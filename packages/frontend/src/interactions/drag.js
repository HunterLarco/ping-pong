import { ref, watch } from 'vue';

function mouseToCursors(mouseEvent) {
  return [
    {
      x: mouseEvent.screenX,
      y: mouseEvent.screenY,
      identifier: 'mouse',
    },
  ];
}

function touchToCursors(touchEvent) {
  return Array.from(touchEvent.touches).map((touch) => ({
    x: touch.screenX,
    y: touch.screenY,
    identifier: `${touch.identifier}`,
  }));
}

export function useDrag(elementRef) {
  const initialX = ref(0);
  const initialY = ref(0);
  const deltaX = ref(0);
  const deltaY = ref(0);
  const velocityX = ref(0);
  const velocityY = ref(0);
  const isDragActive = ref(false);

  let activeCursorIdentifier;
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

  function eventTrampoline(event) {
    switch (event.type) {
      case 'mousedown':
        return onCursorStart(mouseToCursors(event));
      case 'mousemove':
        return onCursorMove(mouseToCursors(event));
      case 'mouseup':
        return onCursorEnd(mouseToCursors(event));
      case 'touchstart':
        return onCursorStart(touchToCursors(event));
      case 'touchmove':
        return onCursorMove(touchToCursors(event));
      case 'touchend':
        return onCursorEnd(touchToCursors(event));
    }
  }

  function onCursorStart(cursors) {
    if (activeCursorIdentifier) {
      return;
    }

    // For multi-cursor cases (e.g. touch) we naively select the first active
    // cursor and use it for the entire drag interaction.
    activeCursorIdentifier = cursors[0].identifier;

    initialX.value = cursors[0].x;
    initialY.value = cursors[0].y;
    deltaX.value = 0;
    deltaY.value = 0;
    isDragActive.value = true;
    history = [];
    onDragStart(createCallbackArgs());
    window.addEventListener('mousemove', eventTrampoline);
    window.addEventListener('touchmove', eventTrampoline);
    window.addEventListener('mouseup', eventTrampoline);
    window.addEventListener('touchend', eventTrampoline);
  }

  function onCursorMove(cursors) {
    const cursor = cursors.find(
      (cursor) => cursor.identifier == activeCursorIdentifier
    );

    deltaX.value = cursor.x - initialX.value;
    deltaY.value = cursor.y - initialY.value;

    history.push({ x: cursor.x, y: cursor.y, timestamp: Date.now() });
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

  function onCursorEnd() {
    window.removeEventListener('mousemove', eventTrampoline);
    window.removeEventListener('touchmove', eventTrampoline);
    window.removeEventListener('mouseup', eventTrampoline);
    window.removeEventListener('touchend', eventTrampoline);
    onDragEnd(createCallbackArgs());
    velocityX.value = 0;
    velocityY.value = 0;
    isDragActive.value = false;
    activeCursorIdentifier = null;
  }

  watch(elementRef, (element, previousElement) => {
    if (previousElement) {
      previousElement.removeEventListener('mousedown', eventTrampoline);
      previousElement.removeEventListener('touchstart', eventTrampoline);
      window.removeEventListener('mousemove', eventTrampoline);
      window.removeEventListener('touchmove', eventTrampoline);
      window.removeEventListener('mouseup', eventTrampoline);
      window.removeEventListener('touchend', eventTrampoline);
      initialX.value = 0;
      initialY.value = 0;
      deltaX.value = 0;
      deltaY.value = 0;
      velocityX.value = 0;
      velocityY.value = 0;
      isDragActive.value = false;
      activeCursorIdentifier = null;
    }

    element.addEventListener('mousedown', eventTrampoline);
    element.addEventListener('touchstart', eventTrampoline);
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
