import { useParams, useNavigate } from 'react-router-dom';
import React, { useState, useEffect } from "react"
import axios from 'axios';
import data from "../components/DummyHistory"

const Share = () => {
    const { imageid } = useParams();
    const [sharedData, setSharedData] = useState(null);
    const [ userDisplayName, setUserDisplayName ] = useState(null);
    const [ imagePrompt, setImagePrompt ] = useState(null);
    const [ imageURL, setImageURL ] = useState(null);

    useEffect(() => {
        const fetchShare = async () => {  
        try {
            const response = await axios.get(`http://localhost:5000/share?imageid=${imageid}`);
            setSharedData(response.data);
            setImagePrompt(response.data.prompt);
            setImageURL(response.data.image_url);
            setUserDisplayName(response.data.user_display_name);
            console.log(response.data)
        }  catch (error) {
            console.error(error);
        }
        }
        fetchShare();
    }, []);

    return (
        <>
            {sharedData && 
                <div className='w-full h-full'>
                    <div className='text-2xl mx-auto text-black'>
                        <p>{imagePrompt}</p>
                    </div>
                    <img src={imageURL}></img>
                    <p>generated by {userDisplayName}</p>
                </div>
            }
        </>
    )
}

export default Share;