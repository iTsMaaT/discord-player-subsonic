import { BaseExtractor,
    ExtractorInfo,
    ExtractorSearchContext,
    QueryType,
    SearchQueryType,
    Track,
    Util,
    Player,
    RawTrackData,
} from "discord-player";
import crypto from "crypto";
import { Readable } from "stream";

export interface SubsonicExtractorOptions {
    username: string;
    password: string;
    host: string;
}

export class SubsonicExtractor extends BaseExtractor<SubsonicExtractorOptions> {
    public static identifier = "com.itsmaat.discord-player.subsonic-extractor";
    public static instance: SubsonicExtractor | null = null;

    async activate(): Promise<void> {
        this.protocols = ["subsonic"];
        SubsonicExtractor.instance = this;
    }

    async deactivate(): Promise<void> {
        this.protocols = [];
        SubsonicExtractor.instance = null;
    }

    async validate(query: string): Promise<boolean> {
        if (typeof query !== "string") return false;
        return !this.isURL(query) || new URL(query).protocol === "subsonic:";
    }

    async handle(query: string, context: ExtractorSearchContext): Promise<ExtractorInfo> {
        const { username, password, host } = this.options;

        const salt = crypto.randomBytes(6).toString("hex");
        const token = crypto.createHash("md5").update(password + salt).digest("hex");

        const url = `${host}/rest/search2.view`;
        const params = new URLSearchParams({
            u: username,
            t: token,
            s: salt,
            v: "1.16.1",
            c: "discord-player",
            f: "json",
            query: query,
            songCount: "10",
        });

        const response = await fetch(url, {
            method: "POST",
            headers: { "Content-Type": "application/x-www-form-urlencoded" },
            body: params,
        });

        if (!response.ok) 
            throw new Error(`Subsonic API request failed: ${response.statusText}`);
    

        const data = await response.json();

        const apiResponse = data["subsonic-response"];
        if (apiResponse.status !== "ok") 
            throw new Error(`Subsonic API error: ${apiResponse.error?.message || "Unknown error"}`);
    

        const songs = apiResponse.searchResult2?.song || [];
        interface SubsonicSong {
            id: string;
            title: string;
            artist: string;
            duration: number;
            coverArt?: string;
        }

        const tracks = songs.map((song: SubsonicSong) => {

            return new Track(this.context.player, {
                title: song.title,
                description: `${song.title} by ${song.artist}`,
                author: song.artist,
                url: `subsonic://${song.id}`,
                thumbnail: undefined,
                duration: Util.buildTimeCode(Util.parseMS(song.duration * 1000)),
                views: 0,
                requestedBy: context.requestedBy,
                source: "arbitrary",
                metadata: {
                    source: song,
                    bridge: null,
                },
                raw: {
                    id: song.id,
                    salt,
                    token, 
                },
                requestMetadata: async () => ({
                    source: song,
                    bridge: null,
                }),
            });
        });

        return this.createResponse(null, tracks);
    }

    async stream(track: Track): Promise<Readable> {
        const { id, token, salt } = track.raw;
        const { username, host } = this.options;
    
        const streamUrl = `${host}/rest/stream.view?u=${username}&t=${token}&s=${salt}&v=1.16.1&c=discord-player&id=${id}`;
        const response = await fetch(streamUrl);
    
        if (!response.ok) 
            throw new Error(`Failed to fetch stream: ${response.statusText}`);
        
    
        const buffer = Buffer.from(await response.arrayBuffer());
        return Readable.from(buffer);
    }
    

    async getRelatedTracks(): Promise<ExtractorInfo> {
        return this.createResponse(null, []);
    }
     
    private isURL(str: string): boolean {
        try {
            return ["http:", "https:"].includes(new URL(str).protocol);
        } catch {
            return false;
        }
    }
}
