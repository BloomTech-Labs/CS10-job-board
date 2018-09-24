import React from "react";
import { Tags } from "./";
import "../css/PostJob.css"

import { Form, Input, Icon, Button, Upload } from 'antd';

const FormItem = Form.Item;

const { TextArea } = Input;

class PostJob extends React.Component {
  constructor() {
    super();
    this.state = {
      formLayout: 'horizontal',
    };
  }

  handleFormLayoutChange = (e) => {
    this.setState({ formLayout: e.target.value });
  }

  render() {
    const { getFieldDecorator } = this.props.form;
    const formItemLayout = {
      labelCol: { span: 6 },
      wrapperCol: { span: 14 },
    };
    return (
      <div className="post-job">
        <Form onSubmit={this.handleSubmit}>
          <FormItem
            {...formItemLayout}
            label="Company"
          >
            <Input placeholder="Name of company" />
          </FormItem>
          <FormItem
            {...formItemLayout}
            label="Title"
          >
            {getFieldDecorator('title', {
            rules: [{ required: true, message: 'Please input the job title' }],
          })(
            <Input placeholder="e.g. Software Engineer" />
          )}
          </FormItem>
          <FormItem
            {...formItemLayout}
            label="Logo"
        >
          {getFieldDecorator('upload', {
            valuePropName: 'fileList',
            getValueFromEvent: this.normFile,
          })(
            <Upload name="logo" action="/upload.do" listType="picture">
              <Button>
                <Icon type="upload" /> Click to upload
              </Button>
            </Upload>
          )}
        </FormItem>
        <FormItem
        {...formItemLayout}
          label="Description"
          wrapperCol={{ span: 12, offset:  1 }}
        >
          {getFieldDecorator('description', {
            rules: [{ required: true, message: 'Please input the description!' }],
          })(
            <TextArea placeholder="Describe the responsibilities of this position." autosize={{ minRows: 2, maxRows: 6 }}/>
          )}
        </FormItem>
        <FormItem
        {...formItemLayout}
          label="Location"
        >
          {getFieldDecorator('location', {
            rules: [{ required: true, message: 'Please input the job location!' }],
          })(
            <Input placeholder="e.g. Philadelphia" />
          )}
        </FormItem>
        <FormItem
        {...formItemLayout}
          label="Requirements"
        >
          {getFieldDecorator('requirements', {
            rules: [{ required: true, message: 'Please input the requirements!' }],
          })(
            <TextArea placeholder="Add skills/experience the applicant should have." />
          )}
        </FormItem>
        <Tags
        wrapperCol={{ span: 6, offset:  12 }}
        {...this.props} />
          <FormItem
            wrapperCol={{ span: 12, offset: 6 }}
            >
            <Button type="primary" style={{ background: '#7892EA'}}> Submit</Button>
          </FormItem>
        </Form>
      </div>
    );
  }
}


export default PostJob = Form.create()(PostJob);

