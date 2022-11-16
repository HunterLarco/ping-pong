import { makeExecutableSchema } from '@graphql-tools/schema';
import { mergeResolvers } from '@graphql-tools/merge';

import BookResolvers from '@/resolvers/Book/index.js';
import RoomResolvers from '@/resolvers/Room/index.js';
import LibraryResolvers from '@/resolvers/Library/index.js';
import AbilityResolvers from '@/resolvers/Ability/index.js';

import BookSchema from '@/schema/BookService.graphql';
import RoomSchema from '@/schema/RoomService.graphql';
import LibrarySchema from '@/schema/LibraryService.graphql';
import AbilitySchema from '@/schema/AbilityService.graphql';

export default makeExecutableSchema({
  typeDefs: [RoomSchema, BookSchema, LibrarySchema, AbilitySchema],
  resolvers: mergeResolvers([
    RoomResolvers,
    LibraryResolvers,
    BookResolvers,
    AbilityResolvers,
  ]),
});
