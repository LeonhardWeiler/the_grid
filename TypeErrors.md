55% ~/files/projects/the_grid $ bunx tsc
frontend/src/camera/camera.js:31:5 - error TS18047: 'canvas' is possibly 'null'.

31     canvas.width / (BASE_PIXEL_SIZE * camera.tzoom)
       ~~~~~~

frontend/src/camera/camera.js:31:12 - error TS2339: Property 'width' does not exist on type 'HTMLElement'.

31     canvas.width / (BASE_PIXEL_SIZE * camera.tzoom)
              ~~~~~

frontend/src/camera/camera.js:34:5 - error TS18047: 'canvas' is possibly 'null'.

34     canvas.height / (BASE_PIXEL_SIZE * camera.tzoom)
       ~~~~~~

frontend/src/camera/camera.js:34:12 - error TS2339: Property 'height' does not exist on type 'HTMLElement'.

34     canvas.height / (BASE_PIXEL_SIZE * camera.tzoom)
              ~~~~~~

frontend/src/camera/controls.js:25:3 - error TS18047: 'canvas' is possibly 'null'.

25   canvas.addEventListener("mousedown", (e) => {
     ~~~~~~

frontend/src/camera/controls.js:75:5 - error TS2322: Type '{ x: number; y: number; }' is not assignable to type 'null'.

75     state.hoverPixel = world
       ~~~~~~~~~~~~~~~~

frontend/src/camera/controls.js:79:5 - error TS18047: 'coordsEl' is possibly 'null'.

79     coordsEl.textContent = `${centered.x} / ${centered.y}`
       ~~~~~~~~

frontend/src/camera/controls.js:105:5 - error TS18047: 'canvas' is possibly 'null'.

105     canvas.width = window.innerWidth
        ~~~~~~

frontend/src/camera/controls.js:105:12 - error TS2339: Property 'width' does not exist on type 'HTMLElement'.

105     canvas.width = window.innerWidth
               ~~~~~

frontend/src/camera/controls.js:106:5 - error TS18047: 'canvas' is possibly 'null'.

106     canvas.height = window.innerHeight
        ~~~~~~

frontend/src/camera/controls.js:106:12 - error TS2339: Property 'height' does not exist on type 'HTMLElement'.

106     canvas.height = window.innerHeight
               ~~~~~~

frontend/src/dom.js:2:20 - error TS18047: 'canvas' is possibly 'null'.

2 export const ctx = canvas.getContext("2d")
                     ~~~~~~

frontend/src/dom.js:2:27 - error TS2339: Property 'getContext' does not exist on type 'HTMLElement'.

2 export const ctx = canvas.getContext("2d")
                            ~~~~~~~~~~

frontend/src/dom.js:7:27 - error TS18047: 'minimap' is possibly 'null'.

7 export const minimapCtx = minimap.getContext("2d")
                            ~~~~~~~

frontend/src/dom.js:7:35 - error TS2339: Property 'getContext' does not exist on type 'HTMLElement'.

7 export const minimapCtx = minimap.getContext("2d")
                                    ~~~~~~~~~~

frontend/src/dom.js:9:1 - error TS18047: 'canvas' is possibly 'null'.

9 canvas.width = window.innerWidth
  ~~~~~~

frontend/src/dom.js:9:8 - error TS2339: Property 'width' does not exist on type 'HTMLElement'.

9 canvas.width = window.innerWidth
         ~~~~~

frontend/src/dom.js:10:1 - error TS18047: 'canvas' is possibly 'null'.

10 canvas.height = window.innerHeight
   ~~~~~~

frontend/src/dom.js:10:8 - error TS2339: Property 'height' does not exist on type 'HTMLElement'.

10 canvas.height = window.innerHeight
          ~~~~~~

frontend/src/main.ts:51:1 - error TS18047: 'canvas' is possibly 'null'.

51 canvas.addEventListener("click", (e) => {
   ~~~~~~

frontend/src/main.ts:67:3 - error TS2322: Type '{ x: number; y: number; }' is not assignable to type 'null'.

67   state.selectedPixel = world
     ~~~~~~~~~~~~~~~~~~~

frontend/src/main.ts:78:28 - error TS2339: Property 'x' does not exist on type 'never'.

78     x: state.selectedPixel.x,
                              ~

frontend/src/main.ts:79:28 - error TS2339: Property 'y' does not exist on type 'never'.

79     y: state.selectedPixel.y,
                              ~

frontend/src/main.ts:88:1 - error TS18047: 'cooldownEl' is possibly 'null'.

88 cooldownEl.addEventListener(
   ~~~~~~~~~~

frontend/src/render/grid.js:26:5 - error TS18047: 'canvas' is possibly 'null'.

26     canvas.width / baseStep
       ~~~~~~

frontend/src/render/grid.js:26:12 - error TS2339: Property 'width' does not exist on type 'HTMLElement'.

26     canvas.width / baseStep
              ~~~~~

frontend/src/render/grid.js:29:5 - error TS18047: 'canvas' is possibly 'null'.

29     canvas.height / baseStep
       ~~~~~~

frontend/src/render/grid.js:29:12 - error TS2339: Property 'height' does not exist on type 'HTMLElement'.

29     canvas.height / baseStep
              ~~~~~~

frontend/src/render/grid.js:63:7 - error TS18047: 'canvas' is possibly 'null'.

63       canvas.width / 2
         ~~~~~~

frontend/src/render/grid.js:63:14 - error TS2339: Property 'width' does not exist on type 'HTMLElement'.

63       canvas.width / 2
                ~~~~~

frontend/src/render/grid.js:67:25 - error TS18047: 'canvas' is possibly 'null'.

67     ctx.lineTo(screenX, canvas.height)
                           ~~~~~~

frontend/src/render/grid.js:67:32 - error TS2339: Property 'height' does not exist on type 'HTMLElement'.

67     ctx.lineTo(screenX, canvas.height)
                                  ~~~~~~

frontend/src/render/grid.js:79:7 - error TS18047: 'canvas' is possibly 'null'.

79       canvas.height / 2
         ~~~~~~

frontend/src/render/grid.js:79:14 - error TS2339: Property 'height' does not exist on type 'HTMLElement'.

79       canvas.height / 2
                ~~~~~~

frontend/src/render/grid.js:83:16 - error TS18047: 'canvas' is possibly 'null'.

83     ctx.lineTo(canvas.width, screenY)
                  ~~~~~~

frontend/src/render/grid.js:83:23 - error TS2339: Property 'width' does not exist on type 'HTMLElement'.

83     ctx.lineTo(canvas.width, screenY)
                         ~~~~~

frontend/src/render/minimap.js:17:1 - error TS18047: 'minimap' is possibly 'null'.

17 minimap.width = MINIMAP_SIZE
   ~~~~~~~

frontend/src/render/minimap.js:17:9 - error TS2339: Property 'width' does not exist on type 'HTMLElement'.

17 minimap.width = MINIMAP_SIZE
           ~~~~~

frontend/src/render/minimap.js:18:1 - error TS18047: 'minimap' is possibly 'null'.

18 minimap.height = MINIMAP_SIZE
   ~~~~~~~

frontend/src/render/minimap.js:18:9 - error TS2339: Property 'height' does not exist on type 'HTMLElement'.

18 minimap.height = MINIMAP_SIZE
           ~~~~~~

frontend/src/render/minimap.js:57:5 - error TS18047: 'canvas' is possibly 'null'.

57     canvas.width /
       ~~~~~~

frontend/src/render/minimap.js:57:12 - error TS2339: Property 'width' does not exist on type 'HTMLElement'.

57     canvas.width /
              ~~~~~

frontend/src/render/minimap.js:61:5 - error TS18047: 'canvas' is possibly 'null'.

61     canvas.height /
       ~~~~~~

frontend/src/render/minimap.js:61:12 - error TS2339: Property 'height' does not exist on type 'HTMLElement'.

61     canvas.height /
              ~~~~~~

frontend/src/render/pixels.js:18:15 - error TS18047: 'canvas' is possibly 'null'.

18       pos.x > canvas.width ||
                 ~~~~~~

frontend/src/render/pixels.js:18:22 - error TS2339: Property 'width' does not exist on type 'HTMLElement'.

18       pos.x > canvas.width ||
                        ~~~~~

frontend/src/render/pixels.js:19:15 - error TS18047: 'canvas' is possibly 'null'.

19       pos.y > canvas.height
                 ~~~~~~

frontend/src/render/pixels.js:19:22 - error TS2339: Property 'height' does not exist on type 'HTMLElement'.

19       pos.y > canvas.height
                        ~~~~~~

frontend/src/render/preview.js:10:24 - error TS2339: Property 'x' does not exist on type 'never'.

10       state.hoverPixel.x,
                          ~

frontend/src/render/preview.js:11:24 - error TS2339: Property 'y' does not exist on type 'never'.

11       state.hoverPixel.y
                          ~

frontend/src/render/preview.js:28:27 - error TS2339: Property 'x' does not exist on type 'never'.

28       state.selectedPixel.x,
                             ~

frontend/src/render/preview.js:29:27 - error TS2339: Property 'y' does not exist on type 'never'.

29       state.selectedPixel.y
                             ~

frontend/src/render/render.js:24:5 - error TS18047: 'canvas' is possibly 'null'.

24     canvas.width,
       ~~~~~~

frontend/src/render/render.js:24:12 - error TS2339: Property 'width' does not exist on type 'HTMLElement'.

24     canvas.width,
              ~~~~~

frontend/src/render/render.js:25:5 - error TS18047: 'canvas' is possibly 'null'.

25     canvas.height
       ~~~~~~

frontend/src/render/render.js:25:12 - error TS2339: Property 'height' does not exist on type 'HTMLElement'.

25     canvas.height
              ~~~~~~

frontend/src/ui/button.js:21:5 - error TS18047: 'cooldownEl' is possibly 'null'.

21     cooldownEl.textContent =
       ~~~~~~~~~~

frontend/src/ui/button.js:24:5 - error TS18047: 'cooldownEl' is possibly 'null'.

24     cooldownEl.classList.add("disabled")
       ~~~~~~~~~~

frontend/src/ui/button.js:29:3 - error TS18047: 'cooldownEl' is possibly 'null'.

29   cooldownEl.classList.remove("disabled")
     ~~~~~~~~~~

frontend/src/ui/button.js:32:5 - error TS18047: 'cooldownEl' is possibly 'null'.

32     cooldownEl.textContent = "Select Pixel"
       ~~~~~~~~~~

frontend/src/ui/button.js:38:27 - error TS2339: Property 'x' does not exist on type 'never'.

38       state.selectedPixel.x,
                             ~

frontend/src/ui/button.js:39:27 - error TS2339: Property 'y' does not exist on type 'never'.

39       state.selectedPixel.y
                             ~

frontend/src/ui/button.js:42:3 - error TS18047: 'cooldownEl' is possibly 'null'.

42   cooldownEl.textContent = `Click to accept (${centered.x} / ${centered.y})`
     ~~~~~~~~~~

frontend/src/ui/cooldown.js:5:29 - error TS7006: Parameter 'end' implicitly has an 'any' type.

5 export function setCooldown(end) {
                              ~~~

frontend/src/ui/palette.js:7:5 - error TS18047: 'paletteEl' is possibly 'null'.

7     paletteEl.querySelectorAll(".color")
      ~~~~~~~~~

frontend/src/ui/palette.js:14:16 - error TS2339: Property 'dataset' does not exist on type 'Element'.

14         button.dataset.color
                  ~~~~~~~

frontend/src/utils/coords.js:4:31 - error TS7006: Parameter 'clientX' implicitly has an 'any' type.

4 export function screenToWorld(clientX, clientY) {
                                ~~~~~~~

frontend/src/utils/coords.js:4:40 - error TS7006: Parameter 'clientY' implicitly has an 'any' type.

4 export function screenToWorld(clientX, clientY) {
                                         ~~~~~~~

frontend/src/utils/coords.js:7:18 - error TS18047: 'canvas' is possibly 'null'.

7       (clientX - canvas.width / 2) /
                   ~~~~~~

frontend/src/utils/coords.js:7:25 - error TS2339: Property 'width' does not exist on type 'HTMLElement'.

7       (clientX - canvas.width / 2) /
                          ~~~~~

frontend/src/utils/coords.js:13:18 - error TS18047: 'canvas' is possibly 'null'.

13       (clientY - canvas.height / 2) /
                    ~~~~~~

frontend/src/utils/coords.js:13:25 - error TS2339: Property 'height' does not exist on type 'HTMLElement'.

13       (clientY - canvas.height / 2) /
                           ~~~~~~

frontend/src/utils/coords.js:20:31 - error TS7006: Parameter 'x' implicitly has an 'any' type.

20 export function worldToScreen(x, y) {
                                 ~

frontend/src/utils/coords.js:20:34 - error TS7006: Parameter 'y' implicitly has an 'any' type.

20 export function worldToScreen(x, y) {
                                    ~

frontend/src/utils/coords.js:24:32 - error TS18047: 'canvas' is possibly 'null'.

24     x: (x - camera.x) * size + canvas.width / 2,
                                  ~~~~~~

frontend/src/utils/coords.js:24:39 - error TS2339: Property 'width' does not exist on type 'HTMLElement'.

24     x: (x - camera.x) * size + canvas.width / 2,
                                         ~~~~~

frontend/src/utils/coords.js:25:32 - error TS18047: 'canvas' is possibly 'null'.

25     y: (y - camera.y) * size + canvas.height / 2,
                                  ~~~~~~

frontend/src/utils/coords.js:25:39 - error TS2339: Property 'height' does not exist on type 'HTMLElement'.

25     y: (y - camera.y) * size + canvas.height / 2,
                                         ~~~~~~

frontend/src/utils/gridCoords.js:3:34 - error TS7006: Parameter 'x' implicitly has an 'any' type.

3 export function toCenteredCoords(x, y) {
                                   ~

frontend/src/utils/gridCoords.js:3:37 - error TS7006: Parameter 'y' implicitly has an 'any' type.

3 export function toCenteredCoords(x, y) {
                                      ~

frontend/src/ws.js:10:26 - error TS7006: Parameter 'clientId' implicitly has an 'any' type.

10 export function createWS(clientId) {
                            ~~~~~~~~

frontend/src/ws.js:11:7 - error TS7034: Variable 'ws' implicitly has type 'any' in some locations where its type cannot be determined.

11   let ws
         ~~

frontend/src/ws.js:18:7 - error TS7005: Variable 'ws' implicitly has an 'any' type.

18       ws.send(JSON.stringify({
         ~~

frontend/src/ws.js:78:10 - error TS7006: Parameter 'data' implicitly has an 'any' type.

78     send(data) {
            ~~~~

frontend/src/ws.js:81:9 - error TS7005: Variable 'ws' implicitly has an 'any' type.

81         ws &&
           ~~


Found 85 errors in 15 files.

Errors  Files
     4  frontend/src/camera/camera.js:31
     7  frontend/src/camera/controls.js:25
     8  frontend/src/dom.js:2
     5  frontend/src/main.ts:51
    12  frontend/src/render/grid.js:26
     8  frontend/src/render/minimap.js:17
     4  frontend/src/render/pixels.js:18
     4  frontend/src/render/preview.js:10
     4  frontend/src/render/render.js:24
     7  frontend/src/ui/button.js:21
     1  frontend/src/ui/cooldown.js:5
     2  frontend/src/ui/palette.js:7
    12  frontend/src/utils/coords.js:4
     2  frontend/src/utils/gridCoords.js:3
     5  frontend/src/ws.js:10
55% ~/files/projects/the_grid $
