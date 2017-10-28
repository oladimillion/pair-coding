import React, {  Component } from 'react'
import {  connect } from 'react-redux'
import PropTypes from "prop-types";

import { isValidLoginData } from "../../../../../server/utils/validations";

import { SetLoginInfo } from "../../actions/user-actions"
import { LoginRequest } from "../../actions/user-actions"


class LoginForm extends Component { 

  constructor(props){ 
    super(props);
    this.state = { 
      username: "",
      password: "",
      isLoading: false
    }
    this.onSubmit = this.onSubmit.bind(this);
    this.onChange = this.onChange.bind(this);
    this.hide = this.hide.bind(this);
  }

  componentWillMount(){ 
    document.addEventListener("keydown", this.hide);
  }

  componentWillUnmount(){ 
    document.removeEventListener("keydown", this.hide)
  }

  hide(event){ 
    // clearing any form of status messages
    switch (event.code) {
      case "Escape":
        this.props.SetLoginInfo({ message: "", success: true });
        break;
      default:
        break;
    }
  }

  onChange(e){ 
    this.setState({  [e.target.name]: e.target.value  });
    this.props.SetLoginInfo({ message: "", success: true });
  }

  onSubmit(e){ 
    e.preventDefault();

    this.setState({ isLoading: true })
    let { username, password } = this.state;
    this.props.SetLoginInfo({ message: "Please wait... ", success: true });

    // validating user input
    const message = isValidLoginData({ username, password });

    if(message){ 
      this.props.SetLoginInfo({ message, success: false });
      this.setState({ isLoading: false })
    } else { 
      // making login request to server
      this.props.LoginRequest({ username, password })
        .then(({  data  }) =>{ 
          this.setState({ isLoading: false })
          // redirecting to home route on successful login
          this.props.redirect();
        })
        .catch(({ response }) => { 
          this.setState({ isLoading: false })
        });
    }
  }

  render() { 

    const { username, password } = this.state;
    const { toggleResetPassword } = this.props;
    const { message, success } = this.props.info;
    let style;
    if(message && !success){ 
      style = { "border": "1px solid #F02020" };
    }

    return (
      <form class="login" onSubmit = { this.onSubmit }>

        <div>
          <label for="username">Username:</label>
          <input 
            onChange = { this.onChange }
            style={ style } 
            type="text" 
            name="username" 
            value={username}
            placeholder="Enter your username"  
          />
        </div>

        <div>
          <label for="password">Password:</label>
          <input 
            onChange = { this.onChange }
            style={ style } 
            type="password" 
            name="password" 
            value={password}
            placeholder="Enter your password"  
          />
        </div>

        <div>									  
          <a
            onClick = { ()=>toggleResetPassword() } 
            class="">
            Forgot Password?
          </a>
          <button 
            disabled = {  this.state.isLoading  } 
            id="login" 
            type="submit"
            class="btn btn-primary">
            Login
          </button>
          <a 
            id="small" href="#"
            onClick = { ()=>toggleResetPassword() } 
          >Forgot Password?</a>
        </div>

      </form>
    )
  }
}

LoginForm.propTypes = {
  SetLoginInfo: PropTypes.func.isRequired,
  LoginRequest: PropTypes.func.isRequired,
  redirect: PropTypes.func.isRequired,
  toggleResetPassword: PropTypes.func.isRequired,
  info: PropTypes.object.isRequired,
}

  
function mapStateToProps(state){ 
  return { 
    info: state.LoginInfo
  }
}

export default connect(mapStateToProps, { 
  SetLoginInfo,
  LoginRequest
})(LoginForm);
