import { IdentityCard, IdentityType } from '@prisma/client';
import { GraphQLError } from 'graphql';
import pickRandom from 'pick-random';
import shuffleArray from 'shuffle-array';

import type { RequestContext } from '@/RequestContext';
import type MTGTreacheryDataSource from '@/data_sources/MTGTreacheryDataSource';

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

type SortedByIdentity<T> = {
  leaders: Array<T>;
  guardians: Array<T>;
  assassins: Array<T>;
  traitors: Array<T>;
};

export function sortByIdentity<T>(
  values: Array<T>,
  getIdentityType: (value: T) => IdentityType
): SortedByIdentity<T> {
  const sortedValues: SortedByIdentity<T> = {
    leaders: [],
    guardians: [],
    assassins: [],
    traitors: [],
  };

  for (const value of values) {
    switch (getIdentityType(value)) {
      case IdentityType.Leader:
        sortedValues.leaders.push(value);
        break;
      case IdentityType.Guardian:
        sortedValues.guardians.push(value);
        break;
      case IdentityType.Assassin:
        sortedValues.assassins.push(value);
        break;
      case IdentityType.Traitor:
        sortedValues.traitors.push(value);
        break;
    }
  }

  return sortedValues;
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
  const identities = sortByIdentity(cards, (card) => card.type);

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
