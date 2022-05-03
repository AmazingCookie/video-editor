import React, { useState, useEffect } from 'react';
import { createFFmpeg, fetchFile } from '@ffmpeg/ffmpeg'

// show logs in the console
const ffmpeg = createFFmpeg({ log: true });

const FFmpegLoader = () => {
    // keep track of loading states
    const [ready, setReady] = useState(false);

    const load = async () => {
        await ffmpeg.load();
        setReady(true);
    }

    useEffect(() => {
        load();
    }, [])

    return ready ? (
        <VideoLoader />
    ) : (
        <p>Loading FFmpeg...</p>
    );

}


const VideoLoader = () => {
    const [video, setVideo] = useState(false);
    const [res, setRes] = useState(false);

    const handleChangeVideo = e => {
        const file = e.target.files?.item(0);
        file && setVideo(file);
    }

    const exporter = async () => {
        ffmpeg.FS('writeFile', 'input.mp4', await fetchFile(video));
        await ffmpeg.run('-i', 'input.mp4', '-t', '5', 'out.mp4')
        const data = ffmpeg.FS('readFile', 'out.mp4');
        const url = URL.createObjectURL(new Blob([data.buffer], { type: 'video/mp4' }))
        setRes(url);
    }

    return (
        <div>
            {video && <video
                controls
                width="250"
                src={URL.createObjectURL(video)}>
            </video>}
            <input type='file' onChange={handleChangeVideo} accept="video/*"></input>
            <button onClick={exporter}>convert</button>
            {res && <video
                controls
                width="250"
                src={res}>
            </video>}
        </div>
    )
}




export default FFmpegLoader;