# Heirachy
## Scene
- Can contain several canvases which interact with one another.
- Manages the interactions between its children.

### Canvas
- Either a '2d' or a '3d' context.

### OffscreenCanvas
- Can perform bit manipulation without having to render the image.

### Utilities
- For example spectrum which can be used by a scene to calculate spectrums and doesn't necessarily need a canvas.