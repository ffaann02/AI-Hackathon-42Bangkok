import { IoIosHeart } from "react-icons/io"
import axios from "axios"
import { useEffect, useState } from "react";
import { useNavigate } from 'react-router-dom';

const HistoryModal = (props) => {

    const [isFavorite, setIsFavorite] = useState(null);
    const navigate = useNavigate();

    useEffect(() => {
        setIsFavorite(props.favorite)
    }, [props])

    const handleDownload = async (imageUrl) => {
        try {
            const response = await axios.post('http://localhost:3200/fetch-image', { imageUrl }, { responseType: 'arraybuffer' });
            const imageData = response.data;
            console.log(response)

            const imageBlob = new Blob([imageData], { type: 'image/png' });
            const imageURL = URL.createObjectURL(imageBlob);

            const link = document.createElement('a');
            link.href = imageURL;
            link.download = `${props.imageID}.png`;
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
        } catch (error) {
            console.error('Error fetching or processing image:', error);
        }
    };

    const handleClickFavorite = async() => {
        if(isFavorite === "true"){
            setIsFavorite("false")
            //Update to SQL
            await axios.post("http://localhost:3200/update-favorite", {
                image_id: props.imageID,
                favorite: "false"
            })
            // When child got clicked, return value to parent 
            props.onClick("false");
        }
        else{
            setIsFavorite("true")
            // Update to SQL
            await axios.post("http://localhost:3200/update-favorite", {
                image_id: props.imageID,
                favorite: "true"
            })
            // When child got clicked, return value to parent 
            props.onClick("true");
        }
    }

    return (
        <>
            <div className="justify-center items-center flex overflow-x-hidden overflow-y-auto fixed inset-0 z-50 outline-none focus:outline-none">
                <div className="relative w-auto my-6 mx-auto max-w-5xl">
                    {/*content*/}
                    <div className="relative grid grid-cols-12 border-0 rounded-lg shadow-lg w-full bg-white outline-none focus:outline-none" ref={props.cardDetailRef}>
                        {/*body*/}
                        <div className="col-span-6 relative p-2 flex" id="test">
                            <img src={props.imageURL} className="ml-0" />
                        </div>

                        <div className="col-span-6 relative p-2">

                            <div className="flex justify-end mt-4">
                                <button className="mr-3 bg-[#D9D9D9] hover:bg-gray-400 text-black py-2 px-4 rounded-sm inline-flex items-center"
                                onClick={() => { handleDownload(props.imageURL) }}>
                                    <svg className="fill-current w-4 h-4 mr-2" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20"><path d="M13 8V2H7v6H2l8 8 8-8h-5zM0 18h20v2H0v-2z" /></svg>
                                    <span>Download</span>
                                </button>
                                <button className="mr-3 bg-[#D9D9D9] hover:bg-gray-400 text-black  px-4 py-2 rounded-sm" onClick={() => navigate(`/share/${props.imageID}`)}>
                                    <span>Share</span>
                                </button>
                                <button className={`mr-4 flex ${isFavorite === "true" ? "bg-red-500" : "bg-project-black"}
                                 hover:bg-gray-600 text-white items-center px-3 py-2 rounded-sm`} onClick={() => handleClickFavorite()}>
                                    <IoIosHeart className="mt-0.5 text-md" />
                                    <p className="ml-1.5 my-auto text-md">Favorite</p>
                                </button>
                            </div>

                            <p className="mt-12 ml-8 text-2xl font-semibold">{props.imagePrompt}</p>

                            <div className="absolute bottom-8 ml-8">
                                <button className="mr-4 bg-project-orange text-project-orange  px-24 py-4 rounded-lg">
                                    <span>-</span>
                                </button>
                                <button className="mr-4 bg-project-black text-project-black  px-24 py-4 rounded-lg">
                                    <span>-</span>
                                </button>
                            </div>

                        </div>
                    </div>
                </div>
            </div>
            <div className="opacity-25 fixed inset-0 z-40 bg-black"></div>
        </>
    )
}

export default HistoryModal;