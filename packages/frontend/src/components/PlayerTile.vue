<script setup lang="ts">
import type { PlayerFragmentFragment } from '@generated/graphql/operations';
import { ref } from 'vue';

const props = defineProps<{
  player: PlayerFragmentFragment;
}>();

const modelStyles = ref({
  display: 'none',
});

/// Actions

function toggleModal() {
  if (props.player.unveiled) {
    modelStyles.value.display =
      modelStyles.value.display == 'none' ? 'block' : 'none';
  }
}
</script>

<template>
  <div class="Host" @click="toggleModal">
    <div class="Left">
      <div class="Name">
        {{ props.player.user.name
        }}<span v-if="props.player.user.isViewer"> (you)</span>
      </div>
      <div class="State" v-if="props.player.state !== 'Active'">
        {{ props.player.state }}
      </div>
    </div>
    <div class="Right">
      <div
        class="Identity"
        v-if="props.player.unveiled && props.player.identity"
      >
        {{ props.player.identity.type }} // {{ props.player.identity.name }}
      </div>
    </div>
    <img
      class="BackgroundImage"
      v-if="props.player.unveiled && props.player.identity"
      :src="props.player.identity.image"
    />

    <div class="Modal" :style="modelStyles">
      <img :src="props.player.identity?.image" />
    </div>
  </div>
</template>

<style scoped lang="scss">
@import '@/styles/layout';

.Host {
  @include layout-horizontal;

  padding: 27px 20px;
  position: relative;
  white-space: nowrap;
  overflow: hidden;

  &::before {
    @include layout-fill;

    background: #fff;
    content: '';
    display: block;
    mix-blend-mode: overlay;
    z-index: -1;
  }
}

.Left {
  flex-grow: 1;
}

.Right {
  flex-shrink: 0;
}

.Name {
  display: inline-block;
  font-size: 14px;
  font-weight: 700;
}

.State {
  border-radius: 7px;
  border: 2px solid #fff;
  display: inline-block;
  font-size: 14px;
  font-weight: 700;
  line-height: 17px;
  margin-left: 14px;
  padding: 0 3px;
}

.Identity {
  font-size: 14px;
  font-weight: 700;
}

.BackgroundImage {
  filter: blur(7px);
  left: -20px;
  opacity: 0.7;
  position: absolute;
  top: -90px;
  width: calc(100% + 40px);
  z-index: -1;
}

.Modal {
  @include layout-fill;

  background: #fff;
  position: fixed;
  z-index: 999;

  img {
    height: 100%;
    object-fit: contain;
    width: 100%;
  }
}
</style>
