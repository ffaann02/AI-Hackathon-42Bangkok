import React, {useRef} from "react";
import ReactDOM from "react-dom";
import CanvasDraw from "react-canvas-draw";
import Replicate from "replicate";
import axios from "axios";

const GeneratorWithDraw = () => {

    const canvasRef = useRef(null);

    const saveButton = () => {
        const data_URL = canvasRef.current.getDataURL('image/png');
        console.log(data_URL);
        console.log(canvasRef.current);
    }
    
    const onDrawing = (event) => {
        // console.log(event);
    }

    return(
        <div className="w-full h-full mx-auto bg-gray-300">
            <CanvasDraw 
                ref={canvasRef} onChange={(e) => {onDrawing(e)}}
                brushColor="#000000"
                brushRadius={2}
            />
            <button onClick={saveButton}>Save</button>
        </div>
    )
}

export default GeneratorWithDraw