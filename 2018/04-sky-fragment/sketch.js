let mid = {};
let palette = [];
let bg;
const TWO_PI = Math.PI * 2;
function draw() {
  let canvas = document.getElementById("canvas");
  // choose an "impact point"
  // choose a bunch of random points going out from there around a circle
  // then connect them with lines?
  // "fill" the connected area with transparency so one can see layers underneath (later)
  // maybe make the connections more jagged
  new Layer({
    impactPosition: mid,
    surface: canvas
  }).draw();
}

class Layer {
  constructor(options) {
    Object.assign(
      this,
      {
        impactPosition: { x: 0, y: 0 },
        fragment: {
          amount: {
            min: 200,
            max: 200
          },
          length: {
            min: 100,
            max: 300
          }
        }
      },
      options
    );
    this.ctx = this.surface.getContext("2d");
  }
  draw() {
    this.drawSky();
    this.drawFragments();
    //image(this.surface, 0, 0);
  }
  drawSky() {
    const width = this.surface.width;
    const height = this.surface.height;
    this.ctx.fillStyle = "blue";
    this.ctx.fillRect(0, 0, width, height);
    this.ctx.save();
  }
  drawFragments() {
    const { x, y } = { ...this.impactPosition };
    const { min, max } = { ...this.fragment.length };

    // debugger;
    var ctx = this.ctx; //this.surface.getContext("2d");
    ctx.beginPath();
    ctx.fillMode = "rgb(255,0,0,0)";
    ctx.ellipse(x, y, min / 5, min / 5, 0, Math.PI * 2, false);
    ctx.globalCompositeOperation = "destination-out";
    const amounts = this.fragment.amount;
    const amountOfPoints = this.randomInt(amounts.min, amounts.max);
    const mid = { x: this.surface.width / 2, y: this.surface.height / 2 };
    const points = this.polygonPoints(amountOfPoints, {
      x: mid.x,
      y: mid.y
    });
    let amountDrawn = 0;
    points.map(point => {
      if (amountDrawn !== 0) {
        ctx.lineTo(point.x, point.y);
      }
      ctx.moveTo(point.x, point.y);
      amountDrawn++;
    });
    ctx.lineTo(points[0].x, points[0].y);
    ctx.fill();
    ctx.stroke();

    // for (let i = 0; i < width; i++) {
    //   for (let j = 0; j < height; j++) {
    //     if (ctx.isPointInPath(i, j)) {
    //       this.surface.set(i, j, alphaC);
    //       //console.log({ i, j });
    //     }
    //   }
    // }
    // console.log(fragmentPath);
    //ctx.clip();
    //debugger;
    // this.surface.fill(alphaC);
    // this.surface.ellipse(x, y, max);
    //this.surface.updatePixels();
    console.log(this.surface);
  }
  polygonPoints(numberOfPoints, { x = 0, y = 0, ao = 0 } = {}) {
    var angle = TWO_PI / numberOfPoints;
    const results = [];
    const { min, max } = { ...this.fragment.length };
    let last = undefined;
    let mid = (max + min) / 2;
    for (var a = 0; a < TWO_PI; a += angle) {
      let low = min;
      let high = max;

      let radius = this.randomInt(low, high);
      last = radius;
      var sx = x + Math.cos(a + ao) * radius;
      var sy = y + Math.sin(a + ao) * radius;
      results.push({ x: sx, y: sy });
    }
    return results;
  }
  randomInt(min, max) {
    return Math.floor(Math.random() * (max - min + 1) + min);
  }
}

draw();
