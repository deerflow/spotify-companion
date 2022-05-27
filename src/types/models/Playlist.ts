interface Playlist {
    _id: string;
    tracks: string[];
    userId: string;
    snapshotId: string;
    name: string;
    description: string;
}

export default Playlist;
