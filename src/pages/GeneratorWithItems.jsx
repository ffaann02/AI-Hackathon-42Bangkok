import React, { useState ,useEffect,useRef} from "react";
import { CiSearch } from "react-icons/ci";
import { BsFillCartFill } from "react-icons/bs";
import { FaRobot } from "react-icons/fa";
import furnitureData from "../components/products_data.json";

const GeneratorWithItems = () => {
  const [searchTitle, setSearchTitle] = useState("");
  const [cartItems, setCartItems] = useState([]);
  const [showCartModal, setShowCartModal] = useState(false);

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

  const handleGenerate = () => {
    console.log(cartItems)
    if (cartItems) {
      const combinedPrompt = cartItems.map((item) => `${item.amount} ${item.promt}`).join(', ');
      console.log(combinedPrompt)
      setPrompts(combinedPrompt);
    }
  }

  const filteredFurniture = furnitureData.filter((item) =>
    item.name.toLowerCase().includes(searchTitle.toLowerCase())
  );

  const cartTotal = cartItems.reduce((total, item) => total + item.amount, 0);
  const [prompts,setPrompts] = useState("");
  const modalRef = useRef();
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
    </div>
  );
};

export default GeneratorWithItems;
