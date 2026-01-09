videoContainer = document.querySelector(".video-container")
videoElement = document.querySelector("#video");
videoOverlayElement = document.querySelector(".video-overlay");
overlayContentElement = document.querySelector(".overlay-content")
videoOverlayTitle = document.querySelector("#overlay-title");
playButton = document.querySelector("#playButton");
pauseButton = document.querySelector("#pauseButton");
returnButton = document.querySelector("#return-button")
videoControls = document.querySelector(".video-controls");
videoSelectorOverlay = document.querySelector(".video-selector-overlay")
const hotspot = document.querySelector("#hotspot");
const WPVR_URL = "https://34.169.26.223/?embed_page=54";



videoElement.style.display = 'block';
videoControls.style.display = 'block';
videoSelectorOverlay.style.display = 'none';
overlayContentElement.style.display = 'none';
videoOverlayElement.style.display = 'none';


tourList = {
    "Student Center": "student-center.mp4",
    "Bava Hall": "bava-hall.mp4"
};

let resumeTime = 0;
tourRunning = false;
currentVideo = tourList["Student Center"]

tourList = {
    "Student Center": "student-center.mp4",
    "Bava Hall": "bava-hall.mp4"
};

videoContainer.addEventListener("mouseenter", enableVideoControls); // Enables video controls (play/pause buttons) when mouse moves over the video.
videoContainer.addEventListener("mouseleave", disableVideoControls); // Disables video controls when mouse leaves the video.
playButton.addEventListener("click", () => videoElement.play()); // Plays the video.
pauseButton.addEventListener("click", () => videoElement.pause()); // Pauses the video.
returnButton.addEventListener("click", () => playVideo(currentVideo))


videoSelectorOverlay.addEventListener("click", (event) => {
    if (event.target.tagName === 'P') {
        videoName = event.target.textContent
        console.log(videoName)
        console.log(tourList[videoName])

        playVideo(tourList[videoName])
        currentVideo = tourList[videoName]
        resumeTime = 0;
    }
})


function playVideo(videoPath) {
    tourRunning = true;
    overlayContentElement.style.display = 'none'
    videoOverlayElement.style.display = 'none';
    videoElement.src = videoPath;
    videoElement.currentTime = resumeTime;
    
    videoElement.style.display = 'block'
    videoOverlayElement.style.display = 'none';

    videoElement.play();
}

function addOverlay(overlayTitle, overlayStartTime, overlayEndTime) {
    videoOverlayElement.addEventListener("click", () => {
        resumeTime = videoElement.currentTime;
        showWebContent();
    })
    
    videoElement.addEventListener('timeupdate', () => {
        const videoCurrentTime = videoElement.currentTime;
        const videoEndTime = videoElement.duration;
        
        console.log(videoCurrentTime);
            
            if (videoCurrentTime > overlayStartTime && videoCurrentTime < overlayEndTime) {
                videoOverlayTitle.innerHTML = overlayTitle;
                videoOverlayElement.style.display = 'block';
            }

            if (videoCurrentTime > overlayEndTime) {
            videoOverlayElement.style.display = 'none';
            }
        }
    );
}

function showWebContent() {
    // Stop the tour
    tourRunning = false;

    // Save the current video time to resume later
    resumeTime = videoElement.currentTime;

    // Pause the video
    videoElement.pause();

    // Optional: show overlay message
    videoOverlayTitle.innerText = "Opening VR experience…";
    videoOverlayElement.style.display = "block";

    // Open WPVR in a new tab
    setTimeout(() => {
        window.open(WPVR_URL, "_blank", "noopener,noreferrer");

        // Hide the overlay after opening
        videoOverlayElement.style.display = "none";
    }, 300); // small delay for smoother UX
}


function newWebContent(link, overlayTitle, duration) {
    videoOverlayTitle.innerHTML = overlayTitle;
    overlayContentElement.src = link;

    return new Promise((resolve) => {
        setTimeout(() => {resolve();}, (duration * 1000))
    })
}


function disableVideoControls() {
    videoControls.style.display = 'none';
    videoSelectorOverlay.style.display = 'none';
}

function enableVideoControls() {
    videoControls.style.display = 'block';
    videoSelectorOverlay.style.display = 'block';
}

/*
function experienceSequence() {
    playVideo("student-center.mp4")
    addOverlay("Student Center", 0, 10);
    //newWebContent("https://www.google.com/maps/embed?pb=!4v1761976513702!6m8!1m7!1sLCnPJT8X5ivSPMMteKpMxw!2m2!1d37.52466119681335!2d-120.855832794452!3f328.44554397942886!4f-3.7204663493234307!5f0.7820865974627469", "Street View", 5);
    //addOverlay("Bava Hall", 12, 17);
    //await playVideo("bava-hall.mp4");

}
*/

playVideo(currentVideo)
addOverlay("Overlay Test 1", 0, 4);
addOverlay("Overlay Test 2", 4, 8);

// Keyframes: adjust these numbers to match your building
const hotspotKeyframes = [
    { time: 0, x: -200, y: 300 },
    { time: 4, x: -200, y: 300 },
    { time: 6, x: -250, y: 300 }
];

// Click action
hotspot.addEventListener("click", () => {
    resumeTime = videoElement.currentTime;
    showWebContent(); // opens your WPVR
});

function animateHotspot() {
    const t = videoElement.currentTime;

    let visible = false;

    for (let i = 0; i < hotspotKeyframes.length - 1; i++) {
        const k1 = hotspotKeyframes[i];
        const k2 = hotspotKeyframes[i + 1];

        if (t >= k1.time && t <= k2.time) {
            const ratio = (t - k1.time) / (k2.time - k1.time);

            // Smooth easing
            const eased = ratio * ratio * (3 - 2 * ratio);

            const x = k1.x + (k2.x - k1.x) * eased;
            const y = k1.y + (k2.y - k1.y) * eased;

            hotspot.style.transform = `translate(${x}px, ${y}px)`;
            hotspot.style.display = "flex";
            visible = true;
            break;
        }
    }

    if (!visible) {
        hotspot.style.display = "none";
    }

    requestAnimationFrame(animateHotspot);
}

// Start animation
requestAnimationFrame(animateHotspot);

