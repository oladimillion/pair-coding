import React, { Component } from "react";
import { connect } from 'react-redux'
import PropTypes from "prop-types"
import { isValidProfileData } from "../../../../../server/utils/validations";
import { ProfileUpdateRequest } from "../../actions/user-actions"
import { FetchAllSessionRequest, ClearSessionState } from "../../actions/session-actions";

class ProfileDetail extends Component {

  constructor(props){
    super(props);

    this.onChange = this.onChange.bind(this);
    this.onClick = this.onClick.bind(this);
    this.toggleEditing = this.toggleEditing.bind(this);

    this.state = {
      username: "",
      email: "",
      phone: "",
      opassword: "",
      password: "",
      cpassword: "",
      message: "",
      success: true,
      isLoading: false,
      isEditing: false
    }
  }

  componentWillMount(){
    let { username, email, phone } = this.props.user;
    this.setState({
      username,
      email,
      phone
    })
  }

  onChange (e){
    this.setState({
      message: "",
      success: true,
      isLoading: false,
      [e.target.name] : e.target.value
    });
  }

  onClick(e) {
    // user's new data
    let {username, email, phone, opassword, password, cpassword } = this.state;

    let path = window.location.pathname;
    const re = /\/session\//;
    let rejoin = (re.test(path))

    const { user } = this.props;

    // user's old data
    let data = {};
    data._username = user.username;
    data._email = user.email;
    data._phone = user.phone;

    // combining old data and new data
    data = Object.assign({}, data, this.state);

    // validating user's data
    const message = isValidProfileData(data);

    if(message) {
      this.setState({
        message,
        success: false,
        isLoading: false 
      })
      return;
    }

    this.setState({
      message: "",
      success: true,
      isLoading: true
    });

    // making profile update request
    this.props.ProfileUpdateRequest(data)
      .then(({ message, success }) => {
        // displaying success message, clearing some state data
        this.setState({ 
          message, success, isLoading: false, isEditing: false,
          opassword: "", password: "", cpassword: ""
        })
        if(rejoin){
          // clearing state after profile update
          this.props.ClearSessionState()
        } else {
          // clearing state after profile update
          this.props.ClearSessionState()
          // fetching all saved sessions from the server after profile update
          this.props.FetchAllSessionRequest({username});
        }
      })
      .catch(({response}) => {
        // displaying error message
        let { message, success  } = response.data;
        this.setState({ 
          message, success, isLoading: false
        })
      });
  }

  toggleEditing(){
    // toggling editing mode of the component
    this.setState({
      isEditing: !this.state.isEditing,
      message: "",
      success: true,
    })
  }

  render() {

    let{ username, email, phone, opassword, password, cpassword } = this.state;
    let { message, success, isLoading, isEditing } = this.state;

    let style = success ? "alert alert-success" : "alert alert-danger";

    return (
      <div class="pop-up">
        <ul 
          class="pop-up-detail">

          <li
            disabled = { isLoading }> 
            <span>
              <span
                onClick = { ()=>this.toggleEditing() }
                class="glyphicon glyphicon-edit">
              </span>
              <span 
                onClick = { ()=>this.props.toggleProfileDetail() }
                class="glyphicon glyphicon-remove"
              ></span>
            </span>
          </li>

          <li class="pop-up-info bold-info">
            My Profile
          </li>

          { isEditing && 
              <li>
                Your Password
                <input type="password" 
                  name="opassword" 
                  value={opassword}
                  placeholder="Required"
                  onChange = { this.onChange }
                /> 
              </li>
          }

          <li>
            Username 
            <input 
              type="text" 
              name="username" 
              value={username} 
              placeholder="Your Username"
              onChange = { this.onChange }
              readOnly={!isEditing} /> 
          </li>

          <li>
            Email 
            <input type="text" 
              name="email" 
              value={email} 
              placeholder="Your Email"
              onChange = { this.onChange }
              readOnly={!isEditing} /> 
          </li>

          <li>
            Phone No 
            <input type="text" 
              name="phone" 
              value={phone}
              placeholder="Your Phone Number"
              onChange = { this.onChange }
              readOnly={!isEditing} /> 
          </li>

          { isEditing && 
              <li>
                Change Password?  
                <input type="password" 
                  name="password" 
                  value={password}
                  placeholder="New Password"
                  onChange = { this.onChange }
                /> 
              </li>
          }

          { isEditing && 
              <li>
                <input type="password" 
                  name="cpassword" 
                  value={cpassword} 
                  placeholder="Confirm Password"
                  onChange = { this.onChange }
                /> 
              </li>
          }

          <li>
            <button 
              disabled = { isLoading || !isEditing }
              onClick = {this.onClick }
              class="btn btn-primary">
              Update Profile
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

ProfileDetail.propTypes = {
  ProfileUpdateRequest: PropTypes.func.isRequired,
  ClearSessionState: PropTypes.func.isRequired,
  FetchAllSessionRequest: PropTypes.func.isRequired,
  toggleProfileDetail: PropTypes.func.isRequired,
  user: PropTypes.object.isRequired,
}

function mapStateToProps(state){
  return { 
    user: state.User,
  }
}

export default connect(mapStateToProps, {
  ProfileUpdateRequest,
  FetchAllSessionRequest,
  ClearSessionState,
})(ProfileDetail);
