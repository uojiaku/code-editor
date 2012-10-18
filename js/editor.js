window.URL = window.URL || window.webkitURL;

// deflate

var decode = function ( string ) {

  return RawDeflate.inflate( window.atob( string ) );

};

var encode = function ( string ) {

  return window.btoa( RawDeflate.deflate( string ) );

};

//

var templates = [ {
  filename: '3D starter project',
  filetype: 'text/plain',
  autoupdate: true,
  code: decode( "jVJdS8MwFH3fr7j41ElJ58MQ5hSk1i+kk7WgbxKb6xJpk5Jkq/rrTdOu0KngJdCQe8/pOSdZvir2ebGM/GeyNIUWtQWji/Mjbm29iKINrYTc3GekUFWUc41I3s2Rg3Sz/wDFXKsKr8UHmt+hFxOAKIKcCwNuNRw1grHbtzcQEtRWg+NDaERZAqd1jXLhEDuqwRQoEc5BYgP57TpJSNaeBNOzySEndQoRDVjec+85qKmxsC+aWqEcVSMkUw0RUqJ+EsxyiEZntyg23J714MIJ03Sk4BG1ZxQ7jH03OJ2Ho7+EcOLWzNW05ek4SK2McE1JvhzdfDZrW94foYwF3dDYlw+Eadp09lpnvR7vVEmrOruFu7UhM42SuYD1SHRM5Y6add8KvK79IDFoM/GFwY9owl+S8VCmim2F0pL2XRF/ZSzmomTBQMpUlZTYDg2mjvuCLL9c5xCvru7SG1ilTmMCafKcw8Ndmgxjk7Y8MFVNCIarP4M4iGEQ0W0CH3MIQ8bDC/0G" )
}, {
  filename: 'Empty project',
  filetype: 'text/plain',
  autoupdate: true,
  code: decode( "s0nKT6m0s9EHU1w2xclFmQUlCsVFybZKGSUlBVb6+umJuZl56V7Besn5ufohGUWpqXpZxUpALRC1RGhyzijKz011y6xILcau1Y5LQUFfXyEyv7RIITk/JVUhPT+1WCEjtShVT0+PC64cAA==" )
}, {
  filename: 'Spinning Multi-Sided Thingy',
  filetype: 'text/plain',
  autoupdate: true,
  code: decode( "jVRha9swEP28/ArRL1WHUdRCGMRpYfPSZWOF0RT2WbMusYYteSclTlr63yfZchYvGcwYx7577+np7pTZDyP3d7Nx+zOa2RxV7YjF/PaicK6ejsdrUSm9/rJkuanGTwUCsJ/2wlM67H+QsgJNBfdqB/Y89W5EyFYgyUUFKBJic9CQEAQtAQHTmF6Dl3G4T0glHKASpX8DW6QjD1BaOXoVoEKrkA8f/mu10blTRkcAefEx0q1AbomGhjwtHudztgyRyOmWE7aG3HlQo7Q0DVNaA35X0hVkPIgtQK0Ll7bEbgsD5W+ArZLaQtZm6btJEtUTcu1vzvnVMZ3Vxqpgmj17pQnn6ehN65gJKWmHiYT20RdmsOzn3FhRgESjP8U8veHcLxepfREHrAdfzw/CqvwhZmlXMG/NlAanhO94eyUkxhuFsELvaUocbuA0/lV5+VC2Kbnpkq99mUP3Tpanp32Ojv/UIBB7kX5MBkKZ0FthH2OKRoEeyiy4rASBWdjUAnaU71btdQa4VM9AT2YgOTMCvSNp8k0F2rFwqph1+xJYJXCttPfI039izBZwVZrGoy4LJSXoy3NgUdfeXlaoUtKDUWmqeQkB1G7hdTD7hyMRxx/h1wase9+GPeA+9IlG1HFzGBrXItjOm/ros0ybxuu8JZz5KZikZ6D7c9Drv7rFuhcaz/rRUL+ODn8QvwE=" )
} ];


var documents = ( localStorage.codeeditor !== undefined ) ?
  JSON.parse( localStorage.codeeditor ) :
  [templates[templates.length-1]];

var EDIT_ONLY = window.location.search.indexOf('?e') > -1;

// preview

var preview = document.createElement( 'div' );
preview.style.position = 'absolute';
preview.style.left = '0px';
preview.style.top = '0px';
preview.style.width = window.innerWidth + 'px';
preview.style.height = window.innerHeight + 'px';
if (!EDIT_ONLY) {
  document.body.appendChild( preview );
}

// editor

var interval;

var editor = document.createElement( 'div' );
editor.id = "editor";
editor.style.position = 'absolute';
editor.style.left = '0px';
editor.style.top = '0px';
editor.style.width = window.innerWidth + 'px';
editor.style.height = window.innerHeight + 'px';
document.body.appendChild( editor );

var ace = ace.edit("editor");
ace.setTheme("ace/theme/chrome");
ace.getSession().setMode("ace/mode/javascript");
ace.getSession().setUseWrapMode(true);
ace.getSession().setUseSoftTabs(true);
ace.setPrintMarginColumn(false);
ace.setDisplayIndentGuides(false);
ace.setFontSize('18px');
var CommandManager = ace.getKeyboardHandler();
var EmacsManager = require("ace/keyboard/emacs").handler;
ace.setKeyboardHandler(CommandManager);
ace.setValue((documents.length > 0) ? documents[ 0 ].code : templates[ 0 ].code, -1);

var UndoManager = require("ace/undomanager").UndoManager;
ace.getSession().setUndoManager(new UndoManager());

ace.getSession().on( "change", function () {
  save();

  if ( documents[ 0 ].autoupdate === false ) return;

  clearTimeout( interval );
  interval = setTimeout( update, 300 );
});

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

  if ( documents.length == 0 || documents[ 0 ].autoupdate === true ) checkbox.checked = true;

  checkbox.style.margin = '-4px 4px -4px 0px';
  checkbox.addEventListener( 'click', function ( event ) {

    event.stopPropagation();

    documents[ 0 ].autoupdate = documents[ 0 ].autoupdate === false;

    localStorage.codeeditor = JSON.stringify( documents );

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

    window.location.replace( '#B/' + encode( ace.getValue() ) );

  }, false );
  return el;
};

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


// events

document.addEventListener( 'drop', function ( event ) {

  event.preventDefault();
  event.stopPropagation();

  var file = event.dataTransfer.files[ 0 ];

  documents[ 0 ].filename = file.name;
  documents[ 0 ].filetype = file.type;

  var reader = new FileReader();

  reader.onload = function ( event ) {

    ace.setValue( event.target.result, -1 );
    ace.getSession().setUndoManager(new UndoManager());

  };

  reader.readAsText( file );

}, false );

