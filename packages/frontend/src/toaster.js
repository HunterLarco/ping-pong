import { createToaster } from "@meforma/vue-toaster"

const toaster = createToaster({
  position: 'bottom',
  queue: true,
  max: 3,
});

export default toaster;
