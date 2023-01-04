<script setup lang="ts">
import {
  WatchMessageHistoryDocument,
  useGetMessageHistoryQuery,
  useSendMessageMutation,
} from '@generated/graphql/operations';
import type {
  WatchMessageHistorySubscription,
  WatchMessageHistorySubscriptionVariables,
} from '@generated/graphql/operations';
import { computed, ref } from 'vue';

const loading = ref(false);
const sendMessageResponse = ref({
  payload: {},
  error: '',
});

const { result: messageHistoryResult, subscribeToMore } =
  useGetMessageHistoryQuery();
const history = computed(() => messageHistoryResult.value?.messageHistory);

subscribeToMore<
  WatchMessageHistorySubscription,
  WatchMessageHistorySubscriptionVariables
>(() => ({
  document: WatchMessageHistoryDocument,
  updateQuery(previousResult, { subscriptionData }) {
    return {
      messageHistory: [
        subscriptionData.data.messageHistory,
        ...previousResult.messageHistory,
      ],
    };
  },
}));

/// Actions

function sendMessage(message: string) {
  const { mutate, onError, onDone } = useSendMessageMutation({});

  onDone((result) => {
    loading.value = false;
    sendMessageResponse.value.payload = result;
    sendMessageResponse.value.error = '';
  });

  onError((error) => {
    loading.value = false;
    sendMessageResponse.value.payload = {};
    sendMessageResponse.value.error = error.message;
  });

  loading.value = true;
  mutate({ message });
}
</script>

<template>
  <div class="HomePage">
    <div class="Left">
      <button @click="sendMessage('ping')">Send "ping" message</button>
      <button @click="sendMessage('hello')">Send "hello" message</button>
      <div v-if="loading">Loading</div>
      <div v-else>
        <div v-if="sendMessageResponse.error">
          <b>Error</b>
          <pre>{{ sendMessageResponse.error }}</pre>
        </div>
        <div v-else>
          <b>Result</b>
          <pre>{{ sendMessageResponse.payload }}</pre>
        </div>
      </div>
    </div>

    <div class="Right">
      <b>Message History:</b>
      <pre>{{ history }}</pre>
    </div>
  </div>
</template>

<style scoped lang="scss">
@import '@/styles/layout';

.HomePage {
  @include layout-fill;
  @include layout-horizontal;

  b {
    font-weight: 700;
  }
}

.Left {
  flex: 1;
  overflow-x: hidden;
  overflow-y: scroll;
}

.Right {
  flex: 1;
  overflow-x: hidden;
  overflow-y: scroll;
}
</style>
