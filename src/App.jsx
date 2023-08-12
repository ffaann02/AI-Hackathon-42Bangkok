import { useState } from "react";
import "./App.css"

import {
  BrowserRouter as Router,
  Routes,
  Route,
  useLocation,
} from "react-router-dom";
import Generator from './pages/Generator';
import { UserProvider } from "./UserContext";
///Firebase
import firebaseConfig from "./firebaseConfig";
import firebase from 'firebase/compat/app';
import 'firebase/compat/firestore';
import Login from "./pages/Login";
import History from './pages/History';
import { useUser } from "./UserContext";
import React, { useEffect } from "react"
import Navbar from "./components/Navbar";
function App() {
  if (!firebase.apps.length) {
    firebase.initializeApp(firebaseConfig);
  }
  const { user, setUser, accessToken, setAccessToken } = useUser();
  const db = firebase.firestore();
  const [pathName,setPathName] = useState("");
  const findDocumentsWithEmptyToken = async (localAccessToken) => {
    try {
      const querySnapshot = await db.collection("users")
        .where("accessToken", "==", localAccessToken) // Change this to "== null" if you use null values
        .get();
  
      querySnapshot.forEach((doc) => {
        setUser(doc.data());
      });
      setIsAuthenticated(true)
    } catch (error) {
      console.error("Error finding documents:", error);
    }
  };
  useEffect(() => {
    const localAccessToken = localStorage.getItem("accessToken");
    if (localAccessToken) {
      if (!user) {
        findDocumentsWithEmptyToken(localAccessToken);
      }
    }
    setPathName(location.pathname);
  }, [pathName, user])
  return (
    <div className="w-full min-h-screen relative">
      <div className="mx-auto w-full">
        <Router>
          <Navbar/>
          <Routes>
            <Route path="/" element={<div>hello: {user && user.displayName}</div>} />
            <Route path="/generator" element={<Generator />} />
            <Route path="/login" element={<Login />} />
            <Route path="/History" element={<History />}/>
          </Routes>
        </Router>
      </div>
    </div>
  )
}

export default App