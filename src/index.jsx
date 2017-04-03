/*import React from 'react';
import { HashRouter as Router, Route, Link } from 'react-router-dom';
import ReactDOM from 'react-dom';
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';
import AppBar from 'material-ui/AppBar';

const BasicExample = () => (
  <Router>
    <div>
      <ul>
        <li><Link to="/">Home</Link></li>
        <li><Link to="/about">About</Link></li>
      </ul>

      <hr/>

      <Route exact path="/" component={Home}/>
      <Route path="/about" component={About}/>
    </div>
  </Router>
)
class BasicExample extends React.Component {
  render() {
    return (
      <AppBar title="My AppBar" />
    );
  }
}


const Home = () => (
      <MuiThemeProvider>
        <AppBar title="My AppBar" />
      </MuiThemeProvider>
)

const About = () => (
  <div>
    <h2>About</h2>
  </div>
)
ReactDOM.render(<BasicExample />, document.getElementById('root'));*/

import React from 'react';
import ReactDOM from 'react-dom';
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';
import AppBar from 'material-ui/AppBar';

const App = () => (
  <MuiThemeProvider>
    <AppBar />
  </MuiThemeProvider>
);

ReactDOM.render(
  <App />,
  document.getElementById('app')
);