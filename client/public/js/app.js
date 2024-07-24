// defining the ace theme
ace.define("ace/theme/one_dark_pro_monokai_darker", ["require", "exports", "module", "ace/lib/dom"], function(require, exports, module) {
  exports.isDark = true;
  exports.cssClass = "ace-one-dark-pro-monokai-darker";
  exports.cssText = `
    .ace-one-dark-pro-monokai-darker .ace_gutter {
      background: #21252b;
      color: #636d83;
    }
    .ace-one-dark-pro-monokai-darker .ace_print-margin {
      width: 1px;
      background: #2c313a;
    }
    .ace-one-dark-pro-monokai-darker {
      background-color: #282c34;
      color: #abb2bf;
    }
    .ace-one-dark-pro-monokai-darker .ace_cursor {
      color: #528bff;
    }
    .ace-one-dark-pro-monokai-darker .ace_marker-layer .ace_selection {
      background: #3d4350;
    }
    .ace-one-dark-pro-monokai-darker.ace_multiselect .ace_selection.ace_start {
      box-shadow: 0 0 3px 0px #282c34;
    }
    .ace-one-dark-pro-monokai-darker .ace_marker-layer .ace_step {
      background: rgb(102, 82, 0);
    }
    .ace-one-dark-pro-monokai-darker .ace_marker-layer .ace_bracket {
      margin: -1px 0 0 -1px;
      border: 1px solid #747369;
    }
    .ace-one-dark-pro-monokai-darker .ace_marker-layer .ace_active-line {
      background: #2c313a;
    }
    .ace-one-dark-pro-monokai-darker .ace_gutter-active-line {
      background-color: #2c313a;
    }
    .ace-one-dark-pro-monokai-darker .ace_marker-layer .ace_selected-word {
      border: 1px solid #3d4350;
    }
    .ace-one-dark-pro-monokai-darker .ace_invisible {
      color: #747369;
    }
    .ace-one-dark-pro-monokai-darker .ace_keyword,
    .ace-one-dark-pro-monokai-darker .ace_meta {
      color: #c678dd;
    }
    .ace-one-dark-pro-monokai-darker .ace_constant,
    .ace-one-dark-pro-monokai-darker .ace_constant.ace_character,
    .ace-one-dark-pro-monokai-darker .ace_constant.ace_character.ace_escape,
    .ace-one-dark-pro-monokai-darker .ace_constant.ace_other {
      color: #d19a66;
    }
    .ace-one-dark-pro-monokai-darker .ace_constant.ace_numeric {
      color: #d19a66;
    }
    .ace-one-dark-pro-monokai-darker .ace_invalid,
    .ace-one-dark-pro-monokai-darker .ace_invalid.ace_deprecated {
      color: #ffffff;
      background-color: #e05252;
    }
    .ace-one-dark-pro-monokai-darker .ace_support.ace_constant {
      color: #d19a66;
    }
    .ace-one-dark-pro-monokai-darker .ace_fold {
      background-color: #61afef;
      border-color: #abb2bf;
    }
    .ace-one-dark-pro-monokai-darker .ace_support.ace_function {
      color: #61afef;
    }
    .ace-one-dark-pro-monokai-darker .ace_storage {
      color: #c678dd;
    }
    .ace-one-dark-pro-monokai-darker .ace_storage.ace_type,
    .ace-one-dark-pro-monokai-darker .ace_support.ace_type {
      color: #c678dd;
    }
    .ace-one-dark-pro-monokai-darker .ace_variable {
      color: #e06c75;
    }
    .ace-one-dark-pro-monokai-darker .ace_variable.ace_parameter {
      color: #d19a66;
    }
    .ace-one-dark-pro-monokai-darker .ace_string {
      color: #98c379;
    }
    .ace-one-dark-pro-monokai-darker .ace_comment {
      color: #5c6370;
      font-style: italic;
    }
    .ace-one-dark-pro-monokai-darker .ace_entity.ace_name.ace_tag,
    .ace-one-dark-pro-monokai-darker .ace_entity.ace_other.ace_attribute-name {
      color: #e06c75;
    }
    .ace-one-dark-pro-monokai-darker .ace_indent-guide {
      background: url(data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAACCAYAAACZgbYnAAAAEklEQVQImWPQ09NrYAgMjP4PAAtGAwchHMyAAAAAAElFTkSuQmCC) right repeat-y;
    }
  `;
  
  var dom = require("../lib/dom");
  dom.importCssString(exports.cssText, exports.cssClass);
});

// inintializing the ace editors
const htmlEditor = ace.edit("html-editor");
const cssEditor = ace.edit("css-editor");
const jsEditor = ace.edit("js-editor");

const editors = [htmlEditor, cssEditor, jsEditor];

// setting theme, font, and adding word wrap
editors.forEach(editor => {
  editor.setTheme("ace/theme/one_dark_pro_monokai_darker");
  editor.setFontSize(16);
  editor.session.setUseWrapMode(true);
  editor.session.setWrapLimitRange(null, null);
});

// setting the modes for the editors
htmlEditor.session.setMode("ace/mode/html");
cssEditor.session.setMode("ace/mode/css");
jsEditor.session.setMode("ace/mode/javascript");

// getting the saved code from the server and loading it
async function loadSavedCode() {
  try {
    // getting the code
    const response = await fetch('/loadCode', {
      method: 'GET',
      credentials: 'include'
    });

    //setting the editors value to the data that we got from the server and if there is no data then we will use the default
    if (response.ok) {
      const data = await response.json();
      htmlEditor.setValue(data.html !== undefined ? data.html : "<h1>Hello World!</h1>", -1);
      cssEditor.setValue(data.css !== undefined ? data.css : "body { font-family: Arial, sans-serif; }", -1);
      jsEditor.setValue(data.js !== undefined ? data.js : "console.log('Hello World!');", -1);
      updatePreview();
    } else if (response.status === 404) {
      htmlEditor.setValue("<h1>Hello World!</h1>", -1);
      cssEditor.setValue("body { font-family: Arial, sans-serif; }", -1);
      jsEditor.setValue("console.log('Hello World!');", -1);
      updatePreview();
    } else {
      console.error('Failed to load saved code');
    }
  } catch (error) {
    console.error('Error:', error);
  }
}

// load the saved code
window.addEventListener('DOMContentLoaded', loadSavedCode);

// getting the resizers and windows to allow for resizing windows in the editor
const resizer = document.querySelector('.resizer');
const editorSection = document.querySelector('.editor-section');
const previewContainer = document.querySelector('.preview-container');

let isResizing = false;

// resizing logic

resizer.addEventListener('mousedown', function(e) {
  isResizing = true;
  document.body.style.cursor = 'col-resize'; // Change cursor while resizing
  document.addEventListener('mousemove', onMouseMove);
  document.addEventListener('mouseup', onMouseUp);
});

function onMouseMove(e) {
  if (isResizing) {
    const containerWidth = document.querySelector('.container').offsetWidth;
    const minEditorWidth = 500; // Minimum width for the editor
    const minPreviewWidth = 300; // Minimum width for the preview

    let editorWidth = e.clientX - document.querySelector('.container').offsetLeft;
    if (editorWidth < minEditorWidth) {
      editorWidth = minEditorWidth;
    } else if (editorWidth > containerWidth - minPreviewWidth) {
      editorWidth = containerWidth - minPreviewWidth;
    }

    editorSection.style.width = `${editorWidth}px`;
    previewContainer.style.width = `calc(100% - ${editorWidth + 10}px)`; // Add margin back
  }
}

// if the mouse is up stop resizing
function onMouseUp() {
  if (isResizing) {
    isResizing = false;
    document.body.style.cursor = 'default'; // Reset cursor after resizing
    document.removeEventListener('mousemove', onMouseMove);
    document.removeEventListener('mouseup', onMouseUp);
  }
}

// function to switch between the html,css,js, and console tabs
function switchTab(tab) {
  document.querySelectorAll('.tab').forEach(t => t.classList.remove('active'));
  document.querySelector(`.tab:nth-child(${tab === 'html' ? 1 : tab === 'css' ? 2 : tab === 'js' ? 3 : 4})`).classList.add('active');
  document.querySelectorAll('.editor').forEach(e => e.style.display = 'none');
  document.getElementById(`${tab}-editor`).style.display = 'block';
  if (tab === 'html') htmlEditor.focus();
  if (tab === 'css') cssEditor.focus();
  if (tab === 'js') jsEditor.focus();
}

// function to preview the code in the web
function updatePreview() {
  // getting the html,css, and js code
  const html = htmlEditor.getValue();
  const css = cssEditor.getValue();
  const js = jsEditor.getValue();
  
  // clearing the tex area
  let div = document.getElementById('text-area');
  div.innerHTML = '';

  // when clicking run this will display the js in the console
  const oldConsoleLog = console.log;
  console.log = function(message) {
    const logEntry = document.createElement('div');
    logEntry.textContent = message;
    div.appendChild(logEntry);
    oldConsoleLog.apply(console, arguments);
  };

  // running the js and handling errors
  try {
    const result = eval(js);
    if (result !== undefined) {
      const resultEntry = document.createElement('div');
      resultEntry.innerHTML = `<h1>${result}</h1>`;
      div.appendChild(resultEntry);
    }
  } catch (e) {
    const errorEntry = document.createElement('div');
    errorEntry.textContent = 'Error: ' + e.message;
    div.appendChild(errorEntry);
  }

  //getting the preview frame and writing the html,css and js to the preview
  const previewFrame = document.getElementById('preview-frame');
  const preview = previewFrame.contentDocument || previewFrame.contentWindow.document;
  preview.open();
  preview.write(`
    <html>
      <head>
        <style>${css}</style>
      </head>
      <body>
        ${html}
        <script>
          (function() {
            try {
              ${js}
            } catch (e) {
              console.error('Error: ' + e.message);
            }
          })();
        <\/script>
      </body>
    </html>
  `);
  preview.close();

  console.log = oldConsoleLog;
}

// allowing to change between default, vim, and emacs
function changeKeyboardHandler() {
  const handler = document.getElementById('keyboardHandler').value;
  editors.forEach(editor => {
    if (handler === 'ace') {
      editor.setKeyboardHandler(null);
    } else {
      editor.setKeyboardHandler(`ace/keyboard/${handler}`);
    }
  });
}

// saving the code to the server
async function saveCode() {
  // getting the html,css, and js code
  const html = htmlEditor.getValue();
  const css = cssEditor.getValue();
  const js = jsEditor.getValue();
  
  try {
    // sending the code to the server
    const response = await fetch('/saveCode', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        html,
        css,
        js
      }),
      credentials: 'include'
    });

    if (response.ok) {
      // if the code is successfully saved then there will be an alert pop up saying so
      alert('Code saved successfully!');
    } else {
      console.error('Failed to save code');
    }
  } catch (error) {
    console.error('Error:', error);
  }
}

updatePreview();