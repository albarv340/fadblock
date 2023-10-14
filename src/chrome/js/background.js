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
    const muteInterval = setInterval(() => {
      if (!isVideoMuted()) {
        for (const audio of document.querySelectorAll("audio, video")) {
          audio.muted = !allowAudio;
        }
      }
    }, 5);
    if (!videoPlayer.duration) {
      setTimeout(() => {
        hookVideoPlayer();
      }, 20);
    } else {
      videoPlayer.currentTime = videoPlayer.duration - 1;
      videoPlayer.pause();
      videoPlayer.play();
    }
    clearInterval(muteInterval);
  }
}

chrome.tabs.onUpdated.addListener((tabId, changeInfo, tab) => {
  if (
    changeInfo.status === "complete" &&
    String(tab.url).includes("https://www.youtube.com/watch")
  ) {
    chrome.scripting.executeScript({
      target: { tabId: tabId },
      function: waitForPlayer,
    });
  }
});
