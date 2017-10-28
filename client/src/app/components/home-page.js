import React, { Component } from 'react';
import { connect } from "react-redux";
import PropTypes from "prop-types";

import { SetPosition } from "../actions/position-actions"
import { DeleteSessionRequest } from "../actions/session-actions"
import { FetchAllSessionRequest } from "../actions/session-actions"
import { SetLoginInfo, Logout } from "../actions/user-actions"
import { MySort } from "../utils/my-sort";

import MenuBar from './common/menu-bar';
import SessionItems from './home-page-partials/session-items';
import SessionItemsControl from './home-page-partials/session-items-control';

class Home extends Component {

  constructor(props){

    super(props);

    this.next = this.next.bind(this);
    this.prev = this.prev.bind(this);
    this.getSearchInputValue = this.getSearchInputValue.bind(this);
    this.logout = this.logout.bind(this);
    this.deleteSession = this.deleteSession.bind(this);
    this.updateFilterSession = this.updateFilterSession.bind(this);
    this.loop = this.loop.bind(this);
        
    this.state = {
      filteredSessions: [], // stores portions of session items to display
      isLoading: true, // page is loading
    } 

    this.isEmpty = true; // controls search input state
    this.isDeleting = false; // controls deleting process
    this.maxNum = 10; // max number of session items to show per page
  }

  componentWillMount(){

    let {FetchAllSessionRequest, sessions, position} = this.props;
    // getting initial page/position of session items
    let {offset, limit, count} = position;
    this.offset = offset;
    this.limit = limit;
    this.count = count;

    if(!sessions.length){
      // fetches session data from server
      FetchAllSessionRequest({username: this.props.user.username})
        .then((data) => {
          this.setState({
            isLoading: false
          })
          // shows session items
          this.updateFilterSession(data.payload);
        })
        .catch(({response}) => {
          this.setState({
            isLoading: false
          })
        });
    } else {
      // shows session items
      this.updateFilterSession(sessions);
      this.setState({
        isLoading: false
      })
    }

  }

  componentWillReceiveProps(newProps){
    // shows session items
    this.updateFilterSession(newProps.sessions);
  }

  componentWillUnmount(){
    // registers current position or page of session items
    this.props.SetPosition(this.offset, this.limit, this.count);
  }

  deleteSession(id){
    // deleting session item from redux store and server db
    if(this.isDeleting){
      return;
    }
    this.isDeleting = true;

    // delete item id from server
    this.props.DeleteSessionRequest(id)
      .then(() => {
        this.isDeleting = false;
      })
      .catch(() => {
        this.isDeleting = false;
      })
  }

  getSearchInputValue(data){
    // filters out search result base on input
    const re = new RegExp(data); 
    const newState = this.props.sessions.filter((data)=>{
      return re.test(data.title)
    });


    if(data){
      this.isEmpty = false;
    } else {
      this.isEmpty = true;
    }

    this.setState({
      filteredSessions: newState
    });
  }

  logout(){
    // logs user out
    this.props.Logout();
    this.props.history.replace("/", null);
  }

  loop(sessions){
    // shows session item list based on offset and limit
    let newState = sessions.filter((session, index) => {
      return (index >= this.offset) && (index < this.limit);
    })

    this.setState({
      filteredSessions: newState 
    })
  }

  next(){
    // navigates to the next page
    let count = this.count;
    let {sessions} = this.props;

    if(sessions.length <= this.maxNum){
      return;
    }

    if(this.limit == this.maxNum || this.offset == 0){
      this.offset =  this.maxNum;
      this.limit = this.offset + this.maxNum;
      count += this.maxNum; 
    } else if (this.limit + this.maxNum <= sessions.length){ 
      this.offset +=  this.maxNum;
      this.limit += this.maxNum;
      count += this.maxNum;
    }else if(this.limit + this.maxNum > sessions.length 
      && (sessions.length % this.maxNum) != 0){
      this.limit = sessions.length;
      this.offset = this.limit - (sessions.length % this.maxNum);
      count = sessions.length;
    } else  if(this.limit + this.maxNum >= sessions.length){
      this.limit = sessions.length;
      this.offset = this.limit - this.maxNum;
      count = sessions.length;
    }

    if(this.limit > sessions.length){
      this.limit = sessions.length;
      this.offset = this.limit - (sessions.length % this.maxNum);
      count = this.limit;
    }

    this.count = count
    this.loop(sessions);
  }

  prev(){
    // navigates to the previous page
    let count = this.count;
    let {sessions} = this.props;

    if(sessions.length <= this.maxNum){
      return;
    }

    if(this.limit - this.maxNum <= 0){
      this.limit = this.maxNum;
      this.offset = 0;
      count = this.maxNum; 
    } else if(sessions.length % this.maxNum != 0 && 
      this.limit == sessions.length){
      this.limit = this.limit - (sessions.length % this.maxNum);
      this.offset =this.limit - this.maxNum;
      count = (sessions.length - (sessions.length % this.maxNum));
    } else if (this.limit == sessions.length || 
      this.limit - this.maxNum >= 0){
      this.limit -= this.maxNum;
      this.offset -= this.maxNum;
      count -= this.maxNum; 
    }

    if(this.limit > sessions.length){
      this.limit = sessions.length;
      this.offset = this.limit - (sessions.length % this.maxNum);
    }

    this.count = count
    this.loop(sessions);
  }

  updateFilterSession(sessions){
    // shows session items based on offset and limit
    sessions = sessions.sort(MySort());
    let length = sessions.length;

    if(this.limit >= length){
      this.limit = length;
    }

    if(this.limit < length && (this.limit + this.maxNum) > length){
      this.limit = length;
    }

    if(this.limit == this.offset){
      this.offset = (this.limit - this.maxNum);
      this.count += this.offset;
    }

    if(this.count > this.limit || (this.count + this.maxNum) > this.limit ){
      this.count = this.limit;
    }

    if((this.offset + this.maxNum) < this.count){
      this.count = (this.offset + this.maxNum);
    }

    if((this.offset + this.maxNum) < this.limit && 
      (this.offset + this.maxNum) < length){
      this.limit = this.offset + this.maxNum;
    }

    if(length < this.maxNum){
      this.offset = 0;
      this.limit = length;
      this.count = length;
    }

    this.loop(sessions)
  }

  render() {

    let { filteredSessions, isLoading } = this.state;
    let count = this.count;
    let { sessions } = this.props;

    const toggleSessionItems = isLoading ? 
      (<div class="no-session"><div>Loading...</div></div>) :
      sessions.length ?  
      <SessionItems
        sessions = { filteredSessions }
        deleteSession = { this.deleteSession }
      /> :
      (<div class="no-session">
        <div>
          No saved session yet.<br />
          Kindly create one
        </div>
      </div>);

    return (
      <main class="home">
        <MenuBar 
          logout = {this.logout}
        />
        <SessionItemsControl 
          prev = {this.prev}
          next = {this.next}
          totalItems = {
            sessions.length
          }
          currentItemNumber = {
            !this.isEmpty ? filteredSessions.length :
              count > sessions.length 
              ? sessions.length : count 
          }
          getSearchInputValue = {this.getSearchInputValue}
        />
        {toggleSessionItems} 
      </main>
    )
  }
}

Home.propTypes = {
  SetLoginInfo: PropTypes.func.isRequired,
  FetchAllSessionRequest: PropTypes.func.isRequired,
  SetPosition: PropTypes.func.isRequired,
  DeleteSessionRequest: PropTypes.func.isRequired,
  Logout: PropTypes.func.isRequired,
  SetPosition: PropTypes.func.isRequired,
  sessions: PropTypes.array.isRequired,
  user: PropTypes.object.isRequired,
  position: PropTypes.object.isRequired,
}


function mapStateToProps(state){
  return {
    user: state.User,
    sessions: state.Sessions,
    position: state.Position,
  }
}

export default connect(mapStateToProps, {
  FetchAllSessionRequest,
  SetLoginInfo,
  DeleteSessionRequest,
  SetPosition,
  Logout
})(Home);

