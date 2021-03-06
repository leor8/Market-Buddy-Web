import React, {Component} from 'react';
import { withRouter } from 'react-router'
import {post} from 'axios';

class Logout extends Component{
  constructor() {
    super();
  }
  componentDidMount() {
    post("/logout")
    .then(response => response.data)
    .then(user => {
      localStorage.clear();
      window.Materialize.toast("You have logged out", 2000, 'success-alert');
      this.props.history.push({
        pathname: '/main'
      })
    });
  }

  render(){
    return (
      <div>
        <p>You are logged out</p>
      </div>
    )
  }
}

export default withRouter(Logout);