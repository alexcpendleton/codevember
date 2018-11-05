let mid = {};
let palette = [];
let bg;
function setup() {
  //960,720;
  createCanvas(700, 700);
  bg = color("#fff");
  background(bg);
  mid = {
    x: width / 2,
    y: height / 2
  };
  noLoop();
  setupSeed();
  pixelDensity(1);
}

function draw() {
  // choose an "impact point"
  // choose a bunch of random points going out from there around a circle
  // then connect them with lines?
  // "fill" the connected area with transparency so one can see layers underneath (later)
  // maybe make the connections more jagged
  new Layer({
    impactPosition: mid
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
            min: 30,
            max: 50
          },
          length: {
            min: 50,
            max: 100
          },
          stroke: () => {
            strokeWeight(1);
            stroke(color("#000"));
          },
          fill: () => {
            fill(color(0, 0, 0, 0));
          }
        },
        sky: {
          stroke: () => {
            noStroke();
          },
          fill: () => {
            fill(color("#dead00"));
          }
        }
      },
      options
    );
    this.surface = createGraphics(width, height);
  }
  draw() {
    this.drawSky();
    this.drawFragments();
    image(this.surface, 0, 0);
  }
  drawSky() {
    this.surface.fill("blue");
    this.surface.rect(0, 0, width, height);
  }
  drawFragments() {
    const { x, y } = { ...this.impactPosition };
    const { min, max } = { ...this.fragment.length };
    //this.fragment.stroke();
    //this.fragment.fill();
    const alphaC = color(0, 0);
    //this.surface.set(x, y, alphaC);
    // debugger;
    var ctx = this.surface.canvas.getContext("2d");
    ctx.beginPath();
    //ctx.fillMode = "rgb(0,0,0,0)";
    ctx.ellipse(x, y, min / 5, min / 5, 0, TWO_PI, false);

    const amounts = this.fragment.amount;
    const amountOfPoints = random(amounts.min, amounts.max);
    const points = this.polygonPoints(amountOfPoints);
    let amountDrawn = 0;
    points.map(point => {
      if (amountDrawn !== 0) {
        ctx.lineTo(point.x, point.y);
      }
      ctx.moveTo(point.x, point.y);
      amountDrawn++;
    });
    ctx.fill();
    ctx.stroke();

    for (let i = 0; i < width; i++) {
      for (let j = 0; j < height; j++) {
        if (ctx.isPointInPath(i, j)) {
          this.surface.set(i, j, alphaC);
          //console.log({ i, j });
        }
      }
    }
    // console.log(fragmentPath);
    //ctx.clip();
    //debugger;
    // this.surface.fill(alphaC);
    // this.surface.ellipse(x, y, max);
    this.surface.updatePixels();
    console.log(this.surface);
  }
  polygonPoints(numberOfPoints, { x = 0, y = 0, ao = 0 } = {}) {
    var angle = TWO_PI / numberOfPoints;
    const results = [];
    const { min, max } = { ...this.fragment.length };
    for (var a = 0; a < TWO_PI; a += angle) {
      let radius = random(min, max);
      var sx = x + cos(a + ao) * radius;
      var sy = y + sin(a + ao) * radius;
      results.push({ x: sx, y: sy });
    }
    return results;
  }
}

function setupSeed() {
  const fromLocation = new URL(document.location).searchParams.get("seed");
  if (fromLocation) {
    window.seed = parseFloat(fromLocation);
  } else {
    window.seed = ceil(random(0, 1000000));
  }
  console.log(window.seed);
  randomSeed(window.seed);
}

function randomFromArray(arr) {
  const i = Math.floor(random(0, arr.length));
  return arr[i];
}

function qp(name, def, customParser) {
  let value = new URL(document.location).searchParams.get(name);
  if (value === null || value === undefined || value === "") {
    value = def;
  }
  if (customParser) {
    value = customParser(value);
  } else {
    if (!isNaN(value)) {
      value = parseFloat(value);
    }
  }
  console.log("qp", name, value, def);
  return value;
}
function qpColor(name, def) {
  return qp(name, def, v => {
    if (v) {
      return "#" + v;
    }
    return v;
  });
}

function mouseReleased() {
  if (mouseReleased.isCurrentlyPaused) {
    console.log("resumed");
    mouseReleased.isCurrentlyPaused = false;
    return loop();
  }
  mouseReleased.isCurrentlyPaused = true;
  noLoop();
  console.log("paused");
}

function ca(c, a) {
  const result = color(c);
  if (a !== undefined) {
    result.setAlpha(a);
  }
  return result;
}

function randomColorFromPalette() {
  let x = randomFromArray(palette);
  x = x.levels;
  let r = color(x[0], x[1], x[2]);
  return r;
}

function randomFromArray(arr) {
  const i = Math.floor(random(0, arr.length));
  return arr[i];
}
