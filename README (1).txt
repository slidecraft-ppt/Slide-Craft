Put your scroll-scrubbed background frames in this folder.

Naming pattern expected by index.html:
  frame_001.jpg
  frame_002.jpg
  frame_003.jpg
  ...

In index.html, search for "FRAME CONFIG" (inside the main <script> block)
and set FRAME_COUNT to the exact number of frame files you have.
If your files use a different prefix, extension, or zero-padding,
adjust FRAME_PREFIX / FRAME_EXT / FRAME_PAD there too.
