import React,{ Component } from 'react';
import { connect } from "react-redux";
import PropTypes from "prop-types";

import { SetSessionInfo } from "../../actions/session-actions"
import { ClientSendMessage  } from "../../actions/socket-actions"

class ChatBox extends Component { 

  constructor(props){ 
    super(props);

    this.sendMessage = this.sendMessage.bind(this);
    this.handleChange = this.handleChange.bind(this);
    this.scrollToBottom = this.scrollToBottom.bind(this);
    this.localeTime = this.localeTime.bind(this);

    this.state = { 
      textareaValue: "", // chat textare field
      localChats: [], // holds array of chats received from redux store
    }

    this.username = undefined; // user's username
    this.isLoaded = false; // first time component will receive props?

    this.maxRows = 5; // max number of rows 
    this.minRows = 1; // min number of rows
  }

  componentWillMount(){
    this.setState({
      localChats: this.props.chat
    })
  }

  componentDidMount(){ 
    this.scrollAreaPadding(this.minRows);
    // scroll chat box to the bottom 
    this.scrollToBottom();
    this.username = this.props.user.username;
  }

  componentDidUpdate(){ 
    // scroll chat box to the bottom 
    this.scrollToBottom();
  }

  componentWillReceiveProps(nextProps){
    // displaying messages on receive
    let { chat } = nextProps;

    if(chat.length){
      let filterChats = [];

      filterChats = chat.map((item)=>{
        if(item.username == this.username){
          item.type = "self";
          item.username = "me";
        }
        return item;
      })

      this.setState({ 
        localChats: this.isLoaded ? filterChats : chat
      })

      this.scrollToBottom();
      this.isLoaded = true;
    }
  }

  handleChange(e){ 
    const text = e.target.value;

    // setting height of message textarea based on number of new lines
    const lines = this.minRows + (text.match(/\n/g) || []).length;

    this.setState({ 
      textareaValue: text
    });

    if(lines < this.maxRows){ 
      e.target.rows = lines;
      this.scrollAreaPadding(lines);
    } else { 
      e.target.rows = this.maxRows;
      this.scrollAreaPadding(this.maxRows);
    }
  }

  scrollAreaPadding(multiple, fixed = 20){
    let calcPadding = (multiple * fixed);
    // has message-box height increases, shift conversations up
    // this.refs.scrollArea.style.paddingBottom = calcPadding + "px";
    const declaration = this.refs.scrollArea.style;
    declaration.setProperty("padding-bottom",`${calcPadding}px`);
  }

  scrollToBottom(){ 
    // scrolling page to the bottom on each message update
    this.refs.scrollArea.scrollTop = this.refs.scrollArea.scrollHeight;
  }

  sendMessage(e){ 
    // handles real time message dispatch
    let message = this.state.textareaValue.trim();
    let { username } = this.props.user;
    const re = /[\w+\W+]/g;

    if(!re.test(message))
      return;

    let time = Date.now();

    const data = { username, type: "self", message, time};

    // call to client to emit message
    this.props.ClientSendMessage(data);
    // message sending status
    this.props.SetSessionInfo({
      success: true,
      message: "sending..."
    })
    // clears input field
    this.setState({ 
      textareaValue: "",
    })
    this.refs.message.rows = this.minRows;
    this.scrollAreaPadding(this.minRows);
  }

  localeTime(time)
  {
    return new Date(time).toLocaleTimeString("en-US", 
      {hour: "numeric", minute: "numeric", hour12: true})
  }

  render(){ 

    const messages =
      this.state.localChats.map((message, index) => { 
        return (
          <div key={ index } class={ "chat " + message.type }>
            <span class="username">{ message.username }</span>
            <span style={ { whiteSpace: "pre-wrap" } }  class="message">{ message.message }</span>
            <span class="time">{ this.localeTime(message.time) }</span>
          </div>
        )
      });

    return (
      <div class="chat-box">

        <div 
          class="scroll-area" 
          ref="scrollArea">
          { messages }
        </div>

        <div class="message-box ">
          <textarea
            value = { this.state.textareaValue }
            onChange = { this.handleChange } 
            ref="message" 
            name="message" 
            placeholder="Type something..." 
            rows="1">
          </textarea>

          <span 
            onClick = { this.sendMessage } 
            class="glyphicon glyphicon-envelope">
          </span> 
        </div>

      </div>
    )

  }
}

ChatBox.PropTypes = {
  SetSessionInfo: PropTypes.func.isRequired,
  ClientSendMessage: PropTypes.func.isRequired,
  chat: PropTypes.array.isRequired,
  user: PropTypes.object.isRequired,
}


function mapStateToProps(state){ 
  return { 
    user: state.User,
    chat: state.Chat
  }
}

export default connect(mapStateToProps, {
  ClientSendMessage,
  SetSessionInfo,
})(ChatBox);

