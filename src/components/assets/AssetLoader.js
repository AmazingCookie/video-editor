import React, { useState, useEffect } from 'react';
import { createFFmpeg, fetchFile } from '@ffmpeg/ffmpeg';
import { useDispatch, useSelector } from 'react-redux';
import { ImBoxAdd } from "react-icons/im";

import { addAsset } from '../../slices';
import AssetCard from './AssetCard';

// show logs in the console
const ffmpeg = createFFmpeg({ log: true });

const AssetLoader = () => {
    const [ready, setReady] = useState(false);
    const dispatch = useDispatch();
    let { assetList } = useSelector((state) => state.asset);

    const convertVideo = async (file, src) => {
        const newName = `${file.name.slice(0, -4)}.mp4`;

        ffmpeg.FS('writeFile', file.name, await fetchFile(src));
        // ffmpeg.run(`-i`, `${file.name}`);
        await ffmpeg.run(`-i`, `${file.name}`, `-c`, `copy`, `output.mp4`);
        const data = ffmpeg.FS('readFile', `output.mp4`);

        if (data.buffer.byteLength === 0)
            return null;

        const newSrc = URL.createObjectURL(new Blob([data.buffer], { type: 'video/mp4' }))
        return newSrc;
    }

    const handleUploadAsset = async (event) => {
        event.preventDefault();
        const file = event.target.files?.item(0);
        event.target.value = "";


        for (let asset of assetList) {
            if (asset.name === file.name) {
                alert('The file has already been added. Try a different name.');
                return;
            }
        }

        const src = URL.createObjectURL(file);
        const videoUrl = file.name.slice(-3) === 'mp4' ?
            src : await convertVideo(file, src);

        if (videoUrl === null) {
            alert('The selected format is not supported, try another one.');
            return;
        }

        dispatch(addAsset({
            name: file.name.slice(0, -4),
            src: videoUrl
        }))

    }

    useEffect(() => {
        initffmpeg();
    }, [])

    const initffmpeg = () => {
        const load = async () => {
            ffmpeg.isLoaded() || await ffmpeg.load();
            setReady(true);
        }

        load();
    }

    return !ready ? (<p>Loading</p>) : (
        < div className='assets' >
            <label htmlFor="asset-upload" className="assets__upload">
                <ImBoxAdd />
                <input id="asset-upload" type='file' onChange={handleUploadAsset} accept="video/*" />
            </label>

            <div className='assets__container'>
                {assetList && assetList.map((asset) => (
                    <AssetCard asset={asset} />
                ))}
            </div>
        </div >
    )

}

export default AssetLoader;