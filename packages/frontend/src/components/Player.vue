<script setup>
import { computed } from 'vue';

const props = defineProps({
  data: {
    type: Object,
    required: true,
  },
});

const playerState = computed(() => {
  switch (props.data.state) {
    case 'Active':
      return { color: 'gray', label: 'Playing' };
    case 'Inactive':
      return { color: 'red', label: 'Conceded' };
    case 'Lost':
      return { color: 'red', label: 'Lost' };
    case 'Won':
      return { color: 'green', label: 'Won' };
  }
});
</script>

<template>
  <div class="Player">
    <div class="Header">
      <div class="Name">{{ data.user.name }}</div>
      <div class="State">
        <div :style="`background: ${playerState.color};`">
          {{ playerState.label }}
        </div>
      </div>
    </div>
    <div class="Identity">
      <img
        class="IdentityImage"
        v-if="data.identity"
        :src="data.identity.image"
      />
      <div class="IdentityPlaceholder" v-else />
    </div>
  </div>
</template>

<style scoped lang="scss">
@import '@/styles/layout';

.Player {
  @include layout-vertical;

  text-align: center;
}

.Header {
  @include layout-horizontal;

  flex-shrink: 0;
}

.Name {
  flex-grow: 1;
  overflow: hidden;
  text-overflow: ellipsis;
}

.State {
  @include layout-center;

  div {
    background: gray;
    border-radius: 2px;
    flex-shrink: 0;
    font-size: 9px;
    font-weight: 700;
    padding: 0 2px;
    text-transform: uppercase;
  }
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
