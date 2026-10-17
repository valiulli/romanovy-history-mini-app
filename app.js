(() => {
  "use strict";

  const DEFAULT_VIDEO_ID = "NfpKPYRUZLo";
  const DEFAULT_TITLE = "Александр II: личная жизнь либерала на троне";
  const DEFAULT_DATE = "27.02.2021";
  const VIDEO_ID_PATTERN = /^[A-Za-z0-9_-]{11}$/;

  const params = new URLSearchParams(window.location.search);
  const requestedVideoId = params.get("video") || DEFAULT_VIDEO_ID;
  const videoId = VIDEO_ID_PATTERN.test(requestedVideoId)
    ? requestedVideoId
    : DEFAULT_VIDEO_ID;
  const lectureTitle = cleanText(params.get("title"), DEFAULT_TITLE, 140);
  const lectureDate = cleanText(params.get("date"), DEFAULT_DATE, 20);
  const youtubeUrl = `https://www.youtube.com/watch?v=${videoId}`;
  const telegram = window.Telegram?.WebApp;
  const isTelegram = Boolean(telegram?.initData);

  document.getElementById("lecture-title").textContent = lectureTitle;
  document.getElementById("lecture-date").textContent = `Дата лекции: ${lectureDate}`;
  createPlayer();

  if (isTelegram) {
    telegram.ready();
    telegram.expand();
    telegram.setHeaderColor("#10263b");
    telegram.setBackgroundColor("#fbf8f0");
    telegram.BackButton.show();
    telegram.BackButton.onClick(closeMiniApp);
  }

  document.getElementById("youtube-button").addEventListener("click", () => {
    if (isTelegram) {
      telegram.openLink(youtubeUrl, { try_instant_view: false });
      return;
    }
    window.open(youtubeUrl, "_blank", "noopener,noreferrer");
  });

  document.getElementById("close-button").addEventListener("click", closeMiniApp);

  function closeMiniApp() {
    if (isTelegram) {
      telegram.close();
      return;
    }
    if (window.history.length > 1) {
      window.history.back();
      return;
    }
    window.close();
  }

  function createPlayer() {
    const player = document.createElement("iframe");
    const query = new URLSearchParams({
      playsinline: "1",
      rel: "0",
      origin: window.location.origin,
      widget_referrer: window.location.href,
    });
    player.src = `https://www.youtube-nocookie.com/embed/${videoId}?${query}`;
    player.title = `YouTube: ${lectureTitle}`;
    player.referrerPolicy = "strict-origin-when-cross-origin";
    player.allow = [
      "accelerometer",
      "autoplay",
      "clipboard-write",
      "encrypted-media",
      "gyroscope",
      "picture-in-picture",
      "web-share",
    ].join("; ");
    player.allowFullscreen = true;
    document.getElementById("player").append(player);
  }

  function cleanText(value, fallback, maxLength) {
    const normalized = (value || "").trim().replace(/\s+/g, " ");
    return normalized ? normalized.slice(0, maxLength) : fallback;
  }
})();
