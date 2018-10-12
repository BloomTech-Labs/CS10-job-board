import React from 'react';
import axios from 'axios';
import { withRouter } from 'react-router-dom';
import { TagCreate } from '../';
import { Alert, Form, Input, InputNumber, Button, Switch, Modal } from 'antd';

const FormItem = Form.Item;

const { TextArea } = Input;

class JobPost extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      message: null,
      error: null,
      formModal: false,
      company: this.props.company,
      company_name: null,
      title: null,
      description: null,
      job_location: null,
      requirements: null,
      min_salary: null,
      max_salary: null,
      tags: [],
      is_active: false,
      resetFieldsModal: false
    };
  }


  handleJobPost = e => {
    e.preventDefault();
    const { company_name, title, description, job_location, requirements, min_salary, max_salary, tags, is_active } = this.state;
    this.setState({ error: null, message: null});
    // Authentication
    const token = localStorage.getItem('token');
    this.checkToken(e, this.props.token, token);
    // Validation
    if (company_name && title && description && job_location && requirements && min_salary && max_salary) {
      
      if (min_salary > max_salary) {
        this.setState({ error: `Maximum Salary is less than Minimum Salary`});
      } else if (tags.length > 50) {
        this.setState({ error: `No more than 50 tags`});
      } else {
        // POST Request
        const requestOptions = { headers: { Authorization: `JWT ${token}` }};
        axios.post(`${process.env.REACT_APP_API}company/jobs/`, this.state, requestOptions)
          .then(response => {
            if (is_active) {
              this.setState({ message: `Job Posted!` });
            } else {
              this.setState({ message: `Draft Saved!`});
            }
            setTimeout(() => {
              this.clearForm();
              this.toggleFormModal();
            }, 2500);
          })
          .catch(err => {
            this.setState({ error: `Error processing request. Please try again.`})
          });
      }
    } else {
      this.setState({ error: `Please fill out all of the required fields`});
    }
  }

  clearForm = () => {
    // Ant-Design form method to reset state with components wrapped in {getFieldDecorator}
    this.props.form.setFields({
      company_name: null,
      title: null,
      description: null,
      job_location: null,
      requirements: null
    });
    // Reset items /not/ controlled by {getFieldDecorator}
    this.setState({
      message: null,
      error: null,
      min_salary: null,
      max_salary: null,
      tags: [],
      is_active: false,
      resetFieldsModal: false
    });
  }

  toggleFormModal = () => {
    this.setState({ formModal: !this.state.formModal });
  }

  toggleResetFieldsModal = () => {
    this.setState({ resetFieldsModal: !this.state.resetFieldsModal});
  }

  checkToken = (e, appToken, token) => {
    if (appToken !== token) {
      this.props.logOut(e, `Problem authenticating account. Please log in again.`);
    }
  }

  onChange = e => {
    this.setState({ [e.target.name]: e.target.value });
  }

  // ant-d passes e not as event, but value itself for non-standard elements
  togglePublish = e => {
    this.setState({ is_active: e });
  }
  // ant-d passes e not as event, but value itself for non-standard elements
  updateMaxSalary = e => {
    this.setState({ max_salary: e });
  }
  // ant-d passes e not as event, but value itself for non-standard elements
  updateMinSalary = e => {
    this.setState({ min_salary: e });
  }

  addTags = tags => {
    this.setState({ tags: tags });
  }

  render() {
    const {
      message,
      error,
      formModal,
      min_salary,
      max_salary,
      tags,
      is_active,
      resetFieldsModal
    } = this.state;
    // Ant-d property from Form.create()
    const { getFieldDecorator } = this.props.form;

    return (
      <div>
        <Button type="secondary" onClick={this.toggleFormModal}>Post a Job</Button>


        <Modal title="Post A Job"
        visible={formModal}
        onCancel={this.toggleFormModal}
        footer={[null, null,]} >

          <Form className="job-post" id="job-post-form" >
          
            <FormItem label="Company Name" >
              {getFieldDecorator('company_name', {
                rules: [{
                  required: true,
                  message: `Please provide a company name`,
                  min: 1,
                  max: 200,
                  hasFeedback: true,
                }]
              })(
                <Input type="text" placeholder="e.g. Google" name="company_name" onChange={this.onChange}/>
              )}
            </FormItem>
          
            <FormItem label="Title" >
            {getFieldDecorator('title', {
              rules: [{
                required: true,
                message: `Please provide a title, (200 chars max)`,
                min: 2,
                max: 200, 
                hasFeedback: true,
              }]
            })(
              <Input type="text" placeholder="e.g. Software Engineer" name="title" onChange={this.onChange}/>
            )}
            </FormItem>
  
            <FormItem label="Description" >
              {getFieldDecorator('description', {
                rules: [{
                  required: true,
                  message: `Please provide a job description, no more than 2,000 words`,
                  min: 1,
                  max: 12000,
                  hasFeedback: true,
                }]
              })(
                <TextArea type="text" placeholder="Describe the responsibilities of this position." name="description" onChange={this.onChange}/>
              )}
            </FormItem>
  
            <FormItem label="Location" >
              {getFieldDecorator('job_location', {
                rules: [{
                  required: true,
                  message: `Please provide a location`,
                  min: 2,
                  max: 200,
                  hasFeedback: true,
                }]
              })(
                <Input type="text" placeholder="e.g. Philadelphia" name="job_location" onChange={this.onChange}/>
              )}
            </FormItem>
  
            <FormItem label="Requirements" >
              {getFieldDecorator('requirements', {
              rules: [{
                required: true,
                message: `Please provide job requirements, no more than 2,000 words`,
                min: 1,
                max: 12000,
                hasFeedback: true,
                help: `About 2000 words maximum`
              }]
            })(
              <TextArea type="text" placeholder="Add skills/experience the applicant should have." name="requirements" onChange={this.onChange}/>
            )}
            </FormItem>
  
            <div className="flex">
              <FormItem label="Minimum Salary" className="ant-form-item-required">
                <InputNumber
                  onChange={this.updateMinSalary} name="min_salary" id="min_salary"
                  step={10000}
                  min={0}
                  max={999998}
                  value={min_salary}
                  parser={value => value.replace(/\$\s?|(,*)/g, '')}
                  formatter={value => `$ ${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')} 
                  required
                />
              </FormItem>
  
              <FormItem label="Maximum Salary" className="ant-form-item-required">
                <InputNumber
                  onChange={this.updateMaxSalary} name="max_salary" id="max_salary"
                  step={10000}
                  min={0}
                  max={999999}
                  value={max_salary}
                  parser={value => value.replace(/\$\s?|(,*)/g, '')}
                  formatter={value => `$ ${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
                  required 
                />
              </FormItem>
            </div>
  
            <FormItem label="Tags" name="tags">
              <TagCreate addTags={this.addTags} tags={tags}/>
            </FormItem>
  
            <div className="flex">
              <FormItem label="Publish" id="publish">
                <Switch onChange={this.togglePublish} checked={is_active}/>
              </FormItem>
              <Button type="ghost" onClick={this.toggleResetFieldsModal}>Reset all fields</Button>
              <Modal
              okText="Delete all fields"
              okType="danger"
              visible={resetFieldsModal}
              onCancel={this.toggleResetFieldsModal}
              onOk={this.clearForm}
              >
                <p>Are you sure you want to delete all fields?</p>
              </Modal>
              <Button type="primary" onClick={this.handleJobPost}>{is_active ? `Publish` : `Save Draft`}</Button>
            </div>
            <br />
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


