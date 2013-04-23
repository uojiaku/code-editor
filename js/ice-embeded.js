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
  this.addControls();
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
  var ret = this.script.textContent;

  // Strip opening newline
  ret = ret.
    replace(/\n/, '');

  // Wrap bulk of code in script tags
  ret = ret.
    replace(/^([^-][\s\S]+)/m, "<script>\n$1\n</script>");

  // Convert simple -script placeholders to <script> equivalent
  ret = ret.
    replace(/^-(\w+)(.*?)\s*\{([\s\S]+)-\}.*$/gm, "\n<$1$2>$3</$1>").
    replace(/^-(\w+)(.*)$/gm, "<$1$2></$1>").
    replace(/^\s+/, '').
    replace(/\s+$/, '');

  return ret;
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

Embedded.prototype.addControls = function() {
  var el = document.createElement('div');
  el.className = 'icon';
  document.body.appendChild(el);

  this.editor.editor_el.appendChild(el);

  var svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
  svg.setAttribute('viewBox', '0 0 48 48');

  var path = document.createElementNS('http://www.w3.org/2000/svg', 'path');
  path.setAttribute('d', 'M 11.742,7.50 L 20.121,15.879 C 21.294,17.052 21.294,18.948 20.121,20.121 C 18.948,21.294 17.052,21.294 15.879,20.121 L 7.50,11.742 L 5.121,14.121 C 4.548,14.694 3.78,15.00 3.00,15.00 C 2.613,15.00 2.223,14.925 1.851,14.772 C 0.732,14.307 0.00,13.212 0.00,12.00 L 0.00,3.00 C 0.00,1.344 1.344,0.00 3.00,0.00 L 12.00,0.00 C 13.212,0.00 14.307,0.732 14.772,1.851 C 15.237,2.973 14.979,4.263 14.121,5.121 L 11.742,7.50 ZM 45.00,0.00 C 46.659,0.00 48.00,1.344 48.00,3.00 L 48.00,12.00 C 48.00,13.212 47.268,14.307 46.149,14.772 C 45.777,14.925 45.387,15.00 45.00,15.00 C 44.22,15.00 43.452,14.694 42.879,14.121 L 40.50,11.742 L 32.121,20.121 C 30.948,21.294 29.052,21.294 27.879,20.121 C 26.706,18.948 26.706,17.052 27.879,15.879 L 36.258,7.50 L 33.879,5.121 C 33.021,4.263 32.766,2.973 33.228,1.851 C 33.69,0.732 34.788,0.00 36.00,0.00 L 45.00,0.00 ZM 15.879,27.879 C 17.052,26.706 18.948,26.706 20.121,27.879 C 21.294,29.052 21.294,30.948 20.121,32.121 L 11.742,40.50 L 14.121,42.879 C 14.979,43.737 15.237,45.027 14.772,46.149 C 14.307,47.268 13.212,48.00 12.00,48.00 L 3.00,48.00 C 1.344,48.00 0.00,46.659 0.00,45.00 L 0.00,36.00 C 0.00,34.788 0.732,33.69 1.851,33.228 C 2.223,33.075 2.613,33.00 3.00,33.00 C 3.78,33.00 4.548,33.306 5.121,33.879 L 7.50,36.258 L 15.879,27.879 ZM 46.149,33.228 C 47.268,33.69 48.00,34.788 48.00,36.00 L 48.00,45.00 C 48.00,46.659 46.659,48.00 45.00,48.00 L 36.00,48.00 C 34.788,48.00 33.69,47.268 33.228,46.149 C 32.766,45.027 33.021,43.737 33.879,42.879 L 36.258,40.50 L 27.879,32.121 C 26.706,30.948 26.706,29.052 27.879,27.879 C 29.052,26.706 30.948,26.706 32.121,27.879 L 40.50,36.258 L 42.879,33.879 C 43.452,33.306 44.22,33.00 45.00,33.00 C 45.387,33.00 45.777,33.075 46.149,33.228 Z');
  svg.appendChild(path);

  el.appendChild(svg);

  var head = document.getElementsByTagName('head')[0];
  var style = document.createElement('style');
  style.type = 'text/css';

  var declarations = document.createTextNode(
    '.icon {' +
      'position: absolute; ' +
      'cursor: pointer; ' +
      'fill: rgba(204, 204, 204, 0.8); ' +
      'width: 25px; ' +
      'height: 25px; ' +
      'bottom: 10px; ' +
      'right: 30px; ' +
      'transition: all 0.2s ease-in-out; ' +
    '} ' +
    '.icon:hover {' +
      'fill: rgba(0, 0, 0, 0.8); ' +
      'width: 32px; ' +
      'height: 32px; ' +
      'bottom: 6px; ' +
      'right: 26px; ' +
    '}'
  );

  style.appendChild(declarations);
  head.appendChild(style);
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
