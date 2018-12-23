import React from 'react';
import axios from 'axios';
import { Form, Button, Checkbox, Alert, Icon, Input, List, Switch, Dropdown, Menu, Radio, Tooltip, Popconfirm, Drawer } from 'antd';
import { withRouter } from 'react-router-dom';
import { CompanyJobCounter, CompanyJobEdit, CompanyJobBalance } from '../';

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
            filtered: [],
            count: null,
            published_count: null,
            unpublished_count: null,
            jobList: null,
            publishedList: null,
            unpublishedList: null,
            jobListType: "jobList",
            next: null,
            previous: null,
            padding: null,
            checkedList: {},
            lastChecked: null,
            jobType: null,
            job: null,
            drawer: false,
            drawerPlacement: "right",
            popconfirmPublish: null
        }
    }

    onChange = e => {
        this.setState({ [e.target.name]: e.target.value });
    }

    componentDidMount() {
        if (!this.state.jobList) {
            this.fetchJobs();
        }
    }
    
    fetchJobs = () => {
        this.setState({ loading: true, error: null, message: null });
        const token = localStorage.getItem('token');
        this.props.fetchMembership(token);
        const requestOptions = { headers: { Authorization: `JWT ${token}` }};
        let api = `${process.env.REACT_APP_API}company/jobs/`;
        // const { jobListType } = this.state;
        // let url = jobListType ? api + `?${jobListType}` : api;
        axios.get(api , requestOptions)
        .then(response => {
            this.setState({ 
                jobList: response.data.results,
                count: response.data.count,
                next: response.data.next,
                previous: response.data.previous,
                publishedList: response.data.results.filter(job => job.is_active === true),
                unpublishedList: response.data.results.filter(job => job.is_active === false),
                jobIds: response.data.results.map(job => job.id),
                loading: false
            });
            // call stack ordering to be called after job list is filtered.
            this.setState({
                published_count: this.state.publishedList.length,
                unpublished_count: this.state.unpublishedList.length,
                checkedList: response.data.results.reduce((obj, job) => {
                    obj[job.id] = false;
                    return obj;
                }, {})
            });
        })
        .catch(err => {
            this.setState({ error: `Error processing request. Try Again.`, loading: false});
        });
    }
    
    // delete REST request
    deleteJob = (id, requestOptions, cb) => {
        axios.delete(`${process.env.REACT_APP_API}company/jobs/${id}/`, requestOptions)
        .then(response => {
            cb(null, response);
        })
        .catch(error => {
            cb(error);
        });   
    }

    // TODO: refactor API to accept multiple ID ?
    handleDeleteJob = e => {
        e.preventDefault();
        this.setState({ error: false, message: false, loading: true });
        const {checkedList} = this.state;
        const currentJobList = this.state[`${this.state.jobListType}`];
        const isChecked = job => {
            if (checkedList[job.id]) return true;
        }
        const jobIDsToDelete = currentJobList.filter(job => isChecked(job)).map(job => job.id);
        const token = localStorage.getItem('token');
        const requestOptions = { headers: { Authorization: `JWT ${token}` }};
        const deleteJob = this.deleteJob;
        async function deleteLoop(requestOptions, deleteJob) {
            let successArr = [];
            let errorArr = [];
            const cb = (error, response) => {
                if (error) errorArr.push(error);
                else successArr.push(response);
            }
            for (let id of jobIDsToDelete) {
                await deleteJob(id, requestOptions, cb);
            }
            return {success: successArr, error: errorArr};
        }
        deleteLoop(requestOptions, deleteJob).then(response => {
            setTimeout(() => {
                const success = response.success.length;
                const error = response.error.length;
                this.fetchJobs();
                this.setState({ 
                    message: success > 0 ? `Successfully removed ${success} job${success === 1 ? '' : 's'}` : null,
                    error: error > 0 ? `Failed to delete ${error} job${error === 1 ? '': 's'}` : null,
                    loading: false });
            }, 1000, response);
        })
    }

    // Display published, unpublished, or all jobs lists in tab selection
    setJobListType = listName => {
        this.setState({ jobListType: listName });
        if (this.state.search.length > 0) {
            this.searchJobs(this.state[`${listName}`], this.state.search);
        }
    }

    // Filter search
    searchJobs = (list, searchTerm) => {

        if (searchTerm.length === 0) {
            return this.setState({ filtered: [] });
        }

        const matchText = (job, searchTerm) => {
            for (let key in job) {
                const value = job[key];
                if (typeof(value) === 'string') {
                    if (value.toLowerCase().indexOf(`${searchTerm}`) !== -1) return true;
                }
            }
        }
        let filtered = list.filter(job => matchText(job, searchTerm));
        this.setState({ filtered: filtered });
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

    // add / remove checked inputs to Set() in state
    checkJob = e => {
        const job_id = e.target.id;
        const checked = e.target.checked;
        let { checkedList } = this.state;
        checkedList[job_id] = checked;
        this.setState({ checkedList: checkedList});
    }

    handleCheckJob = e => {
        if (e.target.checked && !e.nativeEvent.shiftKey) {
            this.setState({ lastChecked: e.target.id });
            this.checkJob(e);
        } else if (e.target.checked && e.nativeEvent.shiftKey && this.state.lastChecked !== e.target.id) {
            this.checkMultipleJobs(e);
        } else {
            this.checkJob(e);
        }
    }

    checkMultipleJobs = e => {
        const checked_id = parseInt(e.target.id);
        const lastChecked = parseInt(this.state.lastChecked);
        const { checkedList } = this.state;
        const jobIds = this.state.jobIds;
        let indexChecked = jobIds.indexOf(checked_id);
        let indexLastChecked = jobIds.indexOf(lastChecked);
        let order = indexChecked > indexLastChecked ? true : false;
        let start = order ? indexLastChecked : indexChecked;
        let end = order ? indexChecked : indexLastChecked;

        for (let i = start; i <= end; i++) {
            const id = jobIds[i];
            checkedList[id] = true;
        }
        this.setState({ checkedList: checkedList });
    }

    // onClick handler for first checkbox
    checkAll = e => {
        const { checkedList } = this.state;
        const checked = e.target.checked;
        for (let job in checkedList) {
            checkedList[job] = checked;
        }
        this.setState({ checkedList: checkedList });
    }

    // show JobEdit.js view drawer
    openDrawer = id => {
        this.setState({ job: this.state.jobList.filter(job => job.id === id)[0] });
        this.setState({ drawer: true });
    }

    closeDrawer = () => {
        this.setState({ job: null, drawer: false });
    }

    // TODO: Change position of drawer


    setPopconfirmPublish = e => {
        this.setState({ popconfirmPublish: e });
    }
    
    togglePublish = (id, is_active )=> {
        this.setState({ error: null, message: null, loading: true });
        const token = localStorage.getItem('token');
        const requestOptions = { headers: { Authorization: `JWT ${token}` }};
        axios.patch(`${process.env.REACT_APP_API}company/jobs/${id}/`, { is_active: !is_active }, requestOptions)
            .then(response => {
                if (is_active) this.setState({ message: `Job published!`});
                else this.setState({ message: `Job successfully unpublished!`});
                this.fetchJobs();
            })
            .catch(err => {
                this.setState({ error: `Error publishing job. Please try again.`, loading: false});
            });
    }

    boostPost = id => {
        this.setState({ error: null, message: null, loading: true });
        const token = localStorage.getItem('token');
        const requestOptions = { headers: { Authorization: `JWT ${token}` }};
        // setting post_expiration to null triggers a post_save reset of pubslish & expiration of date to now()
        axios.patch(`${process.env.REACT_APP_API}company/jobs/${id}/`, { post_expiration: null }, requestOptions)
            .then(response => {
                this.setState({ message: `Job boosted!`});
                this.fetchJobs();
            })
            .catch(err => {
                this.setState({ error: `Error boosting job. Please try again.`, loading: false});
            });
    }


    render() {
        const {
            error,
            message,
            loading,
            filtered,
            search,
            count,
            published_count,
            unpublished_count,
            checkedList,
            padding,
            job,
            drawer,
            drawerPlacement,
            jobList,
            jobListType,
            popconfirmPublish
        } = this.state;    

        const displayDensityMenu = (
           <Menu className="company-job-list-density">
               <Menu.Item key="0">
                   <div onClick={(e) => this.setPaddingCompact(e)}>Compact</div>
               </Menu.Item>

               <Menu.Item key="1">
                   <div onClick={(e) => this.setPaddingNormal(e)}>Normal</div>
               </Menu.Item>

               <Menu.Item key="2">
                   <div onClick={(e) => this.setPaddingLarge(e)}>Large</div>
               </Menu.Item>
           </Menu>
           );

        const jobTypeMenu = (
            <RadioGroup defaultValue="jobList" onChange={(e) => this.setJobListType(e.target.value)} size="small">
                <RadioButton value="jobList">All</RadioButton>
                <RadioButton value="publishedList">Published</RadioButton>
                <RadioButton value="unpublishedList">Unpublished</RadioButton>
                <Tooltip placement="top" trigger="hover" title={<span>Refresh</span>} mouseEnterDelay={0.8}>
                    <Button className="company-job-edit-link" onClick={this.fetchJobs} value="refresh-jobs" style={{marginLeft: "6px"}}>
                        <Icon type="sync" spin={loading} />
                    </Button>
                </Tooltip>
            </RadioGroup>

        )

        const mapJobs = list => {
            return (
                list.map(job => {
                    return (
                        <List.Item 
                            key={job.id}
                            id={job.id}
                            actions={[
                                job.is_active ? (
                                <Popconfirm
                                    title= {<div>
                                        <p>Are you sure you want to boost this post?</p>
                                        <p>(Cost: 1 Job Post)</p>
                                    </div>}
                                    okText={`Boost`}
                                    cancelText={`Cancel`}
                                    onConfirm={() => this.boostPost(job.id, job.is_active)}
                                >
                                    <Icon type="thunderbolt" name="boost"/>
                                </Popconfirm>
                                ) : (<div style={{ width: "1px", height: "8px"}}></div>),
                                <button className="company-job-edit-link" onClick={() => this.openDrawer(job.id)}>edit</button>,
                                <Popconfirm
                                    title = {
                                        popconfirmPublish ? `Are you sure you want to publish this job?` : `Are you sure you want to unpublish this job?`
                                    }
                                    okText={popconfirmPublish ? `Publish` : `Unpublish`}
                                    cancelText="Cancel"
                                    onConfirm={() => this.togglePublish(job.id, job.is_active)}
                                >
                                    <Switch checked={job.is_active} onChange={this.setPopconfirmPublish}/>
                                </Popconfirm>
                            ]}
                            style = {{ paddingTop: padding ? (padding) : "10px", paddingBottom: padding ? (padding) : "10px"}}
                        >
                            <Checkbox 
                                onChange={this.handleCheckJob} 
                                id={`${job.id}`} 
                                checked={checkedList[job.id]}
                                className="job-item"/>
                            <em className="ant-list-item-action-split-modified"></em>
                            <p>{job.title}</p>
                        </List.Item>
                    );
                })
            )
        };


        return (
            <div className="company-job-list-container">

                {error ? (
                  <Alert message={error} type="error" closable showIcon banner />
                  ) : (null)}
                {message ? (
                  <Alert message={message} type="success" closable showIcon />
                ) : (null)}

                <div className="flex baseline">
                    <CompanyJobBalance job_credit={this.props.job_credit} subscription={this.props.subscription}/>
                    <div className="whitespace"></div>
                    <CompanyJobCounter count={count} published_count={published_count} unpublished_count={unpublished_count}/>
                </div>

                <Form className="company-job-search">
                    <Input className="search" type="text" placeholder="search jobs" onChange={this.onChange} onKeyUp={() => this.searchJobs(this.state[`${jobListType}`], search)} name="search" value={search}/>
                </Form>
                
                <div className="job-list-actions">
                
                    {jobTypeMenu}

                    <div className="whitespace"></div>
                    <Tooltip placement="top" trigger="hover" title={<span>Delete</span>} mouseEnterDelay={0.8}>
                        <Popconfirm
                            title="Are you sure you want to delete these jobs?"
                            okText="Delete"
                            cancelText="Cancel"
                            onConfirm={this.handleDeleteJob}
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

                <List
                    className="flex column company-job-list"
                    bordered={true}
                    loading={loading}
                    pagination={true}
                    position="both"
                    loadMore
                    gutter={1}
                    header={[
                        <div key={1}>
                            <Checkbox onChange={this.checkAll} />
                            <div className="whitespace"></div>
                            <p>Boost</p>
                            <em className="ant-list-item-action-split"></em>
                            <p>Published</p>
                        </div>
                    ]}
                >
                    {jobList && filtered.length === 0 ? (
                        mapJobs(this.state[`${jobListType}`])
                    ) : (
                        mapJobs(filtered)
                    )}
                </List>
                
                <Drawer
                    width={580}
                    visible={drawer}
                    placement={drawerPlacement}
                    toggleDrawer={this.toggleDrawer}
                    onClose={this.closeDrawer}
                    className="company-job-drawer"
                >
                    {/* Pass job key to rerender different jobs w/o unmounting component*/}
                        <CompanyJobEdit key={job ? job.id : null} job={job} fetchJobs={this.fetchJobs}/>
                </Drawer>
        
            </div>
        );
    }
}

export default withRouter(CompanyJobList);