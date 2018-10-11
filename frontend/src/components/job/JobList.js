import React from "react";
import axios from "axios";
import { Button, Alert, Icon } from "antd";
import { Link, withRouter } from "react-router-dom";
import { JobPreview } from "../";

class JobList extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            error: null,
            loading: null,
            jobs: [],
        }
    }

    componentDidMount() {
        // Prevents calling a GET request every time component is rendered
        // jobs is inherited from App.js
        const location = this.props.history.location;
        if (location !== '/' && location !== '/jobs') {
            this.props.history.push('/');
        }
        if (!this.props.jobs) {
            this.fetchJobs();
        }

    }

    fetchJobs = () => {
        this.setState({ loading: true });
        axios.get(`${process.env.REACT_APP_API}jobs/`)
            .then(response => {
                // setJobs is inherited from App.js
                this.props.setJobs(response.data.results);
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
                        <Button type="primary" onClick={this.fetchJobs}>
                            <Icon type="sync" spin={loading}/>
                        </Button>
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
