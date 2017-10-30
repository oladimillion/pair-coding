import React, { Component } from 'react'
import { connect } from 'react-redux'
import PropTypes from "prop-types";
import { isValidResetPwData  } from "../../../../server/utils/validations"; 
import { PasswordResetRequest,
  PasswordResetTokenRequest} from "../actions/user-actions" 

class MainPasswordReset extends Component {

  constructor(props){
    super(props);

    this.onClick = this.onClick.bind(this);
    this.onChange = this.onChange.bind(this);

    this.state = {
      message: "",
      success: true,
      email: "",
      isLoading: false, // is page loading?
    }
  }

  componentWillMount(){
    // verify token from server
    const token = this.props.token;
    this.token = token
    // getting user's email from server based on token provided
    this.props.PasswordResetTokenRequest(token)
      .then((data) => {
        // saving email in the state
        this.setState({
          email: data.data.payload
        })
        // making component focusable
        this.refs.main.focus();
        // adding event listeners to input fields
        this.refs.password.addEventListener("keydown", this.onChange);
        this.refs.cpassword.addEventListener("keydown", this.onChange);
      })
      .catch((error) => {
        const {success, message} =  error.response.data;
        // showing error message if any
        this.setState({
          success, message, isLoading: true
        })
      })
  }

  componentWillUnmount(){
    // removing event listeners from input fields
    this.refs.password.removeEventListener("keydown", this.onChange);
    this.refs.cpassword.removeEventListener("keydown", this.onChange);
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
    let password = this.refs.password.value;   
    let cpassword = this.refs.cpassword.value;

    //validates user input
    let message = isValidResetPwData(email, password, cpassword);

    if(message) {
      this.setState({
        message,
        success: false,
        isLoading: false 
      })
      return;
    }

    // making request to reset password
    this.props.PasswordResetRequest({email, password, cpassword, token: this.token})
      .then(({ data  }) => {
        let { message, success } = data;
        // showing success message
        this.setState({ message, success, isLoading: true })
        // clearing input fields
        this.refs.email.value = "";
        this.refs.password.value = "";
        this.refs.cpassword.value = "";
      })
      .catch(({response }) => {
        let { message, success  } = response.data;
        // showing error message
        this.setState({ message, success, isLoading: false })
      });
  }

  render() {

    const { message, success, email } = this.state;

    let style = success ? "alert alert-success" : "alert alert-danger";

    return (
      <div 
        class="pop-up" 
        ref = "main"
      >
        <ul class="pop-up-detail">
          <li
            disabled = { this.state.isLoading }
          > 
            <span>
              <span></span>
              <span 
                onClick = { ()=>this.props.toggleResetPassword() }
                class="glyphicon glyphicon-remove"
              ></span>
            </span>
          </li>

          <li class="pop-up-info">
            Create a new password. Ensure your password is 
            between 4 and 20 characters in length
          </li>

          <li>
            <input 
              value = {email}
              type="text" 
              ref="email" 
              onChange = { this.onChange }
              placeholder="Your email" 
              disabled
            />
          </li>

          <li>
            <input 
              type="password" 
              ref="password" 
              onChange = { this.onChange }
              placeholder="New Password" 
              autoFocus
              disabled={this.state.isLoading}
            />
          </li>

          <li>
            <input 
              type="password" 
              ref="cpassword" 
              onChange = { this.onChange }
              placeholder="Confirm Password" 
              disabled={this.state.isLoading}
            />
          </li>

          <li>
            <button 
              disabled = { this.state.isLoading}
              onClick = {this.onClick }
              class="btn btn-primary">
              Submit New Password
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

MainPasswordReset.propTypes = {
  PasswordResetRequest: PropTypes.func.isRequired,
  PasswordResetTokenRequest: PropTypes.func.isRequired,
  toggleResetPassword: PropTypes.func.isRequired,
  token: PropTypes.string.isRequired,
}


export default connect(null, { PasswordResetRequest,
  PasswordResetTokenRequest})(MainPasswordReset);
