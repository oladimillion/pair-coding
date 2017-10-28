import React, { Component } from "react"
import  { connect } from "react-redux"
import PropTypes from "prop-types";

import { SetRegInfo } from "../../actions/user-actions"
import { RegRequest } from "../../actions/user-actions"
import { isValidRegData } from "../../../../../server/utils/validations";

class RegistrationForm extends Component {

  constructor(props){
    super(props);
    this.state = {
      username: "",
      email: "",
      phone: "",
      password: "",
      cpassword: "",
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
        this.props.SetRegInfo({message: "", success: true });
        break;
      default:
        break;
    }
  }  

  onChange(e){
    this.setState({ [e.target.name]: e.target.value });
    this.props.SetRegInfo({message: "", success: true });
  }

  onSubmit(e){
    e.preventDefault();

    this.setState({isLoading: true })
    this.props.SetRegInfo({message: "Please wait... ", success: true });

    // validating user's input
    const message = isValidRegData(this.state);

    if(message){
      this.props.SetRegInfo({message, success: false });
      this.setState({isLoading: false })
    } else {
      // making sign up request to the server
      this.props.RegRequest(this.state)
        .then(({ data  }) => {
          this.setState({
            isLoading: false,
            username: "",
            email: "",
            phone: "",
            password: "",
            cpassword: "",
          })
        })
        .catch(({response }) => {
          this.setState({isLoading: false })
        });
    }
  }

  render() {

    const {message, success } = this.props.info;

    let {username, email, phone, password, cpassword } = this.state;

    let style;
    if(message && !success){
      style = {"border": "1px solid #F02020" };
    }


    return (

      <form onSubmit={this.onSubmit } action="">

        <div>
          <label for="username">Username:</label>
          <input 
            onChange = {this.onChange }
            style={style } 
            type="text" 
            name="username" 
            value={username}
            placeholder="Enter username" 
          />
        </div>

        <div>
          <label for="email">Email:</label>
          <input 
            style={style } 
            onChange = {this.onChange }
            type="text"
            name="email" 
            value={email}
            placeholder="Enter email" 
          />
        </div>

        <div>
          <label for="phone">Phone:</label>
          <input 
            style={style } 
            onChange = {this.onChange }
            type="text" 
            name="phone" 
            value={phone}
            placeholder="Enter phone number"
          />
        </div>

        <div>
          <label for="password">Password:</label>
          <input 
            style={style } 
            onChange = {this.onChange }
            type="password" 
            name="password" 
            value={password}
            placeholder="Enter password" 
          />
        </div>

        <div>
          <label for="cpassword">Confirm Password:</label>
          <input 
            style={style } 
            onChange = {this.onChange }
            type="password" 
            name="cpassword" 
            value={cpassword}
            placeholder="Confirm password" 
          />
        </div>

        <button 
          disabled = { this.state.isLoading  }
          type="submit" 
          class="btn btn-primary">
          Sign up
        </button>

      </form>
    )
  }
}

RegistrationForm.propTypes = {
  SetRegInfo: PropTypes.func.isRequired,
  RegRequest: PropTypes.func.isRequired,
  info: PropTypes.object.isRequired,
}


function mapStateToProps(state){
  return {
    info: state.RegInfo
  }
}

export default connect(mapStateToProps, {
  SetRegInfo,
  RegRequest
})(RegistrationForm);
