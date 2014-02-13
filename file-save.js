var fs = require('fs'),
    Canvas = require('canvas'),
    Distributor = require('./rgb-distribution').Distributor;

module.exports.asText = function (dataArray, callback) {
    var rawEeg = "",
        brainWave = "";

    console.log("Saving data as csv....");

    dataArray.forEach(function (dataWindow) {
        var rawEegLine = '';

        dataWindow.forEach(function (dataPackage) {
            dataPackage.split('\r')
                .filter(function(element){
                    return element.length > 0 ;
                }).forEach(function (dataElement) {
                    var elementObj = JSON.parse(dataElement);

                    if (elementObj.hasOwnProperty("rawEeg")) {
                        rawEegLine += elementObj["rawEeg"] + ",";
                    } else {
                        brainWave += dataElement;
                    }
            });
        });

        rawEeg += rawEegLine + rawEegLine.split(',').length+"\r\n";
        brainWave += "\r\n";
    });

    fs.writeFile("./out/rawEeg.txt", rawEeg, function () {
        fs.writeFile("./out/brainWave.txt", brainWave, function () {
            callback();
        });
    });
};


var _generateImage = function(data,callback){
    var distrib = new Distributor(5),
        pixelSize = 2,
        maxColumnCount = 0,
        canvas,
        ctx,
        out,
        stream;

    data.forEach(function(row){
            if(maxColumnCount<row.length) maxColumnCount = row.length;         
    });
    
    console.log(data.length + " recordings");
    console.log(maxColumnCount + " max recording count");
    
    canvas = new Canvas(maxColumnCount*2,data.length*2);
    out = fs.createWriteStream("./out/rawEeg.png");
    stream = canvas.createPNGStream();
    ctx = canvas.getContext("2d");

    stream.on('data',function(chunk){
        out.write(chunk);
    });

    stream.on('end',function(){
        out.end(callback);
    });

    ctx.fillStyle = "rgb(0,0,0)";
    ctx.fillRect(0,0, canvas.width,canvas.height);
    
    data.forEach(function(line,y){
        line.forEach(function(element,x){
            var colour = "rgb(" + distrib.calculateRGB(element).join(',') + ")";;

            ctx.fillStyle = colour;
            ctx.fillRect(x*pixelSize,y*pixelSize,pixelSize,pixelSize);
        });
    });
};

module.exports.asImage = function(dataArray,callback){   
    var rawEegFullData = [],
        maxEeg = -2000,
        minEeg = 2000;
    
    console.log("Saving data as img....");

    dataArray.forEach(function (dataWindow) {
        var rawEegLine = [];

        dataWindow.forEach(function (dataPackage) {
            dataPackage.split('\r')
                .filter(function(element){
                    return element.length > 0 ;
                }).forEach(function (dataElement) {
                    var elementObj = JSON.parse(dataElement);

                    if (elementObj.hasOwnProperty("rawEeg")) {
                        rawEegLine.push(elementObj["rawEeg"])
                        
                        maxEeg = Math.max(maxEeg,elementObj["rawEeg"]);
                        minEeg = Math.min(minEeg,elementObj["rawEeg"]);
                    }
                    
                });
        });
        
        if(rawEegLine.length > 1 ) rawEegFullData.push(rawEegLine);
        else  console.log("Warning! record discarded since it had no data");
    });

    console.log("MaxEeg recorded value: " + maxEeg );
    console.log("MinEeg recorded value: " + minEeg );
    
    _generateImage(rawEegFullData,callback);
};