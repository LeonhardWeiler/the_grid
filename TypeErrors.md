76% ~/files/projects/the_grid $ bunx tsc
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


Found 11 errors in 3 files.

Errors  Files
     4  frontend/src/utils/coords.js:4
     2  frontend/src/utils/gridCoords.js:3
     5  frontend/src/ws.js:10
76% ~/files/projects/the_grid $
