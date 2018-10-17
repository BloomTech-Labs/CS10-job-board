import React from 'react';
import axios from 'axios';
import { Form, Button, Checkbox, Alert, Icon, Input, List, Switch, Dropdown, Menu } from 'antd';
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
            previous: null,
            padding: null,
            // indeterminate: true,
            checkedList: [],
            checkAll: false
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

    toggleIndeterminate = e => {
        this.setState({ indeterminate: !this.state.indeterminate });
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
            } else if (!e.target.checked && input.checked ) {
                input.click()
            }
            checkedList[i].onClick = this.checkJob;
        }
        this.setState({ checkedList:  e.target.checked ? checkedListIds : [] });
    }

    checkJob = e => {
        console.log(e.target);
        if (e.target.checked === true) {
            this.setState({ checkedList: this.state.checkedList.concat(e.target.id)});
        } else {
            this.setState({ checkedList: this.state.checkedList.filter(item => item !== e.target.id)});
        }
    }

    render() {
        const { error, loading, jobs, search, count, published_count, padding, indeterminate } = this.state;

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


        return (
            <div className="company-job-list-container">
                {error ? (
                   <Alert message={error} type="error" closable showIcon />
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

                <Dropdown overlay={displayDensity} trigger={['click']} placement="bottomRight">
                    <a className="ant-dropdown-link">
                      <Icon type="bars" />
                    </a>
                </Dropdown>

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
                                    key={1} 
                                    // indeterminate={indeterminate}
                                    onChange={this.checkAll}/>
                                <em className="ant-list-item-action-split-modified"></em>
                                <h3 key={2}>Title</h3>
                            </div>,
                           <p key={3}>Published</p>
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