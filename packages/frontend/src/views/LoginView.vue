<script setup>
import { ref, watch } from 'vue';
import { useQuery, useMutation, useSubscription } from '@vue/apollo-composable';
import { useRouter, useRoute } from 'vue-router';
import gql from 'graphql-tag';

import loginDocument from '@/graphql/login';
import signupDocument from '@/graphql/signup';
import verifyPhoneNumberDocument from '@/graphql/verifyPhoneNumber';

const route = useRoute();
const router = useRouter();

const phoneNumber = ref();
const knownPhoneNumber = ref(null);
const formValues = ref({
  signup: {
    name: null,
    oneTimePassword: null,
  },
  login: {
    oneTimePassword: null,
  },
});

const {
  mutate: mutation_issuePhoneVerification,
  onDone: onDone_issuePhoneVerification,
} = useMutation(
  gql`
    mutation IssuePhoneVerification($request: IssuePhoneVerificationRequest!) {
      issuePhoneVerification(request: $request) {
        knownPhoneNumber
      }
    }
  `
);

onDone_issuePhoneVerification(({ data }) => {
  knownPhoneNumber.value = data.issuePhoneVerification.knownPhoneNumber;
});

function issuePhoneVerification(phoneNumber) {
  mutation_issuePhoneVerification({ request: { phoneNumber } });
}

async function verifyPhoneNumber({ phoneNumber, oneTimePassword }) {
  const { mutate, onDone, onError } = useMutation(verifyPhoneNumberDocument);
  mutate({
    request: {
      phoneNumber: `+1${phoneNumber}`,
      oneTimePassword,
    },
  });
  return new Promise((resolve, reject) => {
    onDone(({ data }) => resolve(data.verifyPhoneNumber.verificationToken));
    onError((error) => reject(error));
  });
}

async function login() {
  const identityVerificationToken = await verifyPhoneNumber({
    phoneNumber: phoneNumber.value,
    oneTimePassword: formValues.value.login.oneTimePassword,
  });

  const { mutate, onDone } = useMutation(loginDocument);
  mutate({
    request: {
      identityVerificationToken,
    },
  });
  onDone(({ data }) => {
    localStorage.setItem('authorization', data.login.authToken);
    router.push({ path: route.query.to });
  });
}

async function signup() {
  const identityVerificationToken = await verifyPhoneNumber({
    phoneNumber: phoneNumber.value,
    oneTimePassword: formValues.value.signup.oneTimePassword,
  });

  const { mutate, onDone } = useMutation(signupDocument);
  mutate({
    request: {
      identityVerificationToken,
      name: formValues.value.signup.name,
    },
  });
  onDone(({ data }) => {
    localStorage.setItem('authorization', data.signup.authToken);
    router.push({ path: route.query.to });
  });
}
</script>

<template>
  <div>
    <input
      :disabled="knownPhoneNumber !== null"
      type="text"
      placeholder="Phone Number"
      v-model="phoneNumber"
    />

    <template v-if="knownPhoneNumber === null">
      <button @click="issuePhoneVerification(`+1${phoneNumber}`)">Go</button>
    </template>
    <template v-else>
      <template v-if="knownPhoneNumber">
        <br />
        Welcome back
        <br />
        <input
          type="text"
          placeholder="One Time Password"
          v-model="formValues.login.oneTimePassword"
        />
        <br />
        <button @click="login()">Login</button>
      </template>
      <template v-else>
        <br />
        Welcome
        <br />
        <input
          type="text"
          placeholder="Name"
          v-model="formValues.signup.name"
        />
        <br />
        <input
          type="text"
          placeholder="One Time Password"
          v-model="formValues.signup.oneTimePassword"
        />
        <br />
        <button @click="signup()">Signup</button>
      </template>
    </template>
  </div>
</template>
