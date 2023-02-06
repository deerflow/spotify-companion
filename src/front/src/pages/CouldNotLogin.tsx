import React, { FC } from 'react';
import { Link } from 'react-router-dom';
import PageCenter from '../components/PageCenter';

const CouldNotLogin: FC = () => {
    return (
        <PageCenter>
            <h1 style={styles}>Could not login to Spotify</h1>
            <Link to='/users/login' className='spotify-login-button'>
                Try again
            </Link>
        </PageCenter>
    );
};

const styles = {
    marginBottom: '6rem',
};

export default CouldNotLogin;
