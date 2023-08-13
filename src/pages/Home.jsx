import { useNavigate } from "react-router-dom";
import service1Image from "/images/robot-cover-login.png";
const Home = () => {
    const navigate = useNavigate();
    return (
        <div className="w-full h-full bg-slate-50 min-h-screen grid place-items-center">
            <div className="max-w-4xl w-full h-full pb-52 xl:pt-20 pt-16">
                <h1 className="text-center text-2xl font-bold">LOGO NAME</h1>
                <div className="w-full mt-10 grid grid-cols-2 h-full">
                    <div className="bg-slate-100 mx-4 rounded-lg text-center drop-shadow-md hover:bg-slate-200
                    cursor-pointer" onClick={()=>{navigate("/generator")}}>
                        <h2 className="mt-8 text-xl font-bold tracking-wider">
                            Build a Furniture with prompts
                        </h2>
                        <img src={service1Image} className="px-10 py-2"/>
                        <p className="">
                            Create persolized furnitures with prompt
                        </p>
                    </div>
                    <div className="bg-slate-100 mx-4 rounded-lg text-center drop-shadow-md hover:bg-slate-200
                    cursor-pointer" onClick={()=>{navigate("/generator")}}>
                        <h2 className="mt-8 text-xl font-bold tracking-wider">
                            Build a Furniture with prompts
                        </h2>
                        <img src={service1Image} className="px-10 py-2"/>
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