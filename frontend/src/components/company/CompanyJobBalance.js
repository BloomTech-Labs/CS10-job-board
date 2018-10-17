import React from "react";
import axios from "axios";

class CompanyJobBalance extends React.Component {
    state = {
        stripe_count: null
    }

    componentDidMount() {
        // axios call to stripe https://api.stripe.com/v1/orders/customerID ?
    }

    render() {
        return (
            <div className="company-balance">
                <h3>Stripe Balance</h3>
            </div>
        );
    }
}

export default CompanyJobBalance;