import {Page} from "../common/Types";
import {TracksService} from "./TracksService";
import {Track} from "./Track";

class TracksModel {
    service = new TracksService()
    tracks : Array<Track> = []
    totalTracks: number = 0

    getTopTracks(page: Page) : Promise<Array<Track>> {
        return this.service.fetchTopTracks(page).then(value => {
            this.tracks = value.tracks
            this.totalTracks = value.totalTracks
            return this.tracks
        })
    }
}

export default TracksModel