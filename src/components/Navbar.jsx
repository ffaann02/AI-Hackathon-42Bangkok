import { Link, useLocation } from "react-router-dom"
import React, { useRef, useState, useEffect } from "react"
import { useUser } from "../UserContext";
import googleIcon from '/images/google-icon.png';
import robotCoverLogin from '/images/robot-png.png';
import { AiFillCaretDown,AiOutlineStar} from 'react-icons/ai';
import { FiLogOut } from "react-icons/fi";
const Navbar = () => {
    const { user, setUser } = useUser();
    const location = useLocation();
    const [toggleProfileBar, setToggleProfileBar] = useState(false);
    const profileBarRef = useRef();
    useEffect(() => {
        let handler = (e) => {
            if (profileBarRef.current) { // To check that ref was not undefined
                if (!profileBarRef.current.contains(e.target)) {
                    setToggleProfileBar(false);
                }
            }
        };
        document.addEventListener("mousedown", handler);
        return () => {
            document.removeEventListener("mousedown", handler);
        }
    });


    const handleSignOut = () => {
        setUser(null);
        localStorage.removeItem("accessToken");
        setToggleProfileBar(false)
    }

    const [selectServicesToggle, setSelectServicesToggle] = useState(false);
    const [serviceChoices,setServicesChoices] = useState(1);
    const selectServiceRef = useRef();

    useEffect(() => {
        let handler = (e) => {
            if (selectServiceRef.current) { // To check that ref was not undefined
                if (!selectServiceRef.current.contains(e.target)) {
                    setSelectServicesToggle(false);
                }
            }
        };
        document.addEventListener("mousedown", handler);
        return () => {
            document.removeEventListener("mousedown", handler);
        }
    });
    return (
        <>
            <nav className={`sticky top-0 w-full h-14 bg-project-navy-2 flex px-20 justify-between z-[100] border-b-[1px]
         border-slate-600 ${location.pathname !== "/login" ? "block" : "hidden"}`}>
                <div className="flex">
                    <Link to="/">
                        <h1 className="my-auto mt-[14px] text-white text-xl font-bold mr-6 cursor-pointer">LOGO NAME</h1>
                    </Link>
                    <div className="w-fit my-auto" ref={selectServiceRef}>
                        <button onClick={() => { setSelectServicesToggle(prev => !prev) }}
                            className={`tracking-wide text-white ${location.pathname === "generator" && "hover:text-slate-300"}
                        rounded-[5px] text-md pl-4 pr-3 py-2 text-center inline-flex items-center`}>
                            <p className="">Services</p>
                            <svg class="w-2 h-2 ml-1" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 10 6">
                                <path stroke="#ffffff" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="m1 1 4 4 4-4" />
                            </svg>
                        </button>
                        {selectServicesToggle && 
                        <div id="dropdown" className="top-14 absolute z-10 bg-slate-50 divide-gray-100 border-[1px]
                                rounded-sm shadow w-fit" onMouseLeave={()=>{setSelectServicesToggle(false)}}>
                            <ul class="text-sm text-gray-700">
                                <li>
                                    <a href="#" className={`text-[16px] block py-3 hover:bg-slate-100 px-5 rounded-sm 
                                    ${serviceChoices === 1 && "bg-slate-100 pointer-events-none text-project-orange"}`}
                                        >Promts to Furniture Images</a>
                                </li>
                                <li>
                                    <a href="#" className={`text-[16px] block py-3 hover:bg-slate-100 px-5 rounded-sm 
                                    ${serviceChoices === 2 && "bg-slate-100 pointer-events-none text-project-orange"}`}
                                        >Products to Decoration</a>
                                </li>
                            </ul>
                        </div>}
                    </div>
                    <div className="flex">
                        <Link to="/history">
                            <p className={`text-white mt-4 text-md mx-4 cursor-pointer hover:text-slate-300 
                            ${location.pathname === "/history" && "underline-offset-2 underline hover:text-white"}`}>History</p>
                        </Link>

                    </div>
                </div>
                {user ?
                    <div className="flex h-full">
                        <p className="my-auto text-white text-md tracking-wider flex cursor-pointer">{user.displayName}
                            <AiFillCaretDown
                                className={`mt-[6px] text-sm ${toggleProfileBar ? 'pointer-events-none text-slate-200' : 'hover:text-slate-200'
                                    } cursor-pointer`}
                                onClick={() => {
                                    setToggleProfileBar((prev) => !prev);
                                }}
                            />
                        </p>
                        <div className="cursor-pointer my-auto bg-white rounded-full ml-2 border-2 border-project-orange hover:opacity-80">
                            <img
                                src={user.photoURL}
                                className={`w-8 h-8 rounded-full ${toggleProfileBar ? 'pointer-events-none' : 'hover:opacity-70'
                                    }`}
                                onClick={() => {
                                    setToggleProfileBar((prev) => !prev);
                                }}
                            />
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
            {toggleProfileBar && <div className='absolute top-[3.6rem] right-20 z-[200] px-24 py-14' ref={profileBarRef}>
                <div className="w-5 h-5 bg-project-navy-1 absolute -top-1 right-[0.5rem] rotate-45 z-[150]">
                </div>
                <div className="bg-project-navy-1 absolute z-[160] w-full h-fit right-0 top-0 rounded-md drop-shadow-md">
                    <div className="h-full flex flex-col justify-between">
                        <div className="flex">
                            <p className="text-white text-lg px-3 py-2 flex">
                                <AiOutlineStar className="my-auto mr-2 text-xl text-yellow-400"/> Credits: {10}
                            </p>
                        </div>
                        <div className="flex text-white text-lg border-t-[1px] border-project-navy-2 px-4 py-2 
                        hover:bg-slate-600 rounded-b-md cursor-pointer" onClick={handleSignOut}>
                            <FiLogOut className="my-auto mr-2" /><a>Logout</a>
                        </div>
                    </div>
                </div>
            </div>}
        </>
    )
}
export default Navbar
