# ABlur

A small Lit-based library for creating configurable gradient backdrop blur effects.

[![NPM License](https://img.shields.io/npm/l/ablur)](https://github.com/xujunhao940/ablur/blob/master/LICENSE)
[![NPM Version](https://img.shields.io/npm/v/ablur)](https://npmjs.com/package/ablur)
[![NPM Downloads](https://img.shields.io/npm/dm/ablur)](https://npmjs.com/package/ablur)
[![NPM Unpacked Size](https://img.shields.io/npm/unpacked-size/ablur)](https://npmjs.com/package/ablur)

## Installation

```bash
npm install ablur
```

## Using CDN

```html

<head>
    <script src="https://unpkg.com/ablur@latest/dist/index.js"></script>
</head>
<body>
<ablur-layer>
    <span>ABlur Layer</span>
</ablur-layer>
</body>
```

## Component API

### <ablur-layer>

- `layers` (Number) — number of blur slices (higher = smoother, slower). Default: 2
- `baseBlur` (Number) — max blur in pixels at `end-at`. Default: 0
- `end-at` (Number) — percent (0–100) where blur reaches `baseBlur`. Default: 12
- `height` (String) — height of the blur area (e.g. `65%` or `400px`). Default: `100%`
- `flip` (Boolean) — when present, reverses the blur direction (top → bottom)