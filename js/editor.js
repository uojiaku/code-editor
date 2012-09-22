
window.URL = window.URL || window.webkitURL;

// deflate

var decode = function ( string ) {

	return RawDeflate.inflate( window.atob( string ) );

};

var encode = function ( string ) {

	return window.btoa( RawDeflate.deflate( string ) );

};

//

var documents = [ {
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

if ( localStorage.codeeditor !== undefined ) {

	documents = JSON.parse( localStorage.codeeditor );

}

if ( window.location.hash ) {

	var hash = window.location.hash.substr( 1 );
	var version = hash.substr( 0, 2 );

	if ( version == 'A/' ) {

		alert( 'That shared link format is no longer supported.' );

	} else if ( version == 'B/' ) {

		documents[ 0 ].code = decode( hash.substr( 2 ) );

	}

}

// preview

var preview = document.createElement( 'div' );
preview.style.position = 'absolute';
preview.style.left = '0px';
preview.style.top = '0px';
preview.style.width = window.innerWidth + 'px';
preview.style.height = window.innerHeight + 'px';
document.body.appendChild( preview );

// editor

var interval;

var code = CodeMirror( document.body, {

	value: documents[ 0 ].code,
	mode: "text/html",
	lineNumbers: true,
	matchBrackets: true,

	onChange: function () {

		if ( documents[ 0 ].autoupdate === false ) return;

		clearTimeout( interval );
		interval = setTimeout( update, 300 );

	}

} );

var codeElement = code.getWrapperElement();
codeElement.style.position = 'absolute';
codeElement.style.width = window.innerWidth + 'px';
codeElement.style.height = window.innerHeight + 'px';
document.body.appendChild( codeElement );

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
    menuOpen(),
    menuSave(),
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

  if ( documents[ 0 ].autoupdate === true ) checkbox.checked = true;

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

var menuSave = function() {
  var el = document.createElement( 'li' );
  el.textContent = 'save';
  el.addEventListener( 'click', function ( event ) {

    openSaveDialog();

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

    window.location.replace( '#B/' + encode( code.getValue() ) );

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

    closeSaveDialog();

  	projectMenu();

  }, false );

  return el;
};

var buttonProjectMenu = function() {
  var el = document.createElement( 'button' );
  el.className = 'button';
  el.textContent = '☰';
  el.title = 'Switch to code menu';
  el.addEventListener( 'click', function ( event ) {

  	codeToolbar();

  }, false );

  return el;
};

var buttonInfo = function() {
  var el = document.createElement( 'button' );
  el.className = 'button';
  el.textContent = '?';
  el.addEventListener( 'click', function ( event ) {

    window.open( 'https://github.com/mrdoob/code-editor' );

  }, false );

  return el;
};

// dialogs
var saveDialog = document.createElement( 'div' );
saveDialog.className = 'dialog';
saveDialog.style.position = 'absolute';
saveDialog.style.right = '15px';
saveDialog.style.top = '60px';
saveDialog.style.display = 'none';
document.body.appendChild( saveDialog );

var saveFileLabel = document.createElement( 'label' );
saveFileLabel.textContent = 'Name:';
saveDialog.appendChild( saveFileLabel );

var saveFileField = document.createElement( 'input' );
saveFileField.type = 'text';
saveFileField.size = 30;
saveFileField.value = documents[ 0 ].filename;
saveFileLabel.appendChild( saveFileField );

var buttonSaveDialog = document.createElement( 'button' );
buttonSaveDialog.className = 'button';
buttonSaveDialog.textContent = 'Save';
buttonSaveDialog.addEventListener( 'click', function ( event ) {

    save(saveFileField.value);
    closeSaveDialog();

}, false );
saveDialog.appendChild( buttonSaveDialog );

var closeSaveP = document.createElement( 'p' );
closeSaveP.className = 'cancel';
saveDialog.appendChild( closeSaveP );

var closeSaveLink = document.createElement( 'a' );
closeSaveLink.href = '#';
closeSaveLink.textContent = '[ close ]';
closeSaveLink.addEventListener( 'click', function ( event ) {

  closeSaveDialog();
  event.stopPropagation();
	event.preventDefault();

}, false );
closeSaveP.appendChild( closeSaveLink );


// events

document.addEventListener( 'drop', function ( event ) {

	event.preventDefault();
	event.stopPropagation();

	var file = event.dataTransfer.files[ 0 ];

	documents[ 0 ].filename = file.name;
	documents[ 0 ].filetype = file.type;

	var reader = new FileReader();

	reader.onload = function ( event ) {

		code.setValue( event.target.result );

	};

	reader.readAsText( file );

}, false );

document.addEventListener( 'keydown', function ( event ) {

	if ( event.keyCode === 83 && ( event.ctrlKey === true || event.metaKey === true ) ) {

		event.preventDefault();
		openSaveDialog();

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
    else {
      toggle();
    }

	}

}, false );

window.addEventListener( 'resize', function ( event ) {

	codeElement.style.width = window.innerWidth + 'px';
	codeElement.style.height = window.innerHeight + 'px';

	preview.style.width = window.innerWidth + 'px';
	preview.style.height = window.innerHeight + 'px';

} );

// actions

var update = function () {

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
	content.write( code.getValue() );
	content.close();

};

var openProjectsDialog = function() {
  closeProjectsDialog();

  var projectsDialog = document.createElement( 'div' );
  projectsDialog.id = 'projects-dialog';
  projectsDialog.className = 'dialog';
	projectsDialog.style.position = 'absolute';
  projectsDialog.style.right = '15px';
  projectsDialog.style.top = '60px';
	projectsDialog.style.border = '1px solid rgba(0,0,0,0.25)';
  projectsDialog.style.padding = '8px 8px 4px';
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
  code.setValue( documents[ 0 ].code);
  update();
};

var closeProjectsDialog = function() {
  var dialog = document.getElementById('projects-dialog');
  if ( ! dialog ) return;

  dialog.parentElement.removeChild(dialog);
};

var openSaveDialog = function() {
  saveDialog.style.display = '';
  saveFileField.value = documents[ 0 ].filename;
  saveFileField.focus();
};

var closeSaveDialog = function() {
  saveDialog.style.display = 'none';
};

var save = function (title) {

  if ( documents[ 0 ].filename != title) {
    documents.unshift({
      filetype: 'text/plain',
      autoupdate: documents[ 0 ].autoupdate
    });
  }

	documents[ 0 ].code = code.getValue();
  documents[ 0 ].filename = title;

	localStorage.codeeditor = JSON.stringify( documents );
};

var download = function(el) {
	var blob = new Blob( [ code.getValue() ], { type: documents[ 0 ].filetype } );
	var objectURL = URL.createObjectURL( blob );

	el.href = objectURL;

	el.download = documents[ 0 ].filename;
};

var toggle = function () {

	if ( codeElement.style.display === '' ) {

    shortCodeToolbar();
		codeElement.style.display = 'none';

	} else {

    codeToolbar();
		codeElement.style.display = '';

	}

};

codeToolbar();
update();
