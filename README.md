# ClearQR

Free QR codes with no account, no limits and no subscription. Everything is drawn and checked on your own device.

Built and maintained by [ClearSky Digital](https://cscloud.digital).

ClearQR is free. If it saves you a subscription, you can [leave a tip](https://cscloud.digital/tip/) as a thank-you for our free tools. Tips are optional, are not donations, and are not tax-deductible.

## What it makes

- Types: link, text, contact card (vCard), Wi-Fi, email, text message, phone call, map location, calendar event.
- Looks: six presets, plus dot, corner and background colors, dot shape, corner style, quiet zone, error correction, center logo and size.
- Image mode: blend a photo with the code.
- Output: PNG and SVG.
- A scan check: every code is read back in the browser (or the terminal) and marked "scans" or "won't scan" before you download it.
- Campaign tags for link codes: optional source, medium, campaign and content values are added to the address as `utm_` tags before the code is made, so your own analytics can tell a flyer from a business card. ClearQR counts nothing itself. The app has a short guide to reading the results in Google Analytics and to making a printed code changeable with a short link on your own domain.

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

## Campaign tags in a config

A link code can carry tags. An existing `utm_` value in the address is kept, and source and medium are needed together:

```json
{
  "type": "link",
  "content": {
    "url": "https://example.com/menu",
    "campaign": { "source": "flyer", "medium": "print", "campaign": "spring-sale" }
  }
}
```

The code then carries `https://example.com/menu?utm_source=flyer&utm_medium=print&utm_campaign=spring-sale`.

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

## Docker

Each release is published as the image `ghcr.io/clearsky-digital/clearqr`, tagged with its version and `latest`. It serves the app under `/clearqr/` with the headers above. The container has no Node at run time, runs as a non-root user, and listens on port 8080.

To try it on your own computer:

```
docker run --rm -p 8088:8080 ghcr.io/clearsky-digital/clearqr:1.1.0
```

The app is then at `http://localhost:8088/clearqr/`.

On a server behind a reverse proxy, use `docker-compose.yml`. It pulls the release image and publishes no host port. Instead it joins the proxy's existing Docker network, and the proxy forwards to `clearqr:8080` with the subpath unchanged. Two settings:

- `CLEARQR_TAG`: the release to run (default `1.1.0`).
- Build options (`--build-arg`): `NEXT_PUBLIC_CLEARQR_TIP_URL` shows a "Leave a tip" card and footer link when set to an https address (hidden when empty), and `NEXT_PUBLIC_CLEARQR_CONTACT_URL` sets the "Ask for setup help" link (default `https://cscloud.digital/start/`). Both are plain links, fixed at build time, and the page makes no requests of its own.
- `PROXY_NETWORK`: the name of the proxy's external network (default `publictools`).

With Nginx Proxy Manager, edit the proxy host, open the Advanced tab (not a custom location's gear) and paste:

```
location ~* ^/clearqr(/|$) {
    proxy_pass http://clearqr:8080;
    proxy_set_header Host $host;
    proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
    proxy_set_header X-Forwarded-Proto $scheme;
}
```

This matches the path in any capitalization, and the container then redirects to the lowercase `/clearqr/`. A plain custom location `/clearqr` (scheme `http`, forward hostname `clearqr`, port `8080`) also works, for the lowercase address only.

To serve the app under another subpath, build your own image. The subpath is fixed into the pages at build time:

```
docker build --build-arg CLEARQR_BASE_PATH=/qr -t clearqr .
```

Leave `CLEARQR_BASE_PATH` empty for a site root.

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


