var Canvas = require('canvas'),
    Distributor = require('../rgb-distribution').Distributor;

var base = 5,
    spectrumWidth = Math.pow(base,3),
    distrib = new Distributor(base),
    minValToPlot = -2048,
    maxValToPlot = 2047,
    pixelSize = 50,
    width = spectrumWidth * pixelSize, // 3rd root of length must be integer
    length = Math.ceil((maxValToPlot-minValToPlot)/spectrumWidth) * pixelSize;
    canvas = new Canvas(width,length),
    ctx = canvas.getContext("2d");

var fs = require('fs'),
    out = fs.createWriteStream("./distribution.png"),
    stream = canvas.createPNGStream();


stream.on('data',function(chunk){
    out.write(chunk);
});

stream.on('end',function(end){
    out.end();
});


var x = 0 ,y = 0;

for(var i=minValToPlot;i<maxValToPlot;i++){
    var rgb = "rgb(" + distrib.calculateRGB(i).join(',') + ")";
    
    console.log(rgb);
    ctx.fillStyle = rgb;
    ctx.fillRect(x,y,pixelSize,pixelSize);    
    
    x += pixelSize;
    
    if(x>=width){
        console.log("new line");
        y+=pixelSize;
        x=0;
    }
}
