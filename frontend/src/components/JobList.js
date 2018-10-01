import React from "react";
import axios from "axios";
import { Alert, Icon } from "antd";
import { Link, withRouter } from "react-router-dom";
import { JobPreview } from "./";
import '../css/JobList.css'

class JobList extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            error: null,
            loading: null
        }
    }

    componentDidMount() {
        // Prevents calling a GET request every time component is rendered
        // jobs is inherited from App.js
        if (!this.props.jobs) {
            this.fetchJobs();
        }

    }

    fetchJobs = () => {
        this.setState({ loading: true });
        const token = localStorage.getItem('token');
        const requestOptions = { headers: { Authorization: `JWT ${token}` }};
        axios.get(`${process.env.REACT_APP_API}${this.props.history.location.pathname}`, requestOptions)
            .then(response => {
                // setJobs is inherited from App.js
                this.props.setJobs(response.data);
            })
            .catch(err => {
                this.setState({ error: `Error processing request. Try Again.`});
            });
        this.setState({ loading: false });
    }



    render() {
        const { jobs } = this.props;
        const { error, loading } = this.state;
        return (
            <div className="jobs-list-container">
                {error ? (
                   <Alert message={error} type="error" closable showIcon />
                   ) : (null)}
                {jobs ? (
                    <div className="jobs-list">
                        <button onClick={this.fetchJobs}>
                            <Icon type="sync" spin={loading}/>
                        </button>
                            {jobs.map(job => {
                            return (
                                <Link key={job.id} to={`/jobs/${job.id}`}>
                                    <JobPreview job={job}/>
                                </Link>
                            );
                        })}
                    </div>

                ) : (null)}
            </div>
        );
    }
}

export default withRouter(JobList);