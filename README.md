# ClearQR

Free QR codes with no account, no limits and no subscription. Everything is drawn and checked on your own device.

Built and maintained by [ClearSky Digital](https://cscloud.digital).

## What it makes

- Types: link, text, contact card (vCard), Wi-Fi, email, text message, phone call, map location, calendar event.
- Looks: six presets, plus dot, corner and background colors, dot shape, corner style, quiet zone, error correction, center logo and size.
- Image mode: blend a photo with the code.
- Output: PNG and SVG.
- A scan check: every code is read back in the browser (or the terminal) and marked "scans" or "won't scan" before you download it.

## Privacy

Nothing leaves your device. The web app is a static page: no server code, no uploads, no accounts, no analytics, no tracking. Fonts are bundled, and the production page blocks network connections from its own scripts.

## Web app

```
npm install
npm run dev      # development
npm run build    # static site in out/
```

Host the `out/` folder anywhere that serves static files.

## Command line

```
npm run build:cli
node dist/cli.mjs examples/link.json -o link.png
```

Options: `-o <file>`, `--format png|svg`, `--no-verify`. Exit codes: 0 written and scans, 1 usage, 2 invalid config, 3 written but won't scan.

## Config

One JSON file describes a code: `type`, `content`, `style`, `image` and `output`. The schema is in `schema/clearqr.schema.json`, and `examples/` has one file per type using made-up data. The web app saves and loads the same format.

```json
{
  "version": 1,
  "type": "wifi",
  "content": { "ssid": "ExampleNet", "password": "example-password", "security": "WPA" },
  "style": { "preset": "sky" },
  "output": { "format": "png", "file": "wifi.png" }
}
```

## About the scan check

The check uses a software decoder at several sizes. It is a strong sign, not a guarantee: phone cameras differ, and printing changes things. Test a printed code with your own phone before you print many.

## Tests

```
npm test
npm run mutation-proof
```

The tests cover an encode and decode round trip for every type, config validation, image mode, the command line and the page. The mutation proof breaks the scan check and the vCard escaping on purpose and confirms a test fails each time.

## License

MIT. See `LICENSE` and `NOTICE`.

