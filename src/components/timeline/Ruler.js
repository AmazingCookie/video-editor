import React, { useEffect, useRef } from "react";

/**
 * @prop {object} config
 * @prop {number} config.scaleRatio scalling ratio for responsive design
 * @prop {number} config.scale scale size (px)
 * @prop {number} config.scaleTime time represented for one scale (frame)
 * @prop {number} config.nbSamples total length of video sequences (frame)
 * @prop {number} config.fps 
 * 
 * @prop {function} _drawPointer draw time pointer
 */

export default (props) => {
    const defaultHeight = 15;
    const defaultFontSize = defaultHeight * 0.5;
    const defaultLineWidth = 0.5;
    const font = 'Arial';
    const canvasRef = useRef(null);

    const generateTime = (current, fps) => {
        const hh = Math.floor(current / fps / 3600).toString().padStart(2, '0');
        const mm = Math.floor(current / fps / 60 % 60).toString().padStart(2, '0');
        const ss = Math.floor(current / fps % 60).toString().padStart(2, '0');

        return `${hh}:${mm}:${ss}`;
    }

    const drawRuler = () => {
        const { scaleRatio, scale, scaleTime, nbSamples, fps } = props.config;

        const $rulerCanvas = canvasRef.current;
        const ctx = $rulerCanvas.getContext('2d');

        const fontSize = defaultFontSize * scaleRatio;
        const width = Math.ceil(nbSamples / scaleTime) * scale;

        $rulerCanvas.height = Math.ceil(defaultHeight * scaleRatio);
        $rulerCanvas.width = Math.ceil(width * scaleRatio);

        for (let i = 0; i < Math.ceil(nbSamples / scaleTime); i++) {
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

        props._drawPointer(ctx, $rulerCanvas.height);
    }

    useEffect(() => {
        drawRuler();
    }, [props])

    return (
        <canvas className="timeline__container__ruler" ref={canvasRef}/>
    )
}