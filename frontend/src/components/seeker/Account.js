import React from 'react';
import axios from 'axios';
import { NavLink } from "react-router-dom";
import { Alert, Divider, Popconfirm, Button } from 'antd';
import { AccountUpdate, LogoutAll } from "../";

class Account extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            error: null,
            message: null
        }
    }

    // PROPS: user, token, logOut

    componentDidMount() {
        // fetch account details and mount on state using axios.get()
    }

    setMessages = (error, message) => {
        this.setState({ error: error, message: message});
    }

    convertAccount = e => {
        e.preventDefault();
        this.setState({ error: null, message: null });
        const token = localStorage.getItem('token');
        const requestOptions = { headers : { Authorization: `JWT ${token}`}};
        const formData = new FormData();
        formData.append('is_employer', true);
        axios.patch(`${process.env.REACT_APP_API}account/${this.props.user}/`, formData , requestOptions)
            .then(response => {
                this.setState({ message: `Job Posting enabled!`});
                setTimeout(() => {
                    axios.post(`${process.env.REACT_APP_LOGIN_API}refresh/`, { token: token })
                        .then(response => {
                            const registerCompany = true;
                            this.props.logIn(response.data, registerCompany);
                        })
                        .catch(err => {
                            this.logOut(err, `Problem authenticating change. Please log in again.`);
                        });
                }, 2000);
            })
            .catch(err => {
                this.setState({ error: `Error processing request. Try again.`});
            });
    }

    render() {
        const { error, message } = this.state;
        return (
            <div className="account">

                {error ? (
                  <Alert message={error} type="error" closable showIcon  onClose={this.resetMessages}/>
                  ) : (null)}
                {message ? (
                  <Alert message={message} type="success" closable showIcon onClose={this.resetMessages}/>
                ) : (null)}

                <AccountUpdate {...this.props}/>
                <Divider />
                <LogoutAll logOut={this.props.logOut} setMessages={this.setMessages}/>
                <Divider />

                <h4>Register as a company :</h4>
                <Popconfirm
                title="Are you sure you want to convert your account?"
                okText="Yes"
                cancelText="Cancel"
                onConfirm={this.convertAccount}
                >
                    <Button type="secondary">Post a Job</Button>
                </Popconfirm>
            </div>
        );  
    }
}

export default Account;