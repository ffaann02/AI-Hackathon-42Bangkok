import React, { useState } from "react"

const Card = (props) => {

    const handleClick = () => {
        // Call the onClick function passed from the parent component
        if (props.onClick) {
            props.onClick(props.image_id, props.prompt, props.image_url, props.favorite); // Pass the id as an argument
        }
    };

    return (
        <>
            <div className="w-full col-span-3 p-4" >
                <div className="my-auto cursor-pointer" onClick={handleClick}>
                    <div className="relative max-w-sm rounded-md overflow-hidden bg-cover bg-no-repeat">
                        <img className="object-cover"
                            src={props.image_url}
                            alt={props.prompt} />
                        <div className="absolute bottom-0 left-0 right-0 top-0 h-full w-full overflow-hidden bg-black bg-fixed opacity-0 transition duration-300 ease-in-out hover:opacity-20"></div>
                    </div>
                </div>

            </div>
        </>
    )
}

export default Card;