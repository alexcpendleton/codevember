let mid = {};
let palette = [];
let bg;
let lastTime = {
  second: -1,
  hour: -1,
  minute: -1
};
let tick;
let tock;

function setup() {
  //960,720;
  createCanvas(screen.width, screen.height);
  bg = qpColor("bg", "#fff");
  background(bg);
  mid = {
    x: width / 2,
    y: height / 2
  };
  //noLoop();
  setupSeed();
  tick = new FallingText({ text: "tick" });
  tock = new FallingText({ text: "tock" });
}

function draw() {
  background(bg);
  let frameTime = {
    hour: hour() % 12 || 12,
    minute: minute(),
    second: second()
  };
  advance(frameTime);
  tick.drawAndUpdate();
  tock.drawAndUpdate();
}

function advance(frameTime) {
  if (lastTime.second !== frameTime.second) {
    advanceSecond(frameTime.second);
  }
}

function advanceSecond(newSecond) {
  if (lastTime.second == -1) {
    lastTime.second = newSecond;
    return;
  }
  if (newSecond % 2 === 0) {
    console.log("tick", lastTime.second, newSecond);
    tick.reset();
  } else {
    console.log("tock", lastTime.second, newSecond);
    tock.reset();
  }
  lastTime.second = newSecond;
}

class Shaker {
  constructor(options) {
    Object.assign(this, { x: 0, y: 0 }, options);
  }
}

class FallingText {
  constructor(options) {
    Object.assign(this, { x: 0, y: 0, visible: false }, options);
  }
  drawAndUpdate() {
    if (!this.visible) return;
    this.draw();
    this.update();
  }
  draw() {
    textSize(64);
    text(this.text, this.x, this.y);
  }
  update() {
    this.y += 10;
    if (this.y >= height) {
      this.y = 0;
      this.visible = false;
    }
  }
  reset() {
    this.visible = true;
    this.y = 0;
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
