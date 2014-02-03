// gm - Copyright Aaron Heckmann <aaron.heckmann+github@gmail.com> (MIT Licensed)

var gm = require('gm');
var image = gm(525, 110, "#00ff55")

  image
  .fill("#2c2")
  .drawRectangle(40, 10, 50, 20)
  .write('drawing.png', function(err){
	if (err) return console.dir(arguments)
    console.log(this.outname + ' created :: ' + arguments[3])
  }
) 