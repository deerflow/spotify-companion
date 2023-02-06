import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import Home from './pages/Home';
import Login from './pages/Login';
import CouldNotLogin from './pages/CouldNotLogin';
import Profile from './pages/Profile';

const router = createBrowserRouter([
    { path: '/', element: <Home /> },
    { path: '/users/login', element: <Login /> },
    { path: '/error/login', element: <CouldNotLogin /> },
    { path: '/profile', element: <Profile /> },
]);

function App() {
    return <RouterProvider router={router} />;
}

export default App;
