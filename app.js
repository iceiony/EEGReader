var net = require('net');

var socket = new net.Socket();


socket.setEncoding('ascii');
socket.on('error',function(error){
    console.log(error);
})

socket.on('data',function(buffer){
    console.log(buffer);
})

socket.connect(13854,'127.0.0.1',function(){
    var configuration = JSON.stringify({
        enableRawOutput : true,
        format : "Json"
    });

    console.log('Connected ! ');
    console.log(arguments);
    console.log('Sending configuration :' + configuration );

    socket.write(configuration, "utf-8",function(){
        console.log(arguments);
    });
});