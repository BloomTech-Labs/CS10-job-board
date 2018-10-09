import React, { Component } from "react";
import axios from "axios";
import "../css/Dashboard.css";
import Counter from './dashboard/JobPostCounter';
import PostedJobs from "./dashboard/PostedJobs";
import { withRouter, NavLink } from 'react-router-dom';

class Dashboard extends Component {
    render(){
        return (
            <div className="dashboard container">
                <div className="row">
                    <div className="col s12 m6"></div>
                    <div className="col s12 m5 offset-m1"></div>
                    <Counter />
                    <PostedJobs />
                </div>
            </div>
        )
    }
}

export default Dashboard;