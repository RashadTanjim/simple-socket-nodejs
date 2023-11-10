const express = require('express');
const http = require('http');
const socketIo = require('socket.io');

const socket = express();
const server = http.createServer(socket);
const io = socketIo(server);


let connectedClients = 0;
let intervalId = null;

io.on('connection', (socket) => {

    connectedClients++;
    console.log(`Client connected -> ${connectedClients}`);

    if(connectedClients === 1){
        myAsyncFunction().then(r => {
            console.log('myAsyncFunction triggered');
        });
    }

    // Emit initial data to the connected client
   // socket.emit('message', 0);

    // Listen for disconnection
    socket.on('disconnect', () => {

        connectedClients--;
        console.log(`Client disconnected -> ${connectedClients}`);

        // If all clients have disconnected, stop socket and clearInterval
        if (connectedClients === 0) {
            console.log('interval stopped as all clients disconnected.');
            clearInterval(intervalId);
        }
    });

    socket.on('close', () => {
        console.log('close ----')
    })

});


// Asynchronous function that returns a promise
async function myAsyncFunction() {
    return new Promise((resolve, reject) => {

        intervalId = setInterval(() => {

            if (connectedClients > 0) {

                let value = Math.random();
                io.emit('message', value);
                console.log(`connectedClients -> ${connectedClients} - ${value}`);

            } else {

                clearInterval(intervalId);
                console.log('else -> clearInterval(intervalId);');
            }

            resolve();

        }, 3000);

    });
}

socket.get('/', (req, res) => {
    res.sendFile(__dirname + '/index.html');
});

const PORT = 3000;
server.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
