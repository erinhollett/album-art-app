# album-art-app
Album Art App

[Project demo link here](assets/demo.mp4)

Album Art App is an interactive website that lets users create parody album covers featuring themselves. It is designed similarly to a photobooth (a countdown, capture, and then final result at the end). 

The experience begins on the Home page, where users can choose from three templates. Selecting a template opens its Generate page, where the user can enable their webcam. A transparent overlay of the original album cover is displayed to help the user match the pose.

When the user selects 'Start,' a countdown times gives them a few seconds to pose. At the end of the countdown, a centered and cropped snapshot is taken from the webcam feed. Depending on the chosen template, the app applies either a filter, pastes the snapshot into a background, or adds a transparent overlay to the captured image. The captured image is automatically saved to localstorage with a unique ID.

Once the final image is generated, the user can:
* Try Again - Close the popup and restart the capture
* Try Another Template - Return to the Home Page
* View Image - View the image in the Gallery

The Gallery page acts as a personal collection of the user's creations. On it, the user can:
* Download the image as a PNG
* Copy the image to clipboard (as a blob object, ready to paste anywhere)
* Share the image using the Web Share API on mobile devices
* Delete the image (remove it from local storage)

All functionality is handled locally (no backend).
