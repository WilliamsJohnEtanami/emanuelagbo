# Webar Media — Emmanuel Agbo

Complete responsive portfolio with four Edit Room video highlights, a Flux Edit short-form video, client logos, services, biography, and a WhatsApp project enquiry form.

## Build and preview

Requires Node.js 18 or newer. No third-party packages or install step are needed.

```sh
npm run build
python3 -m http.server 8080 --directory dist
```

Open http://localhost:8080. You can also serve `dist/` with any static web server.

The largest videos are stored as lossless parts under `media/` so they can be transferred reliably. The build reconstructs the exact MP4 files and verifies every part and complete video against SHA-256 hashes. The reconstructed files are ignored by Git. Keep all files under `media/` when cloning or downloading the project.

## Deploy to Vercel

Import this GitHub repository. The included `vercel.json` configures:

- Framework: Other
- Build command: `npm run build`
- Output directory: `dist`

The build automatically restores all complete videos before deployment.

## Update the portfolio

Edit `dist/media.js` to update video order, captions, or the professional headshot. The Edit Room contains How I Built Wealth episode 11, KM Lebanese, Peller, and Music Podcast. Flux Edit occupies the No. 2 short-form card. Muted previews play while visible; clicking opens the complete video with sound controls.

Set `headshot` to `{ src: 'assets/emmanuel-headshot.jpg', alt: 'Emmanuel Agbo' }` after adding a portrait to `dist/assets/`.

To replace a multipart video, provide its complete MP4 directly or regenerate its parts and integrity manifest. New direct video URLs can also be configured in `dist/media.js`.

The contact form prepares a WhatsApp message for the visitor to review and send. Direct email and social links are included. No email-delivery backend or submission storage is configured.
