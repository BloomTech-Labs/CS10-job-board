import React from "react";
import { NavLink } from "react-router-dom";
import { Menu, Dropdown, Button, Icon } from "antd";
import "../../css/Navigation.css";
import { Search, JobPost } from "../";

const Navigation = props => {
    const { employer, logOut, token, user } = props;
    const menu = (
        <Menu>
            <Menu.Item key="0">
                <Icon type="user"/>
                <NavLink to='/account'>Account</NavLink>
            </Menu.Item>

            <Menu.Item key="1">
                <Icon type="dollar"/>
                <NavLink to='/billing'>Billing</NavLink>
            </Menu.Item>
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
                    <JobPost logOut={logOut} token={token} company={user}/>
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