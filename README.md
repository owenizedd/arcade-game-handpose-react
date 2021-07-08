# arcade-game-handpose-react

Tensorflow.js + React for detecting hand pose to be able to play games

Built on top of `tensorflow-models/handpose` + `react-webcam` + babylon.js for rendering 3D WebGL.
Built algorithm for detection if detected hand is closed or open manually by calculating distance between joints with formula `|(x1 - x2)| + |(y1 - y2)|`

The calculation itself is pretty simple and if the page is slow, probably due to 3d WebGL
