import React from 'react';
import { Redirect } from 'react-router-dom';
import GoogleLogin from 'react-google-login';
import Snackbar from 'material-ui/Snackbar';
import Avatar from 'material-ui/Avatar';
import {companyDomain} from './../config.json';
import {google} from './../config.json';


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
    console.log('Error: ', err)
  })
  
}


class LoginView extends React.Component {
  render() {
    return (
      <div>
        <img src="/icons/launcher-icon-3x.png" />
        <h1>Ashley Cho Management Suite</h1>
        <GoogleLogin
          clientId={google.apiClientID}
          buttonText="GSuite Login"
          hostedDomain={companyDomain}
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
