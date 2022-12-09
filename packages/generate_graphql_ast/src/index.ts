import { PluginFunction } from '@graphql-codegen/plugin-helpers';
import { getDocumentNodeFromSchema } from '@graphql-tools/utils';
import { GraphQLSchema } from 'graphql';

export const plugin: PluginFunction = (schema: GraphQLSchema) => {
  const documentNode = getDocumentNodeFromSchema(schema);
  return `const document: any = ${JSON.stringify(documentNode)};
export default document;`;
};
