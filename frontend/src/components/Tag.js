import React from "react";
import '../css/Tag.css';

const Tag = props => {
    const { tag } = props;
    return (
        <div className="tag">
            <p>{tag.name}</p>
        </div>
    );
}

export default Tag;