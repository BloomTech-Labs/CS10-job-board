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
            filtered: null,
            count: null,
            published_count: null,
            unpublished_count: null,
            jobList: null,
            publishedList: null,
            unpublishedList: null,
            next: null,
            previous: null,
            padding: null,
            checkedList: new Set(),
            bulk: false,
            jobType: null,
            job: null,
            drawer: false,
            drawerPlacement: "right",
            jobListType: null,
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
                loading: false
            });
            // call stack ordering to be called after job list is filtered.
            this.setState({
                published_count: this.state.publishedList.length,
                unpublished_count: this.state.unpublishedList.length
            });
        })
        .catch(err => {
            this.setState({ error: `Error processing request. Try Again.`, loading: false});
        });
    }

    // Display published, unpublished, or all jobs lists in tab selection
    setJobListType = e => {
        const query = e.target.value.toLowerCase() + 'List';
        if (query === 'allList') {
            this.setState({ jobListType: null });
        }
        else this.setState({ jobListType: query });
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
                    this.fetchJobs();
                    this.setState({ message: `Successfully removed ${numOfJobs} jobs.`, bulk: false, loading: false, checkedList: [] });
                }, 1000);
            })
            .catch(err => {
                this.setState({ error: `Error deleting jobs. Try again or refresh.`, bulk: false, loading: false});
            });
        }
    }

    // Filter search

    searchJobs = e => {
        this.setState({ search: e.target.value });
        let searchTerm = e.target.value.toLowerCase();
        if (searchTerm.length === 0) {
            return this.setState({ filtered: null });
        }
        // activeJobsList is jobs list to search through
        const jobListType = this.state.jobListType;
        const activeJobsList = this.state.jobListType ? this.state[`${jobListType}`] : this.state.jobList;
        const matchText = (job, searchTerm) => {
            for (let key in job) {
                const value = job[key];
                if (typeof(value) === 'string') {
                    if (value.toLowerCase().indexOf(`${searchTerm}`) !== -1) return true;
                }
            }
        }
        this.setState({ filtered: activeJobsList.filter(job => matchText(job, searchTerm))});
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

    handleCheckJob = e => {
        if (e.nativeEvent.shiftKey) {
            this.checkMultipleJobs()
        } else {
            this.checkJob(e);
        }
    }
    
    // add / remove checked inputs to Set() in state
    checkJob = e => {
        const job_id = e.target.id;
        const { checkedList } = this.state;
        if (e.target.checked && !checkedList.has(job_id)) {
            checkedList.add(job_id);
        } else if (!e.target.checked && checkedList.has(job_id)) {
            checkedList.delete(job_id);
        }

        // const { clicked, checkedList } = this.state;
        // // shift key condition - to select multiple items
        // const shiftPressed = e.nativeEvent.shiftKey;
        // if (shiftPressed) {
        //     // last clicked is last clicked without shift key active
        //     let lastClicked = clicked[clicked.length - 1];
        //     if (lastClicked) {
        //         this.checkJobShiftKey(e.target.checked, e.target.id, lastClicked);
        //     } else {
        //     // if clicked array is empty
        //         if (e.target.checked === true) {
        //             this.setState({ 
        //                 checkedList: checkedList.concat(e.target.id),
        //                 clicked: clicked.concat(e.target.id)
        //             });
        //         } else {
        //             this.setState({ 
        //                 checkedList: this.state.checkedList.filter(item => item !== e.target.id),
        //                 clicked: clicked.filter(item => item !== e.target.id)
        //             });
        //             // reset clicked array if checkedList is empty
        //             if (checkedList.length === 0) {
        //                 this.setState({ clicked: [] });
        //             }
        //         }
        //     }
        // // if shift key is not pressed
        // } else {
        //     if (e.target.checked === true) {
        //         this.setState({ 
        //             checkedList: checkedList.concat(e.target.id),
        //             clicked: clicked.concat(e.target.id)
        //         });
        //     } else {
        //         this.setState({ 
        //             checkedList: this.state.checkedList.filter(item => item !== e.target.id),
        //             clicked: clicked.filter(item => item !== e.target.id)
        //         });
        //         // reset clicked array if checkedList is empty
        //         if (checkedList.length === 0) {
        //             this.setState({ clicked: [] });
        //         }
        //     }
        // }
    }

    checkJobShiftKey = (checked, id, lastClicked) => {
        const currentChecked = id;
        const checkboxes = document.querySelectorAll(".job-item .ant-checkbox-input");
        let checkedListIds = [];
        let removeItems = [];
        let push = false;
        for (let i = 0; i < checkboxes.length; i++) {
            const input = checkboxes[i];
            // if item matches both last clicked and currently checked, loop through rest to deselect
            if (input.id === lastClicked && input.id === currentChecked) {

                if (checked) {
                    checkedListIds.push(input.id);
                } else {
                    removeItems.push(input.id);
                }
                // remove remaining items if checked
                for (let p = i + 1; p < checkboxes.length; p++) {
                    const input = checkboxes[p];
                    if (input.checked) {
                        removeItems.push(input.id);
                        input.click();
                    } else {
                        break;
                    }
                }
                // break once all remaining are unchecked
                break;
            }
            // if a node matches either last clicked or currently checked, flip the boolean "push"
            else if (input.id === lastClicked || input.id === currentChecked) {
                push = !push;
                // if push is true, it is the first time to be flipped:
                //      if input matches currently checked, then it indicates a backwards selection
                //      in the DOM node list. (currentChecked comes before lastClicked in list)
                if (push === true && input.id === currentChecked) {
                    // if the event is checked, add the input to later add to state
                    if (checked) {
                        checkedListIds.push(input.id);
                    } else {
                        removeItems.push(input.id);
                    }
                }
                // if push is false inside this else if block, it is the end of the selection list
                //      inside the loop of the DOM nodes. If the id matches currently checked, then 
                //      the selection can shrink by removing clicked items after currently selected.
                if (push === false && input.id === currentChecked) {
                    if (checked) {
                        checkedListIds.push(input.id);
                    } else {
                        removeItems.push(input.id);
                    }
                    // loop through remaining DOM nodes to uncheck
                    for (let p = i + 1; p < checkboxes.length; p++) {
                        const input = checkboxes[p];
                        if (input.checked) {
                            removeItems.push(input.id);
                            input.click();
                        } else {
                            break;
                        }
                    }
                    break;
                }
            }
            // adds items in between lastClicked and currentChecked if push boolean is true
            if (push) {
                if (checked && !input.checked) {
                    input.click();
                    checkedListIds.push(input.id);
                }
            }
        }
        const { checkedList, clicked } = this.state;
        let filteredCheckedList = checkedListIds.filter(id => checkedList.indexOf(id) === -1);
        const newCheckedList = checkedList.concat(filteredCheckedList);
        this.setState({ 
            checkedList: newCheckedList,
            clicked: clicked
        });
        // 
        if (removeItems.length > 0) {
            let updatedChecked = this.state.checkedList.filter(id => removeItems.indexOf(id) === -1);
            let updatedClicked = this.state.clicked.filter(id => removeItems.indexOf(id) === -1);
            this.setState({ 
                checkedList: updatedChecked,
                clicked: updatedClicked
            });
        }
    }

    // onClick handler for first checkbox
    checkAll = e => {
        // get a list of all checkboxes to check / uncheck
        // const checkboxes = document.querySelectorAll(".job-item .ant-checkbox-input");
        if (!e.target.checked) {
            this.setState({ clicked: [] });
        } else {

            this.setState({ checkedList: [] });
        }
    }


    checkRange = (checked, checkedList) => {
        let checkedListIds = [];
        for (let i = 0; i < checkedList.length; i++) {
            const input = checkedList[i];
            if (checked) {
                checkedListIds.push(input.id);
            }
            if (checked && !input.checked) {
                // input.checked = "checked";
                input.click();
            } else if (!checked && input.checked) {
                // input.checked = "checked";
                input.click();
            }
        }
        return checkedListIds;
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
            <RadioGroup defaultValue="all" onChange={this.setJobListType} size="small">
                <RadioButton value="All">All</RadioButton>
                <RadioButton value="Published">Published</RadioButton>
                <RadioButton value="Unpublished">Unpublished</RadioButton>
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
                            <Checkbox onChange={this.handleCheckJob} id={`${job.id}`} className="job-item"/>
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
                    <Input className="search" type="text" placeholder="search jobs" onChange={this.searchJobs} name="search" value={search}/>
                </Form>
                
                <div className="job-list-actions">
                
                    {jobTypeMenu}

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

                {/* If search term present, display list */}
                {filtered ? (
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
                                <Checkbox onChange={this.checkAll}/>
                                <div className="whitespace"></div>
                                <p>Boost</p>
                                <em className="ant-list-item-action-split"></em>
                                <p>Published</p>
                            </div>
                        ]}
                        >
                            {mapJobs(filtered)}
                        </List>
                ) : (
                    // Else if no search term, display jobs if jobList is not null
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
                                <Checkbox onChange={this.checkAll}/>
                                <div className="whitespace"></div>
                                <p>Boost</p>
                                <em className="ant-list-item-action-split"></em>
                                <p>Published</p>
                            </div>
                        ]}
                        >
                        {/* if jobListType is not null, render that list */}
                        {jobList ? (
                            mapJobs(jobListType ? this.state[`${jobListType}`] : this.state.jobList )
                        ) : (null)}
                        </List>
                )}

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