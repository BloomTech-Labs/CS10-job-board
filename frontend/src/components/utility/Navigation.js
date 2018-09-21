import React from "react";
import { NavLink } from "react-router-dom";
import "../../css/Navigation.css";
import { Search } from "../";

const Navigation = props => {
    return (
        <div className="nav-bar">
            <NavLink to='/jobs'>Jobs</NavLink>
            <NavLink to='/account'>Account</NavLink>
            <NavLink to='/billing'>Billing</NavLink>
            <NavLink to='/dashboard'>Dashboard</NavLink>
            <Search />
            <NavLink to='/' onClick={props.handleLogout}>Logout</NavLink>
        </div>
    );
}

export default Navigation;