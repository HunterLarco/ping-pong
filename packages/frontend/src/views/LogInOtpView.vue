<script setup lang="ts">
import { ref } from 'vue';

import InputFrame from '@/components/InputFrame.vue';
import InputGroup from '@/components/InputGroup.vue';
import NavBar from '@/components/NavBar.vue';

const loading = ref(false);
</script>

<template>
  <div class="HomePage">
    <div class="Header">
      <NavBar back="/login" title="Log In" />
    </div>
    <div class="Content">
      <div class="Form">
        <InputGroup label="Welcome back">
          <InputFrame label="One Time Password" :disabled="loading">
            <input type="number" pattern="\d*" :disabled="loading" />
          </InputFrame>
        </InputGroup>
      </div>
    </div>
  </div>
</template>

<style scoped lang="scss">
@import '@/styles/layout';

.HomePage {
  @include layout-fill;
  @include layout-vertical;
}

.Header {
  flex-shrink: 0;
}

.Content {
  flex-grow: 1;
}

.Form {
  padding: 49px 23px 60px 23px;
}
</style>
