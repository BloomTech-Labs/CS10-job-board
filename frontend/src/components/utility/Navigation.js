import React from "react";
import { NavLink } from "react-router-dom";
import { Button } from "antd";
import "../../css/Navigation.css";
import { Search } from "../";

const Navigation = props => {
    const { employer } = props;
    return (
        <div className="nav-bar">
            <NavLink to='/jobs'>Jobs</NavLink>
            <NavLink to='/dashboard'>Dashboard</NavLink>
            <NavLink to='/account'>Account</NavLink>
            <NavLink to='/billing'>Billing</NavLink>
            <Search />
            {employer ? (
                <NavLink to='/addjob'><Button>Add Job</Button></NavLink>
                ) : (null)}
            <NavLink to='/' onClick={props.logOut}>Logout</NavLink>
        </div>
    );
}

export default Navigation;