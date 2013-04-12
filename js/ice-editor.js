// IceCodeEditor.js 0.0.1

(function(){

// ICE.Editor
// ----------

// Import some helpers from the ACE Code Editor
var UndoManager = require("ace/undomanager").UndoManager;
var EmacsManager = require("ace/keyboard/emacs").handler;

// Construct a new instance of the ICE Code Editor. The DOM element
// supplied to the constructor must already exist.
function Editor(el, options) {
  this.el = el;

  if (typeof(options) != "object") options = {};
  this.edit_only = !!options.edit_only;
  this.onUpdate = options.onUpdate || function(){};

  this.preview_el = this.createPreviewElement();
  this.editor_el = this.createEditorElement();
  this.editor = this.initializeAce();
  this.applyStyles();
}

// This will replace the content in the editor layer with the supplied
// `data`.
Editor.prototype.setContent = function(data) {
  var that = this;
  function handleChange() {
    that.resetUpdateTimer();
  }

  this.editor.getSession().removeListener('change', handleChange);
  this.editor.setValue(data, -1);
  this.editor.getSession().setUndoManager(new UndoManager());
  this.editor.getSession().on('change', handleChange);
  this.updatePreview();
};

Editor.prototype.getValue = function() {
  return this.editor.getValue();
};
Editor.prototype.getContent = Editor.prototype.getValue;

// Toggle the display of the editor layer.
Editor.prototype.toggle = function() {
  if (this.isEditorVisible()) {
    this.hideCode();
  }
  else {
    this.showCode();
  }
};

// Predicate method to determine is the editor is currently visible
Editor.prototype.isEditorVisible = function() {
  return this.editor_el.style.display === '';
};

// Show the code layer, calling the ACE resize methods to ensure that
// the display is correct.
Editor.prototype.showCode = function() {
  this.editor_el.style.display = '';
  this.editor.renderer.onResize();
  this.editor.focus();
};

// Hide the code layer
Editor.prototype.hideCode = function() {
  this.editor_el.style.display = 'none';
  if (this.edit_only) return;

  this.preview_el.children[0].focus();
};

// This hides the preview layer by removing the containing iframe
// element from the DOM.
Editor.prototype.hidePreview = function(){
  var iframe = this.getPreviewIframe();
  iframe.parentElement.removeChild(iframe);
};

// Resets the timeout that delays code updates from being seen in the
// preview layer. Immediate updates can be obtrusive / not condusive
// to coding. They can also cause problems with memory or performance
// in the browser. The timeout is 1.5 seconds.
Editor.prototype.resetUpdateTimer = function() {
  var that = this;
  clearTimeout(this.update_timer);
  this.update_timer = setTimeout(
    function() { that.updatePreview(); that.update_timer = undefined; },
    1.5 * 1000
  );
};

// Update the preview layer with the current contents of the editor
// layer.
Editor.prototype.updatePreview = function() {
  if (this.edit_only) return;

  var iframe = this.getPreviewIframe();
  var content = iframe.contentDocument || iframe.contentWindow.document;

  content.open();
  content.write(
    '<html manifest="http://localhost:3000/editor.appcache">' +
      '<body>' +
        this.editor.getValue() +
      '</body>' +
    '</html>'
  );
  content.close();

  content.body.style.margin = '0';
  this.onUpdate();
};

// Getter for the current preview iframe element. If no preview iframe
// exists, a new one will be created.
Editor.prototype.getPreviewIframe = function() {
  var iframe;
  if (this.preview_el.children.length > 0 ) {
    // TOOD: multiples
    iframe = frames[0].frameElement;
  }
  else {
    iframe = document.createElement( 'iframe' );
    iframe.style.width = '100%';
    iframe.style.height = '100%';
    iframe.style.border = '0';
    this.preview_el.appendChild( iframe );
  }

  return iframe;
};

// Apply all of the necessary styles to the code editor.
Editor.prototype.applyStyles = function() {
  this.el.className += ' ice-editor';

  this.el.style.margin = '0px';
  this.el.style.overflow = 'hidden';

  this.editor_el.style.width = '100%';
  this.editor_el.style.position = 'absolute';
  this.editor_el.display = 'none';

  this.preview_el.style.width = '100%';
  this.preview_el.style.position = 'absolute';
  this.preview_el.style.top = '0';
};

// Create a DOM element to hold the preview layer.
Editor.prototype.createPreviewElement = function() {
  var preview = document.createElement('div');

  if (this.edit_only) return preview;

  this.el.appendChild(preview);
  return preview;
};


// Create a DOM element to hold the editor element.
Editor.prototype.createEditorElement = function() {
  var editor = document.createElement( 'div' );
  this.el.appendChild( editor );
  return editor;
};

// Set up the ACE editor with sane JavaScript defaults.
Editor.prototype.initializeAce = function() {
  var editor = ace.edit(this.editor_el);
  editor.setTheme("ace/theme/chrome");
  editor.getSession().setMode("ace/mode/javascript");
  editor.getSession().setUseWrapMode(true);
  editor.getSession().setUseSoftTabs(true);
  editor.getSession().setTabSize(2);
  editor.setPrintMarginColumn(false);
  editor.setDisplayIndentGuides(false);
  editor.setFontSize('18px');

  this._default_keyboard_handler = editor.getKeyboardHandler();

  return editor;
};

// Export the Editor class constructor on the public API.
if (!window.ICE) ICE = {};
ICE.Editor = Editor;

})();
