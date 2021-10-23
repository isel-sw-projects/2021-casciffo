import {Page} from "../common/Types";
import {TracksService} from "./TracksService";
import {Track} from "./Track";

class TracksModel {
    service = new TracksService()

    async getTopTracks(page: Page): Promise<Array<Track>> {
        return await this.service.fetchTopTracks()
    }
}

export default TracksModel