import React from 'react'
import PropTypes from "prop-types";


const ControlBtn = (props) => { 

  return (
    <div class="control">

      <div class="control-btn">

        <button
          onClick = { ()=>props.toggleSessionDetail() }>
          Detail  <span class="glyphicon glyphicon-list-alt"></span>
        </button>

        <button 
          onClick = { ()=>props.saveSession() }>
           Save  <span class="glyphicon glyphicon-floppy-disk"></span>
        </button>

        <button
          onClick = { ()=>props.compileCode() }>
          Run  <span class="glyphicon glyphicon-play"></span>
        </button>

        <button
          onClick = { ()=>props.showChatBox() }>
          Chat  <span class="glyphicon glyphicon-comment"></span>
        </button>

      </div>

    </div>
  )  
}

ControlBtn.propTypes = {
  toggleSessionDetail: PropTypes.func.isRequired,
  saveSession: PropTypes.func.isRequired,
  compileCode: PropTypes.func.isRequired,
  showChatBox: PropTypes.func.isRequired,
}


export default ControlBtn;
