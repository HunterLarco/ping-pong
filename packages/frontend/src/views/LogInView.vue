<script setup lang="ts">
import { useIssuePhoneVerificationMutation } from '@generated/graphql/operations';
import { useMutationLoading } from '@vue/apollo-composable';
import { computed, ref } from 'vue';

import CountryCodeDropdown from '@/components/CountryCodeDropdown.vue';
import InputFrame from '@/components/InputFrame.vue';
import InputGroup from '@/components/InputGroup.vue';
import MenuButton from '@/components/MenuButton.vue';
import NavBar from '@/components/NavBar.vue';

/// Form Data

const countryCode = ref('1' /* Default value is United States (+1) */);
const localPhoneNumber = ref('');
const phoneNumber = computed(
  () => `+${countryCode.value}${localPhoneNumber.value}`
);

/// Mutations

const { mutate: issuePhoneVerification } = useIssuePhoneVerificationMutation(
  () => ({
    variables: {
      phoneNumber: phoneNumber.value,
    },
  })
);

/// Loading State

const loading = useMutationLoading();

/// Actions

function submit() {
  issuePhoneVerification();
}
</script>

<template>
  <div class="HomePage">
    <div class="Header">
      <NavBar title="Log In" />
    </div>
    <div class="Content">
      <div class="Form">
        <InputGroup label="Your Phone Number">
          <InputFrame label="Country / Region" :disabled="loading">
            <CountryCodeDropdown v-model="countryCode" :disabled="loading" />
          </InputFrame>
          <InputFrame label="Phone Number" :disabled="loading">
            <input
              type="tel"
              :value="localPhoneNumber"
              @input="
                localPhoneNumber = (<HTMLInputElement>$event.target).value
              "
              :disabled="loading"
            />
          </InputFrame>
        </InputGroup>
        <MenuButton
          class="SubmitButton"
          text="Next"
          @click="submit"
          :disabled="loading"
        />
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
