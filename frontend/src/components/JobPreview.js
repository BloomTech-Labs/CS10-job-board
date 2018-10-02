import React from "react";
import '../css/JobPreview.css';

const StylelizedLine = () => {
    return (
        <hr
        />
    )
};

const JobPreview = props => {
    const { job } = props;
    return (
        <div>
            <div className="job-preview">
                <h3>{job.title}</h3>
                <h3>{job.min_salary} - {job.max_salary}</h3>
                <p>{job.description}</p>
            </div>
            <StylelizedLine />
        </div>
    );
}

export default JobPreview;