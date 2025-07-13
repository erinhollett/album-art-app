function loadGallery() {
  const galleryContainer = document.getElementById('gallery');
  galleryContainer.innerHTML = '';

  let images = JSON.parse(localStorage.getItem('albumCovers')) || [];

  if (images.length === 0) {
    galleryContainer.innerHTML = '<p style="text-align:center">No album covers saved yet.</p>';
    return;
  }

  images.forEach((imgData, index) => {
    const card = document.createElement('div');
    card.className = 'card';

    const img = document.createElement('img');
    img.src = imgData.data;
    img.alt = 'Album Cover';

    const buttonsDiv = document.createElement('div');
    buttonsDiv.className = 'buttons';

    const downloadBtn = document.createElement('button');
    downloadBtn.textContent = 'Download';
    downloadBtn.onclick = () => downloadImage(imgData.data, `album_cover_${index + 1}.png`);

    buttonsDiv.appendChild(downloadBtn);

    card.appendChild(img);
    card.appendChild(buttonsDiv);
    galleryContainer.appendChild(card);
  });
}

function downloadImage(dataUrl, filename) {
  const link = document.createElement('a');
  link.href = dataUrl;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}

window.onload = loadGallery;
