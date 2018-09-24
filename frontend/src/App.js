import React from "react";
import { Route, Switch, NavLink, withRouter } from "react-router-dom";
import { Landing, NoMatch } from "./components";
import  PostJob  from './components/PostJob';
import './css/App.css';

class App extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      loggedIn: false
    }
  }

  componentDidMount() {
    const token = localStorage.getItem('token');
    if (token) {
      this.setState({ loggedIn: true });
    }
  }

  render() {
    const { loggedIn } = this.state;
    return (
      <div className="App">
        <Switch>
          <Route exact path="/" component={Landing} />
          <Route path="/post-job" component={PostJob} />
          <Route component={NoMatch} />
        </Switch>
      </div>
    );
  }
}

export default withRouter(App);
