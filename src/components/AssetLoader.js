import React, { createRef, useEffect, useState } from 'react';
import { createFFmpeg, fetchFile } from '@ffmpeg/ffmpeg';
import { useDispatch, useSelector } from 'react-redux';
import { addAsset, addClip } from '../slices';
import Workplace from './Workplace';
import AssetCard from './AssetCard';

// show logs in the console
const ffmpeg = createFFmpeg({ log: true });

const AssetLoader = () => {
    const dispatch = useDispatch();
    let { assetList } = useSelector((state) => state.asset);

    const [ready, setReady] = useState(false);
    const [startOffset, setStartOffset] = useState(0);
    const [nbSamples, setNbSamples] = useState(0);
    const [offset, setOffset] = useState(0);

    // useEffect(() => {
    //     //init ffmpegInit
    //     initffmpeg();
    // }, [])

    // const initffmpeg = () => {
    //     const load = async () => {
    //         ffmpeg.isLoaded() || await ffmpeg.load();
    //         setReady(true);
    //     }

    //     load();
    // }
    
    const handleUploadAsset = (e) => {
        const file = e.target.files?.item(0);
        const src = URL.createObjectURL(file);

        dispatch(addAsset({
            name: file.name, 
            src: src
        }))

    }
    const convertToSequence =  (e, assetName) => {
        console.log(assetList);
        const asset = assetList.filter((asset) => asset.name === assetName)[0];
        // ffmpeg.FS('writeFile', 'input.mp4', await fetchFile(tempFile.src));
        // await ffmpeg.run('-i', 'input.mp4', '-t', '5', 'out.mp4')
        // const data = ffmpeg.FS('readFile', 'out.mp4');
        // const result = URL.createObjectURL(new Blob([data.buffer], { type: 'video/mp4' }))
        // frameStart, frameEnd, offset
        dispatch(addClip({
            asset,
            startOffset: Number(startOffset),
            nbSamples: Number(nbSamples),
            offset: Number(offset)
        }))
    
    }

    return (
        <div>
            {ready ? <p>Load successfully</p> : <p>Loading...</p>}
            {/* {assetFile && <video
                controls
                width="250"
                src={URL.createObjectURL(assetFile)}>
            </video>} */}
            <input type='file' onChange={handleUploadAsset} accept="video/*"></input>
            {/* <button onClick={this.convertToSequence}>convert</button> */}
            <div>
                {assetList && assetList.map((asset) => (
                    <div key={asset.name}>
                        <AssetCard asset={asset}/>
                        {asset.name}
                        <input type='number' name='start' value={startOffset} onChange={e => setStartOffset(e.target.value)}/>
                        <input type='number' name='end' value={nbSamples} onChange={e => setNbSamples(e.target.value)}/>
                        <input type='number' name='offset' value={offset} onChange={e => setOffset(e.target.value)}/>
                        <button onClick={(e) => convertToSequence(e, asset.name)}>Add to clip</button>
                    </div>
                ))}
            </div>
            {<Workplace />}

        </div>
    )

}

export default AssetLoader;