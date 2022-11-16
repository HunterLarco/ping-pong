<script setup>
import { books } from './data.js';
</script>

<template>
  <div style="white-space: pre">{{ JSON.stringify(books, null, 2) }}</div>
</template>
