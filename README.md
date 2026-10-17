<h1 align="center">tts-pwa-helper</h1>

<p align="center">
  Type it. Tap it. Say it, or show it big.<br>
  A small text-to-speech app that installs like a real app and works offline.
</p>

<p align="center">
  <a href="https://alrmclok.github.io/tts-pwa-helper/">
    <img alt="Open the app" src="https://img.shields.io/badge/%E2%96%B6%20%20Open%20the%20app-Live%20website-2563eb?style=for-the-badge">
  </a>
</p>

<p align="center">
  <a href="https://alrmclok.github.io/tts-pwa-helper/">alrmclok.github.io/tts-pwa-helper</a>
</p>

---

## What is it?

A helper for moments when talking is hard, tiring or just not possible. Type a sentence (or tap a ready-made phrase), then either have your phone **speak it out loud** or **show it full screen in huge text** for someone to read.

No account, no server, no tracking. Everything stays on your device.

## Features

- **Speak / Stop** with your device's built-in voices
- **Quick phrases** you can edit yourself, grouped under headings
- **View mode** that fills the screen with your text, auto-sized to fit, in landscape, with the screen kept awake
- **Voice picker** with adjustable speed, pitch and volume, plus a test button
- **29 themes**, from Light and Dark to Pure, Mono Sepia, color families (Orange, Amber, Green, Emerald, Teal, Blue, Indigo, Purple, Rose, Crimson) and special ones (Sunset, Midnight, Cyberpunk, Matrix)
- **Installable and offline**: add it to your home screen and use it without internet
- **Settings are saved** in your browser, so your phrases, theme and voice stay put

## How to use

1. Open the [live website](https://alrmclok.github.io/tts-pwa-helper/).
2. Type in the box, or tap a phrase to fill it in.
3. Press **Speak** to hear it, or **View** to show it big. Tap the text in View mode to speak it again, and tap the faint corner to close.
4. Open **Settings** (top right) to change the theme, voice and phrases.

### Editing phrases

In Settings, write one phrase per line. A line starting with `#` becomes a section heading:

```
# Greetings
Hi! Nice to meet you.
Thank you!
# Help
Please speak a bit slower.
```

## Install it as an app

- **Android (Chrome):** menu, then **Install app** or **Add to Home screen**
- **iPhone / iPad (Safari):** Share, then **Add to Home Screen**
- **Desktop (Chrome / Edge):** click the install icon in the address bar

## Run it locally

It's plain HTML, CSS and JavaScript, so there is nothing to build.

```bash
git clone https://github.com/alrmclok/tts-pwa-helper.git
cd tts-pwa-helper
python3 -m http.server 8000
```

Then open <http://localhost:8000>. A local server is needed (instead of opening `index.html` directly) so the service worker and install features work.

## Project structure

```
index.html      app markup
style.css       styles and all themes
app.js          app logic (speech, phrases, themes, settings, view mode)
sw.js           service worker for offline use
manifest.json   install info for the PWA
icons/          interface icons (SVG)
icon-192.png    app icons
icon-512.png
```

## Adding a theme

1. Add a block to `style.css`:
   ```css
   [data-theme=pink-light]{--background:#fdf2f8;--surface:#fff;--paper:#fff;--foreground:#500724;--mute:#9d174d;--border:#be185d;--border-soft:#fbcfe8;--accent:#db2777;--on:#fff}
   ```
2. Add one line to the `THEMES` list at the top of `app.js`:
   ```js
   ['pink-light', 'Pink light'],
   ```

## Updating the app

The service worker caches the files for offline use. After changing any file, bump the version in `sw.js` so users get the new files:

```js
const V = 'tts-pwa-helper-3';
```

## Browser support

Text-to-speech depends on the voices installed on your device, so the list and quality of voices differ between phones and browsers. Landscape lock and screen wake lock aren't available everywhere. If the screen doesn't rotate in View mode, turn on **Use CSS rotation** in Settings, under Advanced.

## License

Add a license of your choice (for example MIT) as a `LICENSE` file.