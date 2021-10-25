import {Track} from "./Track";
import {Page} from "../common/Types";

export class TracksService {
    baseUri = "http://localhost:8080/api/v1"

    async fetchTopTracks(page: Page) : Promise<Array<Track>> {
        const url = `${this.baseUri}/demo/topTracks?limit=${page.elementsLimit}&page=${page.pageNum}&country=${page.searchQuery}`

        const rsp_body = await fetch(url, {method: 'GET', headers: {'Access-Control-Allow-Origin': '*'}});
        const json_body = await rsp_body.json();
        const tracks = json_body.tracks.track.map(TracksService.jsonToTrack);
        return tracks;
    }

    private static jsonToTrack(trackInfo: { name: string | undefined; listeners: number | undefined; }) {
        let track = new Track();
        track.name = trackInfo.name;
        track.listeners = trackInfo.listeners;
        return track;
    }
}

/*
findAllBooks(pageInfo: Page): Promise<Array<Book>> {
    const url = `http://localhost:8000/Online_Bookshop/api/books?page=${pageInfo.page}&size=${pageInfo.size}&sort=${pageInfo.sort}`

    //let req = new Request(url)

    return fetch(url)
        .then(value => value.json())
        .then(value => value._embedded.books
            .map((bookInfo: { isbn: number | undefined; title: string | undefined; }) => {
                let book = new BookImpl()
                book.isbn = bookInfo.isbn;
                book.title = bookInfo.title
                return book;
            }))
        .then(value =>  { console.log(value); return value})
}
 */