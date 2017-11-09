import React from 'react'
import PropTypes from "prop-types";

const Console = (props) =>  {
  return  (
    <div class="console">{ props.output }</div>
  )
};

Console.PropTypes = {
  // output: PropTypes.string.isRequired,
}

export default Console;
