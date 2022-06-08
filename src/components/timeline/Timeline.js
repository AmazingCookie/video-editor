import React, { useRef, useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import Channel from "./Channel";
import Ruler from "./Ruler";
import { addClip, splitClip } from "../../slices";
import { ItemTypes } from '../Constants';
import { useDrop } from 'react-dnd';
import { ImPageBreak } from "react-icons/im";

/**
 * 
 * @param {object} config
 * @param {number} config.scaleRatio scalling ratio for responsive design
 * @param {number} config.scale scale size (px)
 * @param {number} config.scaleTime time represented for one scale (frame)
 * @param {number} config.nbSamples total length of video sequences (frame)
 * @param {number} config.fps 
 * 
 */
export default (props) => {


    const [zoom, setZoom] = useState(5);        // sequence slider
    const [config, setConfig] = useState({});   // configuration

    const divRef = useRef();
    const dispatch = useDispatch();
    let { clipList, nChannels, nbSamples, fps } = useSelector((state) => state.clip);

    const [{ isOver }, channelRef] = useDrop(() => ({
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

    const addToClip = async (asset) => {
        // ffmpeg.FS('writeFile', 'input.mp4', await fetchFile(tempFile.src));
        // await ffmpeg.run('-i', 'input.mp4', '-t', '5', 'out.mp4')
        // const data = ffmpeg.FS('readFile', 'out.mp4');
        // const result = URL.createObjectURL(new Blob([data.buffer], { type: 'video/mp4' }))
        // frameStart, frameEnd, offset
       

        console.log(asset.name);

        const posterSrc = await asset.getPosterSrc(0);
        dispatch(addClip({
            asset: asset,
            startOffset: 0,
            nbSamples: asset.samples.length,
            posterSrc
        }))
    }


    const handleSplit = async (e) => {

        console.log(props.current);
        const clipIndex = clipList.findIndex(clip => clip.offset + clip.nbSamples > props.current &&
            clip.offset < props.current);

        if (clipIndex === -1) {
            console.log('Invalid action: split');
            return;
        }
        
        const offset_second = props.current;
        const { offset, startOffset, nbSamples, asset } = clipList[clipIndex];
        const nbSample_first = offset_second - offset;
        const nbSample_second = nbSamples - nbSample_first;
        const startOffset_second = startOffset + nbSample_first;
        const posterSrc_second = await asset.getPosterSrc(startOffset_second);

        dispatch(splitClip({
            clipIndex,
            offset_second,
            nbSample_first,
            nbSample_second,
            startOffset_second,
            posterSrc_second
        }))
    }

    useEffect(() => setConfig(genConfig()), [zoom, clipList])

    return (
        <div className="timeline" >
            <div className="timeline__zoom">
                <input className="timeline__zoom__slider"
                    type="range"
                    min="1"
                    max="10"
                    value={zoom}
                    onChange={e => setZoom(e.target.value)} />
            </div>
            <div className="timeline__tools">
                <button className="timeline__tools_delete" onClick={handleSplit}><ImPageBreak /></button>
            </div>
            <div className="timeline__container" ref={divRef}>
                <Ruler config={config} current={props.current} _setCurrentFrame={props._setCurrentFrame}  />
                <div className="timeline__channls" ref={channelRef}>
                    {
                        [...Array(nChannels)].map((value, index) => (
                            <Channel
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