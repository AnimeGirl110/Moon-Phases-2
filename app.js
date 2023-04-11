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
  color: "#12c3de",
  orbitalR: 0.4,
  revSpeed: 360 / 365.25,
  pos: { x: undefined, y: undefined },
};

let moon = {
  angle: MOON_ANGLE,
  radius: 0.015,
  color: "#a39e8c",
  orbitalR: 0.1,
  revSpeed: 360 / 30,
  pos: { x: undefined, y: undefined },
};

let sun = {
  pos: { x: undefined, y: undefined }, //to be set during resize; pos: pixels
  radius: 0.075, //radius:10% of minDimension (width/height)
  color: "#ffec47",
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
  con.fillStyle = sun.color;
  con.beginPath();
  con.arc(sun.pos.x, sun.pos.y, sun.radius * offEarthSize, 0, Math.PI * 2);
  con.fill();

  con.fillStyle = earth.color;
  con.beginPath();
  con.arc(
    earth.pos.x,
    earth.pos.y,
    earth.radius * offEarthSize,
    0,
    Math.PI * 2
  );
  con.fill();

  con.fillStyle = moon.color;
  con.beginPath();
  con.arc(moon.pos.x, moon.pos.y, moon.radius * offEarthSize, 0, Math.PI * 2);
  con.fill();
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
