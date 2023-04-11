const EARTH_ANGLE = 0;
const MOON_ANGLE = 0;

let clockCanvas, offEarthCanvas, onEarthCanvas;
let clockCon, offEarthCon, onEarthCon;
let offEarthSize, clockSize;
let speedMulti = 0.02;
let days = 0;

let earth = {
  angle: EARTH_ANGLE,
  radius: 0.04,
  orbitalR: 0.4,
  revSpeed: 360 / 365.25,
  pos: { x: undefined, y: undefined },
  image: undefined,
  halfdim: undefined,
  dim: undefined,
};

let moon = {
  angle: MOON_ANGLE,
  radius: 0.015,
  orbitalR: 0.1,
  revSpeed: 360 / 30,
  pos: { x: undefined, y: undefined },
  image: undefined,
  lightImage: undefined,
  darkImage: undefined,
  halfdim: undefined,
  dim: undefined,
};

let sun = {
  pos: { x: undefined, y: undefined }, //to be set during resize; pos: pixels
  radius: 0.075, //radius:10% of minDimension (width/height)
  image: undefined,
  halfdim: undefined,
  dim: undefined,
  //color
};

window.onload = init;

function init() {
  console.log("initializing");
  clockCanvas = document.getElementById("clockCanvas");
  offEarthCanvas = document.getElementById("offEarthCanvas");
  onEarthCanvas = document.getElementById("onEarthCanvas");
  clockCon = clockCanvas.getContext("2d");
  offEarthCon = offEarthCanvas.getContext("2d");
  onEarthCon = onEarthCanvas.getContext("2d");
  earth.image = document.getElementById("earth");
  moon.lightImage = document.getElementById("moon-light");
  sun.image = document.getElementById("sun");
  window.onresize = resize;
  resize();
  requestAnimationFrame(animate);
}

function resize() {
  console.log("resizing");
  resizeClock();
  resizeOffEarth();
  resizeOnEarth();
}

function resizeClock() {
  clockCanvas.width = clockCanvas.parentElement.offsetWidth;
  clockCanvas.height = clockCanvas.parentElement.offsetHeight;
  clockSize = Math.min(clockCanvas.width, clockCanvas.height);
}

function resizeOffEarth() {
  offEarthCanvas.width = offEarthCanvas.parentElement.offsetWidth;
  offEarthCanvas.height = offEarthCanvas.parentElement.offsetHeight;
  sun.pos.x = offEarthCanvas.width / 2;
  sun.pos.y = offEarthCanvas.height / 2;
  offEarthSize = Math.min(offEarthCanvas.width, offEarthCanvas.height);

  sun.halfdim = sun.radius * offEarthSize;
  sun.dim = sun.halfdim * 2;
  earth.halfdim = earth.radius * offEarthSize;
  earth.dim = earth.halfdim * 2;
  moon.halfdim = moon.radius * offEarthSize;
  moon.dim = moon.halfdim * 2;

  moon.image = new OffscreenCanvas(moon.dim, moon.dim);
  const mOffscreenContext = moon.image.getContext("2d");
  mOffscreenContext.drawImage(
    document.getElementById("moon-light"),
    0,
    0,
    moon.dim,
    moon.dim
  );

  sun.image = new OffscreenCanvas(sun.dim, sun.dim);
  const sOffScreenContext = sun.image.getContext("2d");
  sOffScreenContext.drawImage(
    document.getElementById("sun"),
    0,
    0,
    sun.dim,
    sun.dim
  );

  earth.image = new OffscreenCanvas(earth.dim, earth.dim);
  const eOffscreenContext = earth.image.getContext("2d");
  eOffscreenContext.drawImage(
    document.getElementById("earth"),
    0,
    0,
    earth.dim,
    earth.dim
  );
}

function resizeOnEarth() {
  onEarthCanvas.width = onEarthCanvas.parentElement.offsetWidth;
  onEarthCanvas.height = onEarthCanvas.parentElement.offsetHeight;
}

function animate(timeNow) {
  let timePrior = timeNow;
  requestAnimationFrame(_animate);
  function _animate(timeNow) {
    drawAll();
    updateAssets();
    requestAnimationFrame(_animate);
  }
}

function updateAssets() {
  earth.angle = (earth.angle + earth.revSpeed * speedMulti) % 360;
  earth.pos.x =
    Math.cos(earth.angle) * earth.orbitalR * offEarthSize + sun.pos.x;
  earth.pos.y =
    Math.sin(earth.angle) * earth.orbitalR * offEarthSize + sun.pos.y;
  moon.angle = (moon.angle + moon.revSpeed * speedMulti) % 360;
  moon.pos.x =
    Math.cos(moon.angle) * moon.orbitalR * offEarthSize + earth.pos.x;
  moon.pos.y =
    Math.sin(moon.angle) * moon.orbitalR * offEarthSize + earth.pos.y;
}

function drawClock() {
  //off center
  let con = clockCon;
  let can = clockCanvas;
  con.clearRect(0, 0, can.width, can.height);
  con.fillStyle = "black";
  con.beginPath();
  con.arc(can.width / 2, can.height / 2, 0.4 * clockSize, 0, Math.PI * 2);
  con.fill();
  con.fillStyle = "white";
  con.beginPath();
  con.arc(can.width / 2, can.height / 2, 0.35 * clockSize, 0, Math.PI * 2);
  con.fill();
  let stepA = (Math.PI * 2) / 12;
  con.font = "20px arial";
  con.fillStyle = "black";
  for (let i = 12; i > 0; i--) {
    let a = i * stepA - Math.PI / 2;
    con.fillText(
      i,
      Math.cos(a) * 0.3 * clockSize + can.width / 2 - 5,
      Math.sin(a) * 0.3 * clockSize + can.height / 2 + 5
    );
  }
}

function drawOffEarth() {
  let con = offEarthCon;
  let can = offEarthCanvas;
  con.clearRect(0, 0, can.width, can.height);
  con.translate(sun.pos.x, sun.pos.y);
  con.drawImage(sun.image, -sun.halfdim, -sun.halfdim, sun.dim, sun.dim);
  con.translate(-sun.pos.x, -sun.pos.y);

  con.translate(earth.pos.x, earth.pos.y);
  con.drawImage(
    earth.image,
    -earth.halfdim,
    -earth.halfdim,
    earth.dim,
    earth.dim
  );
  con.translate(-earth.pos.x, -earth.pos.y);

  con.translate(moon.pos.x, moon.pos.y);
  con.drawImage(moon.image, -moon.halfdim, -moon.halfdim, moon.dim, moon.dim);
  con.translate(-moon.pos.x, -moon.pos.y);
}

function drawOnEarth() {
  let con = onEarthCon;
  con.clearRect(0, 0, onEarthCanvas.width, onEarthCanvas.height);
}

function drawAll() {
  drawClock();
  drawOnEarth();
  drawOffEarth();
}
