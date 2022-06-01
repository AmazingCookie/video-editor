import React, { useRef, useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import Channel from "./Channel";
import Ruler from "./Ruler";
import { setClipCurrent, addClip} from "../../slices";
import { ItemTypes } from '../Constants';
import { useDrop } from 'react-dnd';

/**
 * @param {object} config
 * @param {number} config.scaleRatio scalling ratio for responsive design
 * @param {number} config.scale scale size (px)
 * @param {number} config.scaleTime time represented for one scale (frame)
 * @param {number} config.nbSamples total length of video sequences (frame)
 * @param {number} config.fps 
 */
export default (props) => {


    const [zoom, setZoom] = useState(5);        // sequence slider
    const [config, setConfig] = useState({});   // configuration
    const [pointerX, setPointerX] = useState(0); // x of time pointer shown in sequence
    const divRef = useRef();

    const dispatch = useDispatch();
    let { clipList, nChannels, nbSamples, fps, current } = useSelector((state) => state.clip);

    const [{ isOver }, ref] = useDrop(() => ({
        accept: ItemTypes.ASSET,
        drop: monitor => addToClip(monitor.asset),
        collect: monitor => ({
            isOver: !!monitor.isOver(),
        }),
    }))

    const genConfig = () => {
        const $div = divRef.current;
        const width = $div.clientWidth;

        const defaultScale = 10;                // min scale for each grid (px)
        const defaultScaleTime = 600;           // min scale time (frames)             
        const minNbSamples = Math.floor(width / defaultScale * defaultScaleTime / zoom / zoom);

        const newConfig = {
            scaleRatio: 1,
            scale: defaultScale * zoom,
            scaleTime: defaultScaleTime / zoom,
            nbSamples: Math.max(nbSamples, minNbSamples),
            fps: fps
        }
        return newConfig;
    }

    const getClipsInChannel = (index) => (
        clipList.filter((clip) => (clip.channel === index))
    )

    // based on current frame
    const getPointerX = () => {
        const x = current / config.scaleTime * config.scale;
        return x;
    }

    const drawPointer = (ctx, height) => {
        const timePointerWidth = 3;
        const pointerColor = "#66ccff";

        ctx.beginPath();
        ctx.moveTo(pointerX, 0)
        ctx.lineTo(pointerX, height);

        ctx.strokeStyle = pointerColor;
        ctx.lineWidth = timePointerWidth;

        ctx.stroke();
    }

    const getMouseX = (event) => {
        const $div = divRef.current;
        const left = $div.getBoundingClientRect().x;
        return event.pageX + $div.scrollLeft - left;
    }


    const addToClip = (asset) => {
        console.log(asset);
        console.log('Current frame: === ' + current);
        // ffmpeg.FS('writeFile', 'input.mp4', await fetchFile(tempFile.src));
        // await ffmpeg.run('-i', 'input.mp4', '-t', '5', 'out.mp4')
        // const data = ffmpeg.FS('readFile', 'out.mp4');
        // const result = URL.createObjectURL(new Blob([data.buffer], { type: 'video/mp4' }))
        // frameStart, frameEnd, offset
        dispatch(addClip({
            asset: asset,
            startOffset: 0,
            nbSamples: asset.samples.length
        }))

    }

    const handleClick = (e) => {
        let newPointerX = getMouseX(e);
        setPointerX(newPointerX);

        const { nbSamples } = genConfig();
        const $div = divRef.current;
        const divWidth = $div.scrollWidth;
        // console.log('pointer x is: ' + newPointerX);
        // console.log('div width is: ' + divWidth);
        // console.log(`num sample is ${nbSamples}`)

        let currentFrame = Math.ceil(nbSamples * (newPointerX / divWidth));
        console.log(currentFrame);
        dispatch(setClipCurrent({
            current: currentFrame
        }));
    }

    const updatePointerX = () => {
        setConfig(genConfig());
        setPointerX(getPointerX());
    }

    useEffect(updatePointerX, [zoom, current])

    return (
        <div className="timeline" >
            This is the timeline.
            <div className="timeline__zoom">
                <input className="timeline__zoom__slider"
                    type="range"
                    min="1"
                    max="10"
                    value={zoom}
                    onChange={e => setZoom(e.target.value)} />
            </div>
            <div className="timeline__container" onClick={handleClick} ref={divRef}>
                <Ruler _drawPointer={drawPointer} pointerX={pointerX} config={config} />
                <div className="timeline__channls" ref={ref}>
                    {
                        [...Array(nChannels)].map((value, index) => (
                            <Channel
                                _drawPointer={drawPointer}
                                pointerX={pointerX}
                                index={index}
                                clips={getClipsInChannel(index)}
                                config={config}
                            />
                        ))
                    }
                </div>
            </div>
        </div>


    )
}