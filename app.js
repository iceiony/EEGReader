var net = require('net'),
    keypress = require('keypress'),
    fs = require('fs');


var socket = new net.Socket(),
    data = [],
    trialData = [],
    record = false;

keypress(process.stdin);
process.stdin.on('keypress', function (ch, key) {
    if (key && key.name === 'up') {
        record = true;
        setTimeout(function () {
            data.push(trialData);
            trialData = [];
            record = false;
        }, 500);
    }

    if (key && key.ctrl && key.name == 'c') {
        //todo: end the process and save all data
        fs.writeFile("data.txt", JSON.stringify(data), function () {
            process.exit();
        });
    }
});
//webstorm loads the process in a container and overwrites stdin stream
if (process.stdin.constructor.name.toLowerCase() !== 'socket') {
    process.stdin.setRawMode(true);
}
process.stdin.resume();


socket.on('error', function (error) {
    console.log(error);
})

socket.on('data', function (buffer) {
    if (record) {
        console.log(buffer);
        trialData.push( buffer );
    }
})

socket.setEncoding('ascii');
socket.connect(13854, '127.0.0.1', function () {
    var configuration = JSON.stringify({
        enableRawOutput: true,
        format: "Json"
    });

    console.log('Connected ! ');
    console.log(arguments);
    console.log('Sending configuration :' + JSON.stringify(configuration));

    socket.write(configuration, "utf-8", function () {
        console.log("Configuration sent" + JSON.stringify(arguments));
    });

});