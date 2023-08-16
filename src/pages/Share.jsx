import { useParams, useNavigate } from 'react-router-dom';
import React, { useState, useEffect } from "react"
import axios from 'axios';
import data from "../components/DummyHistory"
import { useUser } from "../UserContext";
import { format } from 'date-fns';
import { AiOutlineLink } from "react-icons/ai"
import Swal from 'sweetalert2';
import withReactContent from 'sweetalert2-react-content'
import Toggle from 'react-toggle'

const Share = () => {
    const { imageid } = useParams();

    const [sharedData, setSharedData] = useState(null);

    const [userDisplayName, setUserDisplayName] = useState(null);
    const [imagePrompt, setImagePrompt] = useState(null);
    const [imageURL, setImageURL] = useState(null);
    const [imageDate, setImageDate] = useState(null);
    const [userImageProfile, setUserImageProfile] = useState(null);
    const [ownerUID, setOwnerUID] = useState(null);

    const { user } = useUser();
    const [formattedDate, setFormattedDate] = useState(null);

    const [copySuccess, setCopySuccess] = useState("")
    const url = location.href;

    const [privacyState, setPrivacyState] = useState("Private");
    const [toggleBoolean, setToggleBoolean] = useState(null);
    const [isOwner, setIsOwner] = useState(false);

    useEffect(() => {
        if (user) {
            console.log(user);
            setUserImageProfile(user.photoURL);
        }
    }, [user])

    useEffect(() => {
        const fetchShare = async () => {
            try {
                const response = await axios.get(`http://localhost:3200/share?imageid=${imageid}`);
                setSharedData(response.data);
                setImagePrompt(response.data.prompt);
                setImageURL(response.data.image_url);
                setUserDisplayName(response.data.user_display_name);
                setImageDate(response.data.date);
                setOwnerUID(response.data.user_id);
                setPrivacyState(response.data.privacy);
                console.log(response.data);
            } catch (error) {
                console.error(error);
            }
        }
        fetchShare();
    }, []);

    useEffect(() => {
        const formatDate = () => {
            if (imageDate) {
                const date = new Date(imageDate);
                const date_formatted = format(date, 'd MMMM yyyy');
                setFormattedDate(date_formatted);
            }
        }
        formatDate();
    }, [imageDate])

    useEffect(() => {
        if(user){
            if(user.uid === ownerUID){
                setIsOwner(true);
                console.log("You are owner");
            }
            else{
                setIsOwner(false);
                console.log("You are visitor");
            }
        }
        else{
            setIsOwner(false);
            console.log("You are visitor");
        }
    }, [user, ownerUID])

    async function copyToClip() {
        await navigator.clipboard.writeText(location.href);
        setCopySuccess("Copied");
    }

    const handleToggle = () => {
        if (!toggleBoolean) {
            showAlert("Are you sure to set privacy to Public ?", "This setting will change your privacy.", "question", true, "Public");
        }
        else if (toggleBoolean) {
            showAlert("Are you sure to set privacy to Private ?", "This setting will change your privacy.", "question", false, "Private");
        }
    }

    const sweetAlert = withReactContent(Swal)
    const showAlert = (title, html, icon, setBoolean, showPrivacy) => {
        sweetAlert.fire({
            title: <strong>{title}</strong>,
            html: <i>{html}</i>,
            icon: icon,
            confirmButtonText: 'Yes',
            confirmButtonColor: '#1ea1d9',
            showCancelButton: true,
            cancelButtonText: 'No',
            cancelButtonColor: '#d33'
        }).then((result) => {
            if (result.isConfirmed) {
                setToggleBoolean(setBoolean);
                setPrivacyState(showPrivacy);
                // Update to SQL
                axios.post("http://localhost:3200/share", {
                image_id: imageid,
                privacy : showPrivacy
                })
            } else {
                setToggleBoolean(!setBoolean);
                console.log("Denied");
            }
        })
    }


    return (
        <>
            {sharedData && isOwner &&
                <div className='w-full grid grid-cols-12 pt-24 px-32 mx-auto'>
                    <div className='col-span-8'>
                        <div className='w-full'>
                            <p className='w-full mt-2 ml-8 text-2xl font-semibold text-black'>{imagePrompt}</p>
                            <div className='relative max-w-lg mx-auto mt-12'>
                                <img src={imageURL} className='mt-4 mx-auto'></img>
                                <div className={`absolute top-2 right-2 bg-gray-200 bg-opacity-60 hover:bg-opacity-90 ${!toggleBoolean && "pointer-events-none" }`}>
                                    <button className='px-2 py-2' onClick={() => copyToClip()}>
                                        <AiOutlineLink className='h-6 w-6' />
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className='col-span-4'>
                        <p className='ml-4 text-sm mb-1 text-project-navy-1'>Creator</p>
                        <div className='flex ml-4'>
                            <img src={userImageProfile} className='rounded-full h-14'></img>
                            <p className='my-auto ml-4 font-semibold text-project-navy-2'>{userDisplayName}</p>
                        </div>
                        <div className='flex mt-6'>
                            <p className='ml-4 my-auto text-sm text-project-navy-1'>Created Date :</p>
                            <p className='ml-4 my-auto text-sm text-project-navy-2'>{formattedDate}</p>
                        </div>
                        {isOwner &&
                            <div className='flex ml-4 mt-6'>
                                <p className='text-sm  text-project-navy-1'>Privacy : </p>
                                <div className='ml-4'>
                                    <label className="relative inline-flex items-center">
                                        <input type='checkbox' className="sr-only peer"
                                            checked={toggleBoolean}
                                            onChange={() => handleToggle()} />
                                            <div className="cursor-pointer my-auto w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4
                                            peer-focus:ring-blue-300 dark:peer-focus:ring-blue-800 rounded-full peer dark:bg-gray-700 
                                            peer-checked:after:translate-x-full peer-checked:after:border-white 
                                            after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white
                                            after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all
                                            dark:border-gray-600 peer-checked:bg-blue-600"></div>
                                        <span className="ml-3 my-auto text-sm font-medium text-gray-900">{privacyState}</span>
                                    </label>
                                </div>
                            </div>
                        }
                        {isOwner && !toggleBoolean &&
                            <div className='ml-4 mt-2'>
                                <span className='text-sm  text-project-navy-1'>
                                    If your privacy is private, you will not be able share this page to other users.
                                </span>
                            </div>
                        }
                        {isOwner && toggleBoolean &&
                            <div className='ml-4 mt-2'>
                                <span className='text-sm  text-project-navy-1'>
                                    Public privacy will be able to share this page to other users.
                                </span>
                            </div>
                        }
                    </div>
                </div>
            }
            {sharedData && !isOwner && privacyState === "Public" &&
                <div className='w-full grid grid-cols-12 pt-24 px-32 mx-auto'>
                    <div className='col-span-8'>
                        <div className='w-full'>
                            <p className='w-full mt-2 ml-8 text-2xl font-semibold text-black'>{imagePrompt}</p>
                            <div className='relative max-w-lg mx-auto mt-12'>
                                <img src={imageURL} className='mt-4 mx-auto'></img>
                                <div className={`absolute top-2 right-2 bg-gray-200 bg-opacity-60 hover:bg-opacity-90 ${!toggleBoolean && "pointer-events-none" }`}>
                                    <button className='px-2 py-2' onClick={() => copyToClip()}>
                                        <AiOutlineLink className='h-6 w-6' />
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className='col-span-4'>
                        <p className='ml-4 text-sm mb-1 text-project-navy-1'>Creator</p>
                        <div className='flex ml-4'>
                            <img src={userImageProfile} className='rounded-full h-14'></img>
                            <p className='my-auto ml-4 font-semibold text-project-navy-2'>{userDisplayName}</p>
                        </div>
                        <div className='flex mt-6'>
                            <p className='ml-4 my-auto text-sm text-project-navy-1'>Created Date :</p>
                            <p className='ml-4 my-auto text-sm text-project-navy-2'>{formattedDate}</p>
                        </div>
                        {isOwner &&
                            <div className='flex ml-4 mt-6'>
                                <p className='text-sm  text-project-navy-1'>Privacy : </p>
                                <div className='ml-4'>
                                    <label className="relative inline-flex items-center">
                                        <input type='checkbox' className="sr-only peer"
                                            checked={toggleBoolean}
                                            onChange={() => handleToggle()} />
                                            <div className="cursor-pointer my-auto w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4
                                            peer-focus:ring-blue-300 dark:peer-focus:ring-blue-800 rounded-full peer dark:bg-gray-700 
                                            peer-checked:after:translate-x-full peer-checked:after:border-white 
                                            after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white
                                            after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all
                                            dark:border-gray-600 peer-checked:bg-blue-600"></div>
                                        <span className="ml-3 my-auto text-sm font-medium text-gray-900">{privacyState}</span>
                                    </label>
                                </div>
                            </div>
                        }
                        {isOwner && !toggleBoolean &&
                            <div className='ml-4 mt-2'>
                                <span className='text-sm  text-project-navy-1'>
                                    If your privacy is private, you will not be able share this page to other users.
                                </span>
                            </div>
                        }
                        {isOwner && toggleBoolean &&
                            <div className='ml-4 mt-2'>
                                <span className='text-sm  text-project-navy-1'>
                                    Public privacy will be able to share this page to other users.
                                </span>
                            </div>
                        }
                    </div>
                </div>
            }
            {sharedData && !isOwner && privacyState !== "Public" &&
                <div className='w-full h-full'>
                    <div className='mx-auto text-3xl'>
                        <p>You don't have permission to visit this page.</p>
                    </div>
                </div>
            }
        </>
    )
}

export default Share;