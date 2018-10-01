import React from "react";
import { withRouter } from "react-router-dom";
import { Avatar } from "./";
import { Form, Input, Button } from 'antd';
import "../css/EmployerProfile.css"

const FormItem = Form.Item;

const { TextArea } = Input;


class EmployerProfile extends React.Component {
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

  handleConfirmBlur = (e) => {
    const value = e.target.value;
    this.setState({ confirmDirty: this.state.confirmDirty || !!value });
  }

  compareToFirstPassword = (rule, value, callback) => {
    const form = this.props.form;
    if (value && value !== form.getFieldValue('password')) {
      callback('Two passwords that you enter is inconsistent!');
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

  handleWebsiteChange = (value) => {
    let autoCompleteResult;
    if (!value) {
      autoCompleteResult = [];
    } else {
      autoCompleteResult = ['.com', '.org', '.net'].map(domain => `${value}${domain}`);
    }
    this.setState({ autoCompleteResult });
  }

  render() {
    const { getFieldDecorator } = this.props.form;

    const formItemLayout = {
      labelCol: {
        xs: { span: 24 },
        sm: { span: 8 },
      },
      wrapperCol: {
        xs: { span: 24 },
        sm: { span: 16 },
      },
    };
    const tailFormItemLayout = {
      wrapperCol: {
        xs: {
          span: 24,
          offset: 0,
        },
        sm: {
          span: 16,
          offset: 8,
        },
      },
    };
    return (
    <div className="profile">
      <Form onSubmit={this.handleSubmit}>
        <FormItem
          {...formItemLayout}
          label="Email"
        >
          {getFieldDecorator('email', {
            rules: [{
              type: 'email', message: 'The input is not a valid email!',
            }, {
              required: true, message: 'Please input your email!',
            }],
          })(
            <Input />
          )}
        </FormItem>
        <FormItem {...formItemLayout} label="First name">
          {getFieldDecorator('firstname', {
            rules: [{
              required: true,
              message: 'Please input your first name',
            }],
          })(
            <Input placeholder="" />
          )}
        </FormItem>
        <Avatar
        style={{float: 'right'}}
        {...this.props} />
        <FormItem {...formItemLayout} label="Last name">
          {getFieldDecorator('lastname', {
            rules: [{
              required: true,
              message: 'Please input your last name',
            }],
          })(
            <Input placeholder="" />
          )}
        </FormItem>
        <FormItem {...formItemLayout} label="Company name">
          {getFieldDecorator('companyname', {
            rules: [{
              required: true,
              message: 'Please input the company name',
            }],
          })(
            <Input placeholder="" />
          )}
        </FormItem>
        <FormItem
        {...formItemLayout}
          label="Summary"
        >
          {getFieldDecorator('summary', {
            rules: [{ required: true, message: 'Please input a description of your company!' }],
          })(
            <TextArea placeholder="What's the company culture like? What problems are you solving with your product/service?" />
          )}
        </FormItem>
        <FormItem
          {...formItemLayout}
          label="Application inbox"
          style={{ float: 'left' }}
        >
          {getFieldDecorator('inbox', {
            rules: [{
              type: 'email', message: 'The input is not a valid email!',
            }, {
              required: true, message: 'Please input your company email!',
            }],
          })(
            <Input  placeholder="Email address for applications" />
          )}
        </FormItem>
        <FormItem
          {...formItemLayout}
          label="Password"
        >
          {getFieldDecorator('password', {
            rules: [{
              required: true, message: 'Please input your password!',
            }, {
              validator: this.validateToNextPassword,
            }],
          })(
            <Input type="password" />
          )}
        </FormItem>
        <FormItem
          {...formItemLayout}
          label="Confirm Password"
        >
          {getFieldDecorator('confirm', {
            rules: [{
              required: true, message: 'Please confirm your password!',
            }, {
              validator: this.compareToFirstPassword,
            }],
          })(
            <Input type="password" onBlur={this.handleConfirmBlur} />
          )}
        </FormItem>
        <FormItem {...tailFormItemLayout}>
          <Button type="primary" htmlType="submit" style={{ background: '#7892EA'}}>Save</Button>
        </FormItem>
      </Form>
    </div>
    );
  }
}

export default EmployerProfile = Form.create()(withRouter(EmployerProfile));
