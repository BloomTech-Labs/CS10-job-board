import React from 'react';
import { Upload, Icon, message } from 'antd';

function getBase64(img, callback) {
  const reader = new FileReader();
  reader.addEventListener('load', () => callback(reader.result));
  reader.readAsDataURL(img);
}

function beforeUpload(file) {
  const isJPG = file.type === 'image/jpg';
  const isPNG = file.type === 'image/png';
  const isSVG = file.type === 'image/svg';
  if (!isJPG && !isPNG && !isSVG) {
    message.error('You can only upload a .jpg, .png, or .svg file!');
  }
  const isLt2M = file.size / 1024 / 1024 < 2;
  if (!isLt2M) {
    message.error('Image must smaller than 2MB!');
  }
  if (isJPG) {
    return isJPG && isLt2M;
  } else if (isPNG) {
    return isPNG && isLt2M;
  } else {
    return isSVG && isLt2M;
  }
}

class Avatar extends React.Component {
  constructor(props) {
    super(props)
    this.state ={
      loading: false
    }
  }

  handleChange = (info) => {
    if (info.file.status === 'uploading') {
      this.setState({ loading: true });
      this.props.onImageChange(info);
      return;
    }
    if (info.file.status === 'done') {
      getBase64(info.file.originFileObj, imageUrl => this.setState({
        imageUrl,
        loading: false,
      }));
    }
  }

  render() {
    const uploadButton = (
      <div>
        <Icon type={this.state.loading ? 'loading' : 'plus'} />
        
        <div className="ant-upload">Upload</div>
      </div>
    );
    const imageUrl = this.state.imageUrl;
    return (
      <Upload
        name="avatar"
        listType="picture-card"
        className="avatar-uploader"
        showUploadList={false}
        customRequest={null}
        beforeUpload={beforeUpload}
        onChange={this.handleChange}
      >
        {imageUrl ? <img src={imageUrl} alt="avatar" /> : uploadButton}
      </Upload>
    );
  }
}

export default Avatar;
