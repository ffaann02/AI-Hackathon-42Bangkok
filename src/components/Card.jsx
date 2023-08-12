import React, { useState } from "react"

const Card = (props) => {
    const handleClick = () => {
        // Call the onClick function passed from the parent component
        if (props.onClick) {
            props.onClick(props.id, props.meta.prompt, props.output); // Pass the id as an argument
        }
    };

    return (
        <>
            <div className="w-full h-fit pb-12 my-auto flex relative" >
                <div className="ml-12 mt-8 my-auto cursor-pointer" onClick={handleClick}>
                    <p className="text-black text-lg">Date</p>
                    <div className="relative max-w-sm rounded-xl overflow-hidden bg-cover bg-no-repeat">
                        <img className="object-cover h-48 w-96"
                            src={props.output}
                            alt="Sunset in the mountains" />
                        <div className="absolute bottom-0 left-0 right-0 top-0 h-full w-full overflow-hidden bg-black bg-fixed opacity-0 transition duration-300 ease-in-out hover:opacity-20"></div>
                    </div>
                </div>

            </div>
        </>
    )
}

export default Card;