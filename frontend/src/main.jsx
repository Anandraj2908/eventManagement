import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import { RouterProvider, createBrowserRouter, Navigate } from 'react-router-dom'
import { Provider, useSelector } from 'react-redux'
import store from './store/store.js'

import Login from './pages/Login.jsx'
import Signup from './pages/Signup.jsx'
import Home from './pages/Home.jsx'
import Events from './pages/Events.jsx'
import Attendees from './pages/Attendees.jsx'
import Manage from './pages/Manage.jsx'

const ProtectedRoute = ({ children }) => {
  const isAuthenticated = useSelector((state) => state.auth.status);  
  if (isAuthenticated) {
    return <Navigate to="/events" />;
  }
  return children;
};

const router = createBrowserRouter([
  {
    path:'/',
    element:<App/>,
    children:[
      {
        path:'/',
        element:(
          <ProtectedRoute>
            <Home/>
          </ProtectedRoute>
        )
      },
      {
        path:'/login',
        element:(
          <ProtectedRoute>
            <Login/>
          </ProtectedRoute>
            
        )
      },
      {
        path:'/signup',
        element:(
          <ProtectedRoute>
            <Signup/>
          </ProtectedRoute>
        )
      },
      {
        path:'/events',
        element:(

          <Events/>
        )
      },
      {
        path: '/events/:eventId/attendees',
        element: (
            <Attendees />
        )
      },
      {
        path:'/events/:eventId/manage',
        element:(
          <Manage/>
        )
      },
      {
        path:'*',
        element:<div>404</div>
      }
    ]
  },
])
createRoot(document.getElementById('root')).render(
  <StrictMode>
    <Provider store={store}>
      <RouterProvider router={router}/>
    </Provider>
  </StrictMode>,
)
