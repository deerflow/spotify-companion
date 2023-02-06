import { PropsWithChildren, ReactElement } from 'react';

declare module 'react' {
    interface FCChildren<P = {}> {
        (props: PropsWithChildren<P>, context?: any): ReactElement<any, any> | null;
    }
}
