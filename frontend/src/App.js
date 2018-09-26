import React from "react";
import { Route, Switch, withRouter } from "react-router-dom";
import { Account, Billing, Dashboard, Job, JobList, PostJob, Landing, Navigation, NoMatch } from "./components";
import './css/AntDesignOverride.css';
import './css/App.css';

class App extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      loggedIn: false,
      message: null,
      token: null
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
        this.setState({ message: `Please log in or register.`});
      }
    }
  }


  logIn = token => {
    this.setState({ loggedIn: true, message: null, token: token });
  }

  handleLogout = e => {
    e.preventDefault();
    localStorage.removeItem('token');
    this.setState({ loggedIn: false, token: null, message: null });
    this.props.history.push('/');
  }

  render() {
    const { loggedIn, message, token } = this.state;
    return (
      <div className="App">
        {loggedIn ? (
          <Navigation handleLogout={this.handleLogout}/>
          ) : (null)}
        <div className="main">
          {message ? (<h3 className="message">{message}</h3>) : (null)}
          <Switch>
            <Route exact path="/" render={() => <Landing logIn={this.logIn}/>} />
            <Route path="/jobs" render={() => <JobList />} />
            <Route path="/jobs/:id" render={() => <Job />} />
            <Route path="/addjob" render={() => <PostJob token={token}/>} />            
            <Route path="/account" render={() => <Account token={token}/>} />
            <Route path="/billing" render={() => <Billing token={token}/>} />
            <Route path="/dashboard" component={Dashboard} />
            <Route component={NoMatch} />
          </Switch>
        </div>
      </div>
    );
  }
}

export default withRouter(App);
