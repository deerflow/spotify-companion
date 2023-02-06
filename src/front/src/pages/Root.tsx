import React, { FC } from 'react';
import RewindIon from '../assets/RewindIcon';
import { Link } from 'react-router-dom';
import PageCenter from '../components/PageCenter';

const Root: FC = () => {
    return (
        <PageCenter>
            <div className='title-container'>
                <h1 className='main-title'>Spotify Rewind</h1>
                <RewindIon />
            </div>
            <p>When you add a track to a playlist, Spotify Rewind will add it to a playlist for the current month</p>
            <div className='spotify-login-button-container'>
                <Link to='/users/login' className='spotify-login-button'>
                    Log in with Spotify
                </Link>
            </div>
        </PageCenter>
    );
};

export default Root;
