import React from "react";

export default (props) => {
    return (
        <div className="popup">
            <div className="popup__text">
                {props.text || 'Nothing here...'}
            </div>
        </div>
    )
}