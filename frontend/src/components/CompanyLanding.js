import React from "react";
import { CompanyRegister } from ".";
import "../css/CompanyLanding.css";


class CompanyLanding extends React.Component {
    constructor(props) {
        super(props)
    }

    render() {
        return (
            <div className="company-landing">
                <div>
                    <h1 className="landing-title">Open Jobs</h1>
                    <h2 className="landing-copy">No Degree, No Problem.<br/>Post a job, change a life.</h2>
                </div>
                <div className="landing-form">
                    <CompanyRegister {...this.props}/>
                </div>
            </div>
        );
    }
}

export default CompanyLanding;