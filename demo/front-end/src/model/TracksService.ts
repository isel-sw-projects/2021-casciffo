import {Track} from "./Track";

export class TracksService {
    baseUri = "localhost:8080/api/v1"

    async fetchTopTracks() : Promise<Array<Track>> {
        const url = `https://localhost:8080/api/v1/demo/toptracks`
        const rsp_body = await fetch(url);
        const json_body = await rsp_body.json();
        const tracks = json_body.tracks
            .map((trackInfo: { name: string | undefined; listeners: number | undefined; }) => {
                let track = new Track();
                track.name = trackInfo.name;
                track.listeners = trackInfo.listeners;
                return track;
            });
        console.log(tracks);
        return tracks;
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