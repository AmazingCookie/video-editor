import React, { useState } from "react";
import { useDrop } from 'react-dnd';
import { ItemTypes } from '../Constants';


export default () => {
    const [info, setInfo] = useState({});

    const extractInfo = (asset) => {
        const { name, codec, type, created, modified, duration, timescale, nb_samples,
            track_height, track_width, language, layer, bitrate } = asset.info;

        console.log(asset.info);

        const formattedInfo = {
            name, 
            type,
            codec,
            duration: duration / timescale + ' sec',
            freams: nb_samples,
            bitrate,
            height: track_height,
            width: track_width,
            created: created.toString(),
            modified: modified.toString(),
            layer,
            language,
        };
        setInfo(formattedInfo);
    }


    const [{ isOver }, dropRef] = useDrop(() => ({
        accept: ItemTypes.ASSET,
        drop: monitor => extractInfo(monitor.asset),
        collect: monitor => ({
            isOver: !!monitor.isOver(),
        }),
    }))
    
    return (
        <div className="inspector">
            <div className="inspector__drop" ref={dropRef} >
                Please drop your asset here.
            </div>

            <div className="inspector__info">
                {Object.keys(info).length === 0 && "No info to show."}
                {Object.entries(info).map(([key, value]) => {
                    return (
                        <p>
                            <span className="inspector__info__key">{key + ": "}</span>
                            <span className="inspector__info__value">{value}</span>
                        </p>
                    )
                })}
            </div>
        </div>
    );
}