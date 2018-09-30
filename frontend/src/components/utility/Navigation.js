import React from "react";
import { NavLink } from "react-router-dom";
import { Menu, Dropdown, Button, Icon } from "antd";
import "../../css/Navigation.css";
import { Search } from "../";

const Navigation = props => {
    const { employer } = props;
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
                <NavLink to='/' onClick={props.logOut}>Logout</NavLink>
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
                <NavLink to='/addjob'><Button>Post a Job</Button></NavLink>
                ) : (null)}
            <Dropdown overlay={menu} trigger={['hover']} placement="bottomRight">
                <a className="ant-dropdown-link" href="#">
                  <Icon type="setting" style={{"margin-top": "6px"}}/>
                </a>
            </Dropdown>
        </div>
    );
}

export default Navigation;