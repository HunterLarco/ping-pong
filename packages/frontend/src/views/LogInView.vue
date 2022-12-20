<script setup lang="ts">
import { computed, ref } from 'vue';

import CountryCodeDropdown from '@/components/CountryCodeDropdown.vue';
import InputFrame from '@/components/InputFrame.vue';
import InputGroup from '@/components/InputGroup.vue';
import MenuButton from '@/components/MenuButton.vue';
import NavBar from '@/components/NavBar.vue';

const countryCode = ref('1' /* Default value is United States (+1) */);
const localPhoneNumber = ref('');
const phoneNumber = computed(
  () => `+${countryCode.value}${localPhoneNumber.value}`
);
</script>

<template>
  <div class="HomePage">
    <div class="Header">
      <NavBar title="Log In" />
    </div>
    <div class="Content">
      <div class="Form">
        <InputGroup label="Your Phone Number">
          <InputFrame label="Country / Region">
            <CountryCodeDropdown v-model="countryCode" />
          </InputFrame>
          <InputFrame label="Phone Number">
            <input
              type="tel"
              :value="localPhoneNumber"
              @input="
                localPhoneNumber = (<HTMLInputElement>$event.target).value
              "
            />
          </InputFrame>
        </InputGroup>
        <MenuButton class="SubmitButton" text="Next" />
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

.SubmitButton {
  margin: 44px auto 0 auto;
  max-width: 246px;
  width: 100%;
}
</style>
