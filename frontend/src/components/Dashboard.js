import React from "react";
import { withRouter } from "react-router-dom";

class Dashboard extends React.Component {
    constructor(props) {
        super(props)
        this.state = {

        }
    }

    render() {
        return (
            <div>
                <h1>Job Seeker Dashboard</h1>
            </div>
        );
    }
}

export default withRouter(Dashboard);