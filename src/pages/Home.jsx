import { useNavigate } from "react-router-dom";
import service1Image from "/images/robot-cover-login.png";
import axios from "axios";

const Home = () => {
    const navigate = useNavigate();

    const handleGenAI = async () => {

        // Success
        // axios.post("http://localhost:3200/replicate-api", {
        //             prompt: "a 19th century portrait of a raccoon gentleman wearing a suit",
        //             token: import.meta.env.VITE_CONTROLNET_API_TOKEN
        // })

    }

    return (
        <div className="w-full h-full grid place-items-center">
            <div className="max-w-4xl w-full h-full pt-10">
                <button onClick={handleGenAI}>hello</button>
                <h1 className="text-center text-2xl font-bold">LOGO NAME</h1>
                <div className="w-full mt-10 grid grid-cols-2 h-full">
                    <div className="bg-slate-100 mx-4 rounded-lg text-center drop-shadow-md hover:bg-slate-200
                    cursor-pointer" onClick={() => { navigate("/generator") }}>
                        <h2 className="mt-8 text-xl font-bold tracking-wider">
                            Build a Furniture with prompts
                        </h2>
                        <img src={service1Image} className="px-10 py-2" />
                        <p className="">
                            Create persolized furnitures with prompt
                        </p>
                    </div>
                    <div className="bg-slate-100 mx-4 rounded-lg text-center drop-shadow-md hover:bg-slate-200
                    cursor-pointer" onClick={() => { navigate("/generator") }}>
                        <h2 className="mt-8 text-xl font-bold tracking-wider">
                            Build a Furniture with prompts
                        </h2>
                        <img src={service1Image} className="px-10 py-2" />
                        <p className="">
                            Create persolized furnitures with prompt
                        </p>
                    </div>

                </div>
            </div>
        </div>

    )
}
export default Home