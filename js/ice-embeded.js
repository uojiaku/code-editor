(function(){

function Embedded(script) {
  this.script = script;
  this.sourcecode = this.processSource();
  this.el = this.createEmbeddedElement();

  var that = this;
  this.editor = new ICE.Editor(this.el, {
    onUpdate: function() {that.timeoutPreview();}
  });
  this.editor.setContent(this.sourcecode);
  this.editor.onUpdate();
}

Embedded.prototype.createEmbeddedElement = function() {
  var el = document.createElement( 'div' );
  this.script.insertAdjacentElement('beforebegin', el);
  return el;
};

Embedded.prototype.processSource = function() {
  return this.script.innerText.
    replace(/^-(\w+)(.*?)\s*\{([\s\S]+)-\}.*$/gm, "\n<$1$2>$3</$1>").
    replace(/^-(\w+)(.*)$/gm, "<$1$2></$1>").
    replace(/^\s+/, '').
    replace(/\s+$/, '');
};

Embedded.prototype.timeoutPreview = function() {
  var that = this;
  clearTimeout(this.embed_timeout);
  this.embed_timeout = setTimeout(
    function() {
      that.editor.hidePreview();
    },
    3*1000
  );
};


function attachEmbedded() {
  iceCodeScriptTags().forEach(function (script) {
    new Embedded(script);
  });
}

function iceCodeScriptTags() {
  var scripts_nodelist = document.getElementsByTagName('script'),
      scripts = Array.prototype.slice.call(scripts_nodelist);

  return scripts.filter(function(s) {
    return s.type == 'text/ice-code';
  });
}

if (!window.ICE) ICE = {};
ICE.attachEmbedded = attachEmbedded;

})();
