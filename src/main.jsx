import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.jsx'
import './index.css'
import { useUser } from './UserContext.jsx'
import { UserProvider } from './UserContext.jsx'
ReactDOM.createRoot(document.getElementById('root')).render(
    <UserProvider>
     <App />
    </UserProvider>
)
