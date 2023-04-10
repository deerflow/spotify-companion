import React, { FC, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import Loading from '../components/Loading';

const SaveToken: FC = () => {
    const navigate = useNavigate();
    const { token, redirect_uri: redirectUri } = useParams();

    console.log({ token, redirectUri });

    useEffect(() => {
        if (token) {
            localStorage.setItem('token', token);
            return navigate('/profile');
        }
        //return navigate('/error/login');
    });
    return <Loading />;
};

export default SaveToken;
