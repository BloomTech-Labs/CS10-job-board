import React from "react";
import axios from "axios";
import { withRouter } from "react-router-dom";
import { TagCreate } from "./";
import "../css/JobPost.css"

import { Alert, Form, Input, InputNumber, Button, Switch, Modal } from 'antd';

const FormItem = Form.Item;

const { TextArea } = Input;

class JobPost extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      message: null,
      error: null,
      visible: false,
      company: this.props.user,
      company_name: null,
      title: null,
      description: null,
      location: null,
      requirements: null,
      min_salary: null,
      max_salary: null,
      tags: [],
      is_active: false
    };
  }

  showModal = () => {
    this.setState({
      visible: true,
    });
  }

  hideModal = () => {
    this.setState({
      visible: false,
    });
  }

  handleJobPost = e => {
    e.preventDefault();
    this.setState({ error: null, message: null});
    // Verification
    const token = localStorage.getItem('token');
    this.checkToken(e, this.props.token, token);
    if (this.state.min_salary > this.state.max_salary) {
      this.setState({ error: `Maximum Salary is less than Minimum Salary`});
    } else {
      // POST Request
      const requestOptions = { headers: { Authorization: `JWT ${token}` }};
      axios.post(`${process.env.REACT_APP_API}addjob/`, this.state, requestOptions)
        .then(response => {
          // console.log(response);
          this.setState({ message: `Job Posted!` });
          setTimeout(() => {
            this.setState({ 
              company_name: null,
              title: null,
              description: null,
              location: null,
              requirements: null,
              min_salary: null,
              max_salary: null,
              tags: [],
              is_active: false,
              visible: false
             });
          }, 2500);
        })
        .catch(err => {
          // console.log(this.state, requestOptions, err);
          this.setState({ error: `Error processing request. Please try again.`})
        });
    }
  }

  checkToken = (e, appToken, token) => {
    if (appToken !== token) {
      this.props.logOut(e, `Problem authenticating account. Please log in again.`);
    }
  }

  onChange = e => {
    this.setState({ [e.target.name]: e.target.value });
  }

  togglePublish = e => {
    this.setState({ is_active: e });
  }

  updateMaxSalary = e => {
    this.setState({ max_salary: e });
  }

  updateMinSalary = e => {
    this.setState({ min_salary: e });
  }

  addTags = tags => {
    this.setState({ tags: tags });
  }

  render() {
    const { error, message, is_active, visible } = this.state;
    return (
      <div>
        <Button type="secondary" onClick={this.showModal}>Post a Job</Button>


        <Modal title="Post A Job"
        visible={visible}
        onCancel={this.hideModal}
        footer={[null, null,]} >

          <Form className="job-post">
          
            <FormItem label="Company Name" >
              <Input onChange={this.onChange} type="text" name="company_name" placeholder="e.g. Google" required />
            </FormItem>
          
            <FormItem label="Title" >
              <Input onChange={this.onChange} type="text" name="title" placeholder="e.g. Software Engineer" required />
            </FormItem>
  
            <FormItem label="Description" >
              <TextArea onChange={this.onChange} type="text" name="description" placeholder="Describe the responsibilities of this position."   required />
            </FormItem>
  
            <FormItem label="Location" >
              <Input onChange={this.onChange} type="text" name="job_location" placeholder="e.g. Philadelphia" required />
            </FormItem>
  
            <FormItem label="Requirements" >
              <TextArea onChange={this.onChange} type="text" name="requirements" placeholder="Add skills/experience the applicant should have."   required />
            </FormItem>
  
            <div className="flex">
              <FormItem label="Minimum Salary">
                <InputNumber
                  onChange={this.updateMinSalary} name="min_salary"
                  step={10000}
                  min={0}
                  parser={value => value.replace(/\$\s?|(,*)/g, '')}
                  formatter={value => `$ ${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')} 
                  required
                />
              </FormItem>
  
              <FormItem label="Maximum Salary">
                <InputNumber
                  onChange={this.updateMaxSalary} name="max_salary"
                  step={10000}
                  min={0}
                  parser={value => value.replace(/\$\s?|(,*)/g, '')}
                  formatter={value => `$ ${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
                  required 
                />
              </FormItem>
            </div>
  
            <FormItem label="Tags">
              <TagCreate addTags={this.addTags}/>
            </FormItem>
  
            <div className="flex">
              <FormItem label="Publish">
                <Switch onChange={this.togglePublish} />
              </FormItem>
              <Button type="primary" onClick={this.handleJobPost}>{is_active ? `Publish` : `Save Draft`}</Button>
            </div>
            
            {/* Error / Success messages */}
            {error ? (
              <Alert message={error} type="error" closable showIcon />
              ) : (null)}
            {message ? (
              <Alert message={message} type="success" closable showIcon />
            ) : (null)}

          </Form>

        </Modal>
      </div>
    );
  }
}


export default JobPost = Form.create()(withRouter(JobPost));


