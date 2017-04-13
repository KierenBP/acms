import React from 'react';
import AppBar from 'material-ui/AppBar';
import Drawer from 'material-ui/Drawer';
import Avatar from 'material-ui/Avatar';
import MenuItem from 'material-ui/MenuItem';
import { Link } from 'react-router-dom';

class AccountQuickSettings extends React.Component {
  render() {
    return (
      <Avatar src={localStorage.profilePicture} />
    )
  }
}


export default class MenuBar extends React.Component {

  constructor(props) {
    super(props);
    this.state = {open: false};
    this.handleToggle = this.handleToggle.bind(this);
    this.handleClose = this.handleClose.bind(this);
    this.handleSignOut = this.handleSignOut.bind(this);
  }

  componentWillMount() {
    document.title = `${this.props.title} .:. ACMS`;
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
      return (
        <div>
          <AppBar
            title={this.props.title}
            onLeftIconButtonTouchTap={this.handleToggle}
            iconElementRight={<AccountQuickSettings />} />
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
  }
}
