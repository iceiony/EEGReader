/*
Just read data and show time difference between the different packages 
 */
var net = require('net');

var socket = new net.Socket(),
    previousTime = new Date();

socket.on('error', function (error) {
    console.log(error);
});

socket.on('data', function (buffer) {
    var newTime = new Date();
    console.log(newTime - previousTime + " " + buffer);
    
    previousTime = newTime;
});

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

