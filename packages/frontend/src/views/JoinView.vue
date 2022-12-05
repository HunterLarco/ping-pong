<script setup>
import { useMutation } from '@vue/apollo-composable';
import { useRoute } from 'vue-router';

const route = useRoute();
</script>

<template>
  <div>
    {{ route.params.gameId }}
  </div>
</template>
