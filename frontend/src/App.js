import React from "react";
import { Route, Switch, withRouter } from "react-router-dom";
import { Account, Billing, Dashboard, Job, JobList, JobPost, Landing, Navigation, NoMatch, EmployerProfile } from "./components";
import { Alert } from "antd";

import './css/AntDesignOverride.css';
import './css/App.css';

class App extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      loggedIn: false,
      error: null,
      message: null,
      token: null,
      jobs: null,
      employer: false
    }
  }

  componentDidMount() {
    const token = localStorage.getItem('token');
    if (token) {
      this.logIn(token);
      this.props.history.push('/jobs');
    }
    else {
      let path = this.props.history.location.pathname;
      this.props.history.push('/');
      if (path !== '/') {
        this.setState({ error: `Please log in or register.`});
      }
    }
  }

  // add employer state function to pass to App state

  logIn = token => {
    this.setState({ loggedIn: true, error: null, message: null, token: token });
  }

  logOut = () => {
    localStorage.removeItem('token');
    this.setState({ loggedIn: false, token: null, error: null, message: null, jobs: null });
    this.props.history.push('/');
  }

  setJobs = jobs => {
    this.setState({ jobs: jobs });
  }

  render() {
    const { loggedIn, error, message, token, jobs, employer } = this.state;
    return (
      <div className="App">

        {error ? (
          <Alert message={error} type="error" closable showIcon banner />
          ) : (null)}
        {message ? (
          <Alert message={message} type="success" closable showIcon />
        ) : (null)}

        {loggedIn ? (
          <Navigation logOut={this.logOut} employer={employer}/>
          ) : (null)}

        <div className="main">
          <Switch>
            <Route exact path="/" render={() => <Landing logIn={this.logIn}/>} />
            <Route exact path="/jobs" render={() => <JobList jobs={jobs} setJobs={this.setJobs}/>} />
            <Route path="/jobs/:id" component={Job} />
            <Route path="/addjob" render={() => <JobPost token={token} logOut={this.logOut}/>} />  
            {employer ? (
              <Route path="/account" render={() => <EmployerProfile token={token} logOut={this.logOut}/>} />
              ) : (
              <Route path="/account" render={() => <Account token={token} logOut={this.logOut}/>} />
            )}
            <Route path="/billing" render={() => <Billing token={token} logOut={this.logOut}/>} />
            <Route path="/dashboard" component={Dashboard} />
            <Route component={NoMatch} />
          </Switch>
        </div>

      </div>
    );
  }
}

export default withRouter(App);
