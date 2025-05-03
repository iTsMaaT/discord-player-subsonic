# Subsonic API Extractor

This is a extractor for your self-hosted Subsonic API.

## Installation

```bash
npm install discord-player-subsonic
```

## Usage

```js
const { Player } = require("discord-player");

const { SubsonicExtractor } = require("discord-player-subsonic");
// Or
import { SubsonicExtractor } from "discord-player-blank";

const player = new Player(client, {});

await player.extractors.register(SubsonicExtractor, { /* options */ });
```

## Supported features

| Feature | Supported |
| --- | --- |
| Single tracks | ❌ |
| Playlists | ❌ |
| Search | ✅ |
| Direct streaming | ✅ |
| Can be used as a bridge | ✅ |
| Can bridge to ... | ✅ |
| Autoplay | ❌ |

## Options

| Option | Type | Default | Required | Description |
| --- | --- | --- | --- | --- |
| `username` | string | | ✅ | Your Subsonic username |
| `password` | string | | ✅ | Your Subsonic password |
| `host` | string | | ✅ | The URL of your Subsonic API |

## Example

```js
await player.extractors.register(SubsonicExtractor, { 
    username: "username",
    password: "password",
    host: "http://localhost:4040",
 })
```