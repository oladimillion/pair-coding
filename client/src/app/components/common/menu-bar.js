import React, { Component } from 'react'
import { connect } from 'react-redux'
import PropTypes from "prop-types"

import { SetSessionInfo } from "../../actions/session-actions"
import ProfileDetail from "./profile-detail"

class MenuBar extends Component {

  constructor(props){
    super(props);

    this.toggleProfile = this.toggleProfile.bind(this);
    this.toggleProfileDetail = this.toggleProfileDetail.bind(this);
    this.hide = this.hide.bind(this);

    this.onBlurProfile = this.onBlurProfile.bind(this);

    this.state = {
      profile: false,
      profileDetail: false
    }

    this.timeout = undefined;
  }

  componentWillMount(){
    document.addEventListener("keydown", this.hide);

    if(this.timeout){
        clearTimeout(this.timeout)
    }

    if(this.props.SessionInfo.message){
      this.timeout = setTimeout(()=>{
        this.props.SetSessionInfo({
          message: "",
          success: true
        }); 
      }, 4000);
    }
  }

  componentWillReceiveProps(newProps){
    // clears any form of popups after 10 seconds
    const parent = this;

    if(parent.timeout){
      clearTimeout(parent.timeout)
      parent.timeout = undefined;
    }

    if(newProps.SessionInfo.message){
      parent.timeout = setTimeout(()=>{
        parent.props.SetSessionInfo({
          message: "",
          success: true
        }); 
      }, 4000);
    }
    // console.log(newProps)
  }

  componentWillUnmount(){
    document.removeEventListener("keydown", this.hide);
  }

  onBlurProfile(){
    // hides profile component on blur
    this.setState({
      profile : false
    })
  }

  toggleProfile(e){
    // toggles profile component
    this.setState({
      profile: !this.state.profile,
      profileDetail: false
    })
  }

  toggleProfileDetail(){
    // toggles profile detail component
    this.setState({
      profileDetail : !this.state.profileDetail,
      profile: false
    })
  }

  hide(event){
    // hides profile on ESC key pressed
    switch (event.code) {
      case "Escape":
        this.setState({ 
          profile: false,
        })
        break;

      default:
        break;
    }
  }

  render (){

    const {message} = this.props.SessionInfo;
    const { showHomeBtn, goHome } = this.props;

    return(
      <nav class="menu-bar">

        { 
          showHomeBtn &&
            <div 
              class="go-home"
              onClick = { ()=>goHome() }
            >
              <span class = "glyphicon glyphicon-circle-arrow-left"></span>
            </div>
        }

        {
          message &&
            <div class="status session-status">
              {message}
            </div>
        }

        <div class="settings">
          <a
            onClick = {()=>this.toggleProfile()}>
            <span class="glyphicon glyphicon-triangle-bottom"></span> 
            {this.props.user.username} 
          </a>

          {this.state.profile && 
              <Profile
                toggleProfileDetail = {this.toggleProfileDetail}
                onBlurProfile = {this.onBlurProfile}
                logout = {this.props.logout}
              />
          }
        </div>

        {
          this.state.profileDetail &&
            <ProfileDetail 
              toggleProfileDetail = {this.toggleProfileDetail}
            />    
        }

      </nav>

    )
  }
}

class Profile extends Component {
  componentDidMount(){
    this.refs.profile.focus();
  }

  render() {

    return (
      <ul 
        class="profile" 
        ref="profile"
        tabIndex = {1}
        onBlur = {()=>this.props.onBlurProfile()}
      >
        <li  
          onClick = {()=>this.props.toggleProfileDetail()}>
          Profile
        </li>
        <li
          onClick = {()=>this.props.logout()}
        >
          Sign out
        </li>
      </ul>)

  }
}

Profile.propTypes = {
  onBlurProfile: PropTypes.func.isRequired,
  toggleProfileDetail: PropTypes.func.isRequired,
  logout: PropTypes.func.isRequired,
}

MenuBar.propTypes = {
  goHome: PropTypes.func,
  showHomeBtn: PropTypes.bool,
  SessionInfo: PropTypes.object.isRequired,
  logout: PropTypes.func.isRequired,
}

function mapStateToProps(state){
  return { 
    SessionInfo: state.SessionInfo,
    user: state.User,
  }
}

export default connect(mapStateToProps, {
  SetSessionInfo
})(MenuBar);
