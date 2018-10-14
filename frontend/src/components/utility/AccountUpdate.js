import React from 'react';
import { withRouter } from "react-router-dom";
import axios from 'axios';
import { Collapse, Form, Input, Button, Alert, Modal } from 'antd';

const FormItem = Form.Item;
const Panel = Collapse.Panel;


class AccountUpdate extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            error: null,
            message: null,
            formModal: false
        }
    }

    componentDidMount() {

    }

    onChange = e => {
        this.setState({ [e.target.name]: e.target.value });
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
                this.setState({ error: null, message: null });
                const token = localStorage.getItem('token');
                // Simple token comparison
                this.props.checkToken(e, this.props.token, token);
                // POST to verify token; returns JWT if valid
                axios.post(`${process.env.REACT_APP_LOGIN_API}verify/`, {token: token})
                .then(response => {
                    this.toggleFormModal();
                })
                .catch(err => {
                    this.props.logOut(e, err);
                });
            }
        });
    }

    postEmail = (e) => {
        const token = localStorage.getItem('token');
        const requestOptions = { headers: { Authorization: `JWT ${token}`}};
        const password = document.getElementById("username_reset_password").value;
        const { email } = this.state;
        console.log(email, password);
        const formData = new FormData();
        formData.append('email', email);
        axios.patch(`${process.env.REACT_APP_API}account/${this.props.user}/`, formData, requestOptions)
            .then(response => {
                this.setState({ message: `Account successfully updated!`});
                axios.post(`${process.env.REACT_APP_LOGIN_API}`, { email: email, password: password})
                    .then(response => {
                        localStorage.setItem('token', response.data.token);
                        this.toggleFormModal();
                    })
                    .catch(err => {
                        this.setState({ error: `Error loggin in. Log in again.`});
                        this.toggleFormModal();
                    });
            })
            .catch(err => {
                this.setState({ error: `Error processsing your request.`});
            });
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

    handleConfirmBlur = (e) => {
        const value = e.target.value;
        this.setState({ confirmDirty: this.state.confirmDirty || !!value });
    }

    toggleFormModal = () => {
        this.setState({ formModal: !this.state.formModal });
    }


    render() {
        const { getFieldDecorator } = this.props.form;
        const { error, message, formModal } = this.state;
        return (
        <div className="form flex column account-change">

            {error ? (
              <Alert message={error} type="error" closable showIcon  onClose={this.resetMessages}/>
              ) : (null)}
            {message ? (
              <Alert message={message} type="success" closable showIcon onClose={this.resetMessages}/>
            ) : (null)}

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
                        <Input type="password" onChange={this.onChange} name="password"/>
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
                        <Input type="password" onBlur={this.handleConfirmBlur} onChange={this.onChange} name="confirm"/>
                      )}
                    </FormItem>

                    <Button type="primary" onClick={this.handlePasswordSubmit}>Change Password</Button>
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
                        <Input onChange={this.onChange} name="email"/>
                      )}
                    </FormItem>

                    <Modal title="Enter your password"
                    visible={formModal}
                    onCancel={this.toggleFormModal}
                    footer={[null, null,]} >

                        <FormItem label="password">
                            <Input type="password" id="username_reset_password"/>
                            <Button onClick={this.postEmail}>Submit</Button>
                        </FormItem>

                    </Modal>
                    
                    <Button type="primary" onClick={this.handleEmailSubmit}>Change Email</Button>

                  </Form>

                </Panel>
          
          </Collapse>

        </div>
        );
    }
}

export default AccountUpdate = Form.create()(withRouter(AccountUpdate));
