import React from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import { JobPreview } from "./";
import '../css/JobList.css'


const JobList = () => {
    let jobs = [];
    
    for (let i = 0; i < 10; i++) {
        const job = {
            id: i,
            title: `Job ${i}`,
            salary: `40,000 - 60,000`,
            body: `Description of the Job ${i}.`
        }
        jobs.push(job);
    }
    return (
        <div className="jobs-list">
            {jobs ? (
                jobs.map(job => {
                return (
                    <Link key={job.id} to={`/job/${job.id}`}>
                        <JobPreview job={job}/>
                    </Link>
                );
            })
            ) : (null)
        }
        </div>
    );
}

export default JobList;