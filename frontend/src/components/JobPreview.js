import React from "react";
import '../css/JobPreview.css'

const JobPreview = props => {
    const { job } = props;
    return (
        <div className="job-preview">
            <h2>{job.title}</h2>
            <h3>{job.salary}</h3>
            <p>{job.body}</p>
        </div>
    );
}

export default JobPreview;