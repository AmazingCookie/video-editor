import React, { useCallback, useEffect, useRef, useState } from 'react';
import { useDrag } from 'react-dnd';
import { useDispatch, useSelector } from 'react-redux';
import throttle from 'lodash.throttle'
import { removeClip, removeAsset, addClip } from '../../slices';
import { ItemTypes } from '../Constants';
import { ImCancelCircle, ImPlus } from 'react-icons/im'

/**
 * Your Component
 */
export default ({ asset }) => {
    const dispatch = useDispatch();
    const { clipList } = useSelector((state) => state.clip);
    const [videoSize, setVideoSize] = useState({ height: 0, width: 0 });
    const videoContainer = useRef(null);

    const [{ isDragging }, dragRef] = useDrag(
        () => ({
            type: ItemTypes.ASSET,
            item: { asset },
            collect: (monitor) => ({
                item: monitor.getItem(),
                isDragging: !!monitor.isDragging()
            })
        }),
        [asset]
    )

    const handleDelete = () => {
        clipList.forEach(clip => {
            if (clip.asset.id === asset.id) {
                clip.asset.setPause();
                dispatch(removeClip({ id: clip.id }));
            }
        });

        dispatch(removeAsset({
            id: asset.id,
            src: asset.src
        }));
        console.log('remove asset: ' + asset.name);
    }

    const handleAdd = async () => {
        const posterSrc = await asset.getPosterSrc(0);

        dispatch(addClip({
            asset: asset,
            startOffset: 0,
            nbSamples: asset.getNbSamples(),
            posterSrc
        }));
    }

    const throttlingAdd = useCallback(
        throttle(handleAdd, 1000)
        , [])

    const videoResize = () => {
        const $videoContainer = videoContainer.current;
        setVideoSize({ height: $videoContainer.clientHeight,
            width: $videoContainer.clientWidth})
    }

    useEffect(() => {
        videoResize();
        return () => {
            throttlingAdd.cancel();
            window.removeEventListener('resize', videoResize);
        }
    }, [])

    return (
        <div className="assets__container__card" ref={dragRef} style={{
            opacity: isDragging ? 0.5 : 1,
            cursor: 'move'
        }}>
            {/* <div className="assets__container__card__title" >
                {asset.name.slice(0, 50)}
                {asset.name.length > 30 && '...'}
            </div> */}
            <div className="assets__container__card__video" ref={videoContainer}>
                <video width={videoSize.width} height={videoSize.height}>
                    <source src={`${asset.src}#t=0.5`} type="video/mp4" />
                </video>
            </div>
            <button className="assets__container__card__delete" onClick={handleDelete}>
                <ImCancelCircle />
            </button>
            <button className="assets__container__card__add" onClick={throttlingAdd}>
                <ImPlus />
            </button>
        </div>
    )
}