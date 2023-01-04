<script setup lang="ts">
import { useSendMessageMutation } from '@generated/graphql/operations';
import { ref } from 'vue';

const result = ref();

const { mutate, error, loading, onDone } = useSendMessageMutation({});

onDone((mutationResult) => {
  result.value = mutationResult;
});

/// Actions

function sendMessage(message: string) {
  mutate({ message });
}
</script>

<template>
  <div class="HomePage">
    <button @click="sendMessage('ping')">Send "ping" message</button>
    <button @click="sendMessage('hello')">Send "hello" message</button>
    <div v-if="loading">Loading</div>
    <div v-else>
      <div v-if="error">
        <b>Error</b>
        <pre>{{ error }}</pre>
      </div>
      <div v-else>
        <b>Result</b>
        <pre>{{ result }}</pre>
      </div>
    </div>
  </div>
</template>

<style scoped lang="scss">
@import '@/styles/layout';

.HomePage {
  @include layout-fill;

  overflow-x: hidden;
  overflow-y: scroll;

  b {
    font-weight: 700;
  }
}
</style>
