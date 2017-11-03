import React,{ Component } from 'react';
import { connect } from "react-redux";
import PropTypes from "prop-types";

import { ClientSendMessage  } from "../../actions/socket-actions"

class ChatBox extends Component { 

  constructor(props){ 
    super(props);

    this.sendMessage = this.sendMessage.bind(this);
    this.handleChange = this.handleChange.bind(this);
    this.scrollToBottom = this.scrollToBottom.bind(this);

    this.state = { 
      textareaValue: "", // chat textare field
      localChats: [], // holds array of chats received from redux store
    }

    this.username = undefined; // user's username
    this.isLoaded = false; // first time component will receive props?
  }

  componentWillMount(){
    this.setState({
      localChats: this.props.chat
    })
  }

  componentDidMount(){ 
    this.scrollAreaPadding(1);
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
      let self = chat[chat.length - 1].type;
      let filterChats = [];

      filterChats = chat.map((item)=>{
        if(item.username == this.username){
          item.type = "self";
          item.username = "me";
        }
        return item;
      })


      if(self == "self"){
        // clears input field
        this.setState({ 
          textareaValue: "",
        })
      }

      this.setState({ 
        localChats: this.isLoaded ? filterChats : chat
      })

      this.isLoaded = true;
    }
  }

  handleChange(e){ 
    const text = e.target.value;

    // setting height of message textarea based on number of new lines
    const lines = 1 + (text.match(/\n/g) || []).length;

    this.setState({ 
      textareaValue: text
    });

    if(lines < 5){ 
      e.target.rows = lines;
      this.scrollAreaPadding(lines);
    } else { 
      e.target.rows = 5;
      this.scrollAreaPadding(5);
    }
  }

  scrollAreaPadding(multiple, fixed = 29){
    let calcPadding = (multiple * fixed);
    let padding = 45;
    if(multiple == 1){
      padding = 45;
      this.refs.scrollArea.style.paddingBottom = padding + "px";
    } else  if (multiple == 2){
      padding = calcPadding + 7;
      this.refs.scrollArea.style.paddingBottom = padding + "px";
    } else {
      padding = calcPadding;
      this.refs.scrollArea.style.paddingBottom = padding + "px";
    }
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

    let time = new Date().toLocaleTimeString();

    const data = { username, type: "self", message, time};

    // call to client to emit message
    this.props.ClientSendMessage(data);

    this.refs.message.rows = 1;
    this.scrollAreaPadding(1);
    this.scrollToBottom();
  }

  render(){ 

    const messages =
      this.state.localChats.map((message, index) => { 
        return (
          <div key={ index } class={ "chat " + message.type }>
            <span class="username">{ message.username }</span>
            <span style={ { whiteSpace: "pre-wrap" } }  class="message">{ message.message }</span>
            <span class="time">{ message.time }</span>
          </div>
        )
      });

    return (
      <div class="chat-box ">

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

export default connect(mapStateToProps, {ClientSendMessage})(ChatBox);

