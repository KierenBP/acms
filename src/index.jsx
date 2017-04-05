import React from 'react';
import { HashRouter as Router, Route, Link, Switch, Redirect } from 'react-router-dom';
import ReactDOM from 'react-dom';
import darkBaseTheme from 'material-ui/styles/baseThemes/darkBaseTheme';
import getMuiTheme from 'material-ui/styles/getMuiTheme';
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';
import AppBar from 'material-ui/AppBar';
import Drawer from 'material-ui/Drawer';
import MenuItem from 'material-ui/MenuItem';
import RaisedButton from 'material-ui/RaisedButton';
import injectTapEventPlugin from 'react-tap-event-plugin';
import Avatar from 'material-ui/Avatar';


import Login from './Login.jsx';
import Clients from './clients/View.jsx';

// Tap event handler. Required for material-ui
injectTapEventPlugin();


class AccountLoggedIn extends React.Component {
  render() {
    return (
      <Avatar src={localStorage.profilePicture} />
    )
  }
}


class AppDrawer extends React.Component {

  constructor(props) {
    super(props);
    this.state = {open: false};
    this.handleToggle = this.handleToggle.bind(this);
    this.handleClose = this.handleClose.bind(this);
    this.handleSignOut = this.handleSignOut.bind(this);
  }

  handleToggle() {
    return this.setState({open: !this.state.open});
  }

  handleClose() {
    return this.setState({open: false});
  }

  handleSignOut() {
    auth.signOut();
    location.reload();
  }

  render() {
    if(window.location.hash !== '#/login'){
      return (
        <div>
          <AppBar
            title="ACMS"
            onLeftIconButtonTouchTap={this.handleToggle}
            iconElementRight={<AccountLoggedIn />} />
          <Drawer
            docked={false}
            open={this.state.open}
            onRequestChange={(open) => this.setState({open})} >
            <Link to="/"><MenuItem onTouchTap={this.handleClose}>Dashboard</MenuItem></Link>
            <Link to="/about"><MenuItem onTouchTap={this.handleClose}>About</MenuItem></Link>
            <MenuItem onTouchTap={this.handleSignOut}>Logout</MenuItem>
          </Drawer>
        </div>
      )
    }else {
      return (
        <div />
      )
    }
  }
}

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
      {/*<MuiThemeProvider muiTheme={getMuiTheme(darkBaseTheme)}>*/}
      <MuiThemeProvider>
        <div>
          <AppDrawer/>
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



const Dashboard = () => (
  <h1>test</h1>
)

const NotFound = () => (
  <h1>404 .:. This page is not found!</h1>
)
ReactDOM.render(<App />, document.getElementById('app'));