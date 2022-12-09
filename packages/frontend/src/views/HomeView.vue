<script setup lang="ts">
import { useQuery } from '@vue/apollo-composable';

import HomePageGQL from '@/graphql/operations/HomePage';

const { result: homePageResult } = useQuery(HomePageGQL);
</script>

<template>
  <main>
    {{ homePageResult }}
  </main>
</template>
