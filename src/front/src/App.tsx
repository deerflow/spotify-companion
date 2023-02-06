import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import Home from './pages/Home';
import CouldNotLogin from './pages/CouldNotLogin';
import Profile from './pages/Profile';
import StoreProvider from './components/StoreProvider';
import SaveToken from './pages/SaveToken';

const router = createBrowserRouter([
    { path: '/', element: <Home /> },
    { path: '/error/login', element: <CouldNotLogin /> },
    { path: '/profile', element: <Profile /> },
    { path: '/token/save', element: <SaveToken /> },
]);

function App() {
    return (
        <StoreProvider>
            <RouterProvider router={router} />
        </StoreProvider>
    );
}

export default App;
