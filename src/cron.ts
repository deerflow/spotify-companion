// noinspection ES6MissingAwait

import { Playlists, Users } from './modules/DB';
import SpotifyWebClient from './modules/SpotifyWebClient';
import { AxiosError } from 'axios';
import Logger from './modules/Logger';
import { handleException } from './modules/Exceptions';
import SpotifyApi from './modules/SpotifyApi';

const cron = async () => {
    if (SpotifyApi.instance.retryAfter > 60) {
        SpotifyApi.instance.retryAfter -= 60;
        return console.log({ rateLimited: true, retryAfter: SpotifyApi.instance.retryAfter });
    } else if (SpotifyApi.instance.retryAfter !== 0) {
        SpotifyApi.instance.retryAfter = 0;
    }
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

        const users = await Users.find({}).toArray();

        if (users.length === 0) {
            console.log('Found no user, exiting cron');
        }

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
            const local = new Date().toLocaleDateString(client.language, { month: 'long', year: 'numeric' });
            const playlistName = local[0].toUpperCase() + local.slice(1);
            for (const playlist of playlists) {
                if (playlist.name === playlistName) {
                    if (client.removeDuplicatesInRewindPlaylists) {
                        client.removeDuplicateTracksInPlaylist(playlist.id);
                    }
                    continue;
                }
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
                        Logger.info({ difference, playlist: playlist.name });
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
                        console.log({ playlist: dbPlaylist.name, tracksToAdd: difference });
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
        }
    } catch (e) {
        handleException(e as unknown as Error);
    }
};

export default cron;
