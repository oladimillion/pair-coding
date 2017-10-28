import React, { Component } from "react"
import { connect } from "react-redux"
import PropTypes from "prop-types";

import Top from "./user-page-partials/top"
import Bottom from "./user-page-partials/bottom"
import MainPasswordReset from "./main-password-reset-page";

class User extends Component{ 

  constructor(props){
    super(props);

    this.redirect = this.redirect.bind(this);
    this.toggleResetPassword = this.toggleResetPassword.bind(this);

    this.state = {
      loadPasswordResetForm: false
    }
  }

  componentWillMount(){
    if( Object.keys(this.props.user).length ){
      // prevents logged-in users from accessing User page
      this.props.history.replace("/home", null);
    } else {
      // shows password reset window if path matches
      let path = this.props.history.location.pathname;
      const re = /\/password-reset\//
      let loadPasswordResetForm = (re.test(path));
      this.setState({
        loadPasswordResetForm
      })
    }
  }

  redirect(){
    // redirects to home after successful login
    this.props.history.replace("/home", null);
  }

  toggleResetPassword(){
    // toggles password reset window
    this.setState({
      loadPasswordResetForm : !this.state.loadPasswordResetForm
    })
  }

  render(){
    const { loadPasswordResetForm } = this.state;
    const token = this.props.match.params.token;
    return (
      <div class="wrapper">
        <Top redirect = { this.redirect } />
        { loadPasswordResetForm && 
            <MainPasswordReset 
              token = {token}
              toggleResetPassword = {
                this.toggleResetPassword }
              /> 
        }
        <Bottom />
        <footer>
          Copyright © 2017 Oladimeji Akande
        </footer>
      </div>
    )
  }
}

User.PropTypes = {
  user: PropTypes.object.isRequired,
}


function mapStateToProps(state){
  return {
    user: state.User
  }
}

export default connect(mapStateToProps)(User);
