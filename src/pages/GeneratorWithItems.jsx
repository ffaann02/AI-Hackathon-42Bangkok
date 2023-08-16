import { useState } from "react";
import { CiSearch } from "react-icons/ci"
import { BsFillCartFill } from "react-icons/bs"
import {FaRobot} from "react-icons/fa"
import furniture01 from "/images/furniture01.jpeg"
const GeneratorWithItems = () => {
    const [searchTitle, setSearchTitle] = useState("");
    return (
        <div className="w-full max-w-5xl h-full mx-auto">
            <div className="w-full mt-14">
                <div className="grid grid-cols-12">
                    <div className='flex p-2 rounded-xl bg-gray-100  col-span-9 border-[1px] w-full'>
                        <CiSearch className="text-xl my-auto" />
                        <input
                            className="w-full border-none bg-transparent outline-none font-ibm-thai text-gray-600 px-2 py-1"
                            placeholder="Find your dream furnitures here and bring it to AI."
                            onChange={(event) => setSearchTitle(event.target.value)}
                            onKeyDown={(event) => {
                                if (event.key === 'Enter') {
                                    // handleSearch();
                                }
                            }} />
                    </div>
                    <div className="col-span-3 flex">
                        <div className="my-auto p-2.5 bg-gray-100 border-[1px] rounded-xl ml-auto relative">
                            <BsFillCartFill className="text-3xl"/>
                            <p className="absolute bg-red-400 w-5 h-5 text-center top-0.5 right-0.5 flex rounded-full">
                                <a className="font-bold text-white text-sm mx-auto">1</a>
                            </p>
                        </div>
                        <button className="flex bg-project-orange rounded-xl px-4 text-lg font-medium ml-2 text-white tracking-wider">
                            <FaRobot className="my-auto text-xl mr-2"/><p className="my-auto text-md mt-[0.8rem]">Generate Now</p>
                        </button>
                    </div>
                </div>
                <div className="w-full grid grid-cols-12 mt-6">
                    <div className="col-span-3 p-2">
                        <img src={furniture01} />
                    </div>
                    <div className="col-span-3 p-2">
                        <img src={furniture01} />
                    </div>
                    <div className="col-span-3 p-2">
                        <img src={furniture01} />
                    </div>
                    <div className="col-span-3 p-2">
                        <img src={furniture01} />
                    </div>
                    <div className="col-span-3 p-2">
                        <img src={furniture01} />
                    </div>
                    <div className="col-span-3 p-2">
                        <img src={furniture01} />
                    </div>
                    <div className="col-span-3 p-2">
                        <img src={furniture01} />
                    </div>
                </div>
            </div>
        </div>
    )
}
export default GeneratorWithItems