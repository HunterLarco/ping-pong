import { useApolloClient } from '@vue/apollo-composable';
import cloneDeep from 'clone-deep';

import { GameFragmentFragmentDoc } from '@/generated/graphql/operations';
import type { GameFragmentFragment } from '@/generated/graphql/operations';

const { client: apolloClient } = useApolloClient();

export function update(
  id: string,
  update: (game: GameFragmentFragment) => GameFragmentFragment
) {
  apolloClient.cache.updateFragment<GameFragmentFragment>(
    {
      id: `Game:${id}`,
      fragment: GameFragmentFragmentDoc,
      fragmentName: `GameFragment`,
    },
    (game: GameFragmentFragment | null) => {
      return game ? update(cloneDeep(game)) : null;
    }
  );
}
