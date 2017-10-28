import React, { Component } from 'react'
import { connect } from 'react-redux'
import PropTypes from "prop-types";

import { UpdateSessionDetailRequest  } from "../../actions/session-actions" 

class SessionDetail extends Component {

  constructor(props){
    super(props);

    this.onClick = this.onClick.bind(this);
    this.onChange = this.onChange.bind(this);
    this.setProps = this.setProps.bind(this);

    this.state = {
      title: "",
      description: "",
      message: "",
      success: true,
      isLoading: false,
      isEditing: false
    }
  }

  componentWillMount(){
    // getting title and description from props
    this.setProps(this.props.detail);
  }

  componentWillReceiveProps(newProps){
    // getting title and description from props
    this.setProps(newProps.detail);
  }

  setProps(detail){
    // updates title and description from props data
    let {title, description} = detail;
    this.setState({
      title, description
    })
  }

  onChange (e){
    this.setState({
      message: "",
      success: true,
      isLoading: false,
      [e.target.name] : e.target.value
    });

  }

  onClick(e) {
    let {title, description} = this.state;
    let{ detail } = this.props;
    let {id} = this.props.detail;

    description = description || "";

    let _title = detail.title;
    let _description = detail.description;

    // checks for changes
    if((_title == title) && (_description == description)){
      this.setState({
        success: false,
        message: "No changes made"
      })
      return;
    }

    const re = /[\s]?[\w+\W+]{4,20}/;

    // validates title characters
    if(!title || !re.test(title)){
      this.setState({
        success: false,
        message: "Title requires 4-20 length of characters"
      })
      return;
    }

    // saves session detail update to server
    this.props.UpdateSessionDetailRequest({id, title, description})
      .then(({data})=>{
        let {success, message} = data;
        this.setState({
          success,
          message,
          isEditing: false});
        // saves session detail update locally
        this.props.saveSessionDetail({title, description})
      })
      .catch(({response})=>{
        let {  success, message  } = response.data;
        this.setState({
          success,
          message
        })
      })

  }

  toggleEditing(){
    // toggles window's editing mode
    this.setState({
      isEditing: !this.state.isEditing,
      message: "",
      success: true,
    })

  }

  render() {

    let { 
      message, success, isLoading, isEditing,
      title, description
    } = this.state;

    let style = success ? "alert alert-success" : "alert alert-danger";

    return (
      <div class="pop-up">
        <ul 
          class="pop-up-detail">

          <li
            disabled = { isLoading }> 
            <span>
              <span
                onClick = { ()=>this.toggleEditing() }
                class="glyphicon glyphicon-edit">
              </span>
              <span 
                onClick = { ()=>this.props.toggleSessionDetail() }
                class="glyphicon glyphicon-remove"
              ></span>
            </span>
          </li>
          
          <li class="pop-up-info bold-info">
            Session Detail
          </li>

          <li>
            Title
            <input 
              class="align-left"
              type="text" 
              name="title" 
              value={title}
              placeholder="Title here..."
              onChange={this.onChange}
              readOnly= {!isEditing}
            /> 
          </li>

          <li>
            Description
            <textarea 
              rows="4"
              name="description" 
              value={description}
              placeholder="Description here..."
              onChange={this.onChange}
              readOnly= {!isEditing}
            ></textarea> 
          </li>

          <li>
            <button 
              disabled = { isLoading || !isEditing }
              onClick = {this.onClick }
              class="btn btn-primary">
              Update Detail
            </button>
          </li>

          <li>
            {
              message &&
                <p class={style}>{ message }</p>
            }
          </li>


        </ul>
      </div>
    )
  }
}

SessionDetail.propTypes = {
  UpdateSessionDetailRequest: PropTypes.func.isRequired,
  saveSessionDetail: PropTypes.func.isRequired,
  toggleSessionDetail: PropTypes.func.isRequired,
  detail: PropTypes.object.isRequired,
} 

  
export default connect(null, { 
  UpdateSessionDetailRequest,
})(SessionDetail);
