import React from 'react';
import { withRouter } from "react-router-dom";
import axios from 'axios';
import { Collapse, Form, Input, Icon, Button, Alert, Modal } from 'antd';

const FormItem = Form.Item;
const Panel = Collapse.Panel;


class AccountUpdate extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            confirmDirty: [],
            error: null,
            message: null,
            formModal: false,
            attempts: 0,
            inputType: false
        }
    }

    componentDidMount() {

    }

    onChange = e => {
        this.setState({ [e.target.name]: e.target.value });
    }

    handlePasswordSubmit = e => {
        e.preventDefault();
        this.setState({ error: null, message: null });
        const token = localStorage.getItem('token');
        const requestOptions = { headers: { Authorization: `JWT ${token}`}};
        const { email, current_password, new_password, attempts } = this.state;
        // POST to verify token; returns JWT if valid
        axios.post(`${process.env.REACT_APP_LOGIN_API}verify/`, {token: token})
            .then(response => {
                // If token is valid, check password
                axios.post(`${process.env.REACT_APP_LOGIN_API}`, { email: email, password: current_password })
                    .then(response => {
                        const formData = new FormData();
                        formData.append('password', new_password)
                        // If token & password are valid, send PATCH update
                        axios.patch(`${process.env.REACT_APP_API}account/${this.props.user}/`, formData, requestOptions)
                            .then(response => {
                                this.setState({ message: `Password successfully updated`, attempts: 0 });
                                // Reset JWT secret once password is updated.
                                axios.post(`${process.env.REACT_APP_API}logout/all/`, {}, requestOptions)
                                    .then(response => {
                                        // Login to retrieve a newly signed JWT
                                        axios.post(`${process.env.REACT_APP_LOGIN_API}`, {email: email, password: new_password})
                                            .then(response => {
                                                localStorage.setItem('token', response.data.token);
                                            })
                                            .catch(err => {
                                                this.setState({ error: `Error logging in. Please log in again.`});
                                            });
                                    })
                                    .catch(err => {
                                        this.setState({ error: `Error processing request. Please log in again.`})
                                    });
                            })
                            .catch(err => {
                                this.setState({ error: `Error processing your request.`});
                            });
                    })
                    .catch(err => {
                        if (attempts > 2)  {
                            // Resets JWT secret signature on User
                            axios.post(`${process.env.REACT_APP_API}logout/all/`, {}, requestOptions)
                                .then(response => {
                                    this.props.logOut(e, `Too many password attempts.`);
                                })
                                .catch(err => {
                                    console.log(err);
                                    this.props.logOut(e, `Too many password attempts.`);
                                })
                        }
                        else this.setState({ attempts: attempts + 1 });
                    });
            })
            .catch(err => {
                this.props.logOut(e, `Problems authenticating request. Please log in again.`);
            });
    }

    

    handleEmailSubmit = e => {
        e.preventDefault();
        this.setState({ error: null, message: null });
        const token = localStorage.getItem('token');
        // POST to verify token; returns the same JWT if valid
        axios.post(`${process.env.REACT_APP_LOGIN_API}verify/`, {token: token})
        .then(response => {
            // POST request handled in modal by this.postEmail()
            this.toggleFormModal();
        })
        .catch(err => {
            this.props.logOut(e, `Problems authenticating request. Please log in again.`);
        });

    }

    postEmail = e => {
        e.preventDefault();
        // get password from modal input
        const token = localStorage.getItem('token');
        const requestOptions = { headers: { Authorization: `JWT ${token}`}};
        const { new_email, attempts } = this.state;
        // get password & current_email from modal input ids
        const password = document.getElementById("username_reset_password").value;
        const current_email = document.getElementById("username_reset_email").value;
        // Verify password with login request
        axios.post(`${process.env.REACT_APP_LOGIN_API}`, { email: current_email, password: password })
            .then(response => {
                const formData = new FormData();
                formData.append('email', new_email);
                // for (var pair of formData.entries()) {
                //     console.log(pair[0]+ ', ' + pair[1]); 
                // }
                // Update only email field in PATCH request
                axios.patch(`${process.env.REACT_APP_API}account/${this.props.user}/`, formData, requestOptions)
                    .then(response => {
                        this.setState({ message: `Account successfully updated!`, attempts: 0 });
                        const { new_email } = this.state;
                        // Make a login request with new email and password entered into modal
                        axios.post(`${process.env.REACT_APP_LOGIN_API}`, { email: new_email, password: password})
                            .then(response => {
                                // replace old token with new one with updated email
                                localStorage.setItem('token', response.data.token);
                                this.toggleFormModal();
                            })
                            .catch(err => {
                                this.setState({ error: `Error logging in. Log in again.`});
                                this.toggleFormModal();
                            });
                    })
                    .catch(err => {
                        this.setState({ error: `Error processsing your request.`});
                    });
            })
            .catch(err => {
                if (attempts > 2)  {
                    this.toggleFormModal();
                    // Resets JWT secret signature on User
                    axios.post(`${process.env.REACT_APP_API}logout/all/`, {}, requestOptions)
                        .then(response => {
                            this.props.logOut(e, `Too many password attempts.`);
                        })
                        .catch(err => {
                            this.props.logOut(e, `Too many password attempts.`);
                        });
                } else {
                    this.toggleFormModal();
                    this.setState({ attempts: attempts + 1 });
                }
            });
    }

    compareToFirstPassword = (rule, value, callback) => {
        const form = this.props.form;
        if (value && value !== form.getFieldValue('new_password')) {
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

    handleConfirmBlur = e => {
        const value = e.target.value;
        this.setState({ confirmDirty: this.state.confirmDirty || !!value });
    }

    toggleFormModal = () => {
        this.setState({ formModal: !this.state.formModal });
    }

    toggleInputType = () => {
        this.setState({ inputType: !this.state.inputType });
    }


    render() {
        const { getFieldDecorator } = this.props.form;
        const { error, message, formModal, attempts, inputType } = this.state;
        return (
        <div className="account form flex column account-change">

            {error ? (
              <Alert message={error} type="error" closable showIcon  onClose={this.resetMessages}/>
              ) : (null)}
            {message ? (
              <Alert message={message} type="success" closable showIcon onClose={this.resetMessages}/>
            ) : (null)}

            {attempts > 0 ? (
              <Alert message={`Wrong Password. You have ${(3 - attempts)} password attempts left`} type="error" closable showIcon onClose={this.resetMessages}/>
            ) : (null)}

            <Collapse className="flex column" bordered={false} accordion={true}>
          
                <Panel className="h4" header="Update Password" key="1">

                  <Form className="form account-change">
                    
                    <FormItem label="Account Email">
                      {getFieldDecorator('email', {
                        rules: [{
                          required: true, message: 'Please add your account email!',
                        }, {
                          validator: this.validateToNextPassword,
                        }],
                      })(
                        <Input type="email" onChange={this.onChange} name="email"/>
                      )}
                    </FormItem>
                    
                    <FormItem label="Current Password">
                      {getFieldDecorator('current_password', {
                        rules: [{
                          required: true, message: 'Please add your current password!',
                        }, {
                          validator: this.validateToNextPassword,
                        }],
                      })(
                        <Input type={inputType ? (`text`) : (`password`)} onChange={this.onChange} name="current_password"/>
                      )}
                      <Icon type="eye" onClick={this.toggleInputType}/>
                    </FormItem>

                    <FormItem label="New Password">
                      {getFieldDecorator('new_password', {
                        rules: [{
                          required: true, message: 'Please add your new password!',
                        }, {
                          validator: this.validateToNextPassword,
                        }],
                      })(
                        <Input type="password" onChange={this.onChange} name="new_password"/>
                      )}
                    </FormItem>

                    <FormItem label="Confirm Password">
                      {getFieldDecorator('confirm', {
                        rules: [{
                          required: true, message: 'Please confirm your password!',
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

                    <FormItem label="New Email" required>
                        <Input onChange={this.onChange} name="new_email" placeholder="Choose a new account email"/>
                    </FormItem>

                <Modal title="Enter your account details"
                visible={formModal}
                onCancel={this.toggleFormModal}
                footer={[null, null,]} 
                className="account-modal"
                >

                    <FormItem label="Current Email" required>
                        <Input type="email" id="username_reset_email"/>
                    </FormItem>
                    <FormItem label="Password" required>
                        <Input type={inputType ? (`text`) : (`password`)} id="username_reset_password"/>
                        <Icon type="eye" onClick={this.toggleInputType}/>
                    </FormItem>
                    <FormItem>
                        <Button type="primary" onClick={this.postEmail}>Confirm</Button>
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
