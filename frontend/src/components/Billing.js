import React from "react";
import axios from "axios";
import '../css/Billing.css';

class Billing extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            id: null
        }
    }

    componentDidMount() {
        //axios call to mount user data
    }

    handleBuy = e => {
        e.preventDefault();
        // Stripe integration
    }

    render() {
        return (
            <div className="billing">
                <h3>Payment Info</h3>
                <form>
                    <div>
                        <label htmlFor="">Unlimited Jobs, 1 Month $199.99</label>
                        <input type="checkbox"/>
                    </div>
                    <div>
                        <label htmlFor="">Post 12 Jobs, $99.99</label>
                        <input type="checkbox"/>
                    </div>
                    <div>
                        <label htmlFor="">Post Job, $9.99</label>
                        <input type="checkbox"/>
                    </div>
                    <button onClick={this.handleBuy}>Buy Now</button>
                </form>
            </div>
        );
    }
}

export default Billing;
