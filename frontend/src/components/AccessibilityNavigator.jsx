import { useEffect, useRef } from "react";
import { speak, stopSpeaking } from "../utils/speech";

function cleanText(value) {
  return String(value || "").replace(/\s+/g, " ").trim();
}

function describeElement(el) {
  if (!el || !(el instanceof HTMLElement)) return "";
  const labelled = el.getAttribute("aria-label") || el.getAttribute("title") || el.getAttribute("alt");
  if (labelled) return cleanText(labelled).slice(0, 180);
  if (el instanceof HTMLInputElement || el instanceof HTMLTextAreaElement || el instanceof HTMLSelectElement) {
    const label = el.labels?.[0]?.innerText || el.getAttribute("placeholder");
    if (label) return `${el.tagName === "SELECT" ? "Selection" : "Input"}: ${cleanText(label).slice(0, 120)}`;
  }
  const role = el.getAttribute("role");
  const tag = el.tagName.toLowerCase();
  const text = cleanText(el.innerText || el.textContent).slice(0, 180);
  if (["button", "a"].includes(tag) || role === "button" || role === "link" || el.tabIndex >= 0) {
    return `${tag === "a" || role === "link" ? "Link" : "Button"}: ${text || "unlabeled control"}`;
  }
  if (["h1", "h2", "h3", "h4"].includes(tag) && text) return `Heading: ${text}`;
  if (tag === "img" && text) return `Image: ${text}`;
  return "";
}

export default function AccessibilityNavigator() {
  const lastAnnouncement = useRef("");
  const lastTime = useRef(0);
  const edgeState = useRef("");

  useEffect(() => {
    const enabled = () => localStorage.getItem("accessibility") === "true";
    if (!enabled()) return;

    const announceHover = (event) => {
      if (!enabled()) return;
      const target = event.target?.closest?.("button,a,input,textarea,select,[role='button'],[role='link'],h1,h2,h3,h4,img,[tabindex]");
      const description = describeElement(target);
      if (!description || description === lastAnnouncement.current) return;
      const now = Date.now();
      if (now - lastTime.current < 650) return;
      lastAnnouncement.current = description;
      lastTime.current = now;
      speak(description);
    };

    const announceFocus = (event) => {
      if (!enabled()) return;
      const description = describeElement(event.target);
      if (!description || description === lastAnnouncement.current) return;
      lastAnnouncement.current = description;
      lastTime.current = Date.now();
      speak(description);
    };

    const edgeCheck = (event) => {
      if (!enabled()) return;
      const threshold = 28;
      const x = event.clientX;
      const y = event.clientY;
      const w = window.innerWidth;
      const h = window.innerHeight;
      const edges = [];
      if (x <= threshold) edges.push("left edge");
      if (x >= w - threshold) edges.push("right edge");
      if (y <= threshold) edges.push("top edge");
      if (y >= h - threshold) edges.push("bottom edge");
      const state = edges.join(",");
      if (state && state !== edgeState.current) {
        edgeState.current = state;
        speak(`Warning. Your pointer is near the ${edges.join(" and ")}.`);
      } else if (!state) {
        edgeState.current = "";
      }
    };

    const touchOrPointer = (event) => {
      if (!enabled()) return;
      if (event.pointerType === "touch") speak("Touch detected. You are interacting with the screen.");
    };

    document.addEventListener("mouseover", announceHover, true);
    document.addEventListener("focusin", announceFocus, true);
    document.addEventListener("mousemove", edgeCheck, true);
    document.addEventListener("pointerdown", touchOrPointer, true);
    return () => {
      document.removeEventListener("mouseover", announceHover, true);
      document.removeEventListener("focusin", announceFocus, true);
      document.removeEventListener("mousemove", edgeCheck, true);
      document.removeEventListener("pointerdown", touchOrPointer, true);
    };
  }, []);

  return null;
}
