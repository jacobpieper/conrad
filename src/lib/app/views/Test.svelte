<script lang="ts">
  export let title: string;
  export let parameters: string[] = [];
  export let position: { x: number; y: number };
  export let grid: { cellSize: number };
  export let zoom: number;
  export let pan: { x: number; y: number };
  export let onPositionChange: (pos: { x: number; y: number }) => void;

  let isDragging = false;
  let startMouse = { x: 0, y: 0 };
  let startPosition = { x: 0, y: 0 };

  function handleMouseDown(e: MouseEvent) {
    isDragging = true;
    startMouse = { x: e.clientX, y: e.clientY };
    startPosition = { ...position };
    window.addEventListener("mousemove", handleMouseMove);
    window.addEventListener("mouseup", handleMouseUp);
    e.preventDefault();
  }

  function handleMouseMove(e: MouseEvent) {
    if (!isDragging) return;

    const dx = (e.clientX - startMouse.x) / zoom;
    const dy = (e.clientY - startMouse.y) / zoom;

    const rawX = startPosition.x + dx;
    const rawY = startPosition.y + dy;

    const snappedX = Math.round(rawX / grid.cellSize) * grid.cellSize;
    const snappedY = Math.round(rawY / grid.cellSize) * grid.cellSize;

    onPositionChange({ x: snappedX, y: snappedY });
  }

  function handleMouseUp() {
    isDragging = false;
    window.removeEventListener("mousemove", handleMouseMove);
    window.removeEventListener("mouseup", handleMouseUp);
  }

  // Compute the width and height based on the grid and zoom level
  $: nodeWidth = grid.cellSize * 5 * zoom; // 5 grid wide by default
  $: nodeHeight = (1 + parameters.length) * grid.cellSize * zoom;
  $: styleLeft = position.x * zoom + pan.x;
  $: styleTop = position.y * zoom + pan.y;

  // Calculate font size based on zoom level (with a minimum size)
  $: fontSize = Math.max(12, 16 * zoom); // Minimum font size 12px, base 16px, scaled by zoom
</script>

<style>
  .node {
    position: absolute;
    background-color: #2c2f36;
    border-radius: 4px;
    color: white;
    font-family: sans-serif;
    box-sizing: border-box;
    overflow: hidden;
  }

  .heading {
    background-color: #3a3f4b;
    font-weight: bold;
    user-select: none;
    cursor: grab;
    display: flex;
    align-items: center;
    justify-content: center;
  }

  .param {
	border-top: 1px solid #444;
    display: flex;
    align-items: center;
    height: 100%;
  }

  /* Apply the calculated font size */
  .heading, .param {
    font-size: var(--font-size);
  }
</style>

<div
  class="node"
  style="left: {styleLeft}px; top: {styleTop}px; width: {nodeWidth}px; height: {nodeHeight}px;"
>
  <div
    class="heading"
    style="height: {(grid.cellSize - 1) * zoom}px; --font-size: {fontSize}px"
    on:mousedown={handleMouseDown}
  >
    {title}
  </div>

  {#each parameters as param}
    <div class="param" style="height: {(grid.cellSize - 1) * zoom}px; --font-size: {fontSize}px">
      {param}
    </div>
  {/each}
</div>
