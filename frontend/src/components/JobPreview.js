import React from "react";
import numeral from "numeral";
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
                <h2>{job.title}</h2>
                <h3>{numeral(job.min_salary).format('($0.00a)')} - {numeral(job.max_salary).format('($0.00a)')}</h3>
                <p>{job.description}</p>
            </div>
            <StylelizedLine />
        </div>
    );
}

export default JobPreview;