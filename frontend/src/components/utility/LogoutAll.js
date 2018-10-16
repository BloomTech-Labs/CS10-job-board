import React from 'react';
import axios from 'axios';
import { Button, Popconfirm } from 'antd';

class LogoutAll extends React.Component {
    constructor(props) {
        super(props)
    }


    logoutAll = e => {
        e.preventDefault();
        this.props.setMessages(null, null);
        const token = localStorage.getItem('token');
        // verifies token in local storage
        axios.post(`${process.env.REACT_APP_LOGIN_API}verify/`, {token: token})
            .then(response => {
                const requestOptions = { headers: { Authorization: `JWT ${token}`}};
                // resets JWT secret signature on user model
                axios.post(`${process.env.REACT_APP_API}logout/all/`, {}, requestOptions)
                    .then(response => {
                        this.props.logOut(e, null, `Successfully logged out of all sessions.`);
                    })
                    .catch(err => {
                        this.props.setMessages(`Error processing log out. Please try again.`);
                    });
            })
            .catch(err => {
                this.props.logOut(e, `Error authenticating request. Please log in again.`);
            })
    }

    render() {
        return (
            <div className="logout-all">
                <Popconfirm
                title="Are you sure you want to log out of all sessions?"
                okText="Yes"
                cancelText="Cancel"
                onConfirm={this.logoutAll}
                >
                    <a className="ant-btn ant-btn-danger" href="#"> Logout All Sessions</a>
                </Popconfirm>
            </div>
        );
    }
}

export default LogoutAll;