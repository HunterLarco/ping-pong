<script setup lang="ts">
import { ref } from 'vue';

import CountryCodeDropdown from '@/components/CountryCodeDropdown.vue';
import InputFrame from '@/components/InputFrame.vue';
import InputGroup from '@/components/InputGroup.vue';
import MenuButton from '@/components/MenuButton.vue';
import NavBar from '@/components/NavBar.vue';

const loading = ref(false);
</script>

<template>
  <div class="HomePage">
    <div class="Header">
      <NavBar title="Sign Up" />
    </div>
    <div class="Content">
      <div class="Form">
        <InputGroup label="Your Name">
          <InputFrame label="Screen Name" :disabled="loading">
            <input type="text" :disabled="loading" />
          </InputFrame>
        </InputGroup>
        <div class="InputGroupSpacer" />
        <InputGroup label="Your Phone Number">
          <InputFrame label="Country / Region" :disabled="loading">
            <CountryCodeDropdown :disabled="loading" />
          </InputFrame>
          <InputFrame label="Phone Number" :disabled="loading">
            <input type="tel" :disabled="loading" />
          </InputFrame>
        </InputGroup>
        <MenuButton class="SubmitButton" text="Next" :disabled="loading" />
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

.InputGroupSpacer {
  height: 30px;
}

.SubmitButton {
  margin: 44px auto 0 auto;
  max-width: 246px;
  width: 100%;
}
</style>
