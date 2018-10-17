import React from 'react';
import axios from "axios";

const CompanyJobCounter = props => {
    const { count, published_count } = props;
    return (
        <div className="company-job-count">
            <p>Number of Job Posts saved: {count}</p>
            <p>Number of Job Posts published: {published_count}</p>
        </div>
    );
}

export default CompanyJobCounter;