import React, { Component } from 'react';
import { withRouter } from 'react-router-dom';
import { CompanyJobList, CompanyJobBalance } from '../';

class CompanyDashboard extends Component {
    constructor(props) {
        super(props)
        this.state = {
        }
    }

    render() {
        return (
            <div className="dashboard">
                <CompanyJobList job_credit={this.props.job_credit} subscription={this.props.subscription}/>
            </div>
        );
    }
}

export default withRouter(CompanyDashboard);