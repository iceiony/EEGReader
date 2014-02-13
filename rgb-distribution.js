/*
 There is just no point in trying to explain this. If you modify, check the spike on colour distribution to make sure it is uniform. ( colours must not repeat themselves ) 
 'base' will determine the width of the colour spectrum. The bigger the width the more colours it can capture
 */
exports.Distributor = function (base) {
    if (isNaN(base)) base = 3;

    return {
        calculateRGB: function (eegValue) {
            var r = 0,
                g = 0,
                b = 0,
                weightedRB = 3,
                times = eegValue / Math.pow(base, 3),
                remain = ( eegValue % Math.pow(base, 3)).toString(base),
                i;

            if (remain.length == 1) remain = '00' + remain;
            if (remain.length == 2) remain = '0' + remain;

            //console.log(eegValue+ " " + " "+ times+ " " + remain);

            r = Math.floor(times) * base + parseInt(remain[0]) * weightedRB;
            g = Math.floor(times) * base + parseInt(remain[1]) + 60;
            b = Math.floor(times) * base + parseInt(remain[2]) * weightedRB;

            return [r, g, b];
        }
    }
}
    
    