import React from "react";
import { Tag, Tooltip } from "antd";
import '../css/Tag.css';

const TagView = props => {
    const { tag } = props;
    let isLongTag = tag.length > 14;
    const tagElem = (
        <Tag key={tag}>
          {isLongTag ? `${tag.slice(0, 14)}...` : tag}
        </Tag>
        );

    return (
        <div className="tag">
            {isLongTag ? <Tooltip title={tag} key={tag}>{tagElem}</Tooltip> : tagElem }
        </div>
    );
}

export default TagView;