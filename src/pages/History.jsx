import React, { useState, useEffect, useRef } from "react"
import { useUser } from "../UserContext"
import axios from "axios"
import Card from "../components/Card"
import HistoryModal from "../components/HistoryModal";

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

    const [ownerID, setOwnerID] = useState(null);
    const [historyData, setHistoryData] = useState(null);
    const [sortMode, setSortMode] = useState(1);

    const [isFavorite, setIsFavorite] = useState(null);

    useEffect(() => {
        if (user) {
            setOwnerID(user.uid);
        }
    }, [user])

    useEffect(() => {
        const fetchImageData = async () => {
            try {
                const response = await axios.get(`http://localhost:3200/history?history=${ownerID}`);
                setHistoryData(response.data);
                console.log(response.data)
            } catch (error) {
                console.error(error);
            }
        }
        if (ownerID) {
            fetchImageData();
        }
    }, [ownerID, isFavorite])

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

    const handleCardClick = (id, prompt, imgURL, favorite) => {
        setCardClicked(true);
        setImgID(id);
        setImgPrompt(prompt);
        setImgURL(imgURL);
        setIsFavorite(favorite);
    };

    const handleAllGeneratedClick = () => {
        setSelectDisplay("All generated");
    }

    const handleFavoritesClick = () => {
        setSelectDisplay("Favorites");
    }

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

    const updateFavoriteState = async (favorite) => {
        setIsFavorite(favorite)
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

            {selectDisplay === "All generated" && cardClicked && 
                <HistoryModal
                    onClick = {updateFavoriteState} // return new props to parent function
                    imageID = {imgID}
                    imageURL = {imgURL}
                    imagePrompt = {imgPrompt}
                    favorite = {isFavorite}
                    cardDetailRef = {cardDetailRef}
                />
            }

        </div>
    )
}

export default History;