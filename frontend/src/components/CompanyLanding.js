import React from "react";
import { CompanyRegister } from ".";
import "../css/Landing.css";

class CompanyLanding extends React.Component {
    constructor(props) {
        super(props)
    }
    render() {
        return (
            <div className="landing-page">
                <div>
                    <h1>Open Jobs</h1>
                    <h2>No Degree, No Problem.<br/>Post a job, change a life.</h2>
                    {/* <img src={hero} draggable={false} alt="hero illustration"/> */}
                </div>
                <div>
                    <CompanyRegister {...this.props}/>
                </div>
            </div>
        );
    }
}

export default CompanyLanding;