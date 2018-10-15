import React from 'react';
import axios from 'axios';
import { withRouter } from 'react-router-dom';
import { AccountUpdate } from '../';
import { Alert, Form, Icon, Input, Button, Divider, Progress } from 'antd';

const FormItem = Form.Item;
const { TextArea } = Input;

class CompanyAccount extends React.Component {
  constructor(props) {
    super(props)
    this.state ={
      confirmDirty: false,
      autoCompleteResult: [],
      error: null,
      message: null,
      loadend: false,
      company_name: null,
      company_logo: null,
      company_summary: null,
      application_inbox: null,
      first_name: null,
      last_name: null,
      fileUrl: null,
      progress: 0
    }
  }

  componentDidMount() {

  }

  handleSubmit = e => {
    e.preventDefault();
    this.setState({ error: null, message: null, progress: 0 });
    const token = localStorage.getItem('token');
    this.props.checkToken(e, this.props.token, token);
    const { company_name, company_logo, company_summary, application_inbox, first_name, last_name } = this.state;
    const requestBody = { company_name, company_logo, company_summary, application_inbox, first_name, last_name };
    const formData = new FormData();
    // creates FormData entries
    for (let key in requestBody) {
      if (key === 'comapany_image' && requestBody[key] !== null) {
        formData.append(key, requestBody[key])
      } else if (requestBody[key] !== null) {
        formData.append(key, requestBody[key]);
      }
    }
    const requestOptions = { 
      headers: { Authorization: `JWT ${token}`},
      onUploadProgress: progressEvent => { 
      this.setState({ progress: Math.round(progressEvent.loaded / progressEvent.total * 100)});
      }
    };
    axios.patch(`${process.env.REACT_APP_API}account/${this.props.user}/`, formData, requestOptions)
      .then(response => {
        this.setState({ message: `Account successfully updated!`});
        setTimeout(() => {
          this.setState({ progress: 0, message: null });
        }, 5000);
      })
      .catch(err => {
        this.setState({ 
          error: `Error processing your request. Try Again.`
        });
      });
  }

  onChange = e => {
    this.setState({ [e.target.name]: e.target.value });
  }

  //##### Start Image File Upload Handlers ######

  handleImageUpload = e => {
    this.setState({ 
      error: null, 
      message: null, 
      company_logo: null, 
      loadend: false, 
      fileUrl: null 
    });
    const file = e.target.files[0];
    const imgIsValid = this.beforeImgUpload(file);
    if (imgIsValid) {
      this.setState({ 
        company_logo: file,
        fileUrl: this.getBase64Img(file),
        loadend: true
       });
    }
  }

    // Encoding for live preview
  
  getBase64Img = (file, cb) => {
    const reader = new FileReader();
    reader.addEventListener('load', () => this.setState({ fileUrl: reader.result }), false);
    if (file) {
      reader.readAsDataURL(file);
    }
  }

    // Validation beyond 'accepts' field on input[type="file"] check

  beforeImgUpload = file => {
    const isJPG = file.type === 'image/jpeg';
    const isPNG = file.type === 'image/png';
    const isSVG = file.type === 'image/svg+xml';
    if (!isJPG && !isPNG && !isSVG) {
      return this.setState({ error: 'You can only upload a .jpg, .png, or .svg file!'});
    }
    const isLt2M = file.size / 1024 / 1024 < 2;
    if (!isLt2M) {
      return this.setState({ error: 'Image must smaller than 2MB!'});
    }
    if (isJPG) {
      return isJPG && isLt2M;
    } else if (isPNG) {
      return isPNG && isLt2M;
    } else if (isSVG) {
      return isSVG && isLt2M;
    } else {
      return false;
    }
  }

  //##### End Image Upload Handlers ######

  resetMessages = () => {
    this.setState({ error: null, message: null, progress: 0 });
  }


