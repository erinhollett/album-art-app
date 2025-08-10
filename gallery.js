document.addEventListener('DOMContentLoaded', () => {
  const galleryContainer = document.getElementById('gallery');
    function renderGallery() { //  Added function to encapsulate rendering logic
    galleryContainer.innerHTML = ''; // Clear previous content before rendering

  const imageList = getImageList();

  imageList.forEach(async (imageMetadata, index) => {
    const canvas = await getImage(imageMetadata.imageId);
  
    const card = document.createElement('div');
    card.classList.add('card');

    const img = document.createElement('img');
    img.src = canvas.toDataURL();
    card.appendChild(img);

    const imageData = canvas.toDataURL();

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

      const shareBtn = document.createElement('button');
      shareBtn.textContent = '📤 Share';
      shareBtn.onclick = async () => {
        try {
          const blob = await new Promise(resolve => canvas.toBlob(resolve, 'image/png')); // Turns image to PNG blob object instead of toDataURL
          if (!blob) throw new Error('Canvas toBlob Failed');
          const file = new File([blob], `cover-${index + 1}.png`, { type: 'image/png' });
          // Check if the browswer supports sharing files first
          if (navigator.canShare && navigator.canShare({ files: [file] })) {
            // Share the image file directly
            await navigator.share({
              files: [file],
              title: 'My Album Cover',
              text: 'Check out my parody album cover!',
            });
            return;
          } else if (navigator.share) { // Fallback: Share URL and text only
            await navigator.share({
              title: 'My Album Cover',
              text: 'Check out my parody album cover!',
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
    buttonsDiv.appendChild(copyBtn)
    
    //Delete Button
    const deleteBtn = document.createElement('button');
    deleteBtn.textContent = "Delete";
    deleteBtn.addEventListener("click", function() {
      if (confirm("Are you sure you want to delete this image? This action cannot be undone.")) {
        card.remove();
        localStorage.removeItem(imageMetadata.imageId); //removes image by imageId
        let imageList = JSON.parse(localStorage.getItem(imageListKey) || '[]');
        imageList = imageList.filter(image => image.imageId !== imageMetadata.imageId); //filtering out the removed imageId
        localStorage.setItem(imageListKey, JSON.stringify(imageList)); //updating localStorage
      }
    });

      buttonsDiv.appendChild(deleteBtn);
  
      card.appendChild(buttonsDiv);
      galleryContainer.appendChild(card);
    });
  }

  renderGallery(); //  Initial render call
});


