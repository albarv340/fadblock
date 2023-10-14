function getVideoContainer() {
  return document.querySelector(".html5-video-container");
}

function getVideoWrapper() {
  return getVideoContainer()?.parentNode;
}

function getVideoPlayer() {
  return getVideoContainer()?.querySelector("video");
}

function isAdShowing() {
  return String(getVideoWrapper()?.className).includes("ad-showing");
}

function getSkipButton() {
  return document.querySelector(".ytp-ad-skip-button.ytp-button");
}

function isVideoMuted() {
  return document.querySelector(".ytp-mute-button.ytp-button")?.getAttribute("data-title-no-tooltip") === "Unmute";
}

function setAudioMuted(isMuted) {
  if (!isVideoMuted()) {
    for (const audio of document.querySelectorAll("audio, video")) {
      console.dir(audio)
      audio.muted = isMuted;
    }
  }
}


function waitForPlayer() {
  if (getVideoPlayer()) {
    hookVideoPlayer();
  } else {
    setTimeout(() => {
      waitForPlayer();
    }, 200);
  }
}

function hookVideoPlayer() {
  const videoPlayer = getVideoPlayer();
  videoPlayer.addEventListener("timeupdate", () => {
    getSkipButton()?.click();
  });

  if (isAdShowing()) {
    setAudioMuted(true);
    const muteInterval = setInterval(() => {
      setAudioMuted(true);
    }, 1);
    if (!videoPlayer.duration) {
      setTimeout(() => {
        hookVideoPlayer();
      }, 20);
    } else {
      videoPlayer.currentTime = videoPlayer.duration - 1;
      videoPlayer.pause();
      videoPlayer.play();
    }
    // clearInterval(muteInterval);
    setAudioMuted(false);
  }
}

chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  console.log(message)
  return true
});
