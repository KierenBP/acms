import React from 'react';
import { Redirect } from 'react-router-dom';
import GoogleLogin from 'react-google-login';
import Snackbar from 'material-ui/Snackbar';



const requestAuth = (googleRes) => {
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
    localStorage.firstName = data.firstName;
    localStorage.lastName = data.lastName;
    localStorage.email = data.email;
    localStorage.profilePicture = data.profilePicture;
  }).then(() => {
    location.reload()
  }).catch((err) => {
    alert(err)
  })
  
}


class LoginView extends React.Component {
  render() {
    return (
      <div>
        <h1>Google Login Button!</h1>
        <GoogleLogin
          clientId="613853658453-4876vdq3eksqgahli1rj2n0uhptpfov9.apps.googleusercontent.com"
          buttonText="GSuite Login"
          hostedDomain="ashleycho.com"
          onSuccess={requestAuth}
          onFailure={console.log}
        />
      </div>)
  }
}

export default class Login extends React.Component {
  constructor(props) {
    super(props);
  }
  render() {
    return (
    localStorage.token ? <Redirect to={{
        pathname: '/'
      }}/> : <LoginView />)
  }
};
