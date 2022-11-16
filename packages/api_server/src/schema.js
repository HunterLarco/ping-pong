import { makeExecutableSchema } from '@graphql-tools/schema';
import { mergeResolvers } from '@graphql-tools/merge';

import BookResolvers from '@/resolvers/Book/index.js';
import LibraryResolvers from '@/resolvers/Library/index.js';
import AbilityResolvers from '@/resolvers/Ability/index.js';

import BookSchema from '@/schema/BookService.graphql';
import LibrarySchema from '@/schema/LibraryService.graphql';
import AbilitySchema from '@/schema/AbilityService.graphql';

export default makeExecutableSchema({
  typeDefs: [BookSchema, LibrarySchema, AbilitySchema],
  resolvers: mergeResolvers([
    LibraryResolvers,
    BookResolvers,
    AbilityResolvers,
  ]),
});
