# 🌙 NightEye Premium

> **A powerful, customizable dark mode extension for all websites.**

NightEye Premium transforms your browsing experience by applying a smart, adjustable dark mode to every website you visit. Protect your eyes, save battery, and browse in style.

![Version](https://img.shields.io/badge/version-1.1-blue.svg)
![License](https://img.shields.io/badge/license-MIT-green.svg)

## ✨ Features

NightEye Premium is packed with features to give you complete control over your browsing environment:

*   **🌗 Global Dark Mode**: Instantly toggle dark mode on or off for all websites with a single click.
*   **🎚️ Adjustable Darkness**: Fine-tune the darkness level from **50% to 100%** to match your ambient lighting.
*   **⏰ Schedule Mode**: Set automatic start and end times. NightEye will wake up when the sun goes down.
*   **🎨 Premium Themes**: Choose from a variety of professionally curated themes:
    *   **Classic Black**: The standard, deep dark mode.
    *   **Midnight Blue**: A calming, deep blue tint.
    *   **Deep Forest**: A relaxing, nature-inspired dark green.
    *   **Cyberpunk**: A futuristic, high-contrast aesthetic.
*   **🛡️ Blue Light Filter**: Reduce eye strain by filtering out harmful blue light, perfect for late-night reading.
*   **✅ Smart Whitelist**: Easily disable NightEye for specific websites that you prefer to view in their original design.

## 🚀 Installation

Since this is a developer version, you can install it as an unpacked extension in Chrome, Edge, or Brave.

1.  **Clone or Download** this repository to your computer.
2.  Open your browser and navigate to the **Extensions** page:
    *   Chrome: `chrome://extensions`
    *   Edge: `edge://extensions`
3.  Enable **Developer Mode** (usually a toggle in the top right corner).
4.  Click on **Load unpacked**.
5.  Select the folder where you downloaded **NightEye Premium**.
6.  Done! The 🌙 icon should appear in your toolbar.

## 📖 Usage

1.  Click the **NightEye Premium icon** in your browser toolbar to open the popup.
2.  **Toggle the switch** to enable/disable dark mode globally.
3.  Use the **slider** to adjust the contrast/darkness intensity.
4.  Enable **Schedule Mode** and set your preferred hours for automatic activation.
5.  Select a **Theme** from the dropdown to change the color palette.
6.  Toggle the **Blue Light Filter** for added eye protection.
7.  If a site looks broken or you prefer the light version, click **"Disable for this site"**.

## 📂 Project Structure

```
NightEye Premium/
├── 📁 background/      # Service workers for background tasks
├── 📁 content/         # Scripts & styles injected into websites
├── 📁 icons/           # Application icons
├── 📁 popup/           # The user interface (HTML/CSS/JS)
├── 📄 manifest.json    # Extension configuration
└── 📄 LICENSE.txt      # License information
```

## 🛠️ Technologies

*   **HTML5 & CSS3**: For the popup UI and injected styles.
*   **JavaScript (ES6+)**: Core logic for the extension.
*   **Chrome Extension API (Manifest V3)**: Utilizing the latest standards for performance and security.

## 🤝 Contributing

Contributions are welcome! If you have ideas for new themes or features:

1.  Fork the project.
2.  Create your feature branch (`git checkout -b feature/AmazingFeature`).
3.  Commit your changes (`git commit -m 'Add some AmazingFeature'`).
4.  Push to the branch (`git push origin feature/AmazingFeature`).
5.  Open a Pull Request.

## 📄 License

Distributed under the MIT License. See `LICENSE.txt` for more information.

---
