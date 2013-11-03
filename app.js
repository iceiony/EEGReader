//noinspection JSUnresolvedFunction,SpellCheckingInspection
var net = require('net'),
    keypress = require('keypress'),
    save = require('./file-save');

var socket = new net.Socket(),
    data = [],
    dataBuffer = [],
    record = false,
    interval;


var clearScreen = function(){
    console.log('\033[2J');
}

keypress(process.stdin);
process.stdin.on('keypress', function (ch, key) {
    if (key && key.ctrl && key.name == 'c') {
        clearInterval(interval);
        save.process(data,process.exit);
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
        //process.stdout.write("!");
        dataBuffer.push( buffer );
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

        interval = setInterval(function(){
            record = false;
            data.push(dataBuffer);
            dataBuffer = [];
            clearScreen();

            setTimeout(function(){process.stdout.write(".")},500);
            setTimeout(function(){process.stdout.write(".")},1000);
            setTimeout(function(){process.stdout.write(".")},1500);
            setTimeout(function(){ record = true;}, 1950); //record a few milliseconds before
            setTimeout(function(){process.stdout.write("GO")},2000);
        },2140);




    });

});

