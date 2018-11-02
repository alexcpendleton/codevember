let mid = {};
let palette = [];
let bg;
let arrow;
let floor;
let hasLooped = false;
let steps = 0;
let stepsNeeded = 0;
let record = 1;
function setup() {
  //960,720;
  createCanvas(325, 225);
  bg = color("#000");
  background(bg);
  mid = {
    x: width / 2,
    y: height / 2
  };
  //noLoop();
  setupSeed();
  angleMode(DEGREES);
  //frameRate(1);

  arrow = new Arrow();
  // Arrow should probably be called like LedBoard or something :\
  floor = new Arrow({
    rows: [
      [1, 1, 1, 1, 1],
      [1, 0, 0, 0, 0],
      [1, 0, 0, 0, 0],
      [0, 1, 1, 1, 0],
      [0, 0, 0, 0, 1],
      [0, 0, 0, 0, 1],
      [1, 0, 0, 0, 1],
      [0, 1, 1, 1, 0]
    ],
    shift: () => {}
  });

  stepsNeeded = arrow.rows.length + 1;

  capturer = makeCapturer();
  capturer.start();
}

function makeCapturer() {
  if (record > 0) {
    return new CCapture({
      framerate: 60,
      verbose: true,
      format: "gif",
      workersPath: "/2018/"
    });
  }
  return {
    start: () => {},
    save: () => {},
    capture: () => {},
    stop: () => {}
  };
}
function draw() {
  /* concept: an elevator that never gets where you want to go */
  //translate(mid.x, mid.y);
  translate(25, 25);
  scale(20);
  const fade = color(bg);
  //fade.setAlpha(200);
  background(fade);

  arrow.draw();
  console.log(frameCount);
  if (frameCount % 30 === 1) {
    arrow.shift();
    steps++;
  }

  push();
  translate(7, 0);
  floor.draw();
  floor.shift();
  pop();

  capturer.capture(canvas);
  if (steps == stepsNeeded) {
    noLoop();
    console.log("wtf");
    capturer.stop();
    capturer.save();
    hasLooped = true;
  }
}

class Arrow {
  constructor(options) {
    Object.assign(
      this,
      {
        bulbFillColor: ca("red", 169),
        radius: 0.7
      },
      options
    );
    this.rows = this.rows || [
      [0, 0, 0, 0, 0],
      [0, 0, 1, 0, 0],
      [0, 0, 1, 0, 0],
      [0, 0, 1, 0, 0],
      [1, 0, 1, 0, 1],
      [0, 1, 1, 1, 0],
      [0, 0, 1, 0, 0],
      [0, 0, 0, 0, 0]
    ];
    this.offset = 0;
  }
  draw() {
    //debugger;
    const rowLength = this.rows.length;
    const rows = this.rows;
    for (let rowIndex = 0; rowIndex < rowLength; rowIndex++) {
      // let currentRowIndex = rowIndex + this.offset;
      // if (currentRowIndex > rowLength - 1) {
      //   currentRowIndex = rowIndex;
      // }
      let currentRowIndex = rowIndex;
      const currentRow = rows[currentRowIndex];
      const columnLength = currentRow.length;
      for (let columnIndex = 0; columnIndex < columnLength; columnIndex++) {
        const cellValue = currentRow[columnIndex];
        let x = columnIndex + this.radius;
        let y = rowIndex + this.radius;
        if (cellValue === 1) {
          this.drawLightOn({ x, y });
        } else {
          this.drawLightOff({ x, y });
        }
      }
    }
  }
  drawLightOn({ x, y }) {
    this.drawCellBorder({ x, y });
    ellipseMode(CENTER);
    noStroke();
    fill(this.bulbFillColor);
    ellipse(x, y, this.radius);
  }
  drawLightOff({ x, y }) {
    this.drawCellBorder({ x, y });
  }
  drawCellBorder({ x, y }) {
    return;
    stroke(color("red"));
    strokeWeight(0.1);
    noFill();
    rect(x, y, this.radius * 2, this.radius * 2);
  }
  shift() {
    const newOrder = Array.from(this.rows);
    const move = newOrder.pop();

    this.rows = [move, ...newOrder];
    // let next = this.offset + 1;
    // if (next > this.rows.length - 1) {
    //   next = 0;
    // }
    // console.log({ now: this.offset, next });
    // this.offset = next;
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
  return;
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
