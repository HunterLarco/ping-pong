import FuzzySearch from 'fuzzy-search';

export default {
  Query: {
    async abilities(_, { filters }, { dataSources }) {
      const rawAbilities = await dataSources.MTGTreachery.getIdentities();
      let abilities = rawAbilities.map((ability) => ({
        id: ability.id,
        name: ability.name,
        sourceUri: ability.uri,
        type: ability.types.subtype,
        text: ability.text,
        rulings: ability.rulings,
      }));

      if (filters && filters.id) {
        abilities = abilities.filter(({ id }) => id == filters.id);
      }

      if (filters && filters.type) {
        abilities = abilities.filter(({ type }) => type == filters.type);
      }

      if (filters && filters.name) {
        const index = new FuzzySearch(abilities, ['name']);
        abilities = index.search(filters.name);
      }

      return abilities;
    },
  },

  Ability: {
    imageUri(parent) {
      return encodeURI(
        `https://mtgtreachery.net/images/cards/en/trd/` +
          `${parent.type} - ${parent.name}.jpg`
      );
    },
  },
};
