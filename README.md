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

Host the `out/` folder anywhere that serves static files. To serve it from a subpath such as `https://example.com/qr/`, build with `CLEARQR_BASE_PATH=/qr npm run build` (leave it unset for a site root).

## Command line

```
npm run build:cli
node dist/cli.mjs examples/link.json -o link.png
```

Options: `-o <file>`, `--format png|svg`, `--no-verify`. Exit codes: 0 written and scans, 1 usage, 2 invalid config, 3 written but won't scan.

## Config

One JSON file describes a code: `type`, `content`, `style`, `image` and `output`. The schema is in `schema/clearqr.schema.json`, and `examples/` has one file per type using made-up data. The web app saves and loads the same format. On the command line, an image path in a config must point inside the config file's own folder, and logos must be png, jpg, webp or gif.

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

## Hosting headers

The web app is a static folder (`out/`). A static host that lets you set response headers should send these, because a `<meta>` tag cannot do all of it:

- `Content-Security-Policy`: the same policy the page carries in its meta tag, plus `frame-ancestors 'none'`.
- `Referrer-Policy: no-referrer`
- `X-Content-Type-Options: nosniff`
- `Permissions-Policy: camera=(), microphone=(), geolocation=()`

Hosts that cannot set headers (GitHub Pages is one) still serve a working app with the meta policy, but `frame-ancestors` and the other headers do not apply there.

## Security notes

- Nothing leaves the device: the page makes no network requests, and a policy in the page blocks them.
- On the command line, an image path in a config and an output path from a config must stay inside the folder (symbolic links are followed before the check). An output path from a config also cannot contain a colon, end in a dot or a space, or be a Windows device name such as `NUL`. An image that claims to be a bitmap but holds SVG or XML is refused. `-o` is your own choice and is not restricted. SVG logos are refused on the command line.
- Known and accepted: the page policy allows inline scripts (the static export needs them).

## Tests

```
npm test
npm run mutation-proof
```

The tests cover an encode and decode round trip for every type, config validation, image mode, the command line and the page. The mutation proof breaks the scan check and the vCard escaping on purpose and confirms a test fails each time.

## License

MIT. See `LICENSE` and `NOTICE`.


