// === DOM Element References === //
const video = document.getElementById('webcamFeed');
const templateOverlay = document.getElementById('templateOverlay');
const croppedCanvas = document.getElementById('croppedSnapshot');
const albumCanvas = document.getElementById('albumCover');
const countdownEl = document.getElementById('countdown');
const popup = document.getElementById('popup');
const finalPhoto = document.getElementById('finalPhoto');

// === Canvas === //
const templateCtx = templateOverlay.getContext('2d'); // Album Overlay
const cropCtx = croppedCanvas.getContext('2d'); // Cropped Image Area
const albumCtx = albumCanvas.getContext('2d');

const positions = [
  { x: 60,  y: 68,  width: 187, height: 187, overlay: 'temp1.png' }, // John
  { x: 255, y: 68,  width: 187, height: 187, overlay: 'temp2.png' }, // Paul
  { x: 60,  y: 262, width: 187, height: 187, overlay: 'temp3.png' }, // Ringo
  { x: 255, y: 262, width: 187, height: 187, overlay: 'temp4.png' }, // George
];

let currentShot = 0;