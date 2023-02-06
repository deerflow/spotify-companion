import React, { FCChildren, useContext } from 'react';
import { StoreContext } from './StoreProvider';

const SpotifyLoginButton: FCChildren = ({ children }) => {
    const { token } = useContext(StoreContext);
    return (
        <a href={`/users/login${token && `?token=${token}`}`} className='spotify-login-button'>
            {children}
        </a>
    );
};

export default SpotifyLoginButton;
