import React, { Component } from "react"
import { connect } from "react-redux"
import PropTypes from "prop-types";

import PasswordReset from "./password-reset"
import LoginForm from "./login-form"


class Top extends Component {

  constructor(props){
    super(props);
    this.toggleResetPassword = this.toggleResetPassword.bind(this);

    this.state = {
      showResetPw : false
    }
  }

  toggleResetPassword(){
    this.setState({
      showResetPw : !this.state.showResetPw
    })
  }

  render() {

    const {message, success } = this.props.info;
    let renderInfo = undefined;
    if(message) {
      const style = success ? "status login-status-success success"
        : "status login-status-error error";

      renderInfo = (<div class={style}>{message}</div>)
    }

    return (
      <div class="top">
        <div class="top-inner">
          <div class="small">PAIR - CODING</div>	

          <LoginForm 
            toggleResetPassword = {this.toggleResetPassword} 
            redirect = { this.props.redirect }
          />          
          {renderInfo}
          {
            this.state.showResetPw && 
              <PasswordReset  
                toggleResetPassword = {
                  this.toggleResetPassword }
              />
          }
        </div>
      </div> 
    )
  }
}

Top.propTypes = {
  redirect: PropTypes.func.isRequired,
  info: PropTypes.object.isRequired,
}


function mapStateToProps(state){
  return {
    info: state.LoginInfo
  }
}

export default connect(mapStateToProps)(Top);