document.addEventListener( 'keypress', function ( event ) {
  if ( event.keyCode === 9829 ) { // <3
    event.preventDefault();
    if (ace.getKeyboardHandler() == CommandManager) {
      ace.setKeyboardHandler(EmacsManager);
    }
    else {
      ace.setKeyboardHandler(CommandManager);
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

// Display hacks

window.addEventListener( 'resize', function ( event ) {
  ace.renderer.onResize(true);

  editor.style.width = window.innerWidth + 'px';
  editor.style.height = window.innerHeight + 'px';

  preview.style.width = window.innerWidth + 'px';
  preview.style.height = window.innerHeight + 'px';
} );

var zoomEl = document.createElement('div');
zoomEl.style.left = '-50%';
zoomEl.style.width = '1px';
zoomEl.style.height = '1px';
zoomEl.style.position = 'absolute';
document.body.appendChild(zoomEl);

var lastZoom = zoomEl.offsetLeft;
setInterval(function() {
  if (zoomEl.offsetLeft != lastZoom) {
    lastZoom = zoomEl.offsetLeft;
    ace.renderer.onResize(true);
  }
}, 2000);

document.addEventListener( 'keydown', function ( event ) {
  if (!event.ctrlKey) return;
  if (event.keyCode != 187 && event.keyCode != 189) return;
  event.preventDefault();
});

// dialogs

var openNewDialog = function() {
  var newDialog = document.createElement( 'div' );
  newDialog.id = 'new-dialog';
  newDialog.className = 'dialog';
  document.body.appendChild( newDialog );

  var newFileLabel = document.createElement( 'label' );
  newFileLabel.textContent = 'Name:';
  newDialog.appendChild( newFileLabel );

  var newFileField = document.createElement( 'input' );
  newFileField.type = 'text';
  newFileField.size = 30;
  newFileLabel.appendChild( newFileField );

  var buttonNewDialog = document.createElement( 'button' );
  buttonNewDialog.className = 'button';
  buttonNewDialog.textContent = 'Save';
  buttonNewDialog.addEventListener( 'click', function ( event ) {
    createProject(newFileField.value, templateField.value);
    closeNewDialog();
  }, false );
  newDialog.appendChild( buttonNewDialog );

  var templateDiv = document.createElement( 'div' );
  newDialog.appendChild( templateDiv );

  var templateLabel = document.createElement( 'label' );
  templateLabel.textContent = 'Template:';
  templateDiv.appendChild( templateLabel );

  var templateField = document.createElement( 'select' );
  templateLabel.appendChild(templateField);
  templates.forEach(function(template) {
    var optionField = document.createElement( 'option' );
    optionField.textContent = template.filename;
    templateField.appendChild(optionField);
  });

  var closeNewP = document.createElement( 'p' );
  closeNewP.className = 'cancel';
  newDialog.appendChild( closeNewP );

  var closeNewLink = document.createElement( 'a' );
  closeNewLink.href = '#';
  closeNewLink.textContent = '[ close ]';
  closeNewLink.addEventListener( 'click', function ( event ) {

    closeNewDialog();
    event.stopPropagation();
    event.preventDefault();

  }, false );
  closeNewP.appendChild( closeNewLink );

  newFileField.focus();
};

var createProject = function(name, template_name) {
  var code = templates.
    reduce(function(code, template) {
      if (template.filename == template_name) return template.code;
      return code;
    }, undefined);

  create(code, name);

  changeProject(name);
};

var closeNewDialog = function() {
  var dialog = document.getElementById('new-dialog');
  if ( ! dialog ) return;

  dialog.parentElement.removeChild(dialog);
};

var openProjectsDialog = function() {
  closeProjectsDialog();

  var projectsDialog = document.createElement( 'div' );
  projectsDialog.id = 'projects-dialog';
  projectsDialog.className = 'dialog';
  document.body.appendChild( projectsDialog );

  documents.forEach(function(doc) {
    projectsDialog.appendChild(projectsDialogRow(doc));
  });

  var closeP = document.createElement( 'p' );
  closeP.className = 'cancel';
  projectsDialog.appendChild( closeP );

  var closeLink = document.createElement( 'a' );
  closeLink.href = '#';
  closeLink.textContent = '[ close ]';
  closeLink.addEventListener( 'click', function ( event ) {

    closeProjectsDialog();
    event.stopPropagation();
    event.preventDefault();

  }, false );
  closeP.appendChild( closeLink );
};

var projectsDialogRow = function(doc) {
  var row = document.createElement( 'p' );

  var link = document.createElement( 'a' );
  link.href = '#';
  link.textContent = doc.filename;
  link.addEventListener( 'click', function ( event ) {

    changeProject(doc.filename);
    closeProjectsDialog();
    event.stopPropagation();
    event.preventDefault();

  }, false );
  row.appendChild(link);

  return row;
};

var closeProjectsDialog = function() {
  var dialog = document.getElementById('projects-dialog');
  if ( ! dialog ) return;

  dialog.parentElement.removeChild(dialog);
};

var openMakeCopyDialog = function() {
  var saveDialog = document.createElement( 'div' );
  saveDialog.id = 'save-dialog';
  saveDialog.className = 'dialog';
  document.body.appendChild( saveDialog );

  var saveFileLabel = document.createElement( 'label' );
  saveFileLabel.textContent = 'Name:';
  saveDialog.appendChild( saveFileLabel );

  var saveFileField = document.createElement( 'input' );
  saveFileField.type = 'text';
  saveFileField.size = 30;
  saveFileField.value = documents[0].filename;
  saveFileLabel.appendChild( saveFileField );

  var buttonSaveDialog = document.createElement( 'button' );
  buttonSaveDialog.className = 'button';
  buttonSaveDialog.textContent = 'Save';
  buttonSaveDialog.addEventListener( 'click', function ( event ) {
    saveAs(saveFileField.value);
    closeMakeCopyDialog();
  }, false );
  saveDialog.appendChild( buttonSaveDialog );

  var closeSaveP = document.createElement( 'p' );
  closeSaveP.className = 'cancel';
  saveDialog.appendChild( closeSaveP );

  var closeSaveLink = document.createElement( 'a' );
  closeSaveLink.href = '#';
  closeSaveLink.textContent = '[ close ]';
  closeSaveLink.addEventListener( 'click', function ( event ) {
    closeMakeCopyDialog();
    event.stopPropagation();
    event.preventDefault();
  }, false );
  closeSaveP.appendChild( closeSaveLink );

  saveFileField.focus();
};

var closeMakeCopyDialog = function() {
  var dialog = document.getElementById('save-dialog');
  if (!dialog) return;

  dialog.parentElement.removeChild(dialog);
};

// actions

var create = function(code, title) {
  if (!title) title = nextUntitled();
  if ( documents.length == 0 || documents[ 0 ].filename != title) {
    documents.unshift({
      filetype: 'text/plain',
      autoupdate: documents[ 0 ].autoupdate
    });
  }

  documents[ 0 ].code = code;
  documents[ 0 ].filename = title;

  localStorage.codeeditor = JSON.stringify( documents );
};

var saveAs = function (title) {
  create(ace.getValue(), title);
};

var save = function() {
  documents[ 0 ].code = ace.getValue();
  localStorage.codeeditor = JSON.stringify( documents );
};

var update = function () {
  if (EDIT_ONLY) return;

  while ( preview.children.length > 0 ) {

    preview.removeChild( preview.firstChild );

  }

  var iframe = document.createElement( 'iframe' );
  iframe.style.width = '100%';
  iframe.style.height = '100%';
  iframe.style.border = '0';
  preview.appendChild( iframe );

  var content = iframe.contentDocument || iframe.contentWindow.document;

  content.open();
  content.write( ace.getValue() );
  content.close();

  content.body.style.margin = '0';
};

var changeProject = function(filename) {
  var new_documents = [];

  var i = 0, found;
  while (i < documents.length) {
    if (documents[i].filename == filename) {
      found = documents[i];
    }
    else {
      new_documents.push(documents[i]);
    }
    i++;
  }

  if ( ! found ) return;

  new_documents.unshift(found);
  documents = new_documents;
  ace.setValue( documents[ 0 ].code, -1 );
  ace.getSession().setUndoManager(new UndoManager());
  update();
};

var download = function(el) {
  var blob = new Blob( [ ace.getValue() ], { type: documents[ 0 ].filetype } );
  var objectURL = URL.createObjectURL( blob );

  el.href = objectURL;

  el.download = documents[ 0 ].filename;
};

var toggle = function () {

  if ( editor.style.display === '' ) {

    shortCodeToolbar();
    editor.style.display = 'none';
    preview.children[0].focus();

  } else {

    codeToolbar();
    editor.style.display = '';
    ace.focus();

  }

};

var nextUntitled = function() {
  var nums = documents.
    filter(function(doc) {
      return doc.filename.match(/Untitled/);
    }).
    map(function(doc) {
      return parseInt(doc.filename.replace(/Untitled\s*/, ''), 10);
    }).
    filter(function (num) {
      return !isNaN(num);
    }).
    sort();

  return 'Untitled ' + (nums.length == 0 ? 1 : nums[0] + 1);
};


if ( window.location.hash ) {

  var hash = window.location.hash.substr( 1 );
  var version = hash.substr( 0, 2 );

  if ( version == 'A/' ) {

    alert( 'That shared link format is no longer supported.' );

  } else if ( version == 'B/' ) {

    create(decode(hash.substr(2)));
    window.location.hash = '';
  }

}

codeToolbar();
update();
