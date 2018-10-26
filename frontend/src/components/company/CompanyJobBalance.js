import React from "react";
import axios from "axios";
import { Icon } from "antd";

const CompanyJobBalance = props => {
    return (
        <div className="company-balance">
            <div className="flex">
                <Icon type="shopping" />
                <h3>Job Credits: {props.job_credit}</h3>
            </div>
        </div>
    );
}

export default CompanyJobBalance;