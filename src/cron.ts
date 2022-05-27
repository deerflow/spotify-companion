// noinspection ES6MissingAwait

import { mongoClient, Playlists, Users } from './modules/DB';
import SpotifyWebClient from './modules/SpotifyWebClient';
import { AxiosError } from 'axios';

const cron = async () => {
    try {
        console.log(
            `${new Date().toLocaleDateString('fr-FR', {
                day: '2-digit',
                month: '2-digit',
                year: 'numeric',
                hour: '2-digit',
                minute: '2-digit',
            })} : Starting cron job`
        );
        await mongoClient.connect();
        const local = new Date().toLocaleDateString('fr-FR', { month: 'long', year: 'numeric' });
        const playlistName = local[0].toUpperCase() + local.slice(1);

        const users = await Users.find({}).toArray();
        const webClients = users.map(user => new SpotifyWebClient(user));

        // Refresh tokens of every user that gets a 401 status code
        await Promise.all(
            webClients.map(async client => {
                try {
                    await client.getCurrentUserProfile();
                    return client;
                } catch (e) {
                    if ((e as AxiosError)?.response?.status === 401) {
                        console.log(`Refreshing ${client.email}`);
                        await client.authenticate(true);
                        client.refreshAxiosInstance();
                        await client.updateUserInDb();
                        console.log('Finished refreshing');
                        return client;
                    }
                }
            })
        );

        for (const client of webClients) {
            const playlists = await client.getCurrentUserPlaylists();
            for (const playlist of playlists) {
                if (playlist.name === playlistName) continue;
                const dbPlaylist = await Playlists.findOne({ _id: playlist.id });
                // Playlist does not exist in DB
                if (!dbPlaylist) {
                    const tracks = await client.getPlaylistItems(playlist.id);
                    await Playlists.insertOne({
                        _id: playlist.id,
                        tracks,
                        snapshotId: playlist.snapshot_id,
                        userId: playlist.owner.id,
                        name: playlist.name,
                        description: playlist.description,
                    });
                    // Playlist exists in DB and snapshot ids are different
                } else if (dbPlaylist.snapshotId !== playlist.snapshot_id) {
                    const latestTracks = await client.getPlaylistItems(playlist.id);
                    const difference = latestTracks.filter(track => !dbPlaylist.tracks.includes(track));
                    const temporalPlaylist = playlists.find(playlist => playlist.name === playlistName);
                    if (difference.length > 0) {
                        console.log({ difference, playlist: playlist.name });
                        // Temporal playlist already exists
                        if (temporalPlaylist) {
                            await client.addTracksToPlaylist({ playlistId: temporalPlaylist.id, tracks: difference });
                        } else {
                            // Create temporal playlist
                            const newPlaylist = await client.createPlaylist({
                                name: playlistName,
                                description: `Votre musique de ${playlistName}`,
                            });
                            await client.addTracksToPlaylist({ playlistId: newPlaylist.id, tracks: difference });
                        }
                    }
                    await Playlists.updateOne(
                        { _id: playlist.id },
                        {
                            $set: {
                                tracks: latestTracks,
                                name: playlist.name,
                                userId: playlist.owner.id,
                                snapshotId: playlist.snapshot_id,
                            },
                        }
                    );
                }
            }
        }
    } finally {
        await mongoClient.close();
    }
};

export default cron;
