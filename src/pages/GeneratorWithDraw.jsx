import React, { useRef, useState } from "react";
import CanvasDraw from "react-canvas-draw";
import robotDrawingLoading from "/images/robot-drawing-loading.gif"
import { BiRefresh, BiArrowBack } from "react-icons/bi"
import axios from "axios";
import { useUser } from "../UserContext"

const GeneratorWithDraw = () => {
    const canvasRef = useRef(null);
    const [promptsInput, setPromptsInput] = useState("Furniture, Wood, Like a King, Fancy, Useable and Possible to craft Furniture");

    const { user } = useUser();

    const saveButton = () => {
        const dataURL = canvasRef.current.canvasContainer.children[1].toDataURL('image/png');
        console.log(dataURL);
    }

    const clearButton = () => {
        canvasRef.current.clear();
    }

    const onDrawing = (event) => {
    }

    const handleInputChange = (event) => {
        setPromptsInput(event.target.value);
    };

    const [undrawable, setUndrawable] = useState(false);
    const [progress, setProgress] = useState(null);
    const [results, setResults] = useState(null);

    const handleGenerateWithDrawing = async () => {
        setProgress(true);
        setUndrawable(true)
        const dataURL = await canvasRef.current.canvasContainer.children[1].toDataURL('image/png');
        const response = await axios.post("http://localhost:3200/replicate-api", {
            prompt: promptsInput,
            token: import.meta.env.VITE_CONTROLNET_API_TOKEN,
            imageBase64: dataURL,
            owner_id: user.uid,
            owner_display_name: user.displayName,
            owner_profile_image: user.photoURL
        })
        if(response){
            console.log(response);
            console.log(response.data);
            setResults(response.data);
            setProgress(false)
        }
    }
    const handleGenerateAnother = () => {
        canvasRef.current.clear();
        setResults(null);
        setProgress(null);
        setUndrawable(false);
    }

    return (
        <div className="w-full h-full mx-auto">
            <h1 className="text-center mt-10 text-xl text-slate-600 tracking-wider">Draw your dreams furniture here and Generate it with AI</h1>
            <div className="flex mx-auto justify-center w-full sticky top-16 mt-2 mb-4 shadow-lg rounded-md max-w-3xl">
                <input
                    type="text"
                    value={promptsInput}
                    onChange={handleInputChange}
                    className="border rounded-lg px-4 py-3 focus:outline-none focus:border-blue-500 w-full 
                        rounded-r-none text-slate-600 tracking-wider"
                    placeholder="Example: Furniture, Wood, Like a King, Fancy, Useable and Possible to create Furniture"
                />
                <button onClick={handleGenerateWithDrawing}
                    className='bg-slate-100 text-md px-3 py-2 rounded-md font-bold
                        hover:text-blue-600 text-slate-600
                        hover:bg-slate-200 rounded-l-none ease-in duration-200'
                >
                    Generate
                </button>
            </div>
            {!undrawable ?
                <div className="text-center flex mx-auto w-fit hover:bg-slate-100 hover:text-blue-600 p-2 
            rounded-md cursor-pointer"
                    onClick={clearButton}>
                    <BiRefresh className="text-xl my-auto mr-1" />
                    <p className="my-auto">Refresh</p>
                </div> :
                <div className="text-center flex mx-auto w-fit hover:bg-slate-100 hover:text-blue-600 p-2 
            rounded-md cursor-pointer"
                    onClick={handleGenerateAnother}>
                    <BiArrowBack className="text-xl my-auto mr-1" />
                    <p className="my-auto">Create Another</p>
                </div>}
            <div className="mx-auto max-w-3xl mt-3">
                <div className="flex w-full justify-center">
                    <CanvasDraw
                        ref={canvasRef}
                        onChange={(e) => { onDrawing(e) }}
                        brushColor="#000000"
                        brushRadius={2}
                        className="border-2 mx-2"
                        disabled={undrawable}
                    />
                    {progress!==null && <div className="w-[400px] h-[400px] border-2 relative">
                        {results !== null && progress===false && 
                        <img src={results}
                            className="w-full h-full" />}
                        {results === null && progress===true && <div className="w-full absolute right-0 text-center mt-8">
                            <p className="font-bold text-lg tracking-wider text-slate-600">
                                Generating Your Furniture<span id="dot-animation"></span>
                            </p>
                        </div>}
                        {results === null && progress===true && <img src={robotDrawingLoading} className="w-full h-full p-6" />}
                    </div>}
                </div>
            </div>
        </div>
    );
}

export default GeneratorWithDraw;
