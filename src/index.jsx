import React from 'react';
import { HashRouter as Router, Route, Link, Switch, Redirect } from 'react-router-dom';
import ReactDOM from 'react-dom';
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';
import injectTapEventPlugin from 'react-tap-event-plugin';

import Login from './Login.jsx';
import Clients from './clients/View.jsx';
import MenuBar from './core/MenuBar.jsx';

// Tap event handler. Required for material-ui
injectTapEventPlugin();

export const auth = {
  isAuthenticated: localStorage.token,
  signOut: () => {
    localStorage.removeItem('token');
    localStorage.removeItem('tokenExpiresIn');
    localStorage.removeItem('firstName');
    localStorage.removeItem('lastName');
    localStorage.removeItem('email');
    localStorage.removeItem('profilePicture');
  },
}

const PrivateRoute = ({ component }) => (
  <Route render={props => (
    auth.isAuthenticated ? (
      React.createElement(component, props)
    ) : (
      <Redirect to={{
        pathname: '/login',
        state: { from: props.location }
      }}/>
    )
  )}/>
)



export default class App extends React.Component {
 render() {
   return(
    <Router>
      <MuiThemeProvider>
        <div>
          <Switch>
            <Route path="/login" component={Login}/>
            <PrivateRoute exact path="/" component={Dashboard}/>
            <PrivateRoute path="/clients" component={Clients}/>
            <PrivateRoute component={NotFound}/>
          </Switch>
        </div>
      </MuiThemeProvider>
    </Router>
   )
 } 
}



class Dashboard extends React.Component {
  render() {
    return (
    <div>
      <MenuBar title="Dashboard"/>
      <h1>Testing</h1>
    </div>
    )
  }
}

const NotFound = () => (
    <div>
      <MenuBar title="404!"/>
      <h1>404 .:. This page is not found!</h1>
      <Link to="/">Go Home!</Link>
    </div>
)
ReactDOM.render(<App />, document.getElementById('app'));