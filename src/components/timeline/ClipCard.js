import React, { useState } from 'react';
import { useDrag, useDrop } from 'react-dnd';
import { ItemTypes } from '../Constants';
import { useDispatch } from 'react-redux';
import { removeClip, swapClip, changeClipVolume } from '../../slices';
import { ImCancelCircle, ImVolumeMute2, ImVolumeHigh, ImVolumeMedium, ImVolumeLow } from 'react-icons/im'


export default ({ clip, x, y, h, w }) => {
    const [volume, setVolume] = useState(clip.volume);

    const [{ isDragging }, dragRef] = useDrag(
        () => ({
            type: ItemTypes.CLIP,
            item: { clip },
            collect: (monitor) => ({
                item: monitor.getItem(),
                isDragging: !!monitor.isDragging()
            })
        }), [clip]
    )

    const dispatch = useDispatch();
    const handleDelete = () => {
        clip.asset.setPause();
        dispatch(removeClip({
            id: clip.id
        }));
        console.log('remove clip: ' + clip.id);
    }

    const handleSwap = (clip_second) => {
        console.log(`
            clip first: ${clip.id}
            clip se: ${clip_second.id}
        `)
        dispatch(swapClip({
            id_first: clip.id,
            id_second: clip_second.id
        }));
    }

    const [{ isOver }, dropRef] = useDrop(() => ({
        accept: ItemTypes.CLIP,
        drop: monitor => handleSwap(monitor.clip),
        collect: monitor => ({
            isOver: !!monitor.isOver(),
        }),
    }), [clip]
    )

    const setClipVolume = (event) => {
        setVolume(event.target.value);
        dispatch(changeClipVolume({
            id: clip.id,
            volume: event.target.value
        }))
    }

    return (
        <div className="timeline__container__channels__channel__clip" ref={el => { dragRef(el); dropRef(el) }} style={{
            opacity: isDragging ? 0.5 : 1,
            cursor: 'move',
            left: x,
            right: y,
            height: h,
            width: w
        }}>
            <div className='timeline__container__channels__channel__clip__tool'>
                <img height={h}
                    src={clip.posterSrc} />
                <button onClick={handleDelete}>
                    <ImCancelCircle />
                </button>
                <div className='timeline__container__channels__channel__clip__tool__volume'>
                    <span>
                        {volume == 0 && <ImVolumeMute2 />}
                        {volume > 0 && volume < 0.5 && <ImVolumeLow />}
                        {volume >= 0.5 && volume < 0.8 && <ImVolumeMedium />}
                        {volume >= 0.8 && volume <= 1 && <ImVolumeHigh />}
                    </span>
                    <input 
                        type="range"
                        min="0"
                        max="1"
                        step="0.1"
                        value={volume}
                        onChange={setClipVolume} />
                </div>
            </div>
        </div>
    )
}