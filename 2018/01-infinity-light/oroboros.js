let mid = {};
let palette = [];
let bg;
function setup() {
  //960,720;
  createCanvas(500, 500);
  bg = qpColor("bg", "dead");
  background(bg);
  mid = {
    x: width / 2,
    y: height / 2
  };
  noLoop();
  setupSeed();
  angleMode(DEGREES);
}

function draw() {
  translate(mid.x, mid.y);
  /* idea:
  draw an oroboros-like thing, where the "head" is very bright,
  and it gets progressively darker as it gets back to the tail, 
  where the tail is completely dark
  */
  const segments = 36;
  const degrees = 360;
  const headColor = color("red");
  //const strokeColor = color("black");
  strokeWeight(1);
  stroke(color("black"));
  fill(headColor);
  const maxW = 50;
  const maxH = 100;

  for (let segmentIndex = 0; segmentIndex < segments; segmentIndex++) {
    let w = maxW;
    let h = (maxH / segments) * segmentIndex;
    const angle = (degrees / segments) * segmentIndex;

    push();
    // copy the head color, make the alpha lower
    // the closer we are to the tail
    const currentColor = color(headColor);
    const alpha = (255 / segments) * segmentIndex;
    currentColor.setAlpha(alpha);
    fill(currentColor);

    console.log({
      w,
      h,
      angle,
      segmentIndex,
      currentColor,
      alpha
    });
    rotate(angle);
    rect(0, 0, w, h);
    pop();
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
