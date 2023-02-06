import React, { FC } from 'react';
import PageCenter from '../components/PageCenter';
import SpotifyLoginButton from '../components/SpotifyLoginButton';

const CouldNotLogin: FC = () => {
    return (
        <PageCenter>
            <h1 style={styles}>Could not login to Spotify</h1>
            <SpotifyLoginButton>Try again</SpotifyLoginButton>
        </PageCenter>
    );
};

const styles = {
    marginBottom: '6rem',
};

export default CouldNotLogin;
