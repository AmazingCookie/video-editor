import React from 'react';
import { createFFmpeg, fetchFile } from '@ffmpeg/ffmpeg';
import { useDispatch, useSelector } from 'react-redux';
import { ImBoxAdd } from "react-icons/im";

import { addAsset } from '../../slices';
import AssetCard from './AssetCard';

// show logs in the console
const ffmpeg = createFFmpeg({ log: true });

const AssetLoader = () => {
    const dispatch = useDispatch();
    let { assetList } = useSelector((state) => state.asset);

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

    const handleUploadAsset = (event) => {
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

        dispatch(addAsset({
            name: file.name,
            src: src
        }))

    }

    return (
        <div className='assets'>
            <label htmlFor="asset-upload" className="assets__upload">
                <ImBoxAdd />
                <input id="asset-upload" type='file' onChange={handleUploadAsset} accept="video/*" />
            </label>

            <div className='assets__container'>
                {assetList && assetList.map((asset) => (
                    <AssetCard asset={asset} />
                ))}
            </div>
        </div>
    )

}

export default AssetLoader;