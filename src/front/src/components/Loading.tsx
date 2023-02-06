import React, { FC } from 'react';
import { TailSpin } from 'react-loader-spinner';

const Loading: FC = () => {
    return (
        <div className='center-whole-page'>
            <TailSpin height='100' width='100' color='#18bed8' />
        </div>
    );
};

export default Loading;
