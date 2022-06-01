import { createRoot } from 'react-dom/client'
import { React, useState, useRef, useEffect } from "react";
import { Canvas, useFrame } from '@react-three/fiber';

/** 
 * 
 * @props {} img 
*/
export default (props) => {
    const canvasRef = useRef(null);

    useEffect(() => {
        let ctx, canvas;
        if (!ctx) {
            canvas = canvasRef.current;
            ctx = canvas.getContext('2d');
        }

        props.img && ctx.drawImage(props.img, 0, 0, canvas.width, canvas.height);
        
    }, [props.img])
    
    return (
        <div className="preview">
            <canvas className='preview__canvas' ref={canvasRef}/>
        </div>
    )
}