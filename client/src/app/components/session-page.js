import React, { Component } from "react";
import { connect } from "react-redux";
import PropTypes from "prop-types";
import shortid from "shortid";
import { ClientConnection, ClientLeftSession } from "../actions/socket-actions"
import { ClientSendCode } from "../actions/socket-actions"

import MenuBar from "./common/menu-bar";
import SessionEditor from "./session-page-partials/session-editor";
import SessionChat from "./session-page-partials/session-chat";
import SessionDetail from "./session-page-partials/session-detail";

import { Logout } from "../actions/user-actions"
import { SetSessionInfo } from "../actions/session-actions";
import { UpdateSessionRequest } from "../actions/session-actions";
import { AddNewSessionRequest } from "../actions/session-actions";
import { FetchOneSessionRequest } from "../actions/session-actions";
import { ProcessCode } from "../actions/editor-actions"
import { JsInterpreter } from "../utils/session-utils"


class Session extends Component{

  constructor(props){
    super(props);

    this.state = {
      _showChatBox: true,
      showSessionDetail: false,
      output: [],
      content: "",
      description: "",
      title: "",
      detail: {},
      owner: "",
    }


    this.showChatBox = this.showChatBox.bind(this);
    this.compileCode = this.compileCode.bind(this);
    this.saveSession = this.saveSession.bind(this);
    this.saveSessionDetail = this.saveSessionDetail.bind(this);
    this.toggleSessionDetail = this.toggleSessionDetail.bind(this);
    this.logout = this.logout.bind(this);
    this.goHome = this.goHome.bind(this);
    this._ProcessCode = this._ProcessCode.bind(this);
    this.editorChanged = this.editorChanged.bind(this);

    this.showHomeBtn = true;

    // initialising javascript interpreter
    this.Interpreter = new JsInterpreter();
  }

  componentWillMount(){
    // saving id this context
    this.id = this.props.match.params.id;

    this.props.SetSessionInfo({
      success: true, 
      message: "Please wait... "
    });

    const re = /^[\w+\W+]{4,20}$/
    if(re.test(this.id)) {

      let content = this.props.sessions.filter((item) => {
        if(item.id  == this.id)
          return item 
      })

      // establishing client connection
      this.props.ClientConnection({
        username: this.props.user.username, 
        sessionId: this.id,
      }) 

      if(content.length == 0){
        //content not available in redux store
        // making request to get it from server
        this.props.FetchOneSessionRequest({
          id: this.id
        })
          .then(({data}) => {
            // data successfully fetched from server
            // populating the editor with the content
            this.setState({
              content: data.payload.content,
              title: data.payload.title,
              description: data.payload.description || "",
              owner: data.payload.username,
            });
            // update editor with data from server
            this._ProcessCode(data.payload.content);

            this.props.SetSessionInfo({
              success: true, 
              message: "Done"
            });
          })
          .catch(({response}) => {
            // showing error message
            let { success, message } = response.data;
            this.props.SetSessionInfo({
              success, 
              message,
            });
            // pushing to home page displaying resource not fount message
            // this.props.history.replace("/home", null);

            // ******** commented out to allow custom session/room ******** //
          });

      } else {
        // saving to component state data from server
        this.setState({
          content: content[0].content,
          title: content[0].title,
          description: content[0].description || "",
          owner: content[0].username,
        });
        // update editor with data from server
        this._ProcessCode(content[0].content);

        this.props.SetSessionInfo({
          success: true, 
          message: "Done"
        });
      } 
    } else {
      this.props.SetSessionInfo({
        success: false, 
        message: "ID should be 4 characters minimum"
      });
    }
  }

  componentDidMount(){
    window.document.title = "Pair Coding - Session"
  }

  componentWillReceiveProps(newProps) { 
    // update state with incoming data
    let { content, title, description } = newProps.code;
    this.setState({
      content,
      title: title || this.state.title,
      description: description || this.state.description,
    });
  }

  componentWillUnmount() {
    // closing client connection
    this.props.ClientLeftSession();
  }

  compileCode(){
    // compile javascript code from the editor
    this.setState({
      _showChatBox: false
    });

    this.Interpreter.assignData(this.state.content)
    let output = this.Interpreter.run();

    this.setState({output});    
  }

  editorChanged(content){
    this.setState({
      content,
    })
  }

  goHome() {
    // redirect to home route
    this.props.history.push("/home", null);
  }

  logout(){
    // closing client connection
    this.props.ClientLeftSession();

    // logs user out
    this.props.Logout();
    this.props.history.replace("/", null);
  }

  _ProcessCode(content){
    // broadcast in real time editor content to connected peers
    this.props.ProcessCode({
      title: this.state.title,
      description: this.state.description,
      content, 
      cursorPos: {line: 0, ch: 0, sticky: null},
      top: 0,
      left: 0,
      type: "self",
    })
  }

  saveSession(){
    const {title, description} = this.state;
    // save session to server db on save button clicked
    let data = {}

    data.id =  (this.props.user.username == this.state.owner) ? this.id : shortid.generate();
    data.title = title;
    data.description = description;
    data.username = this.props.user.username;
    data.owner = this.state.owner;
    data.content = this.state.content; 
    data.time = Date.now();

    this.props.SetSessionInfo({
      success: true, 
      message: "Please wait..."
    });

    // sending save request to server
    this.props.UpdateSessionRequest(data);
  }

  saveSessionDetail(data){
    // saving session detail to component state
    let {title, description} = data;
    const self = this;
    this.setState({
      title,
      description
    });

    // notifying connected peers of the session detail change
    this.props.ClientSendCode({
      title: this.state.title,
      description: this.state.description,
      content: this.state.content, 
      type: "self"
    })
  }

  showChatBox(){
    // showing chat box
    this.setState({
      _showChatBox: true
    })
  }

  toggleSessionDetail(){
    // toggles session detail window
    this.setState({
      showSessionDetail: !this.state.showSessionDetail
    })
  }

  render(){
    const {title, description} = this.state;
    this.state.detail = {title, description, id: this.id};
    return (
      <main class="session">
        <MenuBar 
          logout = {this.logout}
          showHomeBtn = {this.showHomeBtn}
          goHome = {this.goHome}
        />
        <div class="divide">
          <SessionEditor 
            showChatBox = {this.showChatBox} 
            compileCode = {this.compileCode} 
            saveSession = {this.saveSession}
            toggleSessionDetail = {this.toggleSessionDetail}
            editorChanged = { this.editorChanged }
          />
          <SessionChat 
            showChatBox = {this.state._showChatBox}
            output = {this.state.output}
          />
        </div>
        {
          this.state.showSessionDetail &&
            <SessionDetail 
              saveSessionDetail = {this.saveSessionDetail}
              toggleSessionDetail = {this.toggleSessionDetail}
              detail = {this.state.detail}
            />
        }
      </main>
    );
  }
}

Session.propTypes = {
  SetSessionInfo: PropTypes.func.isRequired,
  UpdateSessionRequest: PropTypes.func.isRequired,
  AddNewSessionRequest: PropTypes.func.isRequired,
  FetchOneSessionRequest: PropTypes.func.isRequired,
  Logout: PropTypes.func.isRequired,
  ProcessCode: PropTypes.func.isRequired,
  ClientConnection: PropTypes.func.isRequired,
  ClientLeftSession: PropTypes.func.isRequired,
  ClientSendCode: PropTypes.func.isRequired,
  sessions: PropTypes.array.isRequired,
  user: PropTypes.object.isRequired,
  code: PropTypes.object.isRequired,
}


function mapstatetoprops(state){
  return {
    user: state.User,
    sessions: state.Sessions,
    code: state.Code
  }
}

export default connect(mapstatetoprops,{
  SetSessionInfo,
  UpdateSessionRequest,
  AddNewSessionRequest,
  FetchOneSessionRequest,
  ProcessCode,
  ClientConnection,
  ClientLeftSession,
  ClientSendCode,
  Logout
})(Session);

