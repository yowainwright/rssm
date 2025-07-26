// Setup file for bun tests
import { GlobalWindow } from "happy-dom";

// Create a global window instance
const window = new GlobalWindow();

// Register happy-dom globals
Object.assign(global, {
  window,
  document: window.document,
  navigator: window.navigator,
  HTMLElement: window.HTMLElement,
  HTMLDivElement: window.HTMLDivElement,
  Element: window.Element,
  Node: window.Node,
  localStorage: window.localStorage,
  sessionStorage: window.sessionStorage,
  location: window.location,
  history: window.history,
  CustomEvent: window.CustomEvent,
  Event: window.Event,
  EventTarget: window.EventTarget
});