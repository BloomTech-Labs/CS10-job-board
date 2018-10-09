import React from "react";
import axios from "axios";
import { Button, Alert, Icon, Input } from "antd";
import { Link, withRouter } from "react-router-dom";
import PostedPreview from "./PostedPreview";
import '../../css/JobList.css'

class PostedJobs extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            error: null,
            loading: null,
            search: "hello",
            jobs: this.props.jobs
        }
    }
    handleSearch = el => {
        this.setState({search: el.target.value});
    };
t 
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
                <div>
                    <Input className="search" type="text" placeholder="search jobs" onChange={this.handleSearch} value={this.state.handleSearch}/>
                </div>
                {jobs ? (
                        <div className="jobs-list">
                            <Button type="primary" onClick={this.fetchJobs}>
                                <Icon type="sync" spin={loading}/>
                            </Button>
                                {jobs.map(job => {
                                return (
                                    <Link key={job.id} to={`/dashboard/${job.id}`}>
                                        <PostedPreview job={job}/>
                                    </Link>
                                );
                            })}
                        </div>
                ) : (null)}
            </div>
        );
    }
}

export default withRouter(PostedJobs);