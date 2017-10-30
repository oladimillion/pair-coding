import React, { Component } from 'react'
import { connect } from 'react-redux'
import PropTypes from "prop-types";

import { isValidEmail  } from "../../../../../server/utils/validations"; 
import { PasswordResetLinkRequest  } from "../../actions/user-actions" 

class PasswordReset extends Component {

  constructor(props){
    super(props);

    this.onClick = this.onClick.bind(this);
    this.onChange = this.onChange.bind(this);

    this.state = {
      message: "",
      success: true,
      isLoading: false
    }
  }

  componentDidMount(){
    // setting focus on components mounting
    this.refs.main.focus();
    this.refs.email.addEventListener("keydown", this.onChange);
  }

  componentWillUnmount(){
    this.refs.email.removeEventListener("keydown", this.onChange);
  }

  onChange(e){
    this.setState({
      message: "",
      success: true,
      isLoading: false
    })

    if(e.code == "Enter")
    {
      this.onClick();
    }
  }

  onClick(e){
    this.setState({
      message: "",
      success: true,
      isLoading: true
    })

    let email = this.refs.email.value;

    // validating user input
    let message = isValidEmail(email);

    if(message) {
      this.setState({
        message,
        success: false,
        isLoading: false 
      })
      return;
    }

    // requesting password reset link
    this.props.PasswordResetLinkRequest({email})
      .then(({ data  }) => {
        let { message, success } = data;
        this.setState({ message, success, isLoading: false })
        this.refs.email.value = "";
      })
      .catch(({response }) => {
        let { message, success  } = response.data;
        this.setState({ message, success, isLoading: false })
      });
  }

  render() {

    let { message, success, isLoading } = this.state;

    let style = success ? "alert alert-success" : "alert alert-danger";

    return (
      <div 
        class="pop-up" 
        ref = "main"
      >
        <ul class="pop-up-detail">

          <li> 
            <span>
              <span></span>
              <span 
                disabled = {isLoading }
                onClick = { ()=>this.props.toggleResetPassword() }
                class="glyphicon glyphicon-remove"
              ></span>
            </span>
          </li>

          <li class="pop-up-info">
            Enter your account email to 
            receive a link allowing you 
            to create a new password
          </li>

          <li>
            <input 
              type="text" 
              ref="email" 
              onChange = { this.onChange }
              placeholder="Your email" 
              autoFocus
            />
          </li>

          <li>
            <button 
              disabled = {isLoading }
              onClick = {this.onClick }
              class="btn btn-primary">
              Request Reset
            </button>
          </li>

          <li>
            {
              message &&
                <p class={style}>{ message }</p>
            }
          </li>

        </ul>

      </div>
    )
  }
}

PasswordReset.propTypes = {
  PasswordResetLinkRequest: PropTypes.func.isRequired,
  toggleResetPassword: PropTypes.func.isRequired,
}



export default connect(null, { PasswordResetLinkRequest })(PasswordReset);
