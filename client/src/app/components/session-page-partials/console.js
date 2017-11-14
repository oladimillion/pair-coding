import React from 'react'
import PropTypes from "prop-types";

function removePlaceholder(data){
  if(typeof data == "function") return "Function";
  return JSON.stringify(data).replace(/____/g, "")
    .replace(/\"undefined\"/g, "undefined");
}

const Console = (props) =>  {

  const renderOutput =        
    props.output.map((data, index) => {
      return <div key={index}><div>
          {removePlaceholder(data) == '""' ? <br /> : removePlaceholder(data) }
      </div></div>
    });

  return  (
    <div class="console">{ renderOutput }</div>
  )
};

Console.PropTypes = {
  output: PropTypes.array.isRequired,
}

export default Console;
