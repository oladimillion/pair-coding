import React, { Component } from 'react'
import { connect } from "react-redux";
import PropTypes from "prop-types";

import shortid from "shortid";

import { SetSessionInfo } from "../../actions/session-actions"
import { AddNewSessionRequest } from "../../actions/session-actions"

class SessionItemsControl extends Component { 

  constructor(props){ 
    super(props);
    this.state = { 
      searchInputValue: "",
      createInputValue: ""
    }

    this.searchInput = this.searchInput.bind(this);
    this.searchButton = this.searchButton.bind(this);
    this.createInput = this.createInput.bind(this);
    this.createButton = this.createButton.bind(this);
    this.enterPressed = this.enterPressed.bind(this);

    this.creating = false; // is create session request made already?

  }

  componentDidMount(){
    this.refs.create.addEventListener("keydown", 
      this.enterPressed);
  }

  componentWillUnmount(){
    this.refs.create.removeEventListener("keydown", 
      this.enterPressed);
  }

  createButton(){ 

    if(this.creating){
      // making sure one request is made at time
      return;
    }

    this.creating = true;

    const { AddNewSessionRequest, SetSessionInfo } = this.props;

    const { username } = this.props.user;

    const id = shortid.generate(),
      content = "",
      time = new Date().toLocaleString();

    const title = this.state.createInputValue.trim();

    const re = /^[\w+\W+]{4,20}$/

    if(re.test(title)){ 

      this.props.SetSessionInfo({
        success: true, 
        message: "Please wait... "
      });

      // making request to add new session 
      AddNewSessionRequest({ username, title, id, content, time })
        .then(()=>{
          // clearing input value after successful session creation
          this.setState({ 
            createInputValue: ""
          })
        })
    } else { 
      // error message
      SetSessionInfo({ 
        success: false,
        message: "Title requires 4-20 length of characters"
      });
    }
    this.creating = false;
  }

  createInput(e){ 
    // clearing any form of message on input value change
    this.props.SetSessionInfo({ 
      message: "",
      success: true
    });

    this.setState({ 
      createInputValue: e.target.value 
    })
  }

  enterPressed(e){
    if(e.code == "Enter"){
      this.createButton()
    }
  }

  searchButton(){ 
    // filtering session items based on search input value
    // and processing it on button pressed
    this.props.getSearchInputValue(this.state.searchInputValue);
  }

  searchInput(e){ 
    // filtering session items based on search input value
    // and processing it on input value change
    this.setState({ 
      searchInputValue: e.target.value 
    });
    this.props.getSearchInputValue(e.target.value);
  }

  render(){ 
    return (
      <section class="session-items-control">

        <div class="box">

          <div class="search-session">

            <input
              onChange = { this.searchInput }
              value = { this.state.searchInputValue }
              type="text" 
              placeholder="Search for session" 
            />
            <span 
              onClick = {  this.searchButton  }
              class="glyphicon glyphicon-search">
            </span>

          </div>

          <div class="create-session">

            <input 
              ref = "create"
              onChange = { this.createInput }
              value = { this.state.createInputValue }
              type="text" 
              placeholder="Create new session" />
            <span 
              onClick = { this.createButton }
              class="glyphicon glyphicon-file">
            </span>

          </div>

          <div class="navigate-session">

            <div class="navigate-session-box">

              <span>
                <span 
                  onClick = { this.props.prev }
                  class="glyphicon glyphicon-arrow-left">
                </span>
                <span 
                  class="session-count">
                  { this.props.currentItemNumber } of { this.props.totalItems } 
                </span>
                <span 
                  onClick = { this.props.next }
                  class="glyphicon glyphicon-arrow-right">
                </span>
              </span>

            </div>

          </div>

        </div>

      </section>
    )
  }
}

SessionItemsControl.propTypes = {
  SetSessionInfo: PropTypes.func.isRequired,
  AddNewSessionRequest: PropTypes.func.isRequired,
  getSearchInputValue: PropTypes.func.isRequired,
  prev: PropTypes.func.isRequired,
  next: PropTypes.func.isRequired,
  currentItemNumber: PropTypes.number.isRequired,
  totalItems: PropTypes.number.isRequired,
  user: PropTypes.object.isRequired,
}


function mapStateToProps(state){ 
  return { 
    user: state.User
  }
}

export default connect(mapStateToProps,{ 
  SetSessionInfo,
  AddNewSessionRequest
})(SessionItemsControl);

