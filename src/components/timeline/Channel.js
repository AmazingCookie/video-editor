import React, { useEffect, useRef } from "react";

/**
 * @prop {number} index the index of this channel
 * @prop {array} clips all clips in this channel
 * 
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
    const { scaleRatio, scale, scaleTime, nbSamples } = props.config;
    
    const defaultHeight = 40;
    const defaultWidth = Math.ceil(nbSamples / scaleTime) * scale;
    const canvasRef = useRef(null);

    const drawClip = () => {
        let $channelCanvas = canvasRef.current;
        const ctx = $channelCanvas.getContext('2d');

        $channelCanvas.height = Math.ceil(defaultHeight * scaleRatio);
        $channelCanvas.width = Math.ceil(defaultWidth * scaleRatio);

        props.clips.forEach(clip => {
            const x = clip.offset/ scaleTime * scale;
            const y = 0;
            const h = $channelCanvas.height;
            const w = clip.nbSamples / scaleTime * scale;
            ctx.fillStyle = 'red';
            ctx.fillRect(x, y, w, h);
            console.log(`${x} ${y} ${h} ${w}`);
        });

        props._drawPointer(ctx, $channelCanvas.height);
    }

    useEffect(() => {
        drawClip();
    }, [props])

    return (
        <canvas className="timeline__container__channel" ref={canvasRef}/>
    )
}