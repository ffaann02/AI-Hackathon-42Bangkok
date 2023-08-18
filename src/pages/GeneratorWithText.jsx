import axios from "axios";
import { useEffect, useState } from "react";
import "../App.css"
import waitingBotImage from "/images/waiting-bot.gif"
import { useUser } from "../UserContext";

// Firebase
import firebaseConfig from "../firebaseConfig";
import firebase from 'firebase/compat/app';
import 'firebase/compat/firestore';

const Generator = () => {
    const [results, setResults] = useState(null);
    const [promptsInput, setPromptsInput] = useState("Furniture, Wood, Like a King, Fancy, Useable and Possible to craft Furniture");
    const [progress, setProgress] = useState(false);

    // User data
    if (!firebase.apps.length) {
        firebase.initializeApp(firebaseConfig);
    }
    const { user } = useUser();

    const fetchGenerateImages = async () => {
        const apiUrl = 'https://stablediffusionapi.com/api/v3/text2img';
        const requestData = {
            "key": import.meta.env.VITE_STABLE_DIFFUSION_API_KEY,
            "prompt": promptsInput,
            "negative_prompt": "((out of frame)), ((extra fingers)), mutated hands, ((poorly drawn hands)), ((poorly drawn face)), (((mutation))), (((deformed))), (((tiling))), ((naked)), ((tile)), ((fleshpile)), ((ugly)), (((abstract))), blurry, ((bad anatomy)), ((bad proportions)), ((extra limbs)), cloned face, (((skinny))), glitchy, ((extra breasts)), ((double torso)), ((extra arms)), ((extra hands)), ((mangled fingers)), ((missing breasts)), (missing lips), ((ugly face)), ((fat)), ((extra legs))",
            "width": "512",
            "height": "512",
            "samples": "1",
            "num_inference_steps": "20",
            "safety_checker": "no",
            "enhance_prompt": "yes",
            "seed": null,
            "guidance_scale": 7.5,
            "webhook": null,
            "track_id": null
        };

        try {
            setProgress(true); // Reset progress before starting the request
            const response = await axios.post(apiUrl, requestData);
            console.log(response);
            console.log('API Response:', response.data);
            // Post to database
            if (response) {
                axios.post("http://localhost:3200/generator", {
                    owner_id: user.uid,
                    owner_display_name: user.displayName,
                    owner_profile_image: user.photoURL,
                    image_id: response.data.id,
                    image_url: response.data.output[0],
                    prompt: promptsInput,
                    height: response.data.meta.H,
                    width: response.data.meta.W,
                    privacy: "Private",
                    favorite: "false"
                })
                setResults(response.data);
            }
            setProgress(false); // Set progress to 100% when request is complete
        } catch (error) {
            console.error('API Request Error:', error);
            setProgress(false); // Reset progress if there's an error
        }
    }

    const handleInputChange = (event) => {
        setPromptsInput(event.target.value);
    };
    const dummyImages = [
        "https://cdn2.stablediffusionapi.com/generations/498b67c5-5347-431f-967c-9ff5f5bbf587-0.png",
        "https://cdn2.stablediffusionapi.com/generations/0356ffd1-1e11-4021-aded-48ee097a0839-0.png",
        "https://cdn2.stablediffusionapi.com/generations/022049b0-c596-4273-8c2d-b33cc66159f0-0.png"
    ];
    function simulateDummyApiRequest() {

        const randomImageIndex = Math.floor(Math.random() * dummyImages.length);

        const response = {
            status: "success",
            generationTime: Math.random() * 5, // Simulated generation time between 0 and 5 seconds
            id: Math.floor(Math.random() * 100000),
            output: [dummyImages[randomImageIndex]],
            meta: {
                H: 512,
                W: 512,
                enable_attention_slicing: "true",
                file_prefix: "05c3260d-6a2e-4aa5-82f0-e952f2a5fa10",
                guidance_scale: 7.5,
                model: "runwayml/stable-diffusion-v1-5",
                n_samples: 1,
                negative_prompt: "((out of frame)), ...", // Your provided negative_prompt
                outdir: "out",
                prompt: "ultra realistic close up portrait ...", // Your provided prompt
                revision: "fp16",
                safety_checker: "none",
                seed: Math.floor(Math.random() * 100000),
                steps: 20,
                vae: "stabilityai/sd-vae-ft-mse"
            }
        };

        return new Promise((resolve) => {
            setTimeout(() => {
                resolve(response);
            }, 4000); // Simulating a 1-second delay for the API request
        });
    }

    const dummyGenerateFetch = () => {
        setProgress(true); // Reset progress before starting the request

        simulateDummyApiRequest().then((response) => {
            console.log('API Response:', response);
            setResults(response);
            setProgress(false); // Set progress to 100% when request is complete

            // Post to database
            console.log(response.output[0]);
            if (response) {
                axios.post("http://localhost:3200/generator", {
                    owner_id: user.uid,
                    owner_display_name: user.displayName,
                    owner_profile_image: user.photoURL,
                    image_id: response.id,
                    image_url: response.output[0],
                    prompt: response.meta.prompt,
                    height: response.meta.H,
                    width: response.meta.W,
                    privacy: "Private",
                    favorite: "false"
                })
            }
        });
        window.scrollTo(0, 0);
        setResults(null);
    }

    return (
        <>
            <div className={`flex w-full h-full justify-center my-auto`}>
                <div className="w-full text-center max-w-5xl">
                    <div className="flex mx-auto justify-center w-full sticky top-16 mt-10 shadow-lg rounded-md ">
                        <input
                            type="text"
                            value={promptsInput}
                            onChange={handleInputChange}
                            className="border rounded-lg px-4 py-3 focus:outline-none focus:border-blue-500 w-full 
                        rounded-r-none text-slate-600 tracking-wider"
                            placeholder="Example: Furniture, Wood, Like a King, Fancy, Useable and Possible to create Furniture"
                        />
                        <button
                            className='bg-slate-100 text-md px-3 py-2 rounded-md font-bold
                        hover:text-blue-600 text-slate-600
                        hover:bg-slate-200 rounded-l-none ease-in duration-200'
                            onClick={() => { fetchGenerateImages() }}>
                            Generate
                        </button>
                    </div>
                    {progress && (
                        <div className="w-1/2 mx-auto">
                            <img src={waitingBotImage} className="w-30" />
                            <p className="font-bold text-2xl tracking-wider text-slate-600">
                                Waiting<span id="dot-animation"></span>
                            </p>
                        </div>
                    )}
                    {results && (
                        <div className="w-full">
                            <p className="mt-10 mb-2 text-xl font-bold">Result:</p>
                            <img src={results.output[0]} alt="Generated Image"
                                className="mx-auto" />
                        </div>
                    )}
                    {!progress && !results && (<div className="w-full max-w-5xl grid grid-cols-12 mt-6">
                        {[...Array(3)].map((_, repetitionIndex) => (
                            dummyImages.map((image, index) => (
                                <div className="col-span-4 p-2" key={repetitionIndex * dummyImages.length + index}>
                                    <img src={image} alt={`Image ${index}`} />
                                </div>
                            ))
                        ))}
                    </div>)}
                </div>
            </div>
        </>
    )
}

export default Generator;

