# Full Focus - A Distraction-Free YouTube Experience

Full Focus is a Chrome extension that helps you stay focused while using YouTube by removing distracting elements from the interface. It gives you full control over which elements to hide, allowing for a customized, distraction-free viewing experience.

## Features

-   **Hide Home Feed**: Remove the endless scroll of recommended videos on the homepage
-   **Hide Recommendations**: Remove suggested videos that appear on the side and after videos
-   **Disable Autoplay**: Automatically turn off autoplay for all videos
-   **Hide Comments**: Remove the comments section below videos
-   **Hide Shorts**: Remove YouTube Shorts from your feed
-   **Hide Thumbnails**: Show only video titles for a more minimalist experience
-   **Hide Ads**: Remove advertisement elements from the interface
-   **Sync Settings**: Your preferences sync across devices automatically

## Installation

1.  Download from the Chrome Web Store (link coming soon)
2.  Or install manually:
    -   Clone this repository
    -   Open Chrome and navigate to `chrome://extensions/`
    -   Enable "Developer mode" in the top right
    -   Click "Load unpacked" and select the extension directory

## Usage

1.  Click the Full Focus icon in your Chrome toolbar
2.  Use the toggles to enable/disable individual features
3.  Use the "All Features" toggle to enable/disable everything at once
4.  Changes take effect immediately on any open YouTube tabs

## Development

### Project Structure

```         
full-focus/
├── manifest.json      # Extension configuration
├── content.js         # Content script for YouTube modifications
├── popup.html         # Settings popup interface
├── popup.js           # Settings management logic
├── popup.css          # Popup styling
├── styles.css         # YouTube modifications styling
├── background.js      # Service worker
└── img/               # Extension icons
```

### Building From Source

1.  Clone the repository:

``` bash
git clone https://github.com/cwallenwein/full-focus.git
```

2.  Make your modifications

3.  Test the extension:

    -   Open Chrome and go to `chrome://extensions/`
    -   Enable "Developer mode"
    -   Click "Load unpacked" and select the extension directory
    -   Make changes and click the refresh icon to test

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request. For major changes, please open an issue first to discuss what you would like to change.

1.  Fork the repository
2.  Create your feature branch (`git checkout -b feature/AmazingFeature`)
3.  Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4.  Push to the branch (`git push origin feature/AmazingFeature`)
5.  Open a Pull Request

## Tech Stack

-   Vanilla JavaScript
-   Chrome Extension APIs
-   CSS for styling and modifications

## Privacy

Full Focus:

-   Does not collect any user data

-   Does not track your browsing activity

-   Does not require any special permissions beyond what's needed for basic functionality

-   Only operates on YouTube domains