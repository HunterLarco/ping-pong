import { createApp } from "vue";
import App from "./App.vue";
import router from "./router";

import { ApolloClient, InMemoryCache } from "@apollo/client/core";
import { provideApolloClient } from "@vue/apollo-composable";

const apolloClient = new ApolloClient({
  cache: new InMemoryCache(),
  uri: "http://localhost:4000/graphql",
});
provideApolloClient(apolloClient);

import "./assets/main.css";

const app = createApp(App);

app.use(router);

app.mount("#app");
