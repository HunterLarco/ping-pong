import { GraphQLError } from 'graphql';
import pickRandom from 'pick-random';
import shuffleArray from 'shuffle-array';

import { IdentityCard, IdentityType } from '@prisma/client';
import type MTGTreacheryDataSource from '@/data_sources/MTGTreacheryDataSource';
import type { RequestContext } from '@/RequestContext';

export type TreacheryDistribution = {
  leader: number;
  guardian: number;
  assassin: number;
  traitor: number;
};

export function getTreacheryDistribution(
  players: number
): TreacheryDistribution {
  if (players < 4 || players > 8) {
    throw new GraphQLError(`Treachery requires 4-8 players.`, {
      extensions: { code: 'FAILED_PRECONDITION' },
    });
  }

  const distribution = {
    leader: 1,
    traitor: 1,
    assassin: 2,
    guardian: 0,
  };

  if (players >= 8) {
    distribution.traitor = 2;
  }

  if (players >= 6) {
    distribution.assassin = 3;
  }

  if (players >= 7) {
    distribution.guardian = 2;
  } else if (players >= 5) {
    distribution.guardian = 1;
  }

  return distribution;
}

type SortedIdentities = {
  leaders: Array<IdentityCard>;
  guardians: Array<IdentityCard>;
  assassins: Array<IdentityCard>;
  traitors: Array<IdentityCard>;
};

function sortIdentities(identities: Array<IdentityCard>): SortedIdentities {
  const sortedIdentities: SortedIdentities = {
    leaders: [],
    guardians: [],
    assassins: [],
    traitors: [],
  };

  for (const identity of identities) {
    switch (identity.type) {
      case IdentityType.Leader:
        sortedIdentities.leaders.push(identity);
        break;
      case IdentityType.Guardian:
        sortedIdentities.guardians.push(identity);
        break;
      case IdentityType.Assassin:
        sortedIdentities.assassins.push(identity);
        break;
      case IdentityType.Traitor:
        sortedIdentities.traitors.push(identity);
        break;
    }
  }

  return sortedIdentities;
}

/**
 * Selects the provided number of identity cards while preserving the treachery
 * distribution rules. For example, selecting 4 cards will return a leader,
 * traitor, and 2 assassins.
 */
export async function selectIdentityCards(args: {
  count: number;
  cards: Array<IdentityCard>;
}): Promise<Array<IdentityCard>> {
  const { count, cards } = args;

  const distribution = getTreacheryDistribution(count);
  const identities = sortIdentities(cards);

  if (
    identities.leaders.length < distribution.leader ||
    identities.guardians.length < distribution.guardian ||
    identities.assassins.length < distribution.assassin ||
    identities.traitors.length < distribution.traitor
  ) {
    throw new GraphQLError(`Not enough identity cards to pick from.`, {
      extensions: { code: 'FAILED_PRECONDITION' },
    });
  }

  return shuffleArray([
    ...pickRandom(identities.leaders, { count: distribution.leader }),
    ...pickRandom(identities.traitors, { count: distribution.traitor }),
    ...pickRandom(identities.assassins, { count: distribution.assassin }),
    ...pickRandom(identities.guardians, { count: distribution.guardian }),
  ]);
}
