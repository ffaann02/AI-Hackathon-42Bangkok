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
    const [sortListToggle, setSortListToggle] = useState(false)
    const [imgURL, setImgURL] = useState(null)
    const { user } = useUser();
    const cardDetailRef = useRef();
    const selectSortRef = useRef();

    const navigate = useNavigate();

    const [userID, setUserID] = useState(null);
    const [historyData, setHistoryData] = useState(null);
    const [originalHistoryData, setOriginalHistoryData] = useState(null);
    const [sortMode, setSortMode] = useState(1);

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
                setOriginalHistoryData(response.data);
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

    useEffect(() => {
        let handler = (e) => {
            if (selectSortRef.current) { // To check that ref was not undefined
                if (!selectSortRef.current.contains(e.target)) {
                    setSortListToggle(false)
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

    const areArraysEqual = (arr1, arr2) => {
        if (arr1.length !== arr2.length) {
            return false;
        }

        for (let i = 0; i < arr1.length; i++) {
            if (arr1[i] !== arr2[i]) {
                return false;
            }
        }

        return true;
    }

    const reverseArray = () => {
        const reversedArray = [...historyData].reverse()
        setHistoryData(reversedArray);
        if(sortMode===1){
            setSortMode(2);
        }
        if(sortMode===2){
            setSortMode(1);
        }
        setSortListToggle(false);
    }

    return (
        <div className="relative w-full h-full xl:max-w-[75rem] 2xl:max-w-[90rem] lg:max-w-[65rem]  mx-auto">
            <div className="py-4 relative pt-20">
                <h1 className="text-3xl font-semibold tracking-wider ml-4 text-slate-800 w-full">History</h1>
                <div className="mt-5 w-full ml-2 flex justify-between">
                    <div className="flex">
                        <div className={`w-fit px-2 py-2 mr-3 my-auto ${selectDisplay === "All generated" && "underline underline-offset-[2px] decoration-2"}
                        cursor-pointer`}>
                            <p className={`text-lg ${selectDisplay === "All generated" ? "text-slate-800" : "text-slate-500 hover:text-slate-600"}`} onClick={() => handleAllGeneratedClick()}>All generated</p>
                        </div>
                        <div className={`w-fit px-2 py-2 mr-3 my-auto ${selectDisplay === "Favorites" && "underline underline-offset-[2px] decoration-2"}
                        cursor-pointer text-slate-00`}>
                            <p className={`text-lg ${selectDisplay === "Favorites" ? "text-slate-800" : "text-slate-500 hover:text-slate-600"}`} onClick={() => handleFavoritesClick()}>Favorites</p>
                        </div>
                    </div>
                    <div className="relative" ref={selectSortRef}>
                        <button onClick={() => { setSortListToggle(prev => !prev) }}
                            className={`hover:bg-slate-50 tracking-wide border-[1px] border-slate-200 text-slate-800 font-medium 
                            rounded-[5px] text-lg pl-4 pr-5 py-2 text-center inline-flex items-center ${sortListToggle && "bg-slate-50"}`}>
                            <p className="mr-2">Sort By:</p><p className="text-project-orange">{sortMode === 1 ? "Newest" : "Oldest"}</p>
                            <svg class="w-2.5 h-2.5 ml-2.5" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 10 6">
                                <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="m1 1 4 4 4-4" />
                            </svg></button>
                        {sortListToggle && <div id="dropdown" className="top-[3rem] absolute z-10 bg-slate-50 divide-gray-100 border-[1px]
                                rounded-sm shadow w-full">
                            <ul class="text-sm text-gray-700 ">
                                <li>
                                    <a href="#" className={`text-[16px] block py-3 hover:bg-slate-100 px-5 rounded-sm 
                                    ${sortMode === 1 && "bg-slate-100 pointer-events-none text-project-orange"}`}
                                        onClick={reverseArray}>Newest</a>
                                </li>
                                <li>
                                    <a href="#" className={`text-[16px] block py-3 hover:bg-slate-100 px-5 rounded-sm 
                                    ${sortMode === 2 && "bg-slate-100 pointer-events-none text-project-orange"}`}
                                        onClick={reverseArray}>Oldest</a>
                                </li>
                            </ul>
                        </div>}
                    </div>
                </div>

            </div>

            {selectDisplay === "All generated"
                && historyData
                && <div className="w-full grid grid-cols-12 pt-2">
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
                                        onClick={() => { handleDownload(imgURL) }}>
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