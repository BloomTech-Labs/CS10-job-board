import React from "react";
import { CompanyRegister } from ".";
import "../css/CompanyLanding.css";
import hero from "../assets/hero.svg";
class CompanyLanding extends React.Component {
    constructor(props) {
        super(props)
    }

    render() {
        return (
            <div className="company-landing">
            <img src={hero} draggable={false} alt="hero illustration"/>
                <div>
                    <CompanyRegister {...this.props}/>
                </div>
            </div>
        );
    }
}

export default CompanyLanding;