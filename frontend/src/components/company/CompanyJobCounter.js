import React from 'react';

const CompanyJobCounter = props => {
    const { count, stripe_count, published_count } = this.props;
    return (
        <div className="company-job-count">
            <p>Number of Job Posts saved: {count}</p>
            <p>Number of Job Posts published: {published_count}</p>
            <p>Number of Job Posts available: {stripe_count}</p>
        </div>
    );
}
export default CompanyJobCounter;