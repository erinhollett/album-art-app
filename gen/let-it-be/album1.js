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
const albumCtx = albumCanvas.getContext('2d'); // Final Image (paste ontop of temmplate)

const positions = [
  { x: 60,  y: 68 }, // John
  { x: 255, y: 68 }, // Paul
  { x: 60,  y: 262 }, // Ringo
  { x: 255, y: 262 }, // George
];

let currentShot = 0;

const albumImage = new Image();
albumImage.src = './album1.jpg';
albumImage.onload = () => {
  albumCtx.drawImage(albumImage, 0, 0, albumCanvas.width, albumCanvas.height);
};

const tempImg1 = new Image();
tempImg1.src = './temp1.png';

const tempImg2 = new Image();
tempImg2.src = './temp2.png';

const tempImg3 = new Image();
tempImg3.src = './temp3.png';

const tempImg4 = new Image();
tempImg4.src = './temp4.png';

const tempOverlays = [tempImg1, tempImg2, tempImg3, tempImg4];

// === Start Webcam === //
navigator.mediaDevices.getUserMedia({ video: true })
  .then(stream => {
    video.srcObject = stream;

    // === Start Button with Countdown === //
    document.getElementById('startBtn').addEventListener('click', async () => {
      while (currentShot < positions.length) {
        const overlay = tempOverlays[currentShot];
        templateCtx.drawImage(overlay, 0, 0, templateOverlay.width, templateOverlay.height);
        await countdown(3); // Initialize countdown before capture
        capture(); 
      }
    });
  })
  .catch(err => {
    console.error("Webcam error:", err);
  });

// === Countdown Display === //
async function countdown(seconds) {
  countdownEl.style.display = 'block'; // Make it visible
  while (seconds > 0) { // Run loop until countdown == 0
    countdownEl.textContent = seconds; // Show current second number in the HTML
    await new Promise(res => setTimeout(res, 1000)); // Delay 1 second
    seconds--; // Decrease seconds left each loop iteration
  }
  countdownEl.textContent = '';
  countdownEl.style.display = 'none';
}

// === Crop Snapsot (From Middle of Webcam Feed) === //
function crop() {
  const cropWidth = croppedCanvas.width;
  const cropHeight = croppedCanvas.height; 

  // Getting the center coordinates of the webcam video:
  const videoCenterX = video.videoWidth / 2;
  const videoCenterY = video.videoHeight / 2;

  // Getting where to crop from middle
  const cropStartX = videoCenterX - cropWidth / 2; 
  const cropStartY = videoCenterY - cropHeight / 2;

  cropCtx.drawImage(video, cropStartX, cropStartY, cropWidth, cropHeight, 0, 0, cropWidth, cropHeight);
}

function capture() {
  if (currentShot <= positions.length) {
    const { x, y } = positions[currentShot];

    crop();
    
    albumCtx.drawImage(croppedCanvas, 0, 0, croppedCanvas.width,croppedCanvas.height, x, y, 187, 187);
  }
  currentShot++; 

  if (currentShot == positions.length) {
    saveImg()
  }
}

function saveImg() {
  const dataUrl = albumCanvas.toDataURL();
  finalPhoto.src = dataUrl; 
  popup.style.display = 'flex'; 

  // === Saving to Local Storage === //
  //localStorage.setItem('bjorkifiedImage', dataUrl);
  saveImage('beatles', albumCanvas);
}

// === Retry Button === //
function retry() {
  popup.style.display = 'none'; // Remove pop-up
}