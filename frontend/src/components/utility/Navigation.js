import React from "react";
import { NavLink } from "react-router-dom";
import { Button } from "antd";
import "../../css/Navigation.css";
import { Search } from "../";

const Navigation = props => {
    return (
        <div className="nav-bar">
            <NavLink to='/jobs'>Jobs</NavLink>
            <NavLink to='/account'>Account</NavLink>
            <NavLink to='/billing'>Billing</NavLink>
            <NavLink to='/dashboard'>Dashboard</NavLink>
            <NavLink to='/addjob'>Add Job</NavLink>
            <Search />
            <NavLink to='/' onClick={props.logOut}><Button>Logout</Button></NavLink>
        </div>
    );
}

export default Navigation;