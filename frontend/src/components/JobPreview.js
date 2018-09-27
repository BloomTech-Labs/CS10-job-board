import React from "react";
import '../css/JobPreview.css'

const JobPreview = props => {
    const { job } = props;
    return (
        <div className="job-preview">
            <h2>{job.title}</h2>
            <h3>{job.min_salart} - {job.max_salary}</h3>
            <p>{job.description}</p>
        </div>
    );
}

export default JobPreview;