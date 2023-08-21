import { useNavigate } from "react-router-dom";
import service1Image from "/images/robot-cover-login.png";
import axios from "axios";
import banner from "/images/banner.webp"

const Home = () => {
    const navigate = useNavigate();

    return (
        <div className="w-full h-full grid place-items-center">
            <div className="max-w-4xl w-full h-full pt-10">
                {/* <h1 className="text-center text-2xl font-bold">LOGO NAME</h1> */}
                <div className="w-full mt-16 grid grid-cols-6 h-full">
                    <div className="col-span-3">
                        <h1 className="text-5xl font-bold tracking-wide mt-10">Let's build your dream furniture with our AI-Driven Platform.</h1>
                        <p className="text-lg my-2">We have an excellent aritificial inteligence to create furniture images from your need</p>
                        <button className="text-black mt-3 bg-project-orange-1 hover:bg-project-orange px-4 py-2 text-xl rounded-xl font-bold"
                        onClick={()=>{navigate("/generator/draw")}}>
                            Check it out
                        </button>
                    </div>
                    <div className="col-span-3">
                        <img src={banner} className="w-full h-full ml-20"/>
                    </div>
                </div>
            </div>
        </div>

    )
}
export default Home