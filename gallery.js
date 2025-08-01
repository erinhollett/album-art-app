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

    // Share Button
    const shareBtn = document.createElement('button');
    shareBtn.textContent = '📤 Share';
    shareBtn.onclick = async () => {
      
      if (navigator.canShare && navigator.canShare({ files: [] })) {
        const response = await fetch(imageData);
        const blob = await response.blob();
        const file = new File([blob], `cover-${index + 1}.png`, { type: blob.type });

        try {
          await navigator.share({
            files: [file],
            title: 'My Album Cover',
            text: 'Check out my parody album cover!',
          });
        } catch (err) {
          console.error('Sharing failed', err);
          alert('Sharing failed or canceled.');
        }
      } else {
        alert('Sharing is not supported on this browser.');
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

      // Delete Button
      const deleteBtn = document.createElement('button');
      deleteBtn.textContent = '🗑️ Delete';
      deleteBtn.onclick = () => {
        const updatedImages = JSON.parse(localStorage.getItem('albumCovers')) || []; // Re-fetch current state
        updatedImages.splice(index, 1); // Remove selected image
        localStorage.setItem('albumCovers', JSON.stringify(updatedImages)); //  Save updated list
        renderGallery(); //  Refresh the gallery
      };
      buttonsDiv.appendChild(deleteBtn);

      card.appendChild(buttonsDiv);
      galleryContainer.appendChild(card);
    });
  }

  renderGallery(); //  Initial render call
});





