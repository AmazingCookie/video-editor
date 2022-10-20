import React, { useRef, useEffect, useState, useLayoutEffect } from "react";
import { useDispatch, useSelector } from 'react-redux';
import Timeline from './timeline/Timeline';
import { _throw } from "./Debug";
import { ImPlay3, ImPause2, ImStop2, ImEnlarge, ImShrink } from "react-icons/im";


const Workplace = () => {
    if (!'VideoEncoder' in window) {
        alert("webcodecs is not supported.")
    }

    const frameByFrame = 'FRAME_BY_FRAME';
    const oneFrame = 'ONE_FRAME';

    const canvasRef = useRef(null);
    const containerRef = useRef(null);

    let index = 0;
    let clipIndex = 0;

    let { clipList, nbSamples, fps } = useSelector((state) => state.clip);
    const [current, setCurrent] = useState(index);
    const [fullScreen, setFullScreen] = useState(false);
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

    const resetCanvasSize = () => {
        const $canvas = canvasRef.current;
        const $container = containerRef.current;
        $canvas.height = $container.clientHeight;
        $canvas.width = $container.clientWidth;
        const ctx = $canvas.getContext('2d');
        ctx.fillRect(0, 0, $canvas.width, $canvas.height);
    }

    useEffect(() => {
        index = current;
    }, [current]);

    useEffect(() => {
        setPause();
    }, [clipList]);

    useEffect(() => {
        window.addEventListener("resize", resetCanvasSize);
        resetCanvasSize();
        return () => {
            setPause();
            window.removeEventListener("resize", resetCanvasSize);
        }
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
        await clip?.asset.render(clip.startOffset + (index - clip.offset), mode, clip.volume);
    }

    const handleReset = () => {
        if (!clipList[clipIndex]?.asset.isPaused())
            setPause();

        setCurrent(0);
        index = 0;
        clipIndex = 0;
    }

    const handleStart = async () => {
        if (!clipList[clipIndex]?.asset.isPaused())
            setPause();
        else {
            await renderClip(frameByFrame);
            update();
        }
    }

    // const handleFullScreen = () => {
    //     setFullScreen(!fullScreen);
    // }

    const generateTime = (current, fps) => {
        const hh = Math.floor(current / fps / 3600).toString().padStart(2, '0');
        const mm = Math.floor(current / fps / 60 % 60).toString().padStart(2, '0');
        const ss = Math.floor(current / fps % 60).toString().padStart(2, '0');

        return `${hh}:${mm}:${ss}`;
    }

    return (
        <div className="workplace">
            <div className="workplace__preview">
                <h1 className="workplace__preview__title">Preview</h1>
                <div className="workplace__preview__container" ref={containerRef}><canvas width={4000} height={4000} ref={canvasRef} /></div>
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
                <div className="workplace__preview__timestamp">
                    <p>{generateTime(current, fps)} / {generateTime(nbSamples, fps)}</p>
                </div>
            </div>

            <Timeline current={current} _setCurrentFrame={setCurrentFrame} />
        </div>
    )

}
export default Workplace;