import React from "react";
import { Icon } from "antd";

const CompanyJobBalance = props => {
    return (
        <div className="company-balance">
            <div className="flex">
                <Icon type="thunderbolt" />
                <p>Job Credits: {props.job_credit}</p>
            </div>
        </div>
    );
}

export default CompanyJobBalance;