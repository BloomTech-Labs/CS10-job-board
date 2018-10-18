import React from 'react';
import axios from 'axios';
import { Form, Button, Checkbox, Alert, Icon, Input, List, Switch, Dropdown, Menu, Radio, Tooltip, Popconfirm } from 'antd';
import { withRouter } from 'react-router-dom';
import { CompanyJobCounter } from '../';

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
            this.handleJobRequest();
        }

    }
    
    fetchJobs = query => {
        this.setState({ loading: true, error: null, message: null });
        const token = localStorage.getItem('token');
        const requestOptions = { headers: { Authorization: `JWT ${token}` }};
        let api = `${process.env.REACT_APP_API}company/jobs/`;
        let url = query ? api + query : api;
        axios.get(url , requestOptions)
        .then(response => {
            this.setState({ 
                jobs: response.data.results,
                count: response.data.count,
                next: response.data.next,
                previous: response.data.previous,
                loading: false
            });
        })
        .catch(err => {
            this.setState({ error: `Error processing request. Try Again.`, loading: false});
        });
    }
    
    handleJobRequest = e => {
        // During component mount, no e exists
        if (e) {
            // Clicking radio button passes query param to fetchJobs
            if (e.target.value === 'Published') {
                this.fetchJobs(`?published`);
            } else if (e.target.value === 'Unpublished') {
                this.fetchJobs(`?unpublished`);
            } else {
                this.fetchJobs();
            }
        } else {
            this.fetchJobs();
        }
    }
    
    // delete REST request
    deleteJob = (id, requestOptions) => {
        axios.delete(`${process.env.REACT_APP_API}company/jobs/${id}/`, requestOptions)
            .then(response => {
                this.state.bulk ? (
                    this.setState({ checkedList: this.state.checkedList.filter(item => item.id !== id)})
                ) : (
                    this.setState({ message: `Record successfully deleted`, loading: false })
                );
            })
            .catch(err => {
                this.state.bulk ? (
                    console.log(err)
                ) : (
                    this.setState({ error: `Error deleting records. Try again.`, loading: false})
                );
            });      
    }

    // handles delete requests for one or many items
    handleBulkDelete = e => {
        e.preventDefault();
        this.setState({ bulk: true, error: false, message: false, loading: true });
        let {checkedList} = this.state;
        const deleteJob = this.deleteJob;
        const numOfJobs = checkedList.length;
        const token = localStorage.getItem('token');
        const requestOptions = { headers: { Authorization: `JWT ${token}` }};
        if (numOfJobs > 0) {
            // function to ensure proper delete before moving on to next item in checkedList
            async function loop(requestOptions, deleteJob) {
                for (let i = 0; i < numOfJobs; i++) {
                    const id = checkedList[i];
                    await deleteJob(id, requestOptions);
                }
            };
            loop(requestOptions, deleteJob).then(response => {
                // Timeout to ensure delete by server before requesting new list of jobs
                setTimeout(() => {
                    this.handleJobRequest();
                    this.setState({ message: `Successfully removed ${numOfJobs} jobs.`, bulk: false, loading: false });
                }, 1000);
            })
            .catch(err => {
                this.setState({ error: `Error deleting jobs. Try again or refresh.`, bulk: false, loading: false});
            });
        }
    }

    // Next 3 fns: Sets display density of job list

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

    // Toggles click state of all displayed jobs

    checkAll = e => {
        // get a list of checkboxes inside the job list & click them
        let checkedList = document.querySelectorAll(".job-item .ant-checkbox-input");
        let checkedListIds = [];
        for (let i = 0; i < checkedList.length; i++) {
            const input = checkedList[i];
            checkedListIds.push(input.id);
            // removes onClick reference to not trigger this.checkJob(), assigned to each individual checkbox
            input.onClick = null;
            // Must check both states of parent checkbox and individual checkbox to get proper behavior
            if (e.target.checked && !input.checked) {
                input.click();
            } else if (!e.target.checked && input.checked) {
                input.click()
            }
            // reassignes the onClick reference to this.checkJob()
            checkedList[i].onClick = this.checkJob;
        }
        // if parent checkbox is checked replace state with list, else if not checked, replace checkedList with empty array
        this.setState({ checkedList:  e.target.checked ? checkedListIds : [] });
    }

    // individaul checkbox event handler, concats/filters array of checkedList state depending on checked state
    checkJob = e => {
        if (e.target.checked === true) {
            this.setState({ checkedList: this.state.checkedList.concat(e.target.id)});
        } else {
            this.setState({ checkedList: this.state.checkedList.filter(item => item !== e.target.id)});
        }
    }


    render() {
        const { error, message, loading, jobs, search, count, published_count, padding } = this.state;

        const displayDensityMenu = (
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
            <RadioGroup defaultValue="all" onChange={this.handleJobRequest} size="small">
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

                <Form className="company-job-search">
                    <Input className="search" type="text" placeholder="search jobs" onChange={this.onChange} name="search" value={search}/>
                    <Button type="primary" onClick={null}>Search</Button>
                </Form>
                
                <div className="job-list-actions">
                    {jobTypeMenu}

                    <Tooltip placement="top" trigger="hover" title={<span>Refresh</span>} mouseEnterDelay={0.8}>
                        <a onClick={this.handleJobRequest}>
                            <Icon type="sync" spin={loading}/>
                        </a>
                    </Tooltip>

                    <div className="whitespace"></div>
                    <Tooltip placement="top" trigger="hover" title={<span>Delete</span>} mouseEnterDelay={0.8}>
                        <Popconfirm
                            title="Are you sure you want to delete these jobs?"
                            okText="Delete"
                            cancelText="Cancel"
                            onConfirm={this.handleBulkDelete}
                        >
                            <Icon type="delete" onClick={null}/>
                        </Popconfirm>
                    </Tooltip>
                    <Dropdown overlay={displayDensityMenu} trigger={['click']} placement="bottomRight">
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