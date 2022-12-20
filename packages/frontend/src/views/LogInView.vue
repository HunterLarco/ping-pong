<script setup lang="ts">
import InputFrame from '@/components/InputFrame.vue';
import InputGroup from '@/components/InputGroup.vue';
import MenuButton from '@/components/MenuButton.vue';
import NavBar from '@/components/NavBar.vue';
</script>

<template>
  <div class="HomePage">
    <div class="Header">
      <NavBar title="Log In" />
    </div>
    <div class="Content">
      <div class="Form">
        <InputGroup label="Your Phone Number">
          <InputFrame label="Country / Region" />
          <InputFrame label="Phone Number" />
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
