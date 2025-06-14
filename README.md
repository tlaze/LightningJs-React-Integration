# LightningJS + React Integration

This project demonstrates a seamless integration between a [LightningJS](https://webplatformforembedded.github.io/Lightning/) TV application and a React web application. Using an `<iframe>` and the `postMessage` API, the two applications communicate efficiently to simulate user interactions and dynamic UI behavior.

## 📺 About

The React app is embedded inside a LightningJS app through an iframe. When users interact with the Lightning app via keyboard inputs, events are sent to the React app using `window.postMessage`. The React app listens for these messages and translates them into simulated UI actions—such as button clicks—creating a responsive and connected user experience across both contexts.

## ✨ Features

- ✅ Cross-context communication via `postMessage`
- 🔁 Event-driven UI interaction across iframe boundary
- ⚡ Integration of LightningJS app into a modern React web app
- 🧩 Decoupled architecture allowing for modular design

## 🚀 How It Works

1. **Embedding**: The React app embeds the LightningJS app using an iframe.
2. **Messaging**: The LightningJS app sends JSON-formatted messages via `postMessage`.
3. **Listening**: The React app listens for `message` events from the iframe.
4. **UI Updates**: Based on the event content, the React app simulates UI interactions.

## 🛠 Tech Stack

- **LightningJS** – Optimized UI rendering for TV applications.
- **React** – Component-based library for building web user interfaces.
- **JavaScript** – Language glue for both apps.
- **postMessage API** – Secure browser-based communication.


