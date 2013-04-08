(function(){

var UndoManager = require("ace/undomanager").UndoManager;
var EmacsManager = require("ace/keyboard/emacs").handler;

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

Editor.prototype.hidePreview = function(){
  var iframe = this.getPreviewIframe();
  iframe.parentElement.removeChild(iframe);
};

Editor.prototype.resetUpdateTimer = function() {
  var that = this;
  clearTimeout(this.update_timer);
  this.update_timer = setTimeout(
    function() { that.updatePreview(); that.update_timer = undefined; },
    1.5 * 1000
  );
};

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

Editor.prototype.applyStyles = function() {
  this.el.className += ' ice-editor';

  this.el.style.margin = '0px';
  this.el.style.overflow = 'hidden';
  this.el.style.position = 'relative';
  this.el.style.height = '350px';

  this.editor_el.style.width = '100%';
  this.editor_el.style.height = '350px';
  this.editor_el.style.position = 'absolute';
  this.editor_el.display = 'none';

  this.preview_el.style.width = '100%';
  this.preview_el.style.height = '350px';
  this.preview_el.style.position = 'absolute';
  this.preview_el.style.top = '0';
};

Editor.prototype.createPreviewElement = function() {
  var preview = document.createElement('div');

  if (this.edit_only) return preview;

  this.el.appendChild(preview);
  return preview;
};

Editor.prototype.createEditorElement = function() {
  var editor = document.createElement( 'div' );
  this.el.appendChild( editor );
  return editor;
};

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

if (!window.ICE) ICE = {};
ICE.Editor = Editor;

})();
