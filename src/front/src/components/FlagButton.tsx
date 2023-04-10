import React, { FC } from 'react';
import { FR, GB } from 'country-flag-icons/react/3x2';
import User from '../../../types/models/User';

const FlagButton: FC<Props> = ({ language, value, onFlagPress }) => {
    return (
        <div
            style={{ padding: '1rem', background: value === language ? 'cyan' : undefined, cursor: 'pointer' }}
            onClick={() => onFlagPress(language)}
        >
            {language === 'french' ? <FR height={50} /> : <GB height={50} />}
        </div>
    );
};

interface Props {
    language: User['language'];
    value: string;
    onFlagPress: (language: User['language']) => void;
}

export default FlagButton;
