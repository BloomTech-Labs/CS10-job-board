import React from "react";
import { withRouter } from "react-router-dom";
import { Avatar } from "../";
import { Form, Input, Button, Divider, Collapse } from 'antd';

const FormItem = Form.Item;

const { TextArea } = Input;
const Panel = Collapse.Panel;

class CompanyProfile extends React.Component {
  state = {
    confirmDirty: false,
    autoCompleteResult: [],
  };

  handleSubmit = (e) => {
    e.preventDefault();
    this.props.form.validateFieldsAndScroll((err, values) => {
      if (!err) {
        console.log('Received values of form: ', values);
      }
    });
  }

  handlePasswordSubmit = (e) => {
    e.preventDefault();
    this.props.form.validateFieldsAndScroll((err, values) => {
      if (!err) {
        console.log('Received values of form: ', values);
      }
    });
  }

  handleEmailSubmit = (e) => {
    e.preventDefault();
    this.props.form.validateFieldsAndScroll((err, values) => {
      if (!err) {
        console.log('Received values of form: ', values);
      }
    });
  }

  handleConfirmBlur = (e) => {
    const value = e.target.value;
    this.setState({ confirmDirty: this.state.confirmDirty || !!value });
  }

  compareToFirstPassword = (rule, value, callback) => {
    const form = this.props.form;
    if (value && value !== form.getFieldValue('password')) {
      callback('Paswords do not match.');
    } else {
      callback();
    }
  }

  validateToNextPassword = (rule, value, callback) => {
    const form = this.props.form;
    if (value && this.state.confirmDirty) {
      form.validateFields(['confirm'], { force: true });
    }
    callback();
  }

  // handleWebsiteChange = (value) => {
  //   let autoCompleteResult;
  //   if (!value) {
  //     autoCompleteResult = [];
  //   } else {
  //     autoCompleteResult = ['.com', '.org', '.net'].map(domain => `${value}${domain}`);
  //   }
  //   this.setState({ autoCompleteResult });
  // }

  render() {
    const { getFieldDecorator } = this.props.form;
    return (
      <div className="profile">

        {/* Company Profile Form */}

        <Form className="form flex" title="Company Profile" layout='vertical'>

          <Divider orientation="left" className="h3">Company Profile</Divider>

          <FormItem label="Company Name">
            {getFieldDecorator('company_name', {
              rules: [{
                required: true,
                message: 'Please input the company name',
              }],
            })(
              <Input placeholder="" />
            )}
          </FormItem>

          <FormItem label="Summary">
            {getFieldDecorator('summary', {
              rules: [{ required: true, message: 'Please input a description of your company!' }],
            })(
              <TextArea placeholder="What problems are you solving with your product/service? What's the company culture like?" />
            )}
          </FormItem>

          {/* Logo upload */}
          <FormItem label="Company Logo  *jpg, png, svg">
            <Avatar
              style={{float: 'right'}}
              {...this.props} 
            />
          </FormItem>

          <FormItem label="Application Inbox"
            style={{ float: 'left' }}>
            {getFieldDecorator('inbox', {
              rules: [{
                type: 'email', message: 'The input is not a valid email!',
              }, {
                required: true, message: 'Please input your company email!',
              }],
            })(
              <Input  placeholder="Email address to recieve applications" />
            )}
          </FormItem>

          <Divider orientation="left" className="h4">Company Contact</Divider>
            
          <div className="flex space-around">
            <FormItem label="First Name">
              {getFieldDecorator('firstname', {
                rules: [{
                  required: false,
                  message: 'Please input your first name',
                }],
              })(
                <Input placeholder="" />
              )}
            </FormItem>
            <FormItem label="Last Name">
              {getFieldDecorator('lastname', {
                rules: [{
                  required: false,
                  message: 'Please input your last name',
                }],
              })(
                <Input placeholder="" />
              )}
            </FormItem>
          </div>

          <Button type="primary" onClick={this.handleSubmit} htmlType="submit" style={{ background: '#7892EA'}}>Save</Button>

        </Form>



        {/* Update Account Forms */}

        <div className="form flex column account-change">
          <Collapse className="flex column" bordered={false} accordion={true}>
          
            <Panel className="h4" header="Update Password" key="1">

              <Form className="form account-change">
                <FormItem label="Password">
                  {getFieldDecorator('password', {
                    rules: [{
                      required: false, message: 'Please input your password!',
                    }, {
                      validator: this.validateToNextPassword,
                    }],
                  })(
                    <Input type="password" />
                  )}
                </FormItem>

                <FormItem label="Confirm Password">
                  {getFieldDecorator('confirm', {
                    rules: [{
                      required: false, message: 'Please confirm your password!',
                    }, {
                      validator: this.compareToFirstPassword,
                    }],
                  })(
                    <Input type="password" onBlur={this.handleConfirmBlur} />
                  )}
                </FormItem>

                <Button type="primary" onClick={this.handlePasswordSubmit} htmlType="submit" style={{ background: '#7892EA'}}>Save</Button>
              </Form>

            </Panel>

            <Panel className="h4" header="Update Account Email" key="2">

              <Form className="form account-change">

                <FormItem label="Email">
                  {getFieldDecorator('email', {
                    rules: [{
                      type: 'email', message: 'The input is not a valid email!',
                    }, {
                      required: false, message: 'Please input your email!',
                    }],
                  })(
                    <Input />
                  )}
                </FormItem>
                  
                <Button type="primary" onClick={this.handleEmailSubmit} htmlType="submit" style={{ background: '#7892EA'}}>Save</Button>

              </Form>

            </Panel>
          
          </Collapse>

        </div>

      {/* page wrapper */}
      </div>
    );
  }
}

export default CompanyProfile = Form.create()(withRouter(CompanyProfile));
