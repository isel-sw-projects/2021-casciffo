import {Track} from "../model/Track";

type Page = {
    pageNum: number,
    elementsLimit: number,
    searchQuery: string
}

type APIResponse = {
    tracks: Array<Track>,
    totalTracks: number
}

export type {Page, APIResponse}