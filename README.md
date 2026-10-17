<h1 align="center">TTS PWA HELPER</h1>

<p align="center">
  type or say or show it big<br>
  a small text-to-speech that could be installed easily and works offline
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

a helper for moments when talking is hard or tiring or just not possible. type a sentence (or tap a ready-made phrase, you could change it in settings), then either have your phone **speak it out loud** or **show it full screen in huge text** for someone to read

No account and no server, everything stays on your device

## Features

- **Speak / Stop** with your device's built-in voices (you could download custom voice, but i dont know how to, better not or feel free to risk it)
- **Quick phrases** you can edit yourself, grouped under headings
- **View mode** fills the screen with your text, auto-sized to fit, in landscape, with the screen kept awake (i hope)
- **Voice picker** with adjustable speed, pitch and volume, plus a test button. volume could only decrease, as i need to readjust the path of the voice output or i dont know the name
- **30 themes**, from Light and Dark to Pure, Mono Sepia, color families (Orange, Amber, Green, Emerald, Teal, Blue, Indigo, Purple, Rose, Crimson) and special ones (Sunset, Midnight, Cyberpunk, Matrix, Internet Rule)
- **Installable and offline**: add it to your home screen and use it without internet
- **Settings are saved** in your browser, so your phrases, theme and voice stay put and you couldnt blame me if the data is gone

## How to use

1. open the [live website](https://alrmclok.github.io/tts-pwa-helper/)
2. type in the box, or tap default phrases to fill it in
3. press **Speak** to hear it, or **View** to show it big. tap the text in View mode to speak it again, and tap the faint corner (there will be a quarter) to close
4. open **Settings** (top right) to change the theme, voice and phrases

### Editing phrases

in Settings, write one phrase per line. a line starting with `#` becomes a section heading:

```
# Greetings
haii!! nice to meet you!
thank youu!!
# Help
please speak a bit slower...
haha 6 7
```

## Install it as an app

- **Android (Chrome):** menu, then **Install app** or **Add to Home screen**
- **iPhone / iPad (Safari):** share, then **Add to Home Screen**
- **Desktop (Chrome / Edge):** click the install icon in the address bar

> i hope its working in iphone or ipad, never tested there

## Run it locally

its plain HTML, CSS and JavaScript, so there is nothing to build

```bash
git clone https://github.com/alrmclok/tts-pwa-helper.git
cd tts-pwa-helper
python3 -m http.server 8000
```

then open <http://localhost:8000>. A local server is needed (instead of opening `index.html` directly) so the service worker and install features work

or you could do "open with live server" to the `index.html` if using the live server plugin

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

1. add a block to `style.css`:
   ```css
   [data-theme=pink-light]{--background:#fdf2f8;--surface:#fff;--paper:#fff;--foreground:#500724;--mute:#9d174d;--border:#be185d;--border-soft:#fbcfe8;--accent:#db2777;--on:#fff}
   ```
2. add one line to the `THEMES` list at the top of `app.js`:
   ```js
   ['pink-light', 'Pink light'],
   ```

## Updating the app

the service worker (`sw.js`) caches application files for offline use. because the browser will continue to serve these cached files even after you update your code, you must manually trigger an update

After changing any file, bump the version in `sw.js` so users get the new assets:

```js
const V = 'tts-pwa-helper-67';
```

### How it works under the hood
1. **Detection:** changing this string forces the browser to treat `sw.js` as a new file
2. **Caching:** the app creates a new cache instance and downloads your updated files
3. **Cleanup:** once the new service worker activates, it deletes the old cache to free up device space

## Browser support

text-to-speech depends on the voices installed on your device, so the list and quality of voices may be different between phones and browsers. landscape lock and screen wake lock aren't available everywhere. if the screen doesn't rotate in View mode, turn on **Use CSS rotation** in Settings, under Advanced (at the really bottom).

## License

this project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details