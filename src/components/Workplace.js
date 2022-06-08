import React, { useRef, useEffect, useState } from "react";
import { useDispatch, useSelector } from 'react-redux';
import Timeline from './timeline/Timeline';
import { _throw } from "./Debug";
import { ImPlay3, ImPause2, ImStop2 } from "react-icons/im";


const Workplace = () => {
    if (!'VideoEncoder' in window) {
        alert("webcodecs is not supported.")
    }

    const frameByFrame = 'FRAME_BY_FRAME';
    const oneFrame = 'ONE_FRAME';

    const canvasRef = useRef(null);

    let index = 0;
    let clipIndex = 0;

    let { clipList, fps } = useSelector((state) => state.clip);
    const [current, setCurrent] = useState(index);
    const fpsInterval = 1000 / fps;

    let frame = null;

    const setPause = () => {
        console.log('The sequence is paused.');
        clipList.forEach((clip) => clip.asset.setPause());
        log('HandlePause');
    }

    const drawCanva = () => {
        setCurrent(index);
        frame = clipList[clipIndex]?.asset.watch();

        const $canvas = canvasRef.current;
        $canvas.width = Math.floor(window.innerWidth * 0.7);
        $canvas.height = Math.floor(window.innerHeight / 2);
        const ctx = $canvas.getContext('2d');
        ctx.fillRect(0, 0, $canvas.width, $canvas.height);

        if (frame) {
            let hRatio = $canvas.width / frame.videoWidth;
            let vRatio = $canvas.height / frame.videoHeight;
            let ratio = Math.min(hRatio, vRatio);

            let centerShift_x = ($canvas.width - frame.videoWidth * ratio) / 2;
            let centerShift_y = ($canvas.height - frame.videoHeight * ratio) / 2;

            // document.body.append(frame);
            ctx.drawImage(frame, 0, 0,
                frame.videoWidth, frame.videoHeight,
                centerShift_x, centerShift_y,
                frame.videoWidth * ratio, frame.videoHeight * ratio);
        }
    }
    const update = async () => {
        if (index >= clipList[clipIndex].getClipEnd()) {
            setPause();
            clipIndex += 1;
            clipList[clipIndex] && await renderClip(frameByFrame);
        }

        if (!clipList[clipIndex] || clipList[clipIndex].asset.isPaused())
            return;

        drawCanva();
        index++;
        setTimeout(update, fpsInterval);
    }


    const setCurrentFrame = async (givenFrame) => {
        setCurrent(givenFrame);
        index = givenFrame;
        while (index >= clipList[clipIndex]?.getClipEnd()) {
            clipIndex += 1;
        }
        clipList[clipIndex] && await renderClip(oneFrame);
        drawCanva();
    }

    const log = (functionName) => {
        console.log(`
            In ${functionName},
            current index is ${index},
            current current is ${current}`);
    }

    useEffect(() => {
        index = current;
    }, [current]);

    useEffect(() => {
        setPause();
    }, [clipList]);

    useEffect(() => {
        const $canvas = canvasRef.current;
        $canvas.width = Math.floor(window.innerWidth * 0.7);
        $canvas.height = Math.floor(window.innerHeight / 2);
        const ctx = $canvas.getContext('2d');
        ctx.fillRect(0, 0, $canvas.width, $canvas.height);
    }, [])

    // useEffect(() => {
    //     console.log('load');
    //     clipList.forEach((clip) => {
    //         const decoder = new Decoder(frameContainerElement.current);
    //         decoder.configure(clip.asset.info);
    //         for (let sample of clip.asset.samples) {
    //             const type = sample.is_sync ? "key" : "delta";
    //             let chunk = new window.EncodedVideoChunk({
    //                 type,
    //                 data: sample.data,
    //                 duration: sample.duration,
    //                 timestamp: sample.cts
    //             })
    //             decoder.decode(chunk);
    //         }
    //     });

    // }, [clipList])

    const renderClip = async (mode) => {
        const clip = clipList[clipIndex];
        await clip?.asset.render(clip.startOffset + (index - clip.offset), mode);
    }

    const handleReset = () => {
        setCurrent(0);
        index = 0;
        clipIndex = 0;
    }

    const handleStart = async () => {
        await renderClip(frameByFrame);
        update();
    }

    const generateTime = (current, fps) => {
        const hh = Math.floor(current / fps / 3600).toString().padStart(2, '0');
        const mm = Math.floor(current / fps / 60 % 60).toString().padStart(2, '0');
        const ss = Math.floor(current / fps % 60).toString().padStart(2, '0');

        return `${hh}:${mm}:${ss}`;
    }

    return (
        <div className="workplace">
            <div className="workplace__preview">
                <div className="workplace__preview__toolbar">
                    <button onClick={handleStart}>
                        <ImPlay3 />
                    </button>
                    <button onClick={handleReset}>
                        <ImStop2 />
                    </button>
                    <button onClick={setPause}>
                        <ImPause2 />
                    </button>
                </div>
                <canvas className='workplace__preview__canvas' ref={canvasRef} />
                <div className="workplace__preview__timestamp">
                    <p>{generateTime(current, fps)}</p>
                </div>
            </div>

            <Timeline current={current} _setCurrentFrame={setCurrentFrame} />
        </div>
    )

}
export default Workplace;