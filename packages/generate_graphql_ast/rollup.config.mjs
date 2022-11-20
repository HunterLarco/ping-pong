import typescript from "@rollup/plugin-typescript";

export default {
  input: "src/index.ts",
  output: {
    file: "dist/plugin.js",
    format: "cjs",
    sourcemap: true,
  },
  external: ["graphql", "@graphql-codegen/plugin-helpers"],
  plugins: [
    typescript({
      tsconfig: false,
      compilerOptions: {
        allowJs: false,
        allowSyntheticDefaultImports: true,
        baseUrl: "./",
        forceConsistentCasingInFileNames: true,
        noEmitOnError: true,
        noImplicitAny: true,
        paths: {
          "@/*": ["src/*"],
        },
        preserveConstEnums: true,
        skipLibCheck: true,
        strict: true,
      },
    }),
  ],
};
