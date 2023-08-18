import React, { useEffect } from 'react';
import { useUser } from '../UserContext';
import firebase from 'firebase/compat/app';
import 'firebase/compat/auth';
import 'firebase/compat/firestore';
import { useNavigate } from 'react-router-dom';
import firebaseConfig from '../firebaseConfig';
import robotCoverLogin from '/images/robot-png.png';
import googleIcon from '/images/google-icon.png';
import botIcon from '/images/bot-icon.png';

const Login = () => {
    const navigate = useNavigate();
    const { user, setUser, accessToken, setAccessToken } = useUser();
    useEffect(() => {
        const accessToken = localStorage.getItem("accessToken");
        if (accessToken || user) {
            navigate("/")
        }
    }, [])

    if (!firebase.apps.length) {
        firebase.initializeApp(firebaseConfig);
    }

    const db = firebase.firestore();

    const handleSignIn = async () => {
        const provider = new firebase.auth.GoogleAuthProvider();
        try {
            const result = await firebase.auth().signInWithPopup(provider);
            const user = result.user._delegate;
            const accessToken = result.credential.accessToken;
            console.log(user.uid);
            console.log(result)
            // Check if it's the first-time login
            const userRef = db.collection('users').doc(user.uid);
            userRef.get().then(doc => {
                if (doc.exists) {
                    console.log('Welcome back!', doc.data());
                    setUser(doc.data());
                    localStorage.setItem("accessToken", doc.data().accessToken);
                } else {
                    const userData = {
                        uid: user.uid,
                        displayName: user.displayName,
                        email: user.email,
                        accessToken: accessToken,
                        photoURL: user.photoURL
                    };
                    userRef
                        .set(userData)
                        .then(() => {
                            console.log('User data created:', userData);

                            // Update the user context state
                            setUser(userData);

                            // Update localStorage with the new accessToken
                            localStorage.setItem("accessToken", accessToken);

                            // Navigate to the desired location
                            navigate("/");
                        })
                        .catch(error => {
                            console.error('Error collecting user info:', error);
                        });
                }
                navigate("/")
            });
        } catch (error) {
            console.error('Google login error:', error);
        }
    };
    
    return (
        <>
            <div className="w-full h-full absolute -z-10" id="bg-login">
                <img src="/images/furniture-bg-login.webp" className="w-full h-full absolute -z-20" />
                <div className="bg-blue-400 w-full h-full absolute -z-10 bg-opacity-25"></div>
            </div>
            <div className="px-10 py-20 flex w-full max-w-5xl min-h-screen h-full justify-center m-auto">
                <div className="grid grid-cols-2 w-full bg-white drop-shadow-lg border-t-[2px] border-slate-100 rounded-xl">
                    <div className="my-auto px-4 border-r-[0.15rem] border-slate-100">
                        <img src={robotCoverLogin} alt="robot-cover-image-login" />
                    </div>
                    <div className="my-auto text-center pb-10">
                        <img src={botIcon} className="w-16 bg-blue-50 p-2 rounded-full mx-auto" alt="bot-icon" />
                        <h1 className="mt-3 text-2xl font-bold text-slate-600">Let's start exploring the new world of furniture</h1>
                        <h4 className="mt-2 text-sm mx-16 text-slate-600">
                            With our AI-Powered tools to generate new personalized furniture styles, view your room with virtually
                            selected furniture decoration
                        </h4>
                        <button
                            onClick={handleSignIn}
                            className="bg-blue-50 px-4 py-2 border-2 border-slate-200 rounded-md text-xl flex mx-auto hover:bg-blue-100 hover:border-blue-400 mt-3 font-semibold hover:text-blue-900 text-slate-600 ease-in duration-200"
                        >
                            <img src={googleIcon} alt="google-icon" className="w-5 my-auto mr-2" />
                            <p>Sign in with Google</p>
                        </button>
                    </div>
                </div>
            </div>
        </>
    );
};

export default Login;