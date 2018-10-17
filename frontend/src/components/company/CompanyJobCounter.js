import React from 'react';
import axios from "axios";

class CompanyJobCounter extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            stripe_count: null
        }   
    }

    componentDidMount() {
        // axios call to Stripe API asking for how many jobs purchased or what is left
    }

    render() {
        const { count, published_count } = this.props;
        const { stripe_count } = this.state;
        return (
            <div className="company-job-count">
                <p>Number of Job Posts saved: {count}</p>
                <p>Number of Job Posts published: {published_count}</p>
                <p>Number of Job Posts available: {stripe_count}</p>
            </div>
        );
    }    
}

export default CompanyJobCounter;