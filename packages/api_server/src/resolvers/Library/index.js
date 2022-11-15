export default {
  Query: {
    async libraries(_, args, { dataSources }) {
      return await dataSources.Libraries.fuzzySearch({ branch: args.branch });
    },
  },

  Library: {
    async books(parent, _, { dataSources }) {
      return await dataSources.Books.queryByBranch(parent.branch);
    },
  },
};
