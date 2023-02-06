import React, { FC } from 'react';
import PageCenter from '../components/PageCenter';

const CouldNotLogin: FC = () => {
    return (
        <PageCenter>
            <h1 style={styles}>Could not login to Spotify</h1>
            <a href='/users/login' className='spotify-login-button'>
                Try again
            </a>
        </PageCenter>
    );
};

const styles = {
    marginBottom: '6rem',
};

export default CouldNotLogin;
