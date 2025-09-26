let stops = [
  { x: 60, y: 240, time: "08:00" },
  { x: 140, y: 180, time: "08:05" },
  { x: 230, y: 120, time: "08:10" },
  { x: 320, y: 180, time: "08:15" },
  { x: 420, y: 240, time: "08:20" },
];
let vehicle = {
  x: stops[0].x,
  y: stops[0].y,
  currentStop: 0,
  progress: 0,
};
let playing = false;
let simTime = stops[0].time;
function setup() {
  let canvas = createCanvas(500, 300);
  canvas.parent("map-canvas");
  document.getElementById("toggle-button").addEventListener("click", () => {
    playing = !playing;
  });
}
function draw() {
  background(210, 230, 255);
  drawTrees();
  drawRoads();
  drawStops();
  drawVehicle();
  if (playing) moveVehicle();
  document.getElementById("sim-time").innerText = `🕒 ${simTime}`;
}
function drawRoads() {
  stroke(120);
  strokeWeight(8);
  noFill();
  beginShape();
  for (let stop of stops) {
    vertex(stop.x, stop.y);
  }
  endShape();
  strokeWeight(1);
}
function drawStops() {
  noStroke();
  for (let stop of stops) {
    fill("#333");
    ellipse(stop.x, stop.y, 12);
    textSize(12);
    texAlign(CENTER);
    fill(0);
    text(stop.time, stop.x, stop.y - 15);
  }
}
function drawVehicle() {
  fill("blue");
  stroke("#222");
  strokeWeight(2);
  ellipse(vehicle.x, vehicle.y, 18);
  noStroke();
}
function moveVehicle() {
  let current = stops[vehicle.currentStop];
  let next = stops[vehicle.currentStop + 1];
  if (!next) return;

  vehicle.progress += 0.002;
  vehicle.x = lerp(current.x, next.x, vehicle.progress);
  vehicle.y = lerp(current.y, next.y, vehicle.progress);

  if (vehicle.progress >= 1) {
    vehicle.currentStop++;
    vehicle.progress = 0;
    simTime = next.time;
  }
}
function drawTrees() {
  for (let i = 0; i < 8; i++) {
    let x = 30 + i * 60;
    let y = height - 30;
    fill("#6b8e23");
    ellipse(x, y, 20);
    fill("#8b4513");
    rect(x - 2, y, 4, 15);
  }
}
