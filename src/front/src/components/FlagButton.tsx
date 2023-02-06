import React, { FC } from 'react';
import { FR, GB } from 'country-flag-icons/react/3x2';

const FlagButton: FC<Props> = ({ language, value }) => {
    return (
        <div style={{ padding: '1rem', background: value === language ? 'cyan' : undefined }}>
            {language === 'fr' ? <FR height={50} /> : <GB height={50} />}
        </div>
    );
};

interface Props {
    language: 'gb' | 'fr';
    value: string;
}

export default FlagButton;
