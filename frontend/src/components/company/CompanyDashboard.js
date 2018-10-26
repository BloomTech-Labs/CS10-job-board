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
                <CompanyJobList />
                <CompanyJobBalance {...this.props}/>
            </div>
        );
    }
}

export default withRouter(CompanyDashboard);