import React, { useState, useEffect, useRef } from "react";
import { CiSearch } from "react-icons/ci";
import { BsFillCartFill } from "react-icons/bs";
import { FaRobot } from "react-icons/fa";
import furnitureData from "../components/products_data.json";
import { useUser } from "../UserContext";
import axios from "axios";
import botWaiting from "/images/waiting-bot.gif"
const GeneratorWithItems = () => {
  const [searchTitle, setSearchTitle] = useState("");
  const [cartItems, setCartItems] = useState([]);
  const [showCartModal, setShowCartModal] = useState(false);

  const [prompts, setPrompts] = useState("");
  const [openResultModal, setOpenResultModal] = useState(false);
  const [progress, setProgress] = useState(null);
  const [result, setResult] = useState(null);
  const modalRef = useRef();
  const modalResultRef = useRef();
  const { user } = useUser();


  const handleAddToCart = (item) => {
    const updatedCart = cartItems.map((cartItem) =>
      cartItem.id === item.id ? { ...cartItem, amount: cartItem.amount + 1 } : cartItem
    );
    if (!cartItems.some((cartItem) => cartItem.id === item.id)) {
      updatedCart.push({ ...item, amount: 1 });
    }
    setCartItems(updatedCart);
  };

  const handleRemoveFromCart = (itemId) => {
    const updatedCart = cartItems.map((cartItem) =>
      cartItem.id === itemId ? { ...cartItem, amount: cartItem.amount - 1 } : cartItem
    );
    setCartItems(updatedCart.filter((item) => item.amount > 0));
  };

  const handleToggleCartModal = () => {
    setShowCartModal(!showCartModal);
  };

  const handleGenerate = async () => {
    console.log(cartItems)
    setOpenResultModal(true)
    setProgress(true);
    if (cartItems) {
      const combinedPrompt = cartItems.map((item) => `${item.amount} ${item.promt}`).join(', ');
      console.log(combinedPrompt);
      setPrompts(combinedPrompt);

      const furniture_positive_prompt_template = "A photo of a room decoration, Realistic, Possible to craft, "
      const finished_prompt = furniture_positive_prompt_template + combinedPrompt
      console.log(finished_prompt);

      const apiUrl = 'https://stablediffusionapi.com/api/v3/text2img';
      const requestData = {
        "key": import.meta.env.VITE_STABLE_DIFFUSION_API_KEY,
        "prompt": finished_prompt,
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
        const response = await axios.post(apiUrl, requestData);
        console.log(response);
        console.log('API Response:', response.data);
        setResult(response.data)
        setProgress(false);
        // Post to database
        if (response) {
          axios.post("http://localhost:3200/generator", {
            owner_id: user.uid,
            owner_display_name: user.displayName,
            owner_profile_image: user.photoURL,
            image_id: response.data.id,
            image_url: response.data.output[0],
            prompt: combinedPrompt,
            height: response.data.meta.H,
            width: response.data.meta.W,
            privacy: "Private",
            favorite: "false"
          })
        }
      }
      catch (error) {
        console.error('API Request Error:', error);
      }

    }
  }

  const filteredFurniture = furnitureData.filter((item) =>
    item.name.toLowerCase().includes(searchTitle.toLowerCase())
  );

  const cartTotal = cartItems.reduce((total, item) => total + item.amount, 0);
  useEffect(() => {
    let handler = (e) => {
      if (modalRef.current) { // To check that ref was not undefined
        if (!modalRef.current.contains(e.target)) {
          setShowCartModal(false);
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
      if (modalResultRef.current) { // To check that ref was not undefined
        if (!modalResultRef.current.contains(e.target)) {
          setOpenResultModal(false);
        }
      }
    };
    document.addEventListener("mousedown", handler);
    return () => {
      document.removeEventListener("mousedown", handler);
    }
  });
  return (
    <div className="w-full max-w-5xl h-full mx-auto">
      <div className="w-full mt-10">
        <div className="grid grid-cols-12 sticky top-20 drop-shadow-lg">
          <div className='flex p-2 rounded-xl bg-gray-100 col-span-9 border-[1px] w-full sticky'>
            <CiSearch className="text-xl my-auto" />
            <input
              className="w-full border-none bg-transparent outline-none font-ibm-thai text-gray-600 px-2 py-1"
              placeholder="Find your dream furnitures here and bring it to AI."
              value={searchTitle}
              onChange={(event) => setSearchTitle(event.target.value)}
              onKeyDown={(event) => {
                if (event.key === 'Enter') {
                  // handleSearch();
                }
              }}
            />
          </div>
          <div className="col-span-3 flex">
            <div
              className="my-auto p-2.5 bg-gray-100 border-[1px] rounded-xl ml-auto relative cursor-pointer"
              onClick={handleToggleCartModal}
            >
              <BsFillCartFill className="text-3xl" />
              {cartTotal > -1 && (
                <p className="absolute bg-red-400 w-5 h-5 text-center top-0.5 right-0.5 flex rounded-full">
                  <a className="font-bold text-white text-sm mx-auto">{cartTotal}</a>
                </p>
              )}
            </div>
            <button className="flex bg-project-orange hover:bg-project-orange-1 rounded-xl px-4 text-lg font-medium ml-2 text-white tracking-wider">
              <FaRobot className="my-auto text-xl mr-2" />
              <p className="my-auto text-md mt-[0.8rem]" onClick={handleGenerate}>Generate Now</p>
            </button>
          </div>
        </div>
        <div className="w-full grid grid-cols-12 mt-6 gap-4">
          {filteredFurniture.map((item) => (
            <div key={item.id} className="col-span-3">
              <div className="w-full h-full flex flex-col justify-between rounded-lg border-2 hover:border-slate-300 hover:border-4">
                <img
                  src={item.link}
                  alt={item.name}
                  className="rounded-t-lg"
                />
                <div className="p-4">
                  <h3 className="text-gray-800 font-semibold">{item.name}</h3>
                  <p className="text-gray-600">Price: {item.price}</p>
                  <button
                    className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-full mt-2"
                    onClick={() => handleAddToCart(item)}
                  >
                    Add to Cart
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
      {showCartModal && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
          <div className="bg-white p-4 rounded-md w-full max-w-3xl min-h-20 h-full overflow-y-auto py-20" ref={modalRef}>
            <h2 className="text-lg font-semibold mb-2 mt-1">Your Cart</h2>
            {cartTotal <= 0 &&
              <p className="text-center mt-2">Your cart is empty.</p>}
            {cartItems.map((item) => (
              <div key={item.id} className="flex justify-between items-center mb-2 border-[1px] p-4 rounded-lg">
                <div className="flex items-center">
                  <div>
                    <p className="flex-grow">{item.name}</p>
                    <img src={item.link} className="w-24 h-24 border-2 mt-1" alt={item.name} />
                  </div>

                </div>
                <div className="mt-8">
                  <p className="font-bold text-2xl text-center ml-4">{item.amount}</p>
                  <div className="flex items-center ml-4 mt-4">
                    <button
                      className="bg-blue-500 hover:bg-blue-600 text-white px-2 py-0.5 rounded-md mr-2"
                      onClick={() => handleAddToCart(item)}
                    >
                      +
                    </button>
                    <button
                      className="bg-red-500 hover:bg-red-600 text-white px-2 py-0.5 rounded-md"
                      onClick={() => handleRemoveFromCart(item.id)}
                    >
                      -
                    </button>
                  </div>
                </div>
              </div>
            ))}
            <button
              className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-md mt-4"
              onClick={handleToggleCartModal}
            >
              Close
            </button>
          </div>
        </div>
      )}
      {openResultModal === true && progress !== null && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
          <div className="relative bg-white p-4 rounded-md w-full max-w-3xl min-h-20 h-full overflow-y-auto py-20">
            {result === null && progress === false && <img src={botWaiting} />}
            {result === null && progress === false && <div className="w-full absolute right-0 text-center mt-4">
              <p className="font-bold text-xl tracking-wider text-slate-600">
                Generating Room Decoration with items<span id="dot-animation"></span>
              </p>
            </div>}
            {result &&
              <div>
                <p className="text-xl text-center mb-4 font-bold">Result:</p>
                <img className="mx-auto"
                  src={result.output[0]} />
                <button
                  className="bg-blue-500 hover:bg-blue-600 text-white 
              px-4 py-2 rounded-md mt-4 justify-center
              mx-auto flex"
                  onClick={() => {
                    setOpenResultModal(false);
                    setResult(null);
                    setProgress(null)
                  }}
                >
                  Generate Another Image
                </button>
              </div>}
          </div>
        </div>
      )}
    </div>
  );
};

export default GeneratorWithItems;
