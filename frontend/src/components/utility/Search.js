import React from "react";
import axios from "axios";
import '../../css/Search.css';

class Search extends React.Component {
    state = {
        input: null
    }

    handleSearch = e => {
        e.preventDefault();
        // axios post to search? (algolia.com) 
    }

    render() {
        return(
            <form className="search">
                <input type="text"/>
                <button onClick={this.handleSearch}>Search</button>
            </form>
        );
    }
}

export default Search;