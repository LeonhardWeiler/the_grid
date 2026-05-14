70% ~/files/projects/the_grid $ bunx tsc
frontend/src/camera/controls.js:75:5 - error TS2322: Type '{ x: number; y: number; }' is not assignable to type 'null'.

75     state.hoverPixel = world
       ~~~~~~~~~~~~~~~~

frontend/src/main.ts:67:3 - error TS2322: Type '{ x: number; y: number; }' is not assignable to type 'null'.

67   state.selectedPixel = world
     ~~~~~~~~~~~~~~~~~~~

frontend/src/main.ts:78:28 - error TS2339: Property 'x' does not exist on type 'never'.

78     x: state.selectedPixel.x,
                              ~

frontend/src/main.ts:79:28 - error TS2339: Property 'y' does not exist on type 'never'.

79     y: state.selectedPixel.y,
                              ~

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

frontend/src/ui/button.js:38:27 - error TS2339: Property 'x' does not exist on type 'never'.

38       state.selectedPixel.x,
                             ~

frontend/src/ui/button.js:39:27 - error TS2339: Property 'y' does not exist on type 'never'.

39       state.selectedPixel.y
                             ~

frontend/src/ui/cooldown.js:5:29 - error TS7006: Parameter 'end' implicitly has an 'any' type.

5 export function setCooldown(end) {
                              ~~~

frontend/src/ui/palette.js:14:16 - error TS2339: Property 'dataset' does not exist on type 'Element'.

14         button.dataset.color
                  ~~~~~~~

frontend/src/utils/coords.js:4:31 - error TS7006: Parameter 'clientX' implicitly has an 'any' type.

4 export function screenToWorld(clientX, clientY) {
                                ~~~~~~~

frontend/src/utils/coords.js:4:40 - error TS7006: Parameter 'clientY' implicitly has an 'any' type.

4 export function screenToWorld(clientX, clientY) {
                                         ~~~~~~~

frontend/src/utils/coords.js:20:31 - error TS7006: Parameter 'x' implicitly has an 'any' type.

20 export function worldToScreen(x, y) {
                                 ~

frontend/src/utils/coords.js:20:34 - error TS7006: Parameter 'y' implicitly has an 'any' type.

20 export function worldToScreen(x, y) {
                                    ~

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


Found 23 errors in 9 files.

Errors  Files
     1  frontend/src/camera/controls.js:75
     3  frontend/src/main.ts:67
     4  frontend/src/render/preview.js:10
     2  frontend/src/ui/button.js:38
     1  frontend/src/ui/cooldown.js:5
     1  frontend/src/ui/palette.js:14
     4  frontend/src/utils/coords.js:4
     2  frontend/src/utils/gridCoords.js:3
     5  frontend/src/ws.js:10
71% ~/files/projects/the_grid $
