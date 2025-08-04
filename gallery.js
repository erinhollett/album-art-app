document.addEventListener('DOMContentLoaded', () => {
  const galleryContainer = document.getElementById('gallery');
    function renderGallery() { //  Added function to encapsulate rendering logic
    galleryContainer.innerHTML = ''; // Clear previous content before rendering

  const savedImages = JSON.parse(localStorage.getItem('albumCovers')) || [];

  savedImages.forEach((imageData, index) => {
    const card = document.createElement('div');
    card.classList.add('card');

    const img = document.createElement('img');
    img.src = imageData;
    card.appendChild(img);

    const buttonsDiv = document.createElement('div');
    buttonsDiv.classList.add('buttons');

    // Download Button
    const downloadBtn = document.createElement('button');
    downloadBtn.textContent = '📥 Download';
    downloadBtn.onclick = () => {
      const a = document.createElement('a');
      a.href = imageData;
      a.download = `cover-${index + 1}.png`;
      a.click();
    };
    buttonsDiv.appendChild(downloadBtn);

      //  UPDATED: Share Button with fallback support
      const shareBtn = document.createElement('button');
      shareBtn.textContent = '📤 Share';
      shareBtn.onclick = async () => {
        try {
          if (navigator.canShare && navigator.canShare({ files: [] })) {
            const response = await fetch(imageData);
            const blob = await response.blob();
            const file = new File([blob], `cover-${index + 1}.png`, { type: blob.type });

            await navigator.share({
              files: [file],
              title: 'My Album Cover',
              text: 'Check out my parody album cover!',
            });
          } else if (navigator.share) { // Fallback: Share URL and text only
            await navigator.share({
              title: 'My Album Cover',
              text: 'Check out my parody album cover!',
              url: imageData,
            });
          } else {
            alert('Sharing is not supported on this browser.');
          }
        } catch (err) {
          console.error('Sharing failed', err);
          alert('Sharing failed or canceled.');
        }
      };
      buttonsDiv.appendChild(shareBtn);

    // Copy URL Button
    const copyBtn = document.createElement('button');
    copyBtn.textContent = '📋 Copy URL';
    copyBtn.onclick = async () => {
      try {
        await navigator.clipboard.writeText(imageData);
        alert('Image URL copied to clipboard!');
      } catch (err) {
        alert('Failed to copy!');
      }
    };
    buttonsDiv.appendChild(copyBtn);



      card.appendChild(buttonsDiv);
      galleryContainer.appendChild(card);
    });
  }

  renderGallery(); //  Initial render call
});





