import React from 'react';
import axios from 'axios';
import { Form, Button, Checkbox, Alert, Icon, Input, List, Switch, Dropdown, Menu, Radio } from 'antd';
import { Link, withRouter } from 'react-router-dom';
import { CompanyJobPreview, CompanyJobCounter } from '../';

const FormItem = Form.Item;
const RadioButton = Radio.Button;
const RadioGroup = Radio.Group;

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
            jobs: null,
            next: null,
            previous: null,
            padding: null,
            checkedList: [],
            checkAll: false,
            bulk: false,
            jobType: null
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

    deleteJob = (id, requestOptions) => {
        axios.delete(`${process.env.REACT_APP_API}company/jobs/${id}/`, requestOptions)
            .then(response => {
                this.state.bulk ? (
                    this.setState({ checkedList: this.state.checkedList.filter(item => item.id !== id)})
                ) : (
                    this.setState({ message: `Record successfully deleted` })
                );
            })
            .catch(err => {
                this.state.bulk ? (
                    console.log(err)
                ) : (
                    this.setState({ error: `Error deleting records. Try again.`})
                );
            });
        this.setState({ loading: false });       
    }

    handleBulkDelete = e => {
        e.preventDefault();
        this.setState({ bulk: true, error: false, message: false });
        let {checkedList} = this.state;
        const deleteJob = this.deleteJob;
        const numOfJobs = checkedList.length;
        const token = localStorage.getItem('token');
        const requestOptions = { headers: { Authorization: `JWT ${token}` }};
        if (numOfJobs > 0) {
            (async function loop(requestOptions, deleteJob) {
                for (let i = 0; i < numOfJobs; i++) {
                    const id = checkedList[i];
                    await deleteJob(id, requestOptions);
                }
            })(requestOptions, deleteJob);
            this.setState({ message: `Successfully removed ${numOfJobs} jobs.`, buld: false });
            this.fetchJobs();
        }
    }


    setPaddingCompact = e => {
        e.preventDefault();
        this.setState({ padding: "4px"});
    }

    setPaddingNormal = e => {
        e.preventDefault();
        this.setState({ padding: "10px"});
    }

    setPaddingLarge = e => {
        e.preventDefault();
        this.setState({ padding: "25px"});
    }

    checkAll = e => {
        // get a list of checkboxes inside the job list & click them
        let checkedList = document.querySelectorAll(".job-item .ant-checkbox-input");
        let checkedListIds = [];
        for (let i = 0; i < checkedList.length; i++) {
            const input = checkedList[i];
            checkedListIds.push(input.id);
            input.onClick = null;
            if (e.target.checked && !input.checked) {
                input.click();
            } else if (input.checked) {
                input.click()
            }
            checkedList[i].onClick = this.checkJob;
        }
        this.setState({ checkedList:  e.target.checked ? checkedListIds : [] });
    }

    checkJob = e => {
        if (e.target.checked === true) {
            this.setState({ checkedList: this.state.checkedList.concat(e.target.id)});
        } else {
            this.setState({ checkedList: this.state.checkedList.filter(item => item !== e.target.id)});
        }
    }

    handleJobType = e => {
        this.setState({ jobType: e.target.value });
    }

    render() {
        const { error, message, loading, jobs, search, count, published_count, padding, jobType } = this.state;

        const displayDensity = (
           <Menu>
               <Menu.Item key="0">
                   <a href="#" onClick={(e) => this.setPaddingCompact(e)}>Compact</a>
               </Menu.Item>

               <Menu.Item key="1">
                   <a href="#" onClick={(e) => this.setPaddingNormal(e)}>Normal</a>
               </Menu.Item>

               <Menu.Item key="2">
                   <a href="#" onClick={(e) => this.setPaddingLarge(e)}>Large</a>
               </Menu.Item>
           </Menu>
           );

        const jobTypeMenu = (
            <RadioGroup defaultValue="all" onChange={this.handleJobType} size="small">
                <RadioButton value="All">All</RadioButton>
                <RadioButton value="Published">Published</RadioButton>
                <RadioButton value="Unpublished">Unpublished</RadioButton>
            </RadioGroup>
        )


        return (
            <div className="company-job-list-container">

                {error ? (
                  <Alert message={error} type="error" closable showIcon banner />
                  ) : (null)}
                {message ? (
                  <Alert message={message} type="success" closable showIcon />
                ) : (null)}

                <div>
                     <CompanyJobCounter count={count} published_count={published_count}/>
                </div>

                <Form>
                    <Checkbox onChange={this.onChange} />
                    <Input className="search" type="text" placeholder="search jobs" onChange={this.onChange} name="search" value={search}/>
                    <Button type="primary" onClick={this.fetchJobs}>
                        <Icon type="sync" spin={loading}/>
                    </Button>
                </Form>
                
                <div className="job-list-actions">
                    {jobTypeMenu}
                        <div className="whitespace"></div>
                        <Icon type="delete" onClick={this.handleBulkDelete} />
                        <Dropdown overlay={displayDensity} trigger={['click']} placement="bottomRight">
                            <a className="flex">
                              <Icon type="bars" />
                            </a>
                        </Dropdown>
                </div>

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
                            <div key={1} className="flex baseline">
                                <Checkbox 
                                    onChange={this.checkAll}/>
                                <em className="ant-list-item-action-split-modified"></em>
                            </div>,
                            <p key={2}>Published</p>
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
                                        style = {{ paddingTop: padding ? (padding) : "10px", paddingBottom: padding ? (padding) : "10px"}}
                                    >
                                        <Checkbox onChange={this.checkJob} id={`${job.id}`} className="job-item"/>
                                        <em className="ant-list-item-action-split-modified"></em>
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