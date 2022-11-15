import type { CodegenConfig } from '@graphql-codegen/cli'
 
const config: CodegenConfig = {
  schema: './src/BookService.graphql',
   generates: {
      './dist/client/': {
        preset: 'client',
        plugins: []
      },
      './dist/server/resolvers.ts': {
        config: {
          useIndexSignature: true,
        },
        plugins: ['typescript', 'typescript-resolvers']
      }
   }
}
export default config
