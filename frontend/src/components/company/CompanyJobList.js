import React from "react";
import axios from "axios";
import { Button, Alert, Icon, Input } from "antd";
import { Link, withRouter } from "react-router-dom";
import { JobPreview } from "../";

class CompanyJobList extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            error: null,
            loading: null,
            search: "",
            jobs: []
        }
    }

    handleSearch = el => {
        this.setState({search: el.target.value});
    };
t 
    componentDidMount() {
        // // Prevents calling a GET request every time component is rendered
        // // jobs is inherited from App.js
        // const location = this.props.history.location;
        // if (location !== '/' && location !== '/jobs') {
        //     this.props.history.push('/');
        // }
        if (!this.state.jobs) {
            this.fetchJobs();
        }

    }

    fetchJobs = () => {
        this.setState({ loading: true });
        const token = localStorage.getItem('token');
        const requestOptions = { headers: { Authorization: `JWT ${token}` }};
        axios.get(`${process.env.REACT_APP_API}company/jobs/`, requestOptions)
            .then(response => {
                console.log(response);
                this.setState({ jobs: response.data });
            })
            .catch(err => {
                this.setState({ error: `Error processing request. Try Again.`});
            });
        this.setState({ loading: false });
    }



    render() {
        const { error, loading, jobs, search } = this.state;
        return (
            <div className="jobs-list-container">
                {error ? (
                   <Alert message={error} type="error" closable showIcon />
                   ) : (null)}
                <div>
                    <Input className="search" type="text" placeholder="search jobs" onChange={this.handleSearch} value={search}/>
                </div>
                {jobs ? (
                        <div className="jobs-list">
                            <Button type="primary" onClick={this.fetchJobs}>
                                <Icon type="sync" spin={loading}/>
                            </Button>
                                {jobs.map(job => {
                                return (
                                    <Link key={job.created_date} to={`/dashboard/${job.id}`}>
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

export default withRouter(CompanyJobList);