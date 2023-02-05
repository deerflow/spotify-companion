import './App.css';
import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import Root from './pages/Root';
import Login from './pages/Login';

const router = createBrowserRouter([
    { path: '/', element: <Root /> },
    { path: '/users/login', element: <Login /> },
]);

function App() {
    return <RouterProvider router={router} />;
}

export default App;
