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
      message: null
    }
  }

  componentDidMount() {
    const token = localStorage.getItem('token');
    if (token) {
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


  logIn = () => {
    this.setState({ loggedIn: true, message: null });
  }

  handleLogout = e => {
    e.preventDefault();
    localStorage.removeItem('token');
    this.setState({ loggedIn: false });
    this.props.history.push('/');
  }

  render() {
    const { loggedIn, message } = this.state;
    return (
      <div className="App">
        {loggedIn ? (
          <Navigation handleLogout={this.handleLogout}/>
          ) : (null)}
        <div className="main">
          {message ? (<h3 className="message">{message}</h3>) : (null)}
          <Switch>
            <Route exact path="/" render={() => (<Landing logIn={this.logIn}/>)} />
            <Route path="/jobs" component={JobList} />
            <Route path="/job/:id" component={Job} />
            <Route path="/addjob" component={PostJob} />            
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
