import React from 'react';
import ReactDOM from 'react-dom/client';
import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import './App.css';

import App from './App';
import Email from './pages/Email';
import ErrorPage from './pages/ErrorPage';
import FirstAccess from './pages/FirstAccess';
import Home from './pages/Home';
import Login from './pages/Login';
import Users from './pages/adm/Users';
import CreateUser from './pages/adm/createUser';
import EditUser from './pages/adm/editUser';

const router = createBrowserRouter([
  {
    path: '/',
    element: <App />,
    errorElement: <ErrorPage />,
    children: [
      {
        path: '/',
        element: <Home />
      },
      {
        path: 'sign-in',
        element: <Login />
      },
      {
        path: 'sign-up',
        element: <FirstAccess />
      },
      {
        path: 'change-email',
        element: <Email />
      },
      {
        path: '/adm',
        children: [
          {
            path: '/adm',
            element: <Users />,
          },
          {
            path: 'create-user',
            element: <CreateUser />,
          },
          {
            path: 'edit-user',
            element: <EditUser />,
          }
        ]
      },
    ]
  },
]);

ReactDOM.createRoot(document.getElementById('root')!).render(
    <React.StrictMode>
      <RouterProvider router={router} />
    </React.StrictMode>
)