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

// === Load Transparent Album Overlay === //
const albumImage = new Image();
albumImage.src = './album2.png';
albumImage.onload = () => {
  templateCtx.drawImage(albumImage, 0, 0, templateOverlay.width, templateOverlay.height);
}

// === Start Webcam === //
navigator.mediaDevices.getUserMedia({ video: true })
  .then(stream => {
    video.srcObject = stream;

    // === Start Button with Countdown === //
    document.getElementById('startBtn').addEventListener('click', async () => {
      await countdown(3); // Initialize countdown before capture
      capture(); 
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

// === Sepia Filter === //
function applyFilter(canvas, ctx) {
  const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
  const pixels = imageData.data;

  // Sepia tint colours:
  const tintRed   = 255;
  const tintGreen = 230;
  const tintBlue  = 200;

  // Loop through the all pixel values [Red, Green, Blue, Alpha]
  for (let i = 0; i < pixels.length; i += 4) {

    const r = pixels[i];
    const g = pixels[i + 1];
    const b = pixels[i + 2];

    // Adjusting the snapshot brightness to be grayscale
    const gray = 0.3 * r + 0.59 * g + 0.11 * b;

    // Apply the tint to the grayscale values
    pixels[i]     = gray * (tintRed / 255);
    pixels[i + 1] = gray * (tintGreen / 255); 
    pixels[i + 2] = gray * (tintBlue / 255); 
    // Pixels[i + 3] gets ignored (Alpha = Transparency)
  }

  ctx.putImageData(imageData, 0, 0);
}

// === Crop Snapsot (From Middle of Webcam Feed) === //
function capture() {
  const cropWidth = croppedCanvas.width;
  const cropHeight = croppedCanvas.height; 

  // Getting the center coordinates of the webcam video:
  const videoCenterX = video.videoWidth / 2;
  const videoCenterY = video.videoHeight / 2;

  // Getting where to crop from middle
  const cropStartX = videoCenterX - cropWidth / 2; 
  const cropStartY = videoCenterY - cropHeight / 2;

  cropCtx.drawImage(video, cropStartX, cropStartY, cropWidth, cropHeight, 0, 0, cropWidth, cropHeight);
  applyFilter(croppedCanvas, cropCtx);

  const dataUrl = croppedCanvas.toDataURL();
  finalPhoto.src = dataUrl; 
  popup.style.display = 'flex'; 
  
  // === Saving to Local Storage === //
  //localStorage.setItem('bjorkifiedImage', dataUrl);
  saveImage('madonna', croppedCanvas);
}

// === Retry Button === //
function retry() {
  popup.style.display = 'none'; // Remove pop-up
}