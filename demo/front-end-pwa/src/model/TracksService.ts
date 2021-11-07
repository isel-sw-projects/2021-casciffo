import {Track} from "./Track";
import {APIResponse, Page} from "../common/Types";

export class TracksService {
    baseUri = "http://localhost:8080/api/v1"

    async fetchTopTracks(page: Page) : Promise<APIResponse> {
        const url = `${this.baseUri}/demo/topTracks?limit=${page.elementsLimit}&page=${page.pageNum}&country=${page.searchQuery}`;

        console.log(url)
        const rsp_body = await fetch(url, {method: 'GET', headers: {'Access-Control-Allow-Origin': '*'}});
        const json_body = await rsp_body.json();
        console.log(json_body)
        const tracks = json_body.tracks.track.map(TracksService.jsonToTrack);
        const totalTracks = json_body.tracks["@attr"].total;
        return {tracks: tracks, totalTracks: totalTracks};
    }

    private static jsonToTrack(trackInfo: { name: string | undefined; listeners: number | undefined; }) {
        let track = new Track();
        track.name = trackInfo.name;
        track.listeners = trackInfo.listeners;
        return track;
    }
}
