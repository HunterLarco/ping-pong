<script setup lang="ts">
import { useIssuePhoneVerificationMutation } from '@generated/graphql/operations';
import { computed, ref } from 'vue';
import { useRouter } from 'vue-router';
import { useToast } from 'vue-toastification';

import CountryCodeDropdown from '@/components/CountryCodeDropdown.vue';
import InputFrame from '@/components/InputFrame.vue';
import InputGroup from '@/components/InputGroup.vue';
import MenuButton from '@/components/MenuButton.vue';
import NavBar from '@/components/NavBar.vue';

const router = useRouter();
const toast = useToast();

/// Form State

const loading = ref(false);

const screenName = ref('');
const countryCode = ref('1' /* Default value is United States (+1) */);
const localPhoneNumber = ref('');
const phoneNumber = computed(
  () => `+${countryCode.value}${localPhoneNumber.value}`
);

/// Actions

function submit() {
  loading.value = true;

  const { mutate, onDone, onError } = useIssuePhoneVerificationMutation({
    variables: {
      phoneNumber: phoneNumber.value,
    },
  });

  onError((error) => {
    loading.value = false;
    toast.error(error.message);
    console.error('Failed to issue phone verification.', error);
  });

  onDone((result) => {
    loading.value = false;
    if (result?.data?.issuePhoneVerification.knownPhoneNumber) {
      toast.error('User already exists.');
      return;
    }

    router.push({
      path: '/signup/otp',
      query: {
        name: screenName.value,
        phoneNumber: phoneNumber.value,
      },
    });
  });

  mutate();
}
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
            <input
              type="text"
              :value="screenName"
              @input="screenName = (<HTMLInputElement>$event.target).value"
              :disabled="loading"
            />
          </InputFrame>
        </InputGroup>
        <div class="InputGroupSpacer" />
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
          :disabled="loading || !screenName || !localPhoneNumber"
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

.InputGroupSpacer {
  height: 30px;
}

.SubmitButton {
  margin: 44px auto 0 auto;
  max-width: 246px;
  width: 100%;
}
</style>
