import { Link, useLocation } from "react-router-dom"
import React from "react"
import { useUser } from "../UserContext";
import googleIcon from '/images/google-icon.png';
import robotCoverLogin from '/images/robot-png.png';
import {AiFillCaretDown} from 'react-icons/ai';
const Navbar = () => {
    const { user } = useUser();
    const location = useLocation();
    return (
        <>
            <nav className={`sticky top-0 w-full h-14 bg-project-navy-2 flex px-20 justify-between z-[999] border-b-[1px]
         border-slate-600 ${location.pathname !== "/login" ? "block" : "hidden"}`}>
                <div className="flex">
                    <Link to="/">
                        <h1 className="my-auto mt-[14px] text-white text-xl font-bold mr-6 cursor-pointer">LOGO NAME</h1>
                    </Link>
                    <div className="flex">
                        <Link to="/history">
                            <p className={`text-white mt-4 text-md mx-4 cursor-pointer hover:text-slate-300 
                            ${location.pathname === "/history" && "underline-offset-2 underline"}`}>History</p>
                        </Link>
                        <Link to="/collections">
                            <p className={`text-white mt-4 text-md mx-4 cursor-pointer hover:text-slate-300
                            ${location.pathname === "/collections" && "underline-offset-2 underline"}`}>Collections</p>
                        </Link>
                    </div>
                </div>
                {user ?
                    <div className="flex h-full">
                        <p className="my-auto text-white text-md tracking-wider flex">{user.displayName}
                         <AiFillCaretDown className="mt-[6px] text-sm hover:text-slate-200 cursor-pointer"/>
                        </p>
                        <div className="my-auto bg-white rounded-full ml-2 border-2 border-project-orange hover:opacity-80">
                            <img src={user.photoURL} className="cursor-pointer w-8 h-8 hover:opacity-70 rounded-full"/>
                        </div>
                    </div>
                    : <div className="flex h-full">
                        <p className="my-auto mr-4 text-slate-200 text-lg">Try it out now</p>
                        <Link to="/login">
                            <button className="mt-2 flex text-white bg-project-navy-2 hover:bg-slate-700 hover:text-slate-200 border-[1px]
                     border-project-orange h-fit my-auto px-4 py-1 rounded-md text-xl ease-in duration-200">
                                <p>Sign in with</p>
                                <img src={googleIcon} className="cursor-pointer w-4 my-auto ml-2" />
                            </button>
                        </Link>
                    </div>}
            </nav>
        </>
    )
}
export default Navbar