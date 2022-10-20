import React, { useEffect, useRef } from "react";

/**
 * @prop {object} config
 * @prop {number} config.scaleRatio scalling ratio for responsive design
 * @prop {number} config.scale scale size (px)
 * @prop {number} config.scaleTime time represented for one scale (frame)
 * @prop {number} config.nbSamples total length of video sequences (frame)
 * @prop {number} config.fps 
 */

export default (props) => {
    const defaultHeight = 30;
    const defaultFontSize = defaultHeight * 0.5;
    const defaultLineWidth = 0.5;
    const font = 'Arial';
    const canvasRef = useRef(null);
    let $rulerCanvas = null;
    let ctx = null;

    const generateTime = (current, fps) => {
        const hh = Math.floor(current / fps / 3600).toString().padStart(2, '0');
        const mm = Math.floor(current / fps / 60 % 60).toString().padStart(2, '0');
        const ss = Math.floor(current / fps % 60).toString().padStart(2, '0');

        return `${hh}:${mm}:${ss}`;
    }

    const drawRuler = () => {
        const { scaleRatio, scale, scaleTime, nbSamples, fps } = props.config;

        $rulerCanvas = canvasRef.current;
        ctx = $rulerCanvas.getContext('2d');

        const fontSize = defaultFontSize * scaleRatio;
        const width = Math.ceil(nbSamples / scaleTime) * scale;

        $rulerCanvas.height = Math.ceil(defaultHeight * scaleRatio);
        $rulerCanvas.width = Math.ceil(width * scaleRatio);

        for (let i = 0; i < Math.ceil(nbSamples / scaleTime); i++) {
            ctx.fillStyle = 'white';
            ctx.strokeStyle = 'white';
            ctx.beginPath();
            let lineWidth = defaultLineWidth * scaleRatio;

            if (i % 5 === 0) {
                lineWidth *= 3;
                ctx.font = `${fontSize}px ${font}`;
                ctx.fillText(generateTime(i * scaleTime, fps), i * scale, fontSize);
            }

            ctx.lineWidth = lineWidth;
            ctx.moveTo(i * scale + lineWidth, $rulerCanvas.height * 0.5)
            ctx.lineTo(i * scale + lineWidth, $rulerCanvas.height);
            ctx.stroke();
        }

        drawPointer();
    }

    const drawPointer = () => {
        if (!ctx) {
            $rulerCanvas = canvasRef.current;
            ctx = $rulerCanvas.getContext('2d')
        }

        const timePointerWidth = 3;
        const pointerColor = "white";

        ctx.beginPath();
        const pointerX = getPointerX();
        ctx.moveTo(pointerX, 0)
        ctx.lineTo(pointerX, $rulerCanvas.height);

        ctx.strokeStyle = pointerColor;
        ctx.lineWidth = timePointerWidth;

        ctx.stroke();
    }


    // based on current frame
    const getPointerX = () => {
        const x = props.current / props.config.scaleTime * props.config.scale;
        return x;
    }

    const getMouseX = (event) => {
        if (!ctx) {
            $rulerCanvas = canvasRef.current;
            ctx = $rulerCanvas.getContext('2d')
        }
        
        const left = $rulerCanvas.getBoundingClientRect().x;
        return event.pageX + $rulerCanvas.scrollLeft - left;
    }

    const handleClick = (event) => {
        let newPointerX = getMouseX(event);

        const { nbSamples } = props.config;
        if (!ctx) {
            $rulerCanvas = canvasRef.current;
            ctx = $rulerCanvas.getContext('2d')
        }
        const scrollWidth = $rulerCanvas.scrollWidth;
        console.log('pointer x is: ' + newPointerX);
        console.log('div width is: ' + scrollWidth);
        console.log(`num sample is ${nbSamples}`)

        let currentFrame = Math.ceil(nbSamples * (newPointerX / scrollWidth));
        console.log('current frame is: ' + currentFrame);
        props._setCurrentFrame(currentFrame);
        drawPointer();
    }


    useEffect(drawRuler, [props])

    return (
        <canvas className="timeline__container__ruler" 
        onClick={handleClick}
        ref={canvasRef} />
    )
}