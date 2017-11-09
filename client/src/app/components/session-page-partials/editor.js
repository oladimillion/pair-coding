import React, {  Component } from "react"
import PropTypes from "prop-types";

import { connect } from "react-redux";
import { ProcessCode } from "../../actions/editor-actions"
import { ClientSendCode } from "../../actions/socket-actions"


class Editor extends Component { 

  constructor(props){ 
    super(props);

    this.setValue = this.setValue.bind(this); // updates editor from store

    this.editor = undefined; //  code-mirror 
    this.cursorPos = undefined; // editor's cursor position
    this.top = undefined; // editor's top position
    this.left = undefined; // editor's left position
  }

  componentDidMount(){ 
    // initialising CodeMirror
    const textarea = this.refs.editor;

    var value = "// The bindings defined specifically in the Sublime Text mode\nvar bindings = { \n";
    var map = CodeMirror.keyMap.sublime;
    for (var key in map) { 
      var val = map[key];
      if (key != "fallthrough" && val != "..." && (!/find/.test(val) || /findUnder/.test(val)))
        value += "  \"" + key + "\": \"" + val + "\",\n";
    }
    value += "}\n\n// The implementation of joinLines\n";
    value += CodeMirror.commands.joinLines.toString().replace(/^function\s*\(/, "function joinLines(").replace(/\n  /g, "\n") + "\n";

    var editor = CodeMirror.fromTextArea(textarea, { 
      lineNumbers: true,
      mode: "javascript",
      keyMap: "sublime",
      autoCloseBrackets: true,
      matchBrackets: true,
      showCursorWhenSelecting: true,
      theme: "monokai",
      tabSize: 2,
      indexWithTabs: true,
      lineWrapping: true,
      autoComplete: true,
      styleActiveLine: true,
      autofocus: true
    });

    // getting CodeMirror properties

    // getting editor's scroll position
    let editorInfo = editor.getScrollInfo();
    // getting cursor position
    let cursorPos = editor.getCursor();
    // getting cursor position
    let content = editor.getValue();

    this.editor = editor; // making code-mirror available to member functions
    this.top = editorInfo.top;
    this.left = editorInfo.left;
    this.cursorPos = cursorPos;

    editor.on('keyup', (cm, event) => {       
      if(this.keyStroke(event))
      {
        return;
      }
      // get editor's content
      content = editor.getValue();
      // get editor's scroll position
      editorInfo = editor.getScrollInfo();
      // get cursor position
      cursorPos = editor.getCursor();

      const data = {};
      data.content = content;
      data.top = editorInfo.top;
      data.left = editorInfo.left;
      data.cursorPos = cursorPos;
      data.type = "self";

      this.cursorPos = cursorPos;
      this.top = editorInfo.top;
      this.left = editorInfo.left;

      // storing editor data locally in redux store
      this.props.ProcessCode(data);
      // real time code dispatch to connected peers
      this.props.ClientSendCode(data);
    });

    // editor.setOption("readOnly", "nocursor");
    if(Object.keys(this.props.code).length)
      // update editor with props content
      this.setValue(this.props.code);
  }

  componentWillReceiveProps(newProps) { 
    // update editor with props content
    this.setValue(newProps.code);
  }

  keyStroke(event){
    if(event.key == "Control" || event.key == "Shift" 
      || event.key == "Alt" || event.key == "ArrowDown"
      || event.key == "ArrowUp" || event.key == "ArrowRight" 
      || event.key == "ArrowLeft" || event.key == "PageUp" 
      || event.key == "PageDown" || event.key == "Home" 
      || event.key == "End" || event.ctrlKey 
      || event.shiftKey || event.altKey
    )
    {
      return true;
    }

    return false;
  }

  setValue(data){
    let {content, cursorPos, top, left } = data;
    // set editor's content
    this.editor.setValue(content);
    // set editor's scroll position
    this.editor.scrollTo(left || this.left, top || this.top);
    // set editor's cursor position
    this.editor.setCursor(cursorPos || this.cursorPos);
  }

  render()  { 
    return (
      <textarea ref="editor" id="editor" name="editor" data-editor="markdown"></textarea>
    )
  }
};

Editor.propTypes = {
  ProcessCode: PropTypes.func.isRequired,
  ClientSendCode: PropTypes.func.isRequired,
  code: PropTypes.object.isRequired,
}


function mapStateToProps(state){ 
  return { 
    code: state.Code
  }
}

export default connect(mapStateToProps, {ProcessCode, ClientSendCode})(Editor);

