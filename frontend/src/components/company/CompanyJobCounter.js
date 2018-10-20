import React from 'react';
import axios from "axios";

const CompanyJobCounter = props => {
    const { count, published_count, unpublished_count } = props;
    return (
        <div className="company-job-count flex justify-space-between">
            <p>Published: {published_count}</p>
            <p>Drafts: {unpublished_count}</p>
        </div>
    );
}

export default CompanyJobCounter;