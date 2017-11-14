import React, { Component } from 'react'
import PropTypes from "prop-types";

import ChatBox from './chat-box';
import Console from './console';

class SessionChat extends Component {
  render() {
    const toggleChatBox  = 
      this.props.showChatBox ? 
      <ChatBox /> : 
      <Console output = {this.props.output} />

      return (
        <aside class="session-chat">
          { toggleChatBox }
        </aside>
      )
  }
}

SessionChat.propTypes = {
  showChatBox: PropTypes.bool.isRequired,
  output: PropTypes.array.isRequired,
}

export default SessionChat;
