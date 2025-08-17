import Echo from "laravel-echo";
import Pusher from "pusher-js";

declare global {
  interface Window {
    Pusher: typeof Pusher;
    Echo: Echo<any>;
  }
}

if (typeof window !== "undefined") {
  window.Pusher = Pusher;

  window.Echo = new Echo({
    broadcaster: "pusher",
    key: "local",
    wsHost: "127.0.0.1",
    wsPort: 6001,
    forceTLS: false,
    disableStats: true,
  });
}

export const echo = typeof window !== "undefined" ? window.Echo : ({} as Echo<any>);
