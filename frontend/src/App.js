import React from 'react';
import axios from 'axios';
import { Route, Switch, withRouter, NavLink } from 'react-router-dom';
import './css/index.css';
import { Account,
  Billing,
  CompanyLanding,
  CompanyDashboard,
  Dashboard,
  Job,
  JobList,
  Landing,
  Navigation,
  NoMatch,
  CompanyAccount
  } from './components';
import { Alert, Button} from 'antd';

class App extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      loggedIn: false,
      error: null,
      message: null,
      token: null,
      jobs: null,
      employer: false,
      user: null,
      stripe_id: null,
      subscription: null,
      job_credit: null
    }
  }

  componentDidMount() {
    const token = localStorage.getItem('token');
    if (token) {
      axios.post(`${process.env.REACT_APP_LOGIN_API}refresh/`, { token: token })
      .then(response => {
          this.logIn(response.data);
        })
        .catch(err => {
          if (err.message.includes('Network')) {
            // Does not log user out if Internet connection or server is down.
            this.setState({ error: `Problem connecting to server.`});
          } else {
            this.logOut(err, `Authentication expired. Please log in again.`);
          }
        });
    }
    else {
      let path = this.props.history.location.pathname;
      this.props.history.push('/');
      if (path !== '/' && path !== '/signin' && path !== '/company') {
        this.setState({ error: `Please log in or register.`});
      }
    }
  }

  logIn = (data, registerCompany) => {
    this.setState({ 
      loggedIn: true,
      error: null,
      message: null,
      token: data.token,
      employer: data.user.is_employer,
      user: data.user.id
    });
    localStorage.setItem('token', data.token);
    // Redirect based on user type
    if (registerCompany) {
      this.props.history.push('/account');
      this.setState({ message: `Please complete your company profile.`});
    } else if (data.user.is_employer) {
      this.fetchMembership(data.token);
      const path = this.props.history.location.pathname;
      if (path === '/' || path === '/signin' || path === '/company') {
        this.props.history.push('/dashboard');
      }
    } else {
      const path = this.props.history.location.pathname;
      if (path === '/' || path === '/signin' || path === '/company') {
        this.props.history.push('/jobs');
      }
    }
  }

  logOut = (e, errorMessage, successMessage) => {
    localStorage.removeItem('token');
    this.setState({ 
      loggedIn: false,
      error: errorMessage,
      message: successMessage,
      token: null,
      jobs: null,
      employer: false,
      user: null
    });
    this.props.history.push('/signin');
  }

  fetchMembership = token => {
    axios.get(`${process.env.REACT_APP_API}membership/`, { headers: { Authorization: `JWT ${token}`}})
      .then(response => {
        this.setState({
          job_credit: response.data.job_credit,
          stripe_id: response.data.stripe_id,
          subscription: response.data.subscription
        });
      })
      .catch(err => {
        this.setState({ error: `Error getting membership status. Please refresh or try again.` });
      });
  }

  setJobs = jobs => {
    this.setState({ jobs: jobs });
  }

  render() {
    const { loggedIn, error, message, token, jobs, employer, user, stripe_id, subscription, job_credit } = this.state;
    let location = this.props.history.location.pathname;
    const home = location === '/';
    const company = location === '/company';
    const signin = location === '/signin';
    const job = location.includes('/jobs/');

    return (
      <div className="App">

        {error ? (
          <Alert message={error} type="error" closable showIcon banner />
          ) : (null)}
        {message ? (
          <Alert message={message} type="success" closable showIcon />
        ) : (null)}

        {loggedIn ? (
          <div className="nav-wrapper">
            <Navigation logOut={this.logOut} employer={employer} token={token} user={user}/>
          </div>
        ) : (
            // Navigation for unauthenticated users
            <div className="nav-wrapper">

              {home ? (
                <div className="home-navigation">
                  <div>
                    <h1>Open Jobs</h1>
                    <h3>No Degree, No Problem.<br/>Your next job is just a click away.</h3>
                    <div className="whitespace"></div>
                    <NavLink to='/company'><Button type="secondary">Post a Job</Button></NavLink>
                    <NavLink to='/signin'><Button type="primary">Sign In</Button></NavLink>
                  </div>
                </div>
              ) : (null)}

              {company ? (
                <div className="home-navigation">
                  <div>
                    <div className="whitespace"></div>
                    <NavLink to='/signin'><Button type="secondary">Job Seeker</Button></NavLink>
                    <NavLink to='/signin'><Button type="primary">Sign In</Button></NavLink>
                  </div>
                </div>
              ) : (null)}

              {signin ? (
                <div className="home-navigation">
                  <div>
                    <div className="whitespace"></div>
                    <NavLink to='/company'><Button type="secondary">Post a Job</Button></NavLink>
                    <NavLink to='/'><Button type="primary">Jobs</Button></NavLink>
                  </div>
                </div>
              ) : (null)}

              {job ? (
                <div className="home-navigation">
                  <div>
                    <NavLink to='/' className="h1"><h1>Open Jobs</h1></NavLink>
                    <h3>No Degree, No Problem.<br/>Your next job is just a click away.</h3>
                    <div className="whitespace"></div>
                    <NavLink to='/company'><Button type="secondary">Post a Job</Button></NavLink>
                    <NavLink to='/signin'><Button type="primary">Sign In</Button></NavLink>
                  </div>
                </div>
              ) : (null)}

            </div>
        )}

        <div className="main">
          <Switch>
            {/* Landing Pages */}
            <Route exact path="/" render={() => <JobList jobs={jobs} setJobs={this.setJobs}/>} />
            <Route path="/signin" render={() => <Landing logIn={this.logIn}/>} />
            <Route path="/company" render={() => <CompanyLanding logIn={this.logIn}/>} />
            {/* Non-Auth Routes */}
            <Route exact path="/jobs" render={() => <JobList jobs={jobs} setJobs={this.setJobs}/>} />
            <Route path="/jobs/:id" render={() => <Job />} />
            {/* Auth Routes */}
            {employer ? (
              <Route path="/account" render={() => {
                <CompanyAccount 
                  token={token}
                  logOut={this.logOut}
                  user={user}
                  job_credit={job_credit}
                  subscription={subscription}
                  stripe_id={stripe_id}
                 />
              }} />            
              ) : (
              <Route path="/account" render={() => <Account token={token} logIn={this.logIn} logOut={this.logOut} user={user}/>} />
            )}
            {employer ? (
              <Route exact path="/dashboard" render={() => {
                <CompanyDashboard 
                  token={token} 
                  logOut={this.logOut}
                  user={user}
                  job_credit={job_credit}
                  subscription={subscription}
                  stripe_id={stripe_id}/>
              }} />
            ) : (
              <Route exact path="/dashboard" render={() => <Dashboard token={token} logOut={this.logOut}/>} />
            )}
            <Route path="/billing" render={() => <Billing token={token} logOut={this.logOut} user={user}/>} />
            <Route component={NoMatch} />
          </Switch>
        </div>

      </div>
    );
  }
}

export default withRouter(App);