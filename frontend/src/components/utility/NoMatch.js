import React from "react";
import { Link } from "react-router-dom";
import "../../css/NoMatch.css";

const NoMatch = () => {
    return (
        <div className="no-match">
            <h2>Woopsies!</h2>
            <h3>The page you are looking for does not exit.</h3>
            <Link to="/">Home</Link>
        </div>
    );
}

export default NoMatch;