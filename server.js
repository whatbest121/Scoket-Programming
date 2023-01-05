const net = require('net');

let sockets = [];
let user = [];
const server = net.createServer(socket => {

    sockets.push(socket);
    console.log('Client connected.');

    socket.on('data', data => {
        console.log(data.toString());
        broadcast(data, socket);
    });

    socket.on('error', err => {
    });

    socket.on('close', () => {
    });

});

server.listen(1235);

function broadcast(message, socketSent) {
    const check = message.toString().includes(" has joined the class.")
    const username = message.toString().split(" ")[0]
    if (check) user.push(username)
    // message.toString().includes(' quit') === true || 
    if (message.toString().includes(' has left the class.') === true) {
        const index = sockets.indexOf(socketSent);
        sockets.splice(index, 1);
        user = user.filter(e => e !== username)
        let str = ""
        for (const item of user) {
            str += item + "\n"
        }
        sockets.forEach(socket => {
            socket.write("\x1b[32m" + "======= Online Now ======== \n" + str + "===========================")
        });
    } else {
        let str = ""
        for (const item of user) {
            str += item + "\n"
        }
        sockets.forEach(socket => {
            if (socket !== socketSent) socket.write(message);
            socket.write("\x1b[32m" + "======= Online Now ======== \n" + str + "===========================")
        });
    }
}