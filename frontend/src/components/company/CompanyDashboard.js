import React, { Component } from 'react';
import { withRouter, NavLink } from 'react-router-dom';
import axios from 'axios';
import { CompanyJobCounter, CompanyJobList } from '../';

class CompanyDashboard extends Component {
    constructor(props) {
        super(props)
        this.state = {

        }
    }

    setJobCount = count => {
        this.setState({ count: count });
    }

    render() {
        return (
            <div className="dashboard">
                <CompanyJobList />
                <CompanyJobCounter count={count} stripe_count={stripe_count} published_count={published_count}/>
            </div>
        );
    }
}

export default withRouter(CompanyDashboard);