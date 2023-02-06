import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import Home from './pages/Home';
import CouldNotLogin from './pages/CouldNotLogin';
import Profile from './pages/Profile';
import StoreProvider from './components/StoreProvider';

const router = createBrowserRouter([
    { path: '/', element: <Home /> },
    { path: '/error/login', element: <CouldNotLogin /> },
    { path: '/profile', element: <Profile /> },
]);

function App() {
    return (
        <StoreProvider>
            <RouterProvider router={router} />
        </StoreProvider>
    );
}

export default App;
