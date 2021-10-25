import {Page} from "../common/Types";
import {TracksService} from "./TracksService";
import {Track} from "./Track";

class TracksModel {
    service = new TracksService()
    tracks : Array<Track> = []

    getTopTracks(page: Page) : Promise<Array<Track>> {
        return this.service.fetchTopTracks(page).then(value => this.tracks = value)
    }
}

export default TracksModel