import React, { createRef, useState } from "react";
import { useSelector } from "react-redux";
import Timeline from './timeline/Timeline'
import Preview from "./Preview";
import { _throw } from "./Debug";
import { Decoder } from "../models";

const Workplace = () => {
    if (!'VideoEncoder' in window) {
        alert("webcodecs is not supported.")
    }

    let on = false;

    const [current, setCurrent] = useState(0);
    let index = 0;
    let prevFrameEnd = 0;
    let currentClipIndex = 0;

    let { clipList, nChannels, nbSamples, fps } = useSelector((state) => state.clip);

    let paused = true;
    const [frame, setFrame] = useState(null);

    const setPause = () => {
        console.log('The sequence is paused.');
        paused = true;
        console.log(clipList);
    }
    const setNextClip = () => {
        currentClipIndex += 1;
        console.log('next clip index: ' + currentClipIndex);
        currentClipIndex >= clipList.length && setPause();
        on = false;
        prevFrameEnd = index;
    }
    const drawCanva = async () => {
        ;
        const tempFrame = await (getFrame());
        setFrame(tempFrame);
        setCurrent(index);
    }
    const update = () => {
        if (index - prevFrameEnd >= clipList[currentClipIndex].nbSamples) {
            console.log('clip index: ' + currentClipIndex);
            console.log('Reach the end of the clip;');
            setNextClip();
        }

        if (paused)
            return;

        drawCanva();
        // const now = performance.now();
        // const elapsed = now - then;

        // if (elapsed > fpsInterval) {
        //     // not being a multiple of RAF's interval (16.7ms)
        //     then = now - (elapsed % fpsInterval);

        //     // load the next clip
        //     if (index - prevFrameEnd >= clipList[currentClipIndex].nbSamples) {
        //         console.log('clip index: ' + currentClipIndex);
        //         console.log('Reach the end of the clip;');
        //         setNextClip();
        //     }

        //     if (paused) return;
        //     drawCanva();
        //     index += 1;
        // }
        requestAnimationFrame(update);
    }
    const start = () => {
        paused = false;
        update();
    }


    const getFrame = async () => {
        // if (!decoder) {
        //     const clip = clipList[currentClipIndex];
        //     decoder = new Decoder();
        //     decoder.configure(clip.asset.info);
        //     decoder.setRange(clip.startOffset, clip.getClipNbSamples());
        //     const samples = clipList[currentClipIndex].asset.samples;
        //     samples.forEach(sample => {
        //         const type = sample.is_sync ? "key" : "delta";
        //         let chunk = new window.EncodedVideoChunk({
        //             type,
        //             data: sample.data,
        //             duration: sample.duration,
        //             timestamp: sample.cts
        //         })
        //         decoder.decode(chunk);
        //     })
        // }


        // const frame = await (decoder.getFrame());
        const clip = clipList[currentClipIndex];
        if (!on) {
            on = true;
            await clip.asset.render(clip.startOffset, clip.nbSamples);
        }
        const frame = clipList[currentClipIndex].asset.watch();
        index = prevFrameEnd + clip.asset.getCounter();
        return frame;

    }
    const reset = () => {
        index = 0;
        prevFrameEnd = 0;
        currentClipIndex = 0;
    }
    return (
        <div className="workplace">
            This is the workplace.
            <div>
                <button onClick={start}> Start Recoreder</button>
                <button onClick={reset}> Replay Recoreder</button>
            </div>
            <Preview img={frame} />
            <p>Current is: {current}</p>
            <Timeline current={current} clipList={clipList} nbSamples={nbSamples} nChannels={nChannels} fps={fps} />
        </div>
    )

}
export default Workplace;