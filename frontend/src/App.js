import React from "react";
import { Route, Switch, NavLink, withRouter } from "react-router-dom";
import { Account, Billing, Dashboard, Job, JobList, JobPost, Landing, Navigation, NoMatch } from "./components";
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
      this.props.history.push('/jobs');
    }
  }

  logIn = () => {
    this.setState({ loggedIn: true});
  }

  handleLogout = e => {
    e.preventDefault();
    localStorage.removeItem('token');
    this.setState({ loggedIn: false });
    this.props.history.push('/');
  }

  render() {
    const { loggedIn } = this.state;
    return (
      <div className="App">
        {loggedIn ? (
          <Navigation handleLogout={this.handleLogout}/>
        ) : (null)}
        <div className="main">
          <Switch>
            <Route exact path="/" render={props => (<Landing logIn={this.logIn}/>)} />
            <Route path="/jobs" component={JobList} />
            <Route path="/job/:id" component={Job} />
            <Route path="/addjob" component={JobPost} />
            <Route path="/account" component={Account} />
            <Route path="/billing" component={Billing} />
            <Route path="/dashboard" component={Dashboard} />
            <Route component={NoMatch} />
          </Switch>
        </div>
      </div>
    );
  }
}

export default withRouter(App);
