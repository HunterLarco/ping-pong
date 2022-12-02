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
    throw new Error(`Treachery requires 4-8 players.`);
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

export async function* assignIdentityCards(args: {
  playerIds: Array<string>;
  notLeader?: Array<string>;
  identityDataSource: MTGTreacheryDataSource;
}): AsyncGenerator<{
  playerId: string;
  identity: IdentityCard;
}> {
  const { playerIds, identityDataSource } = args;
  const notLeader = new Set<string>(args.notLeader || []);

  if (playerIds.length < 4 || playerIds.length > 8) {
    throw new Error(`Treachery requires 4-8 players.`);
  } else if (notLeader.size == playerIds.length) {
    throw new Error(`At least one player must be the leader.`);
  }

  const [leader] = pickRandom(playerIds.filter((id) => !notLeader.has(id)));
  const everyoneElse = playerIds.filter((id) => id !== leader);

  const identities = sortIdentities(await identityDataSource.fetchAll());

  yield {
    playerId: leader,
    identity: pickRandom(identities.leaders)[0],
  };

  const distribution = getTreacheryDistribution(playerIds.length);
  const pool = [
    ...pickRandom(identities.traitors, { count: distribution.traitor }),
    ...pickRandom(identities.assassins, { count: distribution.assassin }),
    ...pickRandom(identities.guardians, { count: distribution.guardian }),
  ];

  shuffleArray(pool);

  for (let i = 0; i < everyoneElse.length; ++i) {
    yield {
      playerId: everyoneElse[i],
      identity: pool[i],
    };
  }
}
