<script setup>
import { books } from './data.js';
</script>

<template>
  <div># of books: {{ books ? books.books.length : 0 }}</div>
</template>
