// IceCodeEditor.js 0.0.1

(function(){

// ICE.Embedded
// ------------

// Create a new embedded instance of the ICE Editor from a `script`
// tag.
function Embedded(script, options) {
  this.script = script;
  if (!options) options = {};

  this.sourcecode = this.processSource();
  this.el = this.createEmbeddedElement();
  this.overlay = !options.preview_el;

  var that = this;
  this.editor = new ICE.Editor(this.el, {
    preview_el: options.preview_el,
    onUpdate: function() {that.timeoutPreview();},
    title: options.title
  });
  this.editor.setContent(this.sourcecode);
  this.editor.onUpdate();
  this.attributesFromSource();

  if (this.line) {
    this.editor.scrollToLine(this.line);
  }

  this.applyStyles();
}

// Create the `<div>` element that will hold the editor and preview
// layers.
Embedded.prototype.createEmbeddedElement = function() {
  this.script.insertAdjacentHTML('beforebegin', '<div>');
  return this.script.previousSibling;
};

// Process the sourcecode from the `<script>` tag. This needs to embed
// other `<script>` tags as `-script` since browsers will close an
// opening `<script>` tag with the first `</script>` tag seen.
Embedded.prototype.processSource = function() {
  return this.script.textContent.
    replace(/^-(\w+)(.*?)\s*\{([\s\S]+)-\}.*$/gm, "\n<$1$2>$3</$1>").
    replace(/^-(\w+)(.*)$/gm, "<$1$2></$1>").
    replace(/^\s+/, '').
    replace(/\s+$/, '');
};

Embedded.prototype.attributesFromSource = function() {
  this.line = this.script.attributes.line ? this.script.attributes.line.value : 0;
};

// Start or reset the countdown before the preview layer will be
// removed. The removal is done to prevent high/moderate CPU usage
// from a page element.
Embedded.prototype.timeoutPreview = function() {
  var that = this;
  clearTimeout(this.embed_timeout);
  this.embed_timeout = setTimeout(
    function() {
      that.editor.hidePreview();
    },
    2*60*1000
  );
};

Embedded.prototype.applyStyles = function() {
  if (this.overlay) {
    this.editor.el.style.position = 'relative';
    this.editor.editor_el.style.position = 'absolute';
    this.editor.preview_el.style.position = 'absolute';
    this.editor.preview_el.style.top = '0';
  }

  this.editor.el.style.height = '350px';

  this.editor.editor_el.style.width = '100%';
  this.editor.editor_el.style.height = '350px';

  this.editor.preview_el.style.width = '100%';
  this.editor.preview_el.style.height = '350px';
};

// Create a new instance of the embedded code editor for each
// `<script type=text/ice-code>` element on the page.
function attachEmbedded() {
  var i = 0;
  iceCodeScriptTags().forEach(function (script) {
    new Embedded(script, {title: "script-00"+i});
    i++;
  });
}

// Returns a list of all `<script>` tags with `type=text/ice-code`.
function iceCodeScriptTags() {
  var scripts_nodelist = document.getElementsByTagName('script'),
      scripts = Array.prototype.slice.call(scripts_nodelist);

  return scripts.filter(function(s) {
    return s.type == 'text/ice-code';
  });
}

// Export `attachEmbedded()` on the public API for the `ICE` module.
if (!window.ICE) ICE = {};
ICE.attachEmbedded = attachEmbedded;
ICE.Embedded = Embedded;

})();
