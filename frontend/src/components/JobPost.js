import React from "react";
import axios from "axios";
import '../css/JobPost.css';

class JobPost extends React.Component {
    state = {

    }

    onChange = e => {
        this.setState({ [e.target.name]: e.targe.value });
    }

    handleSubmit = e => {
        e.preventDefault();
        // axios post to jobs api
    }

    render() {
        return (
            <form className="job-post">
                <label htmlFor="">Title</label>
                <input type="text" onChange="this.onChange"/>
                <label htmlFor="">Top Skills</label>
                <input type="text" onChange="this.onChange"/>
                <label htmlFor="">Additional Skills</label>
                <input type="text" onChange="this.onChange"/>
                <label htmlFor="">Familiar With</label>
                <input type="text" onChange="this.onChange"/>
                <label htmlFor="">Description</label>
                <textarea name="" id="" cols="30" rows="10"></textarea>
                <label htmlFor="">Requirement</label>
                <textarea name="" id="" cols="30" rows="10"></textarea>
                <div>
                    <label htmlFor="">Active</label>
                    <input type="checkbox"/>
                </div>
                <div>
                    <label htmlFor="">This job does not require a degree.</label>
                    <input type="checkbox"/>
                </div>
                <div>
                    <button>Cancel</button>
                    <button onClick={this.handleSubmit}>Submit</button>
                </div>
            </form>
        );
    }
}

export default JobPost;