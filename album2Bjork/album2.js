    // Getting References to the HTML Elements
    const video = document.getElementById('webcamFeed');
    const templateOverlay = document.getElementById('templateOverlay');
    const croppedCanvas = document.getElementById('croppedSnapshot');
    const albumCanvas = document.getElementById('albumCover');
    const countdownEl = document.getElementById('countdown');
    const popup = document.getElementById('popup');
    const finalPhoto = document.getElementById('finalPhoto');

    // Making the 4 canvases:
    const templateCtx = templateOverlay.getContext('2d'); // Transparent album (goes ontop of the webcam feed)
    const cropCtx = croppedCanvas.getContext('2d'); // Crops the intial snapshot in the middle
    const albumCtx = albumCanvas.getContext('2d'); // Paste over the original album

    const albumImage = new Image();
    albumImage.src = './album2.png';
    albumImage.onload = () => {
      templateCtx.clearRect(0, 0, templateOverlay.width, templateOverlay.height);
      templateCtx.drawImage(albumImage, 0, 0, templateOverlay.width, templateOverlay.height);
    }

    navigator.mediaDevices.getUserMedia({ video: true })
      .then(stream => video.srcObject = stream)
      .catch(err => console.error("Webcam error:", err));

    document.getElementById('startBtn').addEventListener('click', async () => {
      await countdown(3); // Initializes countdown function with 3 (seconds)
      capture(); // Wait until the countdown function finishes before capture
    });

    // === Countdown Loop Function === //
    async function countdown(seconds) {
      countdownEl.style.display = 'block'; // Make it visible
      while (seconds > 0) { // Run loop until countdown == 0
        countdownEl.textContent = seconds; // Show current second number in the HTML
        await new Promise(res => setTimeout(res, 1000)); // Delay 1 second
        seconds--; // Decrease seconds left each loop iteration
      }
      // Hide everything again after timer is finished:
      countdownEl.textContent = '';
      countdownEl.style.display = 'none';
    }

    // === Crop Snapsot (From Middle of Webcam Feed) === //
    function capture() {
      const w = croppedCanvas.width; // 316 pixels
      const h = croppedCanvas.height; // 316 pixels

      // Find the center of the webcam feed:
      const cx = video.videoWidth / 2; // 640px == 320px
      const cy = video.videoHeight / 2; // 480px == 240px

      // Find the top left corner to crop the middle square
      const sx = cx - w / 2; // (162)
      const sy = cy - h / 2; // (82)

      cropCtx.drawImage(video, sx, sy, w, h, 0, 0, w, h);
      applyFilter(croppedCanvas, cropCtx);

      // === Convert End Canvas to Image === //
      const dataUrl = croppedCanvas.toDataURL();
      finalPhoto.src = dataUrl; // Fills <img> src with the finished image
      popup.style.display = 'flex'; // Show in pop-up
      
      // === Saving to Local Storage === //
      localStorage.setItem('bjorkifiedImage', dataUrl);
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
        pixels[i]     = gray * (tintRed / 255); // No change
        pixels[i + 1] = gray * (tintGreen / 255); // 90% of the grey value
        pixels[i + 2] = gray * (tintBlue / 255); // 78% of the grey value
        // Pixels[i + 3] we ignore (Alpha = Transparency)
      }

      ctx.putImageData(imageData, 0, 0);
    }

    function retry() {
      popup.style.display = 'none'; // Remove pop-up
    }