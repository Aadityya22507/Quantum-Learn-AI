export function isAccessibilityEnabled() {
  return localStorage.getItem("accessibility") === "true";
}

export function stopSpeaking() {
  if (window.speechSynthesis) window.speechSynthesis.cancel();
}

export function speak(text) {
  if (!isAccessibilityEnabled()) {
    stopSpeaking();
    return;
  }
  if (!window.speechSynthesis || !text) return;
  stopSpeaking();
  const speech = new SpeechSynthesisUtterance(String(text));
  speech.lang = "en-US";
  speech.rate = 1;
  speech.pitch = 1;
  speech.volume = 1;
  window.speechSynthesis.speak(speech);
}
