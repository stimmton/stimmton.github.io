# Audio Scope PWA

A tiny offline-capable PWA that captures the microphone and displays a live waveform + input level.

## Important
Microphone capture and service workers require a secure origin. On an iPhone, open the app from an HTTPS URL. Opening `index.html` directly from the Files app will not work as a PWA.

## Fastest test
Deploy this folder to any static HTTPS host (GitHub Pages, Cloudflare Pages, Netlify, etc.). No backend is needed.

Then on iPhone:
1. Open the HTTPS URL in Safari.
2. Tap **Start microphone** and allow microphone access.
3. Verify the waveform moves when you speak/play an instrument.
4. Safari Share button -> **Add to Home Screen** -> Add.
5. Launch **Audio Scope** from the Home Screen once while online.
6. Close it, enable Airplane Mode, reopen it from the Home Screen, and test the microphone again.

If that works, you have proven the core PWA + local microphone path needed for a tuner.