  render() {
    const { getFieldDecorator } = this.props.form;
    const { fileUrl, loadend, progress, error, message } = this.state;
    
    return (
      <div className="profile">


        {error ? (
          <Alert message={error} type="error" closable showIcon  onClose={this.resetMessages}/>
          ) : (null)}
        {message ? (
          <Alert message={message} type="success" closable showIcon onClose={this.resetMessages}/>
        ) : (null)}

        {/* Company Profile Form */}

        < Form className = "form flex"
        title = "Company Profile"
        encType = "multipart/form-data" >

          <Divider orientation="left" className="h3">Company Profile</Divider>

          <FormItem label="Company Name">
            {getFieldDecorator('company_name', {
              rules: [{
                required: true,
                message: 'Please add the company name',
              }],
            })(
              <Input placeholder="ie Google" name="company_name" onChange={this.onChange} />
            )}
          </FormItem>

          <FormItem label="Summary">
            {getFieldDecorator('company_summary', {
              rules: [{ required: true, message: 'Please input a description of your company!' }],
            })(
              <TextArea 
                placeholder="What problems are you solving with your product/service? What's the company culture like?"
                name="company_summary" onChange={this.onChange}
                 />
            )}
          </FormItem>

          {/* Logo upload */}
          
          <div className="company-logo-upload-container">
            <label htmlFor="company_logo_input">Company Logo  *jpg, png, svg</label>
            {loadend ? (
              <Icon type='close' onClick={() => {
                document.getElementById("company_logo_input").value = "";
                this.setState({ fileUrl: null, loadend: false, company_logo: null, progress: 0, message: null, error: null });
              }}></Icon>
            ) : (
                <Icon type='plus' onClick={() => document.getElementById("company_logo_input").click()}></Icon>
            )}
          </div>
          <FormItem>
            <Input 
              id="company_logo_input"
              type="file"
              multiple={false}
              accept="image/png, image/jpeg, image/svg+xml" 
              onChange={this.handleImageUpload} 
            />

            {fileUrl ? (
              <img src={fileUrl} id="company_logo" alt="company logo preview"/>
              ):(null)}

            {progress === 100 && fileUrl && !error ? (
                <Progress type="circle" percent={100} width={55} style={{position: "absolute"}}/>
              ) : (null)}

            {progress > 0 && progress < 100 && fileUrl ? (
              <Progress type="circle" percent={progress} width={55} style={{position: "absolute"}}/>
            ) : (null)}

            {error ? (
              <Progress type="circle" percent={progress} status={"exception"} width={55} style={{position: "absolute"}}/>
            ) : (null)}

          </FormItem>

          <FormItem label="Application Inbox"
            style={{ float: 'left' }}>
            {getFieldDecorator('application_inbox', {
              rules: [{
                type: 'email', message: 'The input is not a valid email!',
              }, {
                required: true, message: 'Please input your company email!',
              }],
            })(
              <Input  placeholder="Email address to recieve applications" name="application_inbox" onChange={this.onChange} />
            )}
          </FormItem>

          <Divider orientation="left" className="h4">Company Contact</Divider>
            
          <div className="flex justify-space-around">
            <FormItem label="First Name">
              {getFieldDecorator('first_name', {
                rules: [{
                  required: false,
                  message: 'Please input your first name',
                }],
              })(
                <Input placeholder="" name="first_name" onChange={this.onChange}/>
              )}
            </FormItem>
            <FormItem label="Last Name">
              {getFieldDecorator('last_name', {
                rules: [{
                  required: false,
                  message: 'Please input your last name',
                }],
              })(
                <Input placeholder="" name="last_name" onChange={this.onChange}/>
              )}
            </FormItem>
          </div>

          <Button type="primary" onClick={this.handleSubmit} htmlType="submit">Save</Button>

        </Form>



        {/* Update Account Forms */}

        <AccountUpdate {...this.props} />

      {/* page wrapper */}
      </div>
    );
  }
}

export default CompanyAccount = Form.create()(withRouter(CompanyAccount));
