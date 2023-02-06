import React, { createContext, FCChildren, useMemo } from 'react';

const StoreProvider: FCChildren = ({ children }) => {
    const token = useMemo(() => localStorage.getItem('token'), []);
    return <StoreContext.Provider value={{ token }}>{children}</StoreContext.Provider>;
};

export const StoreContext = createContext<{ token: string | null }>({
    token: null,
});

export default StoreProvider;
