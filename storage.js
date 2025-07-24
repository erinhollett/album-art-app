const imageListKey = 'album_art_app_image_list';

// === Save to storage === //
function saveImage(albumName, imageCanvas) {
  const timestamp = `${Date.now()}`;
  // imageId is a unique identifier per parody
  const imageId = `img_${albumName}_${timestamp}_${Math.floor(Math.random() * 100000)}`;

  const imageData = imageCanvas.toDataURL("image/png");
  localStorage.setItem(imageId, imageData);
  
  // add a new entry to the image info list and save to staorage
  updateImageList(albumName, timestamp, imageId);
}

// === Retrieve list of saved images === //
function getImageList() {
  return JSON.parse(localStorage.getItem(imageListKey) || '[]');
}

// === Add a new entry to the image info list === //
function updateImageList(albumName, date, imageId) {
  const imageList = getImageList();
  imageList.push({albumName, date, imageId});
  localStorage.setItem(imageListKey, JSON.stringify(imageList));
}

// === Retrieve and deserialize image -- ASYNC === //
function getImage(imageId) {
  const imageData = localStorage.getItem(imageId);
  if (imageData === null) {
    return null;
  }

  // Create an Image object and draw it to a canvas
  const img = new Image();
  const canvas = document.createElement('canvas');
  const ctx = canvas.getContext('2d');

  return new Promise((resolve) => {
    img.onload = () => {
      canvas.width = img.width;
      canvas.height = img.height;
      ctx.drawImage(img, 0, 0);
      resolve(canvas);
    };
    img.src = imageData;
  });
}

