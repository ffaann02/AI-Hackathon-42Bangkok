import { useParams, useNavigate } from 'react-router-dom';
import React, { useState, useEffect } from "react"
import axios from 'axios';
import data from "../components/DummyHistory"
import { useUser } from "../UserContext";
import { format } from 'date-fns';
import { AiOutlineLink } from "react-icons/ai"

const Share = () => {
    const { imageid } = useParams();
    const [sharedData, setSharedData] = useState(null);
    const [ userDisplayName, setUserDisplayName ] = useState(null);
    const [ imagePrompt, setImagePrompt ] = useState(null);
    const [ imageURL, setImageURL ] = useState(null);
    const [ imageDate,  setImageDate] = useState(null);
    const [ userImageProfile, setUserImageProfile ] = useState(null);
    const {user} = useUser();
    const [formattedDate, setFormattedDate] = useState(null);
    const [copySuccess, setCopySuccess] = useState("")

    const url = location.href;

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
            console.log(response.data)
        }  catch (error) {
            console.error(error);
        }
        }
        fetchShare();
    }, []);

    useEffect(() => {
        const formatDate = () => {
            if(imageDate){
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

    return (
        <>
            {sharedData && 
                <div className='w-full grid grid-cols-12 pt-8 px-32 mx-auto'>
                    <div className='col-span-8'>
                        <div className='w-full'>
                            <p className='mt-2 ml-8 text-2xl font-semibold text-black'>{imagePrompt}</p>
                            <div className='relative max-w-lg mx-auto'>
                                <img src={imageURL} className='mt-4 mx-auto'></img>
                                <div className='absolute top-2 right-2 bg-gray-200 bg-opacity-60 hover:bg-opacity-90'>
                                    <button className='px-2 py-2' onClick={() => copyToClip()}>
                                        <AiOutlineLink className='h-6 w-6'/>
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
                    </div>
                </div>
            }
        </>
    )
}

export default Share;