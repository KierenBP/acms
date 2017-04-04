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
import GoogleLogin from 'react-google-login';


import Clients from './clients/view.jsx';




injectTapEventPlugin();


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
            onLeftIconButtonTouchTap={this.handleToggle} />
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

const auth = {
  isAuthenticated: localStorage.token,
  signOut: () => {
    localStorage.removeItem('token');
    localStorage.removeItem('tokenExpiresIn');
    localStorage.removeItem('firstname');
    localStorage.removeItem('lastname');
    localStorage.removeItem('email');
    localStorage.removeItem('profilePicture');
  },
  requestAuth: (googleRes) => {
    console.log(googleRes.tokenObj.id_token)
    fetch('/auth/tokenrequest', {
        method: 'POST',
        body: JSON.stringify({
          googleToken: googleRes.tokenObj.id_token
        }),
        headers: new Headers({
          'Content-Type': 'application/json',
        }),
    })
    .then((res) => res.json())
    .then((data) => {
      localStorage.token = data.token;
      localStorage.tokenExpiresIn = data.expiresIn;
      localStorage.firstname = data.firstname;
      localStorage.lastname = data.lastname;
      localStorage.email = data.email;
      localStorage.profilePicture = data.profilePicture;
    })
    location.reload();
  }
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

class Login extends React.Component {
  constructor(props) {
    super(props);
  }
  render() {
    return (
    auth.isAuthenticated ? <Redirect to={{
        pathname: '/'
      }}/> : <div>
      <h1>Google Login Button!</h1>
      <GoogleLogin
        clientId="613853658453-4876vdq3eksqgahli1rj2n0uhptpfov9.apps.googleusercontent.com"
        buttonText="GSuite Login"
        hostedDomain="ashleycho.com"
        onSuccess={auth.requestAuth}
        onFailure={console.log}
      />
    </div>)
  }
}


const Dashboard = () => (
  <h1>test</h1>
)

const NotFound = () => (
  <h1>404 .:. This page is not found!</h1>
)
ReactDOM.render(<App />, document.getElementById('app'));