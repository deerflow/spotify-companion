import React, { FC } from 'react';
import { Link } from 'react-router-dom';

const CouldNotLogin: FC = () => {
    return (
        <>
            <h1>Could not login to Spotify</h1>
            <Link to='/users/login' className='spotify-login-button'>
                Try again
            </Link>
        </>
    );
};

export default CouldNotLogin;
