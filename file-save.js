var fs = require('fs'),
    gm = require('gm');

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

module.exports.asImage = function(dataArray,callback){
    var rawEegFullData = [],
        maxColumnCount = 0,
        colourOffset = 50,
        image;


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
        rawEegFullData.push(rawEegLine);

        if(maxColumnCount<rawEegLine.length) maxColumnCount = rawEegLine.length;
    });

    image = gm(maxColumnCount*2,rawEegFullData.length*2,"rgb(0,0,0)");

    rawEegFullData.forEach(function(rawDataLine,y){
        rawDataLine.forEach(function(data,x){
             var greenValue = data + colourOffset,
                 redValue = greenValue < 0 ? 0 - Math.floor(greenValue * 1) : 0,
                 blueValue = greenValue > 255 ? Math.floor(greenValue * 1) - 255 : 0,
                colour; 
            
            if( greenValue < 0 || greenValue > 255 ) greenValue = 255;
            
            colour = "rgb("+ redValue +", " + greenValue + ", "+ blueValue +")";
            console.log(colour);
            
            image.fill(colour).drawRectangle(x*2,y*2,(x+1)*2,(y+1)*2);
        });
    });

    image.write('./out/rawEeg.png', function(err){
        if (err) {
            console.dir(arguments);
        }
        callback();
    });
};