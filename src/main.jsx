import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './pages/App'
import { BrowserRouter as Router } from 'react-router-dom'
import { GoogleOAuthProvider } from "@react-oauth/google"
import './index.css'

ReactDOM.createRoot(document.getElementById('root')).render(
    <GoogleOAuthProvider clientId={import.meta.env.VITE_GOOGLE_CLIENT_ID}>
        <React.StrictMode>
            <Router>
                <App />
            </Router>
        </React.StrictMode>
    </GoogleOAuthProvider>
)
