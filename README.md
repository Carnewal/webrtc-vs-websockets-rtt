# webrtc-vs-websockets-rtt
Testing and calculating the roundtrip and delivery times for websockets and webrtc for a screen - controller type application

### Setup & start the server
1. `npm install`
2. Change `var websocketAddr` in views/controller.pug and views/screen.pug to your IP address
3. `npm start`

### Testing RTT
1. Open up `[IP/localhost]:3000/screen` 
2. Open up `[IP/localhost]:3000/controller` 
3. Enter the Screen ID inside the input box on the controller & press the connect button
4. Test by pressing the Spam WebRTC or Spam Websocket button.
5. Wait a couple seconds, the results will come :)
