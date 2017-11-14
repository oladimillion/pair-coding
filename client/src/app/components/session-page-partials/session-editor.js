import React from 'react'
import PropTypes from "prop-types";

import ControlBtn from './control-btn'
import Editor from './editor'


const SessionEditor = (props) => { 

  return (
    <aside class="session-editor">
      <ControlBtn 
        showChatBox = { props.showChatBox }
        compileCode = { props.compileCode }
        saveSession = { props.saveSession }
        toggleSessionDetail = { props.toggleSessionDetail }
      />
      <Editor 
        editorChanged = { props.editorChanged }
      />
    </aside>
  )
}

SessionEditor.propTypes = {
  showChatBox: PropTypes.func.isRequired,
  compileCode: PropTypes.func.isRequired,
  saveSession: PropTypes.func.isRequired,
  toggleSessionDetail: PropTypes.func.isRequired,
} 


export default SessionEditor;
