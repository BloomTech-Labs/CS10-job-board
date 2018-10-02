import React from "react";
import axios from "axios";
import { withRouter } from "react-router-dom";
import { Alert, Icon } from "antd";
import numeral from "numeral";
import { TagView } from "./";
import '../css/Job.css';

class Job extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            job: null,
            error: null,
        }
    }

    componentDidMount() {
        this.fetchJob();
    }

    fetchJob = () => {
        const token = localStorage.getItem('token');
        const requestOptions = { headers: { Authorization: `JWT ${token}` }};
        axios.get(`${process.env.REACT_APP_API}${this.props.history.location.pathname}`, requestOptions)
            .then(response => {
                this.setState({ job: response.data });
            })
            .catch(err => {
                this.setState({ error: `Error processing your request. Try again.`});
            });
    }

    render() {
        const { job, error } = this.state;
        return (
            <div className="job-container">
                {error ? (
                    <Alert message={error} type="error" closable showIcon />
                    ) : (null)}
                {job ? (
                    <div className="job">
                         <Icon onClick={this.props.history.goBack}type="left-circle" theme="twoTone" /> 
                        <div>
                            <img src="" alt="" className="job-logo"/>
                            <h3>{job.company_name}</h3>
                            <p>{job.company_desc}</p>
                        </div>
                        <h2>{job.title}</h2>
                        <h3>{numeral(job.min_salary).format('($0.00a)')} - {numeral(job.max_salary).format('($0.00a)')}</h3>
                        <h3>Job Description</h3>
                        <p>{job.description}</p>
                        <h3>Requirements</h3>
                        <p>{job.requirements}</p>
                        <div>
                            <h3>Tags</h3>
                            <div className="job-tags">
                                {job.tags ? (
                                    job.tags.map(tag => {
                                        return (
                                            <TagView key={tag} tag={tag} />
                                        );
                                    })
                                ) : (null)}
                            </div>
                        </div>
                    </div>
                ) : (null)}
            </div>
        );
    }
}

export default withRouter(Job);