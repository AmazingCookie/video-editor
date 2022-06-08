import React from 'react';
import { useDrag } from 'react-dnd';
import { useDispatch, useSelector } from 'react-redux';
import { removeClip, removeAsset } from '../../slices';
import { ItemTypes } from '../Constants';
import { ImCancelCircle } from 'react-icons/im'

/**
 * Your Component
 */
export default ({ asset }) => {
    const dispatch = useDispatch();
    const { clipList } = useSelector((state) => state.clip);

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

    const handleDelete = async() => {
        clipList.forEach(clip => {
            if (clip.asset.id === asset.id)
                dispatch(removeClip({ id: clip.id }));
        });

        dispatch(removeAsset({
            id: asset.id,
            src: asset.src
        }));
        console.log('remove asset: ' + asset.name);
    }

    return (
        <div className="assets__container__card" ref={dragRef} style={{
            opacity: isDragging ? 0.5 : 1,
            cursor: 'move'
        }}>
            <div className="assets__container__card__title" >
                {asset.name.slice(0, 50)}
                {asset.name.length > 30 && '...'}
            </div>
            <button className="assets__container__card__delete" onClick={handleDelete}>
                <ImCancelCircle />
            </button>
        </div>
    )
}