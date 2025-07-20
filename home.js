// This function is called when a user clicks on an album card
function goToGenerator(albumName) {
  // Store the selected album name in localStorage
  localStorage.setItem('selectedAlbum', albumName);
  
  // Redirect the user to the generator page
  window.location.href = 'generator.html';
}