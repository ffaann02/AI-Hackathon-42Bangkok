import { useState } from "react";
import "./App.css"

import {
  BrowserRouter as Router,
  Routes,
  Route,
} from "react-router-dom";
import Generator from './pages/Generator';
import { UserProvider } from "./UserContext";
///Firebase
import firebaseConfig from "./firebaseConfig";
import firebase from 'firebase/compat/app';
import 'firebase/compat/firestore';
import Login from "./pages/Login";

function App() {
  if (!firebase.apps.length) {
    firebase.initializeApp(firebaseConfig);
  }


  return (
    <>
      <div className="w-full min-h-screen">
        <div className="mx-auto w-full max-w-5xl">
          <Router>
            <UserProvider>
              <Routes>
                <Route path="/generator" element={<Generator />} />
                <Route path="/login" element={<Login />} />
              </Routes>
            </UserProvider>
          </Router>
        </div>
      </div>
    </>
  )
}

export default App