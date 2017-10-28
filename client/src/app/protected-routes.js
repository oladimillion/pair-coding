import React, { Component }  from 'react'
import { Route, Switch } from 'react-router-dom'
import { connect } from "react-redux";
import PropTypes from "prop-types";

import { SetLoginInfo } from "./actions/user-actions"

import Session from "./components/session-page";
import Home from "./components/home-page";

class ProctectedRoutes extends Component {

  constructor(props){
    super(props);

    this.state = {
      isLoading: true
    }
  }
  
  componentWillMount(){
      
    if( !Object.keys(this.props.user).length ){
      this.props.SetLoginInfo({ 
        success: false,
        message: "Please login to access the resource"
      });
      this.props.history.replace("/", null);
    } else {
      this.setState({
        isLoading: false
      })
    }
  }

  render() {
    return (
      <div>
        {
          !this.state.isLoading &&
            <Switch>
              <Route exact path="/home" 
                component={Home} 
              /> 
              <Route exact path="/session/:id"
                component={Session}
              /> 
            </Switch>
        }
      </div>
    )
  }
}

ProctectedRoutes.propTypes = {
  user: PropTypes.object.isRequired,
}



function mapStateToProps(state){
  return {
    user: state.User,
  }
}


export default connect(mapStateToProps, { SetLoginInfo })(ProctectedRoutes);

