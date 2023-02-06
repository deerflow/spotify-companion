import React, { FC, useContext, useEffect, useState } from 'react';
import Request from '../modules/Request';
import { StoreContext } from '../components/StoreProvider';
import User from '../../../types/models/User';
import FlagButton from '../components/FlagButton';
import Switch from 'react-switch';
import Loading from '../components/Loading';
import { useNavigate } from 'react-router-dom';

const Profile: FC = () => {
    const navigate = useNavigate();
    const { token } = useContext(StoreContext);
    const [profile, setProfile] = useState<TProfile>();

    useEffect(() => {
        (async () => {
            try {
                const profile = await Request.get<TProfile>('/data/profile', {
                    data: { token },
                });
                setProfile(profile.data);
            } catch (e) {
                console.trace(e);
                navigate('/');
            }
        })();
    }, []);

    return profile ? (
        <>
            <h1>Spotify Companion</h1>
            <p>Connected as ${profile?.email}</p>
            <div>
                <FlagButton
                    language='gb'
                    value={profile?.language ? languageToFlagCode[profile.language] : 'english'}
                />
                <FlagButton
                    language='fr'
                    value={profile?.language ? languageToFlagCode[profile.language] : 'english'}
                />
                <div>
                    <span>Remove duplicate tracks in temporal playlist</span>
                    <Switch
                        onChange={() =>
                            profile &&
                            setProfile({
                                ...profile,
                                removeDuplicatesInRewindPlaylists: !profile.removeDuplicatesInRewindPlaylists,
                            })
                        }
                        checked={!!profile?.removeDuplicatesInRewindPlaylists}
                        checkedIcon={false}
                        uncheckedIcon={false}
                    />
                </div>
                <button>Save changes</button>
            </div>
        </>
    ) : (
        <Loading />
    );
};

const languageToFlagCode = {
    english: 'gb',
    french: 'fr',
};

type TProfile = Omit<User, 'accessToken' | 'refreshToken' | 'code'>;

export default Profile;
