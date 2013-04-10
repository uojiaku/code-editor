// IceCodeEditor.js 0.0.1

(function(){

// ICE.Full
// --------

var store, editor;

function createElements() {
  var el = createIceElement();
  createPopupElement();

  return el;
}

function createIceElement() {
  var el = document.createElement('div');
  document.body.appendChild(el);
  return el;
}

function createPopupElement() {
  var el = document.createElement('div');
  el.id = "popup";
  el.style.display = 'none';
  document.body.appendChild(el);
  return el;
}

function applyStyles() {
  document.body.style.margin = '0px';
  document.body.style.overflow = 'hidden';

  editor.editor_el.style.position = 'absolute';
  editor.editor_el.style.top = '0';
  editor.editor_el.style.bottom = '0';
  editor.editor_el.style.left = '0';
  editor.editor_el.style.right = '0';
  editor.editor_el.backgroundColor = 'rgba(255,255,255,0.0)';

  editor.preview_el.style.position = 'absolute';
  editor.preview_el.style.top = '0';
  editor.preview_el.style.bottom = '0';
  editor.preview_el.style.left = '0';
  editor.preview_el.style.right = '0';
}

// toolbar

var pad = function ( number, length ) {

  var string = number.toString();

  while ( string.length < length ) string = '0' + string;
  return string;

};

var codeToolbar = function() {
  toolbar(
    buttonUpdate(),
    buttonHide(),
    buttonCodeMenu()
  );
};

var shortCodeToolbar = function() {
  toolbar(
    buttonShow()
  );
};

var projectMenu = function() {
  menu(
    menuNew(),
    menuOpen(),
    menuSave(),
    menuMakeCopy(),
    menuShare(),
    menuDownload(),
    menuInfo()
  );
};

var toolbar = function() {
  var buttons = Array.prototype.slice.apply(arguments);

  var old = document.getElementById('code-editor-toolbar');
  if (old) document.body.removeChild(old);

  var el = document.createElement( 'div' );
  el.id = 'code-editor-toolbar';
  el.style.position = 'absolute';
  el.style.right = '15px';
  el.style.top = '15px';
  document.body.appendChild( el );

  buttons.forEach(function(button) {
    el.appendChild(button);
  });
};

var menu = function() {
  var items = Array.prototype.slice.apply(arguments);

  var old = document.getElementById('code-editor-menu');
  if (old) {
    document.body.removeChild(old);
    return;
  }

  var el = document.createElement( 'ul' );
  el.id = 'code-editor-menu';
  el.className = 'menu';
  el.style.position = 'absolute';
  el.style.right = '17px';
  el.style.top = '55px';
  document.body.appendChild( el );

  items.forEach(function(item) {
    el.appendChild(item);
  });

  el.addEventListener( 'click', function ( event ) {
    document.body.removeChild(el);
  });
};

var buttonUpdate = function() {
  var el = document.createElement( 'button' );
  el.className = 'button';

  var checkbox = document.createElement( 'input' );
  checkbox.type = 'checkbox';

  if ( !store || store.is_new || store.current.autoupdate === true ) checkbox.checked = true;

  checkbox.style.margin = '-4px 4px -4px 0px';
  checkbox.addEventListener( 'click', function ( event ) {

    event.stopPropagation();

    store.current.autoupdate = store.current.autoupdate === false;
    store.sync();

  }, false );

  el.appendChild( checkbox );
  el.appendChild( document.createTextNode( 'update' ) );

  el.addEventListener( 'click', function ( event ) {

    update();

  }, false );

  return el;
};

var menuMakeCopy = function() {
  var el = document.createElement( 'li' );
  el.textContent = 'make a copy';
  el.addEventListener( 'click', function ( event ) {

    openMakeCopyDialog();

  }, false );

  return el;
};

var menuSave = function() {
  var el = document.createElement( 'li' );
  el.textContent = 'save';
  el.addEventListener( 'click', function ( event ) {

    save();

  }, false );

  return el;
};

var menuDownload = function() {
  var el = document.createElement( 'li' )
    , a = document.createElement( 'a' );

  el.appendChild( a );

  a.download = 'index.html';
  a.textContent = 'download';
  a.addEventListener( 'click', function ( event ) {

    download(event.target);

  }, false );

  return el;
};

var menuNew = function() {
  var el = document.createElement( 'li' );
  el.textContent = 'new';
  el.addEventListener( 'click', function ( event ) {

    openNewDialog();

  }, false );
  return el;
};

var menuOpen = function() {
  var el = document.createElement( 'li' );
  el.textContent = 'open';
  el.addEventListener( 'click', function ( event ) {

    openProjectsDialog();

  }, false );
  return el;
};

var menuInfo = function() {
  var el = document.createElement( 'li' );
  el.textContent = 'Help';
  el.addEventListener( 'click', function ( event ) {

    window.open( 'https://github.com/mrdoob/code-editor' );

  }, false );
  return el;
};

var menuShare = function() {
  var el = document.createElement( 'li' );
  el.textContent = 'share';
  el.addEventListener( 'click', function ( event ) {

    var input = document.createElement( 'input' );
    input.value = 'http://gamingjs.com/ice/#B/' + encode( editor.getValue() );
    input.style.width = '400px';
    input.style.padding = '5px';
    input.style.border = '0px';

    var toggle_game_mode = document.createElement('input');
    toggle_game_mode.type = 'checkbox';
    toggle_game_mode.addEventListener('change', function() {
      if (this.checked) {
        input.value = 'http://gamingjs.com/ice/?g#B/' + encode( editor.getValue() );
      }
      else {
        input.value = 'http://gamingjs.com/ice/#B/' + encode( editor.getValue() );
      }
      input.focus();
      input.select();
    });
    var toggle_label = document.createElement('label');
    toggle_label.appendChild(toggle_game_mode);
    toggle_label.appendChild(document.createTextNode("start in game mode"));
    toggle_label.title =
      "If this is checked, then the share link will start with the " +
      "code hidden.";

    var game_mode = document.createElement('div');
    game_mode.appendChild(toggle_label);

    var link = document.createElement( 'a' );
    link.href = 'http://is.gd/create.php?url=' + encodeURIComponent(input.value);
    link.target = "_blank";
    link.textContent = 'make a short link.';
    toggle_game_mode.addEventListener('change', function() {
      link.href = 'http://is.gd/create.php?url=' + encodeURIComponent(input.value);
    });
    var shortener = document.createElement( 'div' );
    shortener.className = 'instructions';
    shortener.textContent = '…or, for easier sharing, ';
    shortener.appendChild(link);

    var title = document.createElement( 'h1' );
    title.textContent = 'Copy this link to share your creation:';

    var share = document.createElement( 'div' );
    share.appendChild(title);
    share.appendChild(input);
    share.appendChild(game_mode);
    share.appendChild(shortener);

    openPopupDialog(share);

    input.focus();
    input.select();

  }, false );
  return el;
};

// popup
function openPopupDialog(content) {
  var el = document.getElementById('popup');

  function show() {
    el.style.display = '';
    update();
  };

  function hide() {
    el.style.display = 'none';
  };

  function update() {
    el.style.left = ( ( window.innerWidth - el.offsetWidth ) / 2 ) + 'px';
    el.style.top = ( ( window.innerHeight - el.offsetHeight ) / 2 ) + 'px';
  };

  while (el.children.length > 0) {
    el.removeChild(el.firstChild);
  }
  el.appendChild(content);

  show();

  var buttonClose = ( function () {
    var svg = document.createElementNS( 'http://www.w3.org/2000/svg', 'svg' );
    svg.setAttribute( 'width', 32 );
    svg.setAttribute( 'height', 32 );

    var path = document.createElementNS( 'http://www.w3.org/2000/svg', 'path' );
    path.setAttribute( 'd', 'M 9,12 L 11,10 L 15,14 L 19,10 L 21,12 L 17,16 L 21,20 L 19,22 L 15,18 L 11,22 L 9,20 L 13,16' );
    path.setAttribute( 'fill', 'rgb(235,235,235)' );
    svg.appendChild( path );

    return svg;
  } )();

  buttonClose.style.position = 'absolute';
  buttonClose.style.top = '5px';
  buttonClose.style.right = '5px';
  buttonClose.style.cursor = 'pointer';
  buttonClose.addEventListener( 'click', function ( event ) {
    scope.hide();
  }, false );
  el.appendChild( buttonClose );

  window.addEventListener( 'load', update, false );
  window.addEventListener( 'resize', function() {scope.hide();}, false );
}


var buttonHide = function() {
  var el = document.createElement( 'button' );
  el.className = 'button';
  el.textContent = 'hide code';
  el.addEventListener( 'click', function ( event ) {

    toggle();

  }, false );
  return el;
};

var buttonShow = function() {
  var el = document.createElement( 'button' );
  el.className = 'button';
  el.textContent = 'show code';
  el.addEventListener( 'click', function ( event ) {

    toggle();

  }, false );
  return el;
};

var buttonCodeMenu = function() {
  var el = document.createElement( 'button' );
  el.className = 'button';
  el.style.fontWeight = 'bold';
  el.textContent = '☰';
  el.title = 'Show project menu';
  el.addEventListener( 'click', function ( event ) {

    if (document.getElementById('projects-dialog')) {
      document.body.removeChild(
        document.getElementById('projects-dialog')
      );
    }

    closeMakeCopyDialog();

    projectMenu();

  }, false );

  return el;
};




document.addEventListener( 'keypress', function ( event ) {
  if ( event.keyCode === 9829 ) { // <3
    event.preventDefault();
    if (editor.getKeyboardHandler() == CommandManager) {
      editor.setKeyboardHandler(EmacsManager);
    }
    else {
      editor.setKeyboardHandler(CommandManager);
    }
  }
});

document.addEventListener( 'keydown', function ( event ) {
  if ( event.keyCode === 83 && ( event.ctrlKey === true || event.metaKey === true ) ) {

    event.preventDefault();
    save();

  }

  if ( event.keyCode === 13 && ( event.ctrlKey === true || event.metaKey === true ) ) {

    update();

  }

  if ( event.keyCode === 27 ) { // ESC

    if (document.getElementById('code-editor-menu')) {
      document.body.removeChild(
        document.getElementById('code-editor-menu')
      );
    }
    else if (document.getElementById('projects-dialog')) {
      document.body.removeChild(
        document.getElementById('projects-dialog')
      );
    }
    else if (document.getElementById('new-dialog')) {
      document.body.removeChild(
        document.getElementById('new-dialog')
      );
    }
    else if (document.getElementById('save-dialog')) {
      document.body.removeChild(
        document.getElementById('save-dialog')
      );
    }
    else {
      toggle();
    }

  }

}, false );

var toggle = function() {
  editor.toggle();
};

// Display hack. Disallow Ctrl++ and Ctrl+- zooming. It causes too
// much heartache.
document.addEventListener( 'keydown', function ( event ) {
  if (!event.ctrlKey) return;
  if (event.keyCode != 187 && event.keyCode != 189) return;
  event.preventDefault();
});


function attachFull() {
  var el = createElements();
  store = new ICE.Store();
  editor = new ICE.Editor(el);
  applyStyles();
  editor.setContent(store.current.code);
  codeToolbar();
}

// Export `attachFull()` on the public API for the `ICE` module.
if (!window.ICE) ICE = {};
ICE.attachFull = attachFull;

})();
