import React from 'react';
import axios from 'axios';
import { Form, Button, Checkbox, Alert, Icon, Input, List, Switch } from 'antd';
import { Link, withRouter } from 'react-router-dom';
import { CompanyJobPreview, CompanyJobCounter } from '../';

const FormItem = Form.Item;

class CompanyJobList extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            error: null,
            message: null,
            loading: false,
            search: "",
            count: null,
            published_count: null,
            jobs: [],
            next: null,
            previous: null
        }
    }

    onChange = e => {
        this.setState({ [e.target.name]: e.target.value });
    }
t 
    componentDidMount() {
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
                console.log(response);
                this.setState({ 
                    jobs: response.data.results,
                    count: response.data.count,
                    next: response.data.next,
                    previous: response.data.previous
                 });
            })
            .catch(err => {
                this.setState({ error: `Error processing request. Try Again.`});
            });
        this.setState({ loading: false });
    }



    render() {
        const { error, loading, jobs, search, count, published_count } = this.state;
        return (
            <div className="company-job-list-container">
                {error ? (
                   <Alert message={error} type="error" closable showIcon />
                   ) : (null)}

                <div>
                     <CompanyJobCounter count={count} published_count={published_count}/>
                </div>

                <Form>
                    <Checkbox type="checkbox" onChange={this.onChange} />
                    <Input className="search" type="text" placeholder="search jobs" onChange={this.onChange} name="search" value={search}/>
                    <Button type="primary" onClick={this.fetchJobs}>
                        <Icon type="sync" spin={loading}/>
                    </Button>
                </Form>

                {jobs ? (
                        <List 
                        className="flex column company-job-list" 
                        bordered={true} 
                        loading={loading} 
                        pagination={true} 
                        position="both" 
                        loadMore
                        gutter={1}
                        header={[
                           <h3>Title</h3>,
                           <p><strong>Published</strong></p>
                        ]}
                        >
                                {jobs.map(job => {
                                return (
                                    <List.Item 
                                        key={job.id}
                                        actions={[
                                            <a href="#">edit</a>,
                                            <Switch onChange={this.togglePublish} checked={job.is_active}/>
                                        ]}
                                    >
                                        <p>{job.title}</p>
                                    </List.Item>
                                );
                            })}
                        </List>
                ) : (null)}
            </div>
        );
    }
}

export default withRouter(CompanyJobList);


    //   <List
    //     className="job-list"
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