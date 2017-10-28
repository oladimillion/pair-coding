import React, { Component } from "react"
import { connect } from "react-redux"
import PropTypes from "prop-types";

import { Route } from 'react-router-dom'

import RegistrationForm from "./reg-form"

class Bottom extends Component { 
  render() { 

    const { message, success } = this.props.info;
    let renderInfo = undefined;
    if(message) { 
      const style = success ? 
        "status reg-status-success success"
        : "status reg-status-error error";

      renderInfo = (<div class={ style }>{ message }</div>)
    }


    return (
      <div class="bottom">
        <div class="bottom-inner">

          <div class="info">

            <h1>WELCOME TO PAIR-CODING</h1>
            <div>Now you can
              <br /> code in real time
              <br /> with your friends/colleagues.
            </div>

          </div>


          <div class="reg">

            <div class="title">
              No account yet?
              <br /> Register now
            </div>

            <Route 
              path = {this.props.url} 
              component = { RegistrationForm } 
            />
            { renderInfo } 

          </div>

        </div>

      </div>
    )
  }
}

Bottom.propTypes = {
  info: PropTypes.object.isRequired,
}


function mapStateToProps(state){ 
  return { 
    info: state.RegInfo
  }
}

export default connect(mapStateToProps)(Bottom);


