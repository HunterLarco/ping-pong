import { GraphQLSchema, printSchema, parse } from "graphql";
import { PluginFunction } from "@graphql-codegen/plugin-helpers";

export const plugin: PluginFunction = (schema: GraphQLSchema) => {
  const schemaStr = printSchema(schema);
  const schemaNode = parse(schemaStr);
  return `export default ${JSON.stringify(schemaNode)}`;
};
