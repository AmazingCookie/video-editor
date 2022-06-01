import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from 'react-redux'
import Timeline from './timeline/Timeline'
import Preview from "./Preview";
import { setClipCurrent } from "../slices";
import { _throw } from "./Debug";

const Workplace = () => {
    if (!'VideoEncoder' in window) {
        alert("webcodecs is not supported.")
    }

    const [initState, setInitState] = useState('init!!');
    const dispatch = useDispatch();
    let on = false;
    let index = 0;
    let prevFrameEnd = 0;
    let currentClipIndex = 0;

    let { clipList, current } = useSelector((state) => state.clip);

    let paused = true;
    const [frame, setFrame] = useState(null);

    const pause = () => {
        console.log('The sequence is paused.');
        clipList[currentClipIndex].asset.setPause();
        paused = true;
    }
    const setNextClip = () => {
        console.log('next clip index: ' + currentClipIndex);
        currentClipIndex + 1 >= clipList.length && pause();
        currentClipIndex += 1;
        on = false;
        prevFrameEnd = index;
    }
    const drawCanva = async () => {
        const tempFrame = await getFrame();
        setFrame(tempFrame);
        dispatch(setClipCurrent({ current: index }));
    }
    const update = () => {
        console.log(index);
        if (index >= clipList[currentClipIndex].getClipEnd()) {
            console.log('clip index: ' + currentClipIndex);
            console.log('Reach the end of the clip;');
            setNextClip();
        }

        if (paused)
            return;

        drawCanva();
        requestAnimationFrame(update);
    }

    const start = () => {
        paused = false;
        update();
    }

    useEffect(() => {
        index = current;
        prevFrameEnd = index;
    }, [current]);

    const getFrame = async () => {
        const clip = clipList[currentClipIndex];

        if (!on) {
            on = true;
            await clip.asset.render(clip.startOffset + (index - clip.offset), clip.nbSamples - (index - clip.offset));
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
            <p onClick={e => setInitState('new state!!')}>{initState}</p>
            <div>
                <button onClick={start}> Start Recoreder</button>
                <button onClick={reset}> Replay Recoreder</button>
                <button onClick={pause}>Pause</button>
            </div>
            <Preview img={frame} />
            <p>Current is: {current}</p>
            <Timeline />
        </div>
    )

}
export default Workplace;