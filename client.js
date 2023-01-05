const net = require('net');

const readLine = require('readline').createInterface({
    input: process.stdin,
    output: process.stdout
});

const waitForUsername = new Promise(resolve => {
    readLine.question('Enter a username to join the class: ', answer => {
        resolve(answer);
    });
});

waitForUsername.then((username) => {

    const socket = net.connect({
        port: 1235
    });

    readLine.on('line', data => {
        if (data === 'quit') {
            socket.write(`${username} has left the class.`);
            socket.setTimeout(1000);
        } else {
            // socket.write(username + ': ' + data);
            console.log('please type quit');
        }
    });

    socket.on('connect', () => {
        socket.write(username + ' has joined the class.');
    });

    socket.on('data', data => {
        console.log(data.toString());
    });

    socket.on('timeout', () => {
        // socket.write(username + 'quit');
        socket.end();
    });

    socket.on('end', () => {
        process.exit();
    });

    socket.on('error', () => {
        console.log('The server seems to have been shut down...');
    });
});