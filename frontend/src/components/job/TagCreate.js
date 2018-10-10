import React from 'react';
import { Tag, Tooltip, Input, Icon } from 'antd';

class TagCreate extends React.Component {
  constructor(props) {
    super(props)
      this.state = {
      inputVisible: false,
      inputValue: '',
    }
  }

  handleClose = (removedTag) => {
    const tags = this.state.tags.filter(tag => tag !== removedTag);
    this.setState({ tags });
  }

  showInput = () => {
    this.setState({ inputVisible: true }, () => this.input.focus());
  }

  handleInputChange = (e) => {
    this.setState({ inputValue: e.target.value });
  }

  handleInputConfirm = () => {
    const { inputValue } = this.state;
    let tags = this.props.tags;
    if (inputValue && tags.indexOf(inputValue) === -1) {
      tags = [...tags, inputValue];
    }
    this.setState({
      inputVisible: false,
      inputValue: '',
    });
    // Sets tags on state of JobPost
    this.props.addTags(tags);
  }

  saveInputRef = input => this.input = input;

  render() {
    const { tags } = this.props;
    const { inputVisible, inputValue } = this.state;
    return (
      <div className="tag">
        {tags.map((tag, index) => {
          let isLongTag = tag.length > 14;
          const tagElem = (
            <Tag key={tag} closable={index !== -1} afterClose={() => this.handleClose(tag)}>
              {isLongTag ? `${tag.slice(0, 14)}...` : tag}
            </Tag>
          );
          return isLongTag ? <Tooltip title={tag} key={tag}>{tagElem}</Tooltip> : tagElem;
        })}
        {inputVisible && (
          <Input
            ref={this.saveInputRef}
            type="text"
            size="small"
            value={inputValue}
            onChange={this.handleInputChange}
            onBlur={this.handleInputConfirm}
            onPressEnter={this.handleInputConfirm}
          />
        )}
        {!inputVisible && (
          <Tag onClick={this.showInput}>
            <Icon type="plus" /> Add skills
          </Tag>
        )}
 
      </div>
    );
  }
}

export default TagCreate;
