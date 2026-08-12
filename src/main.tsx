import ReactDOM from "react-dom/client";

import { App } from "@/App";

if ("serviceWorker" in navigator) {
  void navigator.serviceWorker
    .getRegistrations()
    .then((registrations) => {
      registrations.forEach((registration) => {
        void registration.unregister();
      });
    })
    .catch(() => undefined);
}

ReactDOM.createRoot(document.getElementById("root")!).render(<App />);
