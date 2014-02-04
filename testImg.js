// gm - Copyright Aaron Heckmann <aaron.heckmann+github@gmail.com> (MIT Licensed)

var gm = require('gm');
var image = gm(525, 110, "rgb(0,200,0)")

  image
  .fill("rgb(0,-34,0)")
  .drawRectangle(40, 10, 50, 20)
  .fill("rgb(0,221,0)")
  .drawRectangle(60, 10, 70, 20)
  .write('drawing.png', function(err){
	if (err) return console.dir(arguments)
    console.log(this.outname + ' created :: ' + arguments[3])
  }
) 