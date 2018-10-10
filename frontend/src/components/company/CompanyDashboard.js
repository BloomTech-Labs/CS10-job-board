import React, { Component } from "react";
import { withRouter, NavLink } from 'react-router-dom';
import axios from "axios";
import { CompanyJobCounter, CompanyJobList } from '../';

class CompanyDashboard extends Component {
    constructor(props) {
        super(props)
        this.state = {

        }
    }
    render() {
        return (
            <div className="dashboard container">
                <div className="row">
                    <div className="col s12 m6"></div>
                    <div className="col s12 m5 offset-m1"></div>
                    <CompanyJobCounter />
                    <CompanyJobList />
                </div>
            </div>
        );
    }
}

export default withRouter(CompanyDashboard);