import React from 'react';
import axios from 'axios';
import { AccountUpdate } from "../";

class Account extends React.Component {
    constructor(props) {
        super(props)
    }

    // user, token, logOut, checkToken

    componentDidMount() {
        // fetch account details and mount on state using axios.get()
    }

    render() {
        return (
            <div className="account">
                <AccountUpdate {...this.props}/>
            </div>
        );  
    }
}

export default Account;
