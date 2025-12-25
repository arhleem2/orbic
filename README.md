# Orbit Social 🪐

Orbit is a modern, privacy-focused social media application built with Vanilla JavaScript, HTML5, and CSS3. It features a premium "glassmorphism" design, interactive elements, and a robust local-storage backend for a seamless offline-first experience.

## ✨ Features

### Phase 1: Interactive & Fun
- **Polls**: Create interactive polls in your feed.
- **GIFs & Voice Notes**: Simulated attachments for rich media posts.
- **Reactions**: Long-press "Like" buttons to react with emojis (❤️, 😂, 😮, 😢, 🔥).
- **Confetti**: Celebratory animations on interactions.
- **Gamification**: Profile badges (Verified, Top Fan) and Story Highlights.

### Phase 2: Customization
- **Theme Engine**: Toggle between Dark, Light, and Dim modes.
- **Accent Colors**: Custom primary colors (Pink, Blue, Green, Gold).
- **Profile Customization**: Upload banners and manage your "Link Tree".
- **Display Settings**: Adjustable font sizes and layout modes (Compact vs. Card).

### Core Features
- **Feed**: Initial posts and real-time posting updates.
- **Stories**: Instagram-style story viewer with progress bars.
- **Marketplace**: Clean grid layout for simulated items.
- **Live Streaming**: Simulated cam/mic access with "Live" indicators.
- **Privacy**: Local-first data handling; nothing leaves your browser.

## 🚀 Getting Started

### Prerequisites
No complex build tools or servers are required! Orbit is built with standard web technologies.

### Installation
1.  **Clone the repository**:
    ```bash
    git clone https://github.com/yourusername/orbit-social.git
    cd orbit-social
    ```
2.  **Run the app**:
    *   Simply open `index.html` in your browser.
    *   OR use a live server extension (e.g., Live Server in VS Code) for the best experience.

## 🛠️ Tech Stack
-   **Frontend**: HTML5, CSS3 (Variables, Flexbox, Grid), Vanilla JavaScript (ES6+).
-   **Backend**: `localStorage` (Simulating a NoSQL database).
-   **Icons**: Inline SVGs (Feather Icons style).
-   **Avatars**: DiceBear API.
-   **Images**: Unsplash Source.

## 📁 Project Structure
```
orbit-social/
├── css/
│   └── style.css       # Main stylesheet (Variables, Components, Utilities)
├── js/
│   ├── app.js          # Core application logic (UI, Events, Features)
│   └── backend.js      # Mock database layer (localStorage wrapper)
├── index.html          # Main Feed
├── explore.html        # Discovery Page
├── market.html         # Marketplace
├── messages.html       # Chat Interface
├── notifications.html  # Activity Feed
├── profile.html        # User Profile
├── settings.html       # App Configuration
└── login.html          # Authentication Entry
```

## 🤝 Contributing
1.  Fork the Project
2.  Create your Feature Branch (`git checkout -b feature/AmazingFeature`)
3.  Commit your Changes (`git commit -m 'Add some AmazingFeature'`)
4.  Push to the Branch (`git push origin feature/AmazingFeature`)
5.  Open a Pull Request

## 📄 License
Distributed under the MIT License. See `LICENSE` for more information.

---
*Built with ❤️ by the Orbit Team*
