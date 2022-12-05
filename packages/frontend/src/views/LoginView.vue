<script setup>
import { watch } from 'vue';
import { useQuery, useMutation, useSubscription } from '@vue/apollo-composable';
import gql from 'graphql-tag';

const { mutate: mutation_issuePhoneVerification } = useMutation(
  gql`
  mutation IssuePhoneVerification($request: IssuePhoneVerificationRequest!) {
    issuePhoneVerification(request: $request) {
      knownPhoneNumber
    }
  }
  `
);

function issuePhoneVerification(phoneNumber) {
  mutation_issuePhoneVerification({ request: { phoneNumber } });
}
</script>

<template>
  <div>
    <button @click="issuePhoneVerification('+100')">
      Signup
    </button>
  </div>
</template>
