<script setup>
const props = defineProps({
  data: {
    type: Object,
    required: true,
  },
});
</script>

<template>
  <div class="Player">
    <div class="Name">{{ data.user.name }}</div>
    <div class="Identity">
      <img
        class="IdentityImage"
        v-if="data.identity"
        :src="data.identity.image"
      />
      <div class="IdentityPlaceholder" v-else />
    </div>
    <div class="State">{{ data.state }}</div>
  </div>
</template>

<style scoped lang="scss">
@import '@/styles/layout';

.Player {
  @include layout-vertical;

  border-radius: 4px;
  text-align: center;
}

.State {
  flex-shrink: 0;
}

.Name {
  flex-shrink: 0;
}

.Identity {
  flex-grow: 1;
  overflow: hidden;
}

.IdentityImage {
  height: 400px;
}

.IdentityPlaceholder {
  background: rgba(#000, 20%);
  height: 400px;
}
</style>
