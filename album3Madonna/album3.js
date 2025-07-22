// === Element References === //
const video = document.getElementById('webcamFeed');
const templateOverlay = document.getElementById('templateOverlay');
const croppedCanvas = document.getElementById('croppedSnapshot');
const albumCanvas = document.getElementById('albumCover');
const countdownEl = document.getElementById('countdown');
const popup = document.getElementById('popup');
const finalPhoto = document.getElementById('finalPhoto');

const templateCtx = templateOverlay.getContext('2d');
const cropCtx = croppedCanvas.getContext('2d');
const albumCtx = albumCanvas.getContext('2d');

// === Load Album Template Overlay === //
const albumImage = new Image();
albumImage.src = './album3.jpg';
albumImage.onload = () => {
  templateCtx.clearRect(0, 0, templateOverlay.width, templateOverlay.height);
  templateCtx.drawImage(albumImage, 0, 0, templateOverlay.width, templateOverlay.height);
};

// === Start Webcam === //
navigator.mediaDevices.getUserMedia({ video: true })
  .then(stream => video.srcObject = stream)
  .catch(err => console.error("Webcam error:", err));

// === Start Button with Countdown === //
document.getElementById('startBtn').addEventListener('click', async () => {
  await countdown(3);
  capture();
});

// === Countdown Display === //
async function countdown(seconds) {
  countdownEl.style.display = 'block';
  while (seconds > 0) {
    countdownEl.textContent = seconds;
    await new Promise(res => setTimeout(res, 1000));
    seconds--;
  }
  countdownEl.textContent = '';
  countdownEl.style.display = 'none';
}

// === Apply Filter (Sepia Grayscale) === //
function applyFilter(canvas, ctx) {
  const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
  const pixels = imageData.data;

  // Light sepia tint colours:
  const tintRed   = 255;
  const tintGreen = 245;
  const tintBlue  = 220;

  for (let i = 0; i < pixels.length; i += 4) {
    const r = pixels[i];
    const g = pixels[i + 1];
    const b = pixels[i + 2];

    let gray = 0.3 * r + 0.59 * g + 0.11 * b;

    pixels[i]     = gray * (tintRed / 255);
    pixels[i + 1] = gray * (tintGreen / 255);
    pixels[i + 2] = gray * (tintBlue / 255);
    // Pixels[i + 3] gets ignored (Alpha = Transparency)
  }

  ctx.putImageData(imageData, 0, 0);
}

// === Main Capture Logic === //
function capture() {
  const w = croppedCanvas.width;
  const h = croppedCanvas.height;

  const cx = video.videoWidth / 2;
  const cy = video.videoHeight / 2;
  const sx = cx - w / 2;
  const sy = cy - h / 2;

  // Draw webcam snapshot into cropped canvas
  cropCtx.drawImage(video, sx, sy, w, h, 0, 0, w, h);
  applyFilter(croppedCanvas, cropCtx);

  // Load and draw overlay image on top
  const overlayImage = new Image();
  overlayImage.src = './overlay.png';
  overlayImage.onload = () => {
    cropCtx.drawImage(overlayImage, 0, 0, w, h);

    // Export final image
    const dataUrl = croppedCanvas.toDataURL();
    finalPhoto.src = dataUrl;
    popup.style.display = 'flex';
    localStorage.setItem('madonnaifiedImage', dataUrl);
  };
}

// === Retry Button === //
function retry() {
  popup.style.display = 'none';
}