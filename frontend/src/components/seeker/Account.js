import React from 'react';
import axios from 'axios';

class Account extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            id: null,
            account: {
                email: `test@test.com`,
                first_name: `John Smith`
            }
        }
    }

    componentDidMount() {
        // fetch account details and mount on state using axios.get()
    }

    onChange = e => {
        e.preventDefault();
        this.setState({ [e.target.name]: e.target.value });
    }

    // needs account PUT for updates to info handler
    handleAccountUpdate = e => {
        e.preventDefault();
        // axios.put()
    }

    // needs password PUT to verify and update password handler
    handlePasswordUpdate = e => {
        e.preventDefault();
        // axios.put()
    }

    render() {
        const { account } = this.state;
        return (
            <div className="account">
                <h3>Account Details</h3>
                <form className="form">
                    <label htmlFor="">email:</label>
                    <input type="text" value={account.email} onChange={this.onChange}/>
                    <label htmlFor="">First Name</label>
                    <input type="text" value={account.first_name} onChange={this.onChange}/>
                    <button onClick={this.handleAccountUpdate}>Save</button>
                </form>
                <h3>Password Reset</h3>
                <form className="form">
                    <label htmlFor="">Old Password</label>
                    <input type="text" onChange={this.onChange}/>
                    <label htmlFor="">New password:</label>
                    <input type="text" onChange={this.onChange}/>
                    <label htmlFor="">Confirm password:</label>
                    <input type="text" onChange={this.onChange}/>
                    <button onClick={this.handlePasswordUpdate}>Update</button>
                </form>
            </div>
        );  
    }
}

export default Account;
