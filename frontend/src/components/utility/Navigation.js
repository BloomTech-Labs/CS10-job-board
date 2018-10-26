import React from 'react';
import { NavLink } from 'react-router-dom';
import { Menu, Dropdown, Icon } from 'antd';
import { Search, JobPost } from '../';

const Navigation = props => {
    const { employer, logOut, user } = props;
    const menu = (
        <Menu>
            <Menu.Item key="0">
                <Icon type="user"/>
                <NavLink to='/account'>Account</NavLink>
            </Menu.Item>

            {employer ? (
                <Menu.Item key="1">
                    <Icon type="dollar"/>
                    <NavLink to='/billing'>Billing</NavLink>
                </Menu.Item>
            ) : (null)}
            
            <Menu.Divider />
            <Menu.Item key="3">
                <Icon type="poweroff"/>
                <NavLink to='/signin' onClick={(e) => props.logOut(e)}>Logout</NavLink>
            </Menu.Item>
        </Menu>
        );


    return (
        <div className="nav-bar">
            <NavLink to='/jobs'>Jobs</NavLink>
            <NavLink to='/dashboard'>Dashboard</NavLink>
            <div className="whitespace"></div>
            <Search />
            {employer ? (  
                    <JobPost company={user}/>
                ) : (null)}
            <Dropdown overlay={menu} trigger={['click']} placement="bottomRight">
                <a className="ant-dropdown-link">
                  <Icon type="setting" />
                </a>
            </Dropdown>
        </div>
    );
}

export default Navigation;