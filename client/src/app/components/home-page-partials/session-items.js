import React from 'react'
import { Link } from 'react-router-dom';
import PropTypes from "prop-types";

function SessionItems (props) { 

  const list = props.sessions
    .filter((data, index)=> index < 10)
    .map((session) => { 
      return(
        <li key={ session.id }>
          <Link to={ 
            `/session/${session.id}`
          }>
          <span class="title">{ session.title }</span>
        </Link>
        <span class="time">{ new Date(session.time).toLocaleString() }</span>
        <span 
          onClick={ ()=>props.deleteSession(session.id) }
          class="delete glyphicon glyphicon-remove-circle"></span>
      </li>
      )
    })

  return (
    <section class="session-items">
      <ul>
        { list }
      </ul>
    </section>
  )
}

SessionItems.propTypes = {
  deleteSession: PropTypes.func.isRequired,
  sessions: PropTypes.array.isRequired,
}


export default SessionItems;
