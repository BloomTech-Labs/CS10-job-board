import React from "react";
import axios from "axios";
import { Icon } from "antd";

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
                <Icon onClick={this.handleSearch} type="search" theme="outlined" />
            </form>
        );
    }
}

export default Search;