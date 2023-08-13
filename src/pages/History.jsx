import React, { useState, useEffect, useRef } from "react"
import { useNavigate } from 'react-router-dom';
import { saveAs } from "file-saver";
import Card from "../components/Card"
import data from "../components/DummyHistory"
import html2canvas from "html2canvas"
import axios from "axios"
import { useUser } from "../UserContext";
import { GoChevronDown } from "react-icons/go"

const History = () => {

    const [selectDisplay, setSelectDisplay] = useState("All generated")

    const [cardClicked, setCardClicked] = useState(false)
    const [imgID, setImgID] = useState(null)
    const [imgPrompt, setImgPrompt] = useState(null)
    const [imgURL, setImgURL] = useState(null)
    const {user} = useUser();
    let cardDetailRef = useRef();

    const navigate = useNavigate();

    const [userID, setUserID] = useState(null);
    const [historyData, setHistoryData] = useState(null);
    const [isOldest, setIsOldest] = useState(true);

    useEffect(() => {
        if (user) {
            setUserID(user.uid);
        }
    }, [user])

    useEffect(() => {
        const fetchImageData = async () => {
            try {
                console.log(userID);
                const response = await axios.get(`http://localhost:3200/history?history=${userID}`);
                setHistoryData(response.data);
                console.log(response.data)
            } catch (error) {
                console.error(error);
            }
        }
        if (userID) {
            fetchImageData();
        }
    }, [userID])

    useEffect(() => {
        let handler = (e) => {
            if (cardDetailRef.current) { // To check that ref was not undefined
                if (!cardDetailRef.current.contains(e.target)) {
                    setCardClicked(false);
                }
            }
        };
        document.addEventListener("mousedown", handler);
        return () => {
            document.removeEventListener("mousedown", handler);
        }
    });

    const handleCardClick = (id, prompt, imgURL) => {
        console.log("TEst")
        setCardClicked(true);
        setImgID(id);
        setImgPrompt(prompt);
        setImgURL(imgURL);
    };

    const handleAllGeneratedClick = () => {
        setSelectDisplay("All generated");
    }

    const handleFavoritesClick = () => {
        setSelectDisplay("Favorites");
    }


    const handleDownload = async (imageUrl) => {
        try {
            const response = await axios.post('http://localhost:3200/fetch-image', { imageUrl }, { responseType: 'arraybuffer' });
            const imageData = response.data;
            console.log(response)

            const imageBlob = new Blob([imageData], { type: 'image/png' });
            const imageURL = URL.createObjectURL(imageBlob);

            const link = document.createElement('a');
            link.href = imageURL;
            link.download = 'image.png';
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
        } catch (error) {
            console.error('Error fetching or processing image:', error);
        }
    };

    const reverseArray = () => {
        const reversedArray = [...historyData].reverse()
        setHistoryData(reversedArray);
        console.log(reversedArray)
    }

    return (
        <div className="relative">
            <div className="sticky top-14 w-full z-30 bg-project-navy-2 pt-6">
                <div className="w-full px-32">
                    <p className="ml-4 text-2xl font-semibold text-white tracking-wider">History</p>
                    <div className="w-full flex mt-6">
                        <p className={`my-auto p-2 text-lg cursor-pointer hover:bg-project-navy-1
                        ${selectDisplay === "All generated" ? "text-project-orange" : "text-white"} px-4`}
                            onClick={() => handleAllGeneratedClick()}>All generated</p>
                        <p className={`my-auto p-2 text-lg cursor-pointer  hover:bg-project-navy-2
                        ${selectDisplay === "Favorites" ? "text-project-orange" : "text-white"} px-4`}
                            onClick={() => handleFavoritesClick()}>Favorites</p>
                    </div>
                </div>
            </div>

            {historyData
                &&  <div className="w-full px-32 pt-4">
                        <details className="">
                        <summary className="p-2 w-fit cursor-pointer bg-gray-200">Sorted by</summary>
                            <ul className="w-fit cursor-pointer shadow menu dropdown-content z-[1] bg-base-100 rounded-box">
                                <li onClick={() => {reverseArray(historyData)}} className="p-2 hover:bg-gray-400"><a>Oldest</a></li>
                                <li onClick={() => {reverseArray(historyData)}} className="p-2  hover:bg-gray-400"><a>Lasted</a></li>
                            </ul>
                        </details>
                    </div>
            }

            {selectDisplay === "All generated"
                && historyData
                && <div className="w-full grid grid-cols-12 pt-4 px-32">
                    {historyData.map(item => (
                        <Card
                            key={`${item.id}_${historyData[0].id}`}
                            onClick={handleCardClick} // Pass the onClick function
                            {...item}
                        />
                    ))}
                </div>
            }

            {selectDisplay === "All generated" && cardClicked && <>
                <div className="justify-center items-center flex overflow-x-hidden overflow-y-auto fixed inset-0 z-50 outline-none focus:outline-none">
                    <div className="relative w-auto my-6 mx-auto max-w-5xl">
                        {/*content*/}
                        <div className="relative grid grid-cols-12 border-0 rounded-lg shadow-lg w-full bg-white outline-none focus:outline-none" ref={cardDetailRef}>
                            {/*body*/}
                            <div className="col-span-6 relative p-2 flex" id="test">
                                <img src={imgURL} className="ml-0" />
                            </div>

                            <div className="col-span-6 relative p-2">

                                <div className="flex justify-end mt-4">
                                    <button className="mr-3 bg-[#D9D9D9] hover:bg-gray-400 text-black py-2 px-4 rounded-sm inline-flex items-center"
                                        onClick={() => { handleDownload(imgURL[0]) }}>
                                        <svg className="fill-current w-4 h-4 mr-2" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20"><path d="M13 8V2H7v6H2l8 8 8-8h-5zM0 18h20v2H0v-2z" /></svg>
                                        <span>Download</span>
                                    </button>
                                    <button className="mr-3 bg-[#D9D9D9] hover:bg-gray-400 text-black  px-4 py-2 rounded-sm" onClick={() => navigate(`/share/${imgID}`)}>
                                        <span>Share</span>
                                    </button>
                                    <button className="mr-4 bg-project-black hover:bg-gray-600 text-white  px-4 py-2 rounded-sm"
                                    >
                                        <span>Save</span>
                                    </button>
                                </div>

                                <p className="mt-12 ml-8 text-2xl font-semibold">{imgPrompt}</p>

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
            </>}

        </div>
    )
}

export default History;