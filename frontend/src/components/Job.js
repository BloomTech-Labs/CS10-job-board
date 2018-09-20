import React from "react";
import { Tag } from "./";
import '../css/Job.css';

const Job = props => {
    // const { job } = props;
    const job = {
        company_name: `Cool New co.`,
        company_desc: `Specializing in cool tech.`,
        title: `Full Stack Developer`,
        salary: `60,000`,
        description: `We need someone who can do everything, impossibly! Are you them? Hello?`, 
        requirements: `Living human with skills in tech, 0-100 years experience.`,
        tags: [
            { name: `Cool`},
            { name: `Tech`},
            { name: `Fullstack`},
            { name: `Winning`},
            { name: `Not Losing`},
            { name: `MERNCSHARPJAVAORSCRIPT?`},
        ]
    }
    
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
                <div className="job-tags">
                    {job.tags ? (
                        job.tags.map(tag => {
                            return (
                                <Tag tag={tag} />
                            );
                        })
                    ) : (null)}
                </div>
            </div>
        </div>
    );
}

export default Job;