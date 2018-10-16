import React from 'react';
import axios from 'axios';
import { Form, Button, Checkbox, Alert, Icon, Input } from 'antd';
import { Link, withRouter } from 'react-router-dom';
import { JobPreview, CompanyJobCounter } from '../';

class CompanyJobList extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            error: null,
            message: null,
            loading: null,
            search: "",
            count: null,
            stripe_count: null,
            published_count: null,
            is_active: false,
            jobs: []
        }
    }

    onChange = e => {
        this.setState({ [e.target.name]: e.target.value });
    }
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
        this.setState({ loading: true, error: null, message: null });
        const token = localStorage.getItem('token');
        const requestOptions = { headers: { Authorization: `JWT ${token}` }};
        axios.get(`${process.env.REACT_APP_API}company/jobs/`, requestOptions)
            .then(response => {
                // console.log(response);
                this.setState({ 
                    jobs: response.data.results,
                    count: response.data.count,
                 });
            })
            .catch(err => {
                this.setState({ error: `Error processing request. Try Again.`});
            });
        this.setState({ loading: false });
    }



    render() {
        const { error, loading, jobs, search, count, stripe_count, published_count, is_active } = this.state;
        return (
            <div className="jobs-list-container">
                {error ? (
                   <Alert message={error} type="error" closable showIcon />
                   ) : (null)}
                <div>
                    <CompanyJobCounter count={count} stripe_count={stripe_count} published_count={published_count}/>
                </div>

                <Form>
                    <Checkbox type="checkbox" name="is_active" value={is_active} onChange={this.onChange} />
                    <Input className="search" type="text" placeholder="search jobs" onChange={this.onChange} name="search" value={search}/>
                    <Button type="primary" onClick={this.fetchJobs}>
                        <Icon type="sync" spin={loading}/>
                    </Button>
                </Form>

                {jobs ? (
                    <div className="jobs-list">
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


    //   <List
    //     className="jobs-list"
    //     loading={true}
    //     itemLayout="horizontal"
    //     // loadMore={loadMore}
    //     dataSource={list}
    //     renderItem={item => (
    //       <List.Item actions={[<a>edit</a>, <a>more</a>]}>
    //         <Skeleton avatar title={false} loading={item.loading} active>
    //           <List.Item.Meta
    //             avatar={<Avatar src="https://zos.alipayobjects.com/rmsportal/ODTLcjxAfvqbxHnVXCYX.png" />}
    //             title={<a href="https://ant.design">{item.name.last}</a>}
    //             description="Ant Design, a design language for background applications, is refined by Ant UED Team"
    //           />
    //           <div>content</div>
    //         </Skeleton>
    //       </List.Item>
    //     )}
    //   />