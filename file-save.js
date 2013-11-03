var fs = require('fs');

module.exports.process = function (dataArray, callback) {
    var rawEeg = "",
        brainWave = "";

    dataArray.forEach(function (dataWindow) {
        dataWindow.forEach(function (dataPackage) {
            dataPackage.split('\r')
                .filter(function(element){
                    return element.length > 0 ;
                }).forEach(function (dataElement) {
                    var elementObj = JSON.parse(dataElement);

                    if (elementObj.hasOwnProperty("rawEeg")) {
                        rawEeg += elementObj["rawEeg"] + ",";
                    } else {
                        brainWave += dataElement;
                    }
            });
        });

        rawEeg += "\r\n";
        brainWave += "\r\n";
    });

    fs.writeFile("./rawEeg.txt", rawEeg, function () {
        fs.writeFile("./brainWave.txt", brainWave, function () {
            callback();
        });
    });

};