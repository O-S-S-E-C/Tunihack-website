Why the landing page feels slow on bad internet

1. The 3D background starts downloading too late.
Your site loads in steps: HTML, then the main JavaScript, then the page “wakes up”, and only then does the 3D code (Three.js, a big file) start downloading. On slow internet each step waits for the one before it.
Fix: make the browser start downloading the 3D code earlier, at the same time as the main JavaScript.

2. Tux (the penguin image) probably downloads twice.
You tell the browser to preload it, but the 3D code later asks for it in a slightly different way, so the browser doesn’t recognize it as the same file and fetches it again.
Fix: a one-word change on the preload tag (crossOrigin="anonymous") so it matches. Also make smaller versions of Tux for phones, since a phone doesn’t need the big one.

3. Huge images load at the same time as everything important.
These compete for the same slow connection:

The favicon (the little tab icon) points to a big PNG file. Your inventory has several multi-MB PNGs, and I couldn’t tell which one this is.
The sponsors section loads a full-size logo PNG right away, even though it’s far down the page, and its sponsor logos aren’t lazy-loaded.
Some images are marked “priority” even though they’re at the bottom of the page (the video thumbnail and the footer logo). That tells the browser to download them first.

Fix: make small copies of these images at the size they’re actually shown, and mark the bottom-of-page ones as low priority or lazy.

4. The loading screen did not wait for the right things.
It waited for the browser’s “everything finished” signal, which on slow internet comes very late. It also didn’t wait for the 3D scene, so the loader could leave and show an empty background.
Fix: wait only for what the first screen needs (logo, fonts, the first 3D frame), and never longer than about 6 seconds.

5. The loader’s backdrop and logo appear late.
The animated background is drawn by JavaScript, so it can’t appear until the JavaScript has loaded. The logo was a big PNG.
Fix: show a simple CSS-only pattern instantly and fade the animated version in over it. Use a small WebP for the logo.

6. Too much JavaScript loads up front.
Almost every part of the page is a “client component”, so the browser downloads and runs code for the footer, FAQ, sponsors and everything else before the page is ready.
Fix: load the below-the-fold sections later. The page looks exactly the same.

7. The fonts are heavy.
There are 4 font families with many files, including variable fonts and extra latin-ext copies that you probably don’t need.
Fix: only preload the fonts used at the top of the page, and remove the extra language files if your text doesn’t use those characters.

What is not a problem
The 23 MB video is fine. It only loads when someone clicks play.
The big unused PNGs (the 4.4 MB poster, the 1.3 MB Tux PNG, the 2.2 MB wordmark PNG) don’t slow visitors down. You can just move them out of public/ to keep deployments lighter.
Best order to do things
Fix the images: favicon, sponsors, priority tags, Tux preload. This is the easiest change and likely a big win.
Fix the loader: wait for the right things, and show the backdrop instantly.
Fix the 3D loading order: start the 3D download earlier.
Trim the JavaScript and fonts: do this last, since it carries the most risk.

I’m confident about the image problems and the Tux preload, because they’re visible in the code. Starting the 3D download earlier is my best guess at the biggest win, but it needs a real test on a Vercel preview before you keep it.