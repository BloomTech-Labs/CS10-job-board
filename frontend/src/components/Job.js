import React from "react";
import { Tag } from "./";

const Job = props => {
    const { job } = props;
    return (
        <div className="job">
            <div>
                <img src="" alt="" className="job-logo"/>
                <h3>{job.company_name}</h3>
                <p>{job.company_desc}</p>
            </div>
            <h2>{job.title}</h2>
            <h3>{job.salary}</h3>
            <h3>Job Description</h3>
            <p>{job.description}</p>
            <h3>Requirement</h3>
            <p>{job.requirements}</p>
            <div>
                <h3>Tags</h3>
                {job.tags ? (
                    job.tags.map(tag => {
                        return (
                            <Tag tag={tag} />
                        );
                    })
                ) : (null)}
            </div>
        </div>
    );
}

export default Job;