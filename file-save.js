var fs = require('fs'),
    Canvas = require('canvas');

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
    var colourOffset = 50,
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
            var green = element + colourOffset,
                red = green < 0 ? 0 - Math.floor(green) : 0,
                blue = green > 255 ? Math.floor(green) - 255 : 0,
                colour;

            if( green < 0 || green > 255 ) green = 255;
            if( red > 255 ) { blue = red - 255 ; red = 255 }
            if( blue > 255 ) { red = blue - 255; blue = 255}
            if( red < 0 )  { blue = 0 - red ; red = 0 }
            if( blue < 0 ) { red = 0 - red ; blue = 0 }

            colour = "rgb("+ red +", " + green + ", "+ blue +")";
            //console.log(colour);
            
            ctx.fillStyle = colour;
            ctx.fillRect(x*2,y*2,2,2);
        });
    });
};

module.exports.asImage = function(dataArray,callback){   
    var rawEegFullData = [];
    
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
                    }
                });
        });
        
        if(rawEegLine.length > 1 ) rawEegFullData.push(rawEegLine);
        else  console.log("Warning! record discarded since it had no data");
    });

    _generateImage(rawEegFullData,callback);
};