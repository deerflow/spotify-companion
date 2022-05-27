export interface GetPlaylist {
    collaborative: boolean;
    description: string;
    external_urls: ExternalUrls;
    followers: Followers;
    href: string;
    id: string;
    images: Image[];
    name: string;
    owner: Owner;
    primary_color: any;
    public: boolean;
    snapshot_id: string;
    tracks: Tracks;
    type: string;
    uri: string;
}

interface ExternalUrls {
    spotify: string;
}

interface Followers {
    href: any;
    total: number;
}

interface Image {
    height: number;
    url: string;
    width: number;
}

interface Owner {
    display_name: string;
    external_urls: ExternalUrls2;
    href: string;
    id: string;
    type: string;
    uri: string;
}

interface ExternalUrls2 {
    spotify: string;
}

interface Tracks {
    href: string;
    items: Item[];
    limit: number;
    next: any;
    offset: number;
    previous: any;
    total: number;
}

interface Item {
    added_at: string;
    added_by: AddedBy;
    is_local: boolean;
    primary_color: any;
    track: Track;
    video_thumbnail: VideoThumbnail;
}

interface AddedBy {
    external_urls: ExternalUrls3;
    href: string;
    id: string;
    type: string;
    uri: string;
}

interface ExternalUrls3 {
    spotify: string;
}

interface Track {
    album: Album;
    artists: Artist2[];
    available_markets: string[];
    disc_number: number;
    duration_ms: number;
    episode: boolean;
    explicit: boolean;
    external_ids: ExternalIds;
    external_urls: ExternalUrls7;
    href: string;
    id: string;
    is_local: boolean;
    name: string;
    popularity: number;
    preview_url: string;
    track: boolean;
    track_number: number;
    type: string;
    uri: string;
}

interface Album {
    album_type: string;
    artists: Artist[];
    available_markets: string[];
    external_urls: ExternalUrls5;
    href: string;
    id: string;
    images: Image2[];
    name: string;
    release_date: string;
    release_date_precision: string;
    total_tracks: number;
    type: string;
    uri: string;
}

interface Artist {
    external_urls: ExternalUrls4;
    href: string;
    id: string;
    name: string;
    type: string;
    uri: string;
}

interface ExternalUrls4 {
    spotify: string;
}

interface ExternalUrls5 {
    spotify: string;
}

interface Image2 {
    height: number;
    url: string;
    width: number;
}

interface Artist2 {
    external_urls: ExternalUrls6;
    href: string;
    id: string;
    name: string;
    type: string;
    uri: string;
}

interface ExternalUrls6 {
    spotify: string;
}

interface ExternalIds {
    isrc: string;
}

interface ExternalUrls7 {
    spotify: string;
}

interface VideoThumbnail {
    url: any;
}
