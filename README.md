# Blank Music Extractor

This is a reworked X extractor inspired from the original one at @discord-player/extractors.

## Installation

```bash
npm install discord-player-blank
```

## Usage

```js
const { Player } = require("discord-player");

const { X } = require("discord-player-blank");
// Or
import { X } from "discord-player-blank";

const player = new Player(client, {});

await player.extractors.register(X, { /* options */ });
```

## Supported features

| Feature | Supported |
| --- | --- |
| Single tracks | ✅ |
| Playlists | ✅ |
| Search | ✅ |
| Direct streaming | ❌ |
| Can be used as a bridge | ❌ |
| Can bridge to ... | ✅ |
| Autoplay | ❌ |

## Options

| Option | Type | Default | Required | Description |
| --- | --- | --- | --- | --- |
| createStream(ext: AppleMusicExtractor, url: string) => Promise<Readable \| string>; | function | null | No | A function that returns a Readable stream or a string URL to the stream. |