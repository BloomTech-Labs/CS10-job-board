import React from "react";
import { Route, Switch } from "react-router-dom";
import { Landing, NoMatch } from "./components";
import './css/App.css';

class App extends React.Component {
  constructor() {
    super()
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
          <Route component={NoMatch} />
        </Switch>
      </div>
    );
  }
}

export default App;
