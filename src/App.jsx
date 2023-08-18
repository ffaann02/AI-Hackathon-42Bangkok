import { useState } from "react";
import "./App.css"

import {
  BrowserRouter as Router,
  Routes,
  Route,
  useLocation,
} from "react-router-dom";
import GeneratorWithText from './pages/GeneratorWithText';
import { UserProvider } from "./UserContext";
/// Firebase
import firebaseConfig from "./firebaseConfig";
import firebase from 'firebase/compat/app';
import 'firebase/compat/firestore';
import Login from "./pages/Login";
import History from './pages/History';
import Share from "./pages/Share";
import { useUser } from "./UserContext";
import React, { useEffect } from "react"
import Navbar from "./components/Navbar";
import Home from "./pages/Home";
import GeneratorWithItems from "./pages/GeneratorWithItems";
import GeneratorWithDraw from "./pages/GeneratorWithDraw";

function App() {
  if (!firebase.apps.length) {
    firebase.initializeApp(firebaseConfig);
  }
  const { user, setUser, accessToken, setAccessToken } = useUser();
  const db = firebase.firestore();
  const [pathName, setPathName] = useState("");
  const [isAuthenticated,setIsAuthenticated] = useState(false);
  
  const findDocumentsWithEmptyToken = async (localAccessToken) => {
    try {
      const querySnapshot = await db.collection("users")
        .where("accessToken", "==", localAccessToken) // Change this to "== null" if you use null values
        .get();

      querySnapshot.forEach((doc) => {
        // setUser(doc.data());
        if(doc.exists){
          setUser(doc.data());
        }
        else{
          setUser("Anonymous");
        }
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
    else{
      setUser("Anonymous");
    }
    setPathName(location.pathname);
  }, [pathName, user])

  return (
    <>
        <div className="w-full min-h-screen relative ">
          <div className="mx-auto w-full">
            <Router>
              <Navbar/>
              <Routes>
                <Route path="/" element={<Home/>}/>
                <Route path="/generator/prompt" element={<GeneratorWithText/>} />
                <Route path="/generator/items" element={<GeneratorWithItems/>}/>
                <Route path="/generator/draw"  element={<GeneratorWithDraw/>}/>
                <Route path="/login" element={<Login />} />
                <Route path="/history" element={<History />} />
                <Route path="/share/:imageid" element={<Share />} />
              </Routes>
            </Router>
          </div>
        </div>
    </>
  )
}

export default App