import React, { FC } from 'react';
import RewindIon from '../assets/RewindIcon';
import PageCenter from '../components/PageCenter';
import SpotifyLoginButton from '../components/SpotifyLoginButton';

const Home: FC = () => (
    <PageCenter>
        <div className='title-container'>
            <h1 className='main-title'>Spotify Rewind</h1>
            <RewindIon />
        </div>
        <p>When you add a track to a playlist, Spotify Rewind will add it to a playlist for the current month</p>
        <div className='spotify-login-button-container'>
            <SpotifyLoginButton>Log in with Spotify</SpotifyLoginButton>
        </div>
    </PageCenter>
);

export default Home;
