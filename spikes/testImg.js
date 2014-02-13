var Canvas = require('canvas'),
    canvas = new Canvas(525,110),
    ctx = canvas.getContext("2d");

var fs = require('fs'),
    out = fs.createWriteStream("./drawing.png"),
    stream = canvas.createPNGStream();

  ctx.fillStyle = "rgb(0,125,0)";
  ctx.fillRect(0,0, canvas.width,canvas.height);
  ctx.fillStyle = "rgb(0,200,0)";
  ctx.fillRect(40, 10, 10, 10);
  ctx.fillRect(60, 10, 10, 10);

stream.on('data',function(chunk){
    out.write(chunk);
});

stream.on('end',function(end){
    out.end();
});
