import { ref, watch } from 'vue';

export function useDrag(elementRef) {
  const initialX = ref(0);
  const initialY = ref(0);
  const deltaX = ref(0);
  const deltaY = ref(0);
  const velocityX = ref(0);
  const velocityY = ref(0);
  const isDragActive = ref(false);

  let history = [];
  let onDragStart = () => {};
  let onDragEnd = () => {};

  function createCallbackArgs() {
    return {
      initialX: initialX.value,
      initialY: initialY.value,
      deltaX: deltaX.value,
      deltaY: deltaY.value,
      velocityX: velocityX.value,
      velocityY: velocityY.value,
      isDragActive: isDragActive.value,
    };
  }

  function onMouseDown(event) {
    initialX.value = event.screenX;
    initialY.value = event.screenY;
    deltaX.value = 0;
    deltaY.value = 0;
    isDragActive.value = true;
    history = [];
    onDragStart(createCallbackArgs());
    window.addEventListener('mousemove', onMouseMove);
    window.addEventListener('mouseup', onMouseUp);
  }

  function onMouseMove(event) {
    deltaX.value = event.screenX - initialX.value;
    deltaY.value = event.screenY - initialY.value;

    history.push({ x: event.screenX, y: event.screenY, timestamp: Date.now() });
    while (history[0].timestamp < Date.now() - 500) {
      history.shift();
    }
    if (history.length > 1) {
      const recent = history[history.length - 1];
      const past = history[0];
      velocityX.value =
        (recent.x - past.x) / (recent.timestamp - past.timestamp);
      velocityY.value =
        (recent.y - past.y) / (recent.timestamp - past.timestamp);
    }
  }

  function onMouseUp(event) {
    onDragEnd(createCallbackArgs());
    velocityX.value = 0;
    velocityY.value = 0;
    isDragActive.value = false;
    window.removeEventListener('mousemove', onMouseMove);
    window.removeEventListener('mouseup', onMouseUp);
  }

  watch(elementRef, (element, previousElement) => {
    if (previousElement) {
      previousElement.removeEventListener('mousedown', onMouseDown);
      window.removeEventListener('mousemove', onMouseMove);
      window.removeEventListener('mouseup', onMouseUp);
      initialX.value = 0;
      initialY.value = 0;
      deltaX.value = 0;
      deltaY.value = 0;
      velocityX.value = 0;
      velocityY.value = 0;
      isDragActive.value = false;
    }

    element.addEventListener('mousedown', onMouseDown);
  });

  return {
    initialX,
    initialY,
    deltaX,
    deltaY,
    velocityX,
    velocityY,
    isDragActive,
    onDragStart(callback) {
      onDragStart = callback;
    },
    onDragEnd(callback) {
      onDragEnd = callback;
    },
  };
}
