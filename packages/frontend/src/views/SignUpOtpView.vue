<script setup lang="ts">
import {
  useIssuePhoneVerificationMutation,
  useSignupMutation,
  useVerifyPhoneNumberMutation,
} from '@generated/graphql/operations';
import { ref } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { useToast } from 'vue-toastification';

import InputFrame from '@/components/InputFrame.vue';
import InputGroup from '@/components/InputGroup.vue';
import NavBar from '@/components/NavBar.vue';

const route = useRoute();
const router = useRouter();
const toast = useToast();

/// Form State

const loading = ref(false);
const input = ref<HTMLInputElement>();

/// Event Handlers

function onInput(value: string) {
  if (value.length >= 6) {
    submit(value);
  }
}

/// Actions

function resendOTP() {
  if (loading.value) {
    return;
  }

  loading.value = true;

  const { mutate, onError, onDone } = useIssuePhoneVerificationMutation({
    variables: {
      phoneNumber: <string>route.query.phoneNumber,
    },
  });

  onError((error) => {
    loading.value = false;
    toast.error(error.message);
    console.error('Failed to issue phone verification.', error);
  });

  onDone(() => {
    loading.value = false;
    toast.success(`New One Time Password send.`);
  });

  mutate();
}

function submit(oneTimePassword: string) {
  loading.value = true;

  const { mutate, onError, onDone } = useVerifyPhoneNumberMutation({
    variables: {
      phoneNumber: <string>route.query.phoneNumber,
      oneTimePassword,
    },
  });

  onDone((result) => {
    loading.value = false;

    const verificationToken = result.data?.verifyPhoneNumber.verificationToken;
    if (!verificationToken) {
      toast.error('Failed to create verification token.');
      return;
    }

    signup(verificationToken);
  });

  onError((error) => {
    if (input.value) {
      input.value.value = '';
    }
    loading.value = false;
    toast.error(error.message);
    console.error('Failed to verify phone number.', error);
  });

  if (input.value) {
    input.value.blur();
  }

  mutate();
}

function signup(identityVerificationToken: string) {
  loading.value = true;

  const { mutate, onError, onDone } = useSignupMutation({
    variables: {
      identityVerificationToken,
      name: <string>route.query.name,
    },
  });

  onDone((result) => {
    const authToken = result.data?.signup.authToken;
    if (!authToken) {
      toast.error('Failed to create auth token.');
      return;
    }

    window.localStorage.setItem('authorization', authToken);
    router.push({ path: '/' });
  });

  onError((error) => {
    if (input.value) {
      input.value.value = '';
    }
    loading.value = false;
    toast.error(error.message);
    console.error('Failed to signup.', error);
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
        <InputGroup :label="`Welcome to Treachery, ${route.query.name}`">
          <InputFrame label="One Time Password" :disabled="loading">
            <input
              type="number"
              ref="input"
              pattern="\d*"
              :disabled="loading"
              @input="onInput((<HTMLInputElement>$event.target).value)"
            />
          </InputFrame>
        </InputGroup>
        <div class="SecondaryActions">
          Didn't get the code? <span @click="resendOTP">Resend</span>.
        </div>
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

.SecondaryActions {
  color: rgba(#fff, 0.7);
  font-size: 12px;
  margin-top: 40px;
  text-align: center;
  white-space: nowrap;

  a,
  span {
    color: #fff;
  }
}
</style>
