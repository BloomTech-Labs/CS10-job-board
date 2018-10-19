import React, { Component } from 'react';
import { withRouter, NavLink } from 'react-router-dom';
import axios from 'axios';
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
                <CompanyJobBalance />
            </div>
        );
    }
}

export default withRouter(CompanyDashboard);