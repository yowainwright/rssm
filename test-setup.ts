import { GlobalWindow } from "happy-dom";

const window = new GlobalWindow();

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
  EventTarget: window.EventTarget,
});
