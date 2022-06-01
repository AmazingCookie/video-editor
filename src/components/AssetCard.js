import React from 'react';
import { useDrag } from 'react-dnd';
import { ItemTypes } from './Constants';

/**
 * Your Component
 */
export default ({ asset }) => {
    const [{ isDragging }, dragRef] = useDrag(
        () => ({
            type: ItemTypes.ASSET,
            item: { asset },
            collect: (monitor) => ({
                item: monitor.getItem(),
                isDragging: !!monitor.isDragging()
            })
        }),
        []
    )
    return (
        <div ref={dragRef} style={{
            opacity: isDragging ? 0.5 : 1,
            cursor: 'move',
        }}>
            {asset.name}
        </div>
    )
}