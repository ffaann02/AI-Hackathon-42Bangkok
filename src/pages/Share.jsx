import { useParams, useNavigate } from 'react-router-dom';
import React, { useState, useEffect } from "react"
import axios from 'axios';
import { useUser } from "../UserContext";
import { format } from 'date-fns';
import { AiOutlineLink } from "react-icons/ai"
import Swal from 'sweetalert2';
import withReactContent from 'sweetalert2-react-content'
import Toggle from 'react-toggle'
import { el, tr } from 'date-fns/locale';

const Share = () => {
    const { imageid } = useParams();

    const [sharedData, setSharedData] = useState(null);

    const [userDisplayName, setUserDisplayName] = useState(null);
    const [imagePrompt, setImagePrompt] = useState(null);
    const [imageURL, setImageURL] = useState(null);
    const [imageDate, setImageDate] = useState(null);
    const [userImageProfile, setUserImageProfile] = useState(null);
    const [owenerProfileImage, setOwnerProfileImage] = useState(null);

    const { user } = useUser();
    const [formattedDate, setFormattedDate] = useState(null);

    const [copySuccess, setCopySuccess] = useState("")

    const [privacyState, setPrivacyState] = useState(null);
    const [toggleBoolean, setToggleBoolean] = useState(null);
    const [isOwner, setIsOwner] = useState(false);

    const [loadSuccess, setLoadSuccess] = useState(false);

    useEffect(() => {
        if (imageid && user !== null && !loadSuccess) {
            if (user !== "Anonymous") {
                setUserImageProfile(user.photoURL);
                const fetchShare = async () => {
                    try {
                        let visitorID = user.uid;
                        const response = await axios.post('http://localhost:3200/share', { imageid, visitorID });
                        setSharedData(response.data);
                        setImagePrompt(response.data.prompt);
                        setImageURL(response.data.image_url);
                        setUserDisplayName(response.data.owner_display_name);
                        setOwnerProfileImage(response.data.owner_profile_image)
                        setImageDate(response.data.date);
                        setPrivacyState(response.data.privacy);
                        setIsOwner(response.data.isOwner);
                        console.log(response.data);
                        if (response.data.privacy === "Private") {
                            setToggleBoolean(false);
                        }
                        else if (response.data.privacy === "Public") {
                            setToggleBoolean(true);
                        }
                    } catch (error) {
                        console.error(error);
                    }
                };
                fetchShare();
                setLoadSuccess(true);
            }
            else {
                const fetchShare = async () => {
                    try {
                        let visitorID = "No User";
                        const response = await axios.post('http://localhost:3200/share', { imageid, visitorID });
                        setSharedData(response.data);
                        setImagePrompt(response.data.prompt);
                        setImageURL(response.data.image_url);
                        setUserDisplayName(response.data.owner_display_name);
                        setOwnerProfileImage(response.data.owner_profile_image)
                        setImageDate(response.data.date);
                        setPrivacyState(response.data.privacy);
                        setIsOwner(response.data.isOwner);
                        console.log(response.data);
                    } catch (error) {
                        console.error(error);
                    }
                };
                fetchShare();
                setLoadSuccess(true);
            }
        }

    }, [imageid, user]);

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
                axios.post("http://localhost:3200/update-privacy", {
                    image_id: imageid,
                    privacy: showPrivacy
                })
            } else {
                setToggleBoolean(!setBoolean);
                console.log("Denied");
            }
        })
    }


    return (
        <>
            {sharedData && isOwner !== null && isOwner === true &&
                <div className='w-full grid grid-cols-12 pt-24 px-32 mx-auto'>
                    <div className='col-span-8'>
                        <div className='w-full'>
                            <p className='w-full mt-2 ml-8 text-2xl font-semibold text-black'>{imagePrompt}</p>
                            <div className='relative max-w-lg mx-auto mt-12'>
                                <img src={imageURL} className='mt-4 mx-auto'></img>
                                <div className={`absolute top-2 right-2 bg-gray-200 bg-opacity-60 hover:bg-opacity-90 ${!toggleBoolean && "pointer-events-none"}`}>
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
                            <img src={owenerProfileImage} className='rounded-full h-14'></img>
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
            {sharedData && isOwner === false && privacyState === "Public" &&
                <div className='w-full grid grid-cols-12 pt-24 px-32 mx-auto'>
                    <div className='col-span-8'>
                        <div className='w-full'>
                            <p className='w-full mt-2 ml-8 text-2xl font-semibold text-black'>{imagePrompt}</p>
                            <div className='relative max-w-lg mx-auto mt-12'>
                                <img src={imageURL} className='mt-4 mx-auto'></img>
                                <div className={`absolute top-2 right-2 bg-gray-200 bg-opacity-60 hover:bg-opacity-90 ${!toggleBoolean && "pointer-events-none"}`}>
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
                            <img src={owenerProfileImage} className='rounded-full h-14'></img>
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
            {sharedData && isOwner === false && privacyState === "Private" &&
                <div>
                    <section className="bg-white ">
                        <div className="container flex items-center min-h-screen px-6 py-12 mx-auto">
                            <div className="flex flex-col items-center max-w-sm mx-auto text-center">
                                <p className="p-3 text-sm font-medium text-project-orange rounded-full bg-orange-50">
                                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor" 
                                    className="w-6 h-6">
                                        <path stroke-linecap="round" stroke-linejoin="round" d="M12 9v3.75m9-.75a9 9 0 11-18 0 9 9 0 0118 0zm-9 3.75h.008v.008H12v-.008z" />
                                    </svg>
                                </p>
                                <h1 className="mt-3 text-2xl font-semibold text-project-black md:text-3xl">Access denied</h1>
                                <p className="mt-4 text-project-navy-1">The page are private. Here are some helpful links:</p>

                                <div className="flex items-center w-full mt-6 gap-x-3 shrink-0 sm:w-auto">
                                    <button className="flex items-center justify-center w-1/2 px-5 py-2 text-sm text-gray-700 transition-colors duration-200 bg-white border rounded-lg gap-x-2 sm:w-auto">
                                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" 
                                            className="w-5 h-5 rtl:rotate-180">
                                            <path stroke-linecap="round" stroke-linejoin="round" d="M6.75 15.75L3 12m0 0l3.75-3.75M3 12h18" />
                                        </svg>
                                        <span>Go back</span>
                                    </button>

                                    <button className="w-1/2 px-5 py-2 text-sm tracking-wide text-white transition-colors duration-200 bg-blue-500 rounded-lg shrink-0 sm:w-auto hover:bg-blue-600">
                                        Take me home
                                    </button>
                                </div>
                            </div>
                        </div>
                    </section>
                </div>
            }
        </>
    )
}

export default Share;