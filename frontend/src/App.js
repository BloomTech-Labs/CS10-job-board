import React from "react";
import axios from "axios";
import { Route, Switch, withRouter, NavLink } from "react-router-dom";
// Do not change the order of lines 4 - 6 to preserve styling logic
import './css/AntDesignOverride.css';
import './css/App.css';
import { Account,
  Billing,
  CompanyLanding,
  Dashboard,
  Job,
  JobList,
  JobPost,
  Landing,
  Navigation,
  NoMatch,
  EmployerProfile } from "./components";
import { Alert, Button} from "antd";

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
      axios.post(`${process.env.REACT_APP_LOGIN_API}refresh/`, { token: token })
        .then(response => {
          this.logIn(response.data);
          this.props.history.push('/jobs');
        })
        .catch(err => {
          this.logOut();
          this.setState({ error: `Error processing request. Please log in or register.`});
        });
    }
    else {
      let path = this.props.history.location.pathname;
      this.props.history.push('/');
      if (path !== '/') {
        this.setState({ error: `Please log in or register.`});
      }
    }
  }

  
  logIn = data => {
    this.setState({ 
      loggedIn: true,
      error: null,
      message: null,
      token: data.token,
      employer: data.user.is_employer 
    });
    // Redirect based on user type
    if (data.user.is_employer) {
      this.props.history.push('/dashboard');
    } else {
      this.props.history.push('/jobs');
    }
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
    let home = this.props.history.location.pathname === '/';
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
          ) : (
            // Hides Post a Job button if not on '/'
            <div className="company-register-link">
              {home ? (
                <NavLink to='/company'><Button>Post a Job</Button></NavLink>
              ) : (null) 
              }
            </div>
          )}

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
            <Route path="/company" component={CompanyLanding} />
            <Route component={NoMatch} />
          </Switch>
        </div>

      </div>
    );
  }
}

export default withRouter(App);
