import React, { useState, useEffect, useRef } from "react"
import {saveAs} from "file-saver";
import Card from "../page components/Card"
import data from "../page components/DummyHistory"

const History = () => {

    const [selectDisplay, setSelectDisplay] = useState("All generation")

    const [cardClicked, setCardClicked] = useState(false)
    const [imgPrompt, setImgPrompt] = useState(null)
    const [imgURL, setImgURL] = useState(null)

    let cardDetailRef = useRef();
    const clipboardRef = useRef();

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
        setCardClicked(true);
        setImgPrompt(prompt);
        setImgURL(imgURL);
    };

    const handleAllGenerationClick = () => {
        setSelectDisplay("All generation");
    }

    const handleFavoritesClick = () => {
        setSelectDisplay("Favorites");
    }

    const downloadClick = () => {
        let url = imgURL[0]
        console.log(imgURL);
        saveAs(url, "image.jpg")
    }

    return (
        <div className="relative">
            <div className="sticky top-0 w-full z-30">
                <div className="w-full pt-8 bg-[#292C39]">
                    <p className="ml-24 text-3xl font-semibold text-white">History</p>
                </div>
                <div className="w-full pt-12 pb-4 bg-[#292C39] flex">
                    <p className={`ml-24 my-auto p-2 text-2xl cursor-pointer hover:bg-[#585b6e]
                        ${selectDisplay === "All generation" ? "text-[#E49D65]" : "text-white"}`} 
                        onClick={() => handleAllGenerationClick()}>All generation</p>
                    <p className={`ml-12 my-auto p-2 text-2xl cursor-pointer  hover:bg-[#585b6e]
                        ${selectDisplay === "Favorites" ? "text-[#E49D65]" : "text-white"}`} 
                        onClick={() => handleFavoritesClick()}>Favorites</p>
                </div>
            </div>

            {selectDisplay === "All generation"

                && <div>
                    {data.map(item => (
                        <Card
                            key={item.id}
                            onClick={handleCardClick} // Pass the onClick function
                            {...item}
                        />
                    ))}
                </div>
            }

            {selectDisplay === "All generation" && cardClicked && <>
                <div className="justify-center items-center flex overflow-x-hidden overflow-y-auto fixed inset-0 z-50 outline-none focus:outline-none">
                    <div className="relative w-auto my-6 mx-auto max-w-5xl">
                        {/*content*/}
                        <div className="relative grid grid-cols-12 border-0 rounded-lg shadow-lg w-full bg-white outline-none focus:outline-none" ref={cardDetailRef}>
                            {/*body*/}
                            <div className="col-span-6 relative p-2 flex">
                                <img src={imgURL} className="ml-0" />
                            </div>

                            <div className="col-span-6 relative p-2">
                                
                                <div className="flex justify-end mt-4">
                                    <button className="mr-3 bg-[#D9D9D9] hover:bg-gray-400 text-black py-2 px-4 rounded-sm inline-flex items-center" onClick={downloadClick}>
                                        <svg className="fill-current w-4 h-4 mr-2" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20"><path d="M13 8V2H7v6H2l8 8 8-8h-5zM0 18h20v2H0v-2z" /></svg>
                                        <span>Download</span>
                                    </button>
                                    <button className="mr-3 bg-[#D9D9D9] hover:bg-gray-400 text-black  px-4 py-2 rounded-sm">
                                        <span>Share</span>
                                    </button>
                                    <button className="mr-4 bg-[#111111] hover:bg-gray-600 text-white  px-4 py-2 rounded-sm">
                                        <span>Save</span>
                                    </button>
                                </div>

                                <p className="mt-12 ml-8 text-2xl font-semibold">{imgPrompt}</p>

                                <div className="absolute bottom-8 ml-8">
                                    <button className="mr-4 bg-[#E49D65] text-[#E49D65]  px-24 py-4 rounded-lg">
                                        <span>-</span>
                                    </button>
                                    <button className="mr-4 bg-[#111111] text-[#111111]  px-24 py-4 rounded-lg">
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