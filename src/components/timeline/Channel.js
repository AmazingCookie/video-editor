import React, { useEffect, useRef, useState } from "react";
import { Clip } from "../../models";
import ClipCard from "./ClipCard";

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

 */
export default (props) => {
    const { scaleRatio, scale, scaleTime, nbSamples } = props.config;

    const defaultHeight = 110;
    const defaultWidth = Math.ceil(nbSamples / scaleTime) * scale;

    const [height, setHeight] = useState(Math.ceil(defaultHeight * scaleRatio));
    const [width, setWidth] = useState(Math.ceil(defaultWidth * scaleRatio));

    // let height = Math.ceil(defaultHeight * scaleRatio);
    // let width = Math.ceil(defaultWidth * scaleRatio);

    useEffect(() => {
        // console.log('regenerate!!');
        // console.log(`Before: h: ${height}, w: ${width}`);

        const newWdith = Math.ceil(nbSamples / scaleTime) * scale;
        setHeight(Math.ceil(defaultHeight * scaleRatio));
        setWidth(Math.ceil(newWdith * scaleRatio));
    }, [props.config])


    return (
        <div className="timeline__container__channels__channl" style={{
            height: height,
            width: width
        }}>
            {
                props.clips.map(clip => {
                    const x = clip.offset / scaleTime * scale;
                    const y = 0;
                    const h = height;
                    const w = clip.nbSamples / scaleTime * scale;
                    return <ClipCard clip={clip} x={x} y={y} h={h} w={w} />
                })
            }
        </div>

    )
}