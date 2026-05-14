78% ~/files/projects/the_grid $ bunx tsc
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


Found 13 errors in 5 files.

Errors  Files
     1  frontend/src/ui/cooldown.js:5
     1  frontend/src/ui/palette.js:14
     4  frontend/src/utils/coords.js:4
     2  frontend/src/utils/gridCoords.js:3
     5  frontend/src/ws.js:10
78% ~/files/projects/the_grid $
