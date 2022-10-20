import React, { useState, useEffect, useMemo } from 'react';
import { createFFmpeg, fetchFile } from '@ffmpeg/ffmpeg';
import { useDispatch, useSelector } from 'react-redux';
import { ImBoxAdd } from "react-icons/im";

import { addAsset } from '../../slices';
import AssetCard from './AssetCard';
import AssetInspector from "./AssetInspector";
import Popup from '../Popup';

// show logs in the console
const ffmpeg = createFFmpeg({ log: true });

const AssetLoader = () => {
    const [ready, setReady] = useState(false);

    const [popupText, setPopupText] = useState('');

    const dispatch = useDispatch();
    let { assetList } = useSelector((state) => state.asset);

    const convertVideo = async (file, src) => {
        if (!ready)
            return null;

        ffmpeg.FS('writeFile', file.name, await fetchFile(src));
        // ffmpeg.run(`-i`, `${file.name}`);
        setPopupText('Wait to be converted...');
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
            if (asset.name === file.name.slice(0, -4)) {
                setPopupText('The file has already been added. Try a different name.');
                return;
            }
        }

        const src = URL.createObjectURL(file);

        const videoUrl = file.name.slice(-3).toLowerCase() === 'mp4' ?
            src : await convertVideo(file, src);

        dispatch(addAsset({
            name: file.name.slice(0, -4),
            src: videoUrl || src
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

    useEffect(() => {
        setTimeout(() => {
            setPopupText('');
        }, 3000);
    }, [popupText])

    return (
        < div className='assets' >
            <h1 className='assets__title'>Assets</h1>
            {popupText && <Popup text={popupText} />}
            <label htmlFor="asset__upload" className="assets__upload">
                <ImBoxAdd />
                <input id="asset__upload" type='file' onChange={handleUploadAsset} accept="video/*" />
            </label>
            <div className='assets__container'>
                {assetList && assetList.map((asset) => (
                    <AssetCard asset={asset} />
                ))}
            </div>
            <AssetInspector />
        </div >

    )

}

export default AssetLoader;