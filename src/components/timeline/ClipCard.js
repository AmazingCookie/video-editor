import React from 'react';
import { useDrag, useDrop } from 'react-dnd';
import { ItemTypes } from '../Constants';
import { useDispatch } from 'react-redux';
import { removeClip, swapClip } from '../../slices';
import { ImCross } from 'react-icons/im'
/**
 * Your Component
 */
export default ({ clip, x, y, h, w }) => {
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
                    <ImCross />
                </button>
            </div>
        </div>
    )
}