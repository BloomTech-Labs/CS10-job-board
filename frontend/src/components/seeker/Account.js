import React from 'react';
import axios from 'axios';
import { Alert, Divider } from 'antd';
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
            </div>
        );  
    }
}

export default Account;
