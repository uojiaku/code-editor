// IceCodeEditor.js 0.0.1

(function(){

// ICE.Store
// ----------

// Decode from gzip content
var decode = function(string) {
  return RawDeflate.inflate( window.atob( string ) );
};

// Gzip data for store or sharing
var encode = function(string) {
  return window.btoa( RawDeflate.deflate( string ) );
};


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
  filename: '3D Starter Project (with Physics)',
  filetype: 'text/plain',
  autoupdate: true,
  code: decode( "lVRZTxsxEH7PrxjRBzZV2F2ooBKXhNJwVFVASXq8IbM7iQ1Ze2t7sw2I/96xvVmuILVWDsv+vplvLh/eqHx5fJj4v86hybQoLRidHW1wa8v9JJmxQsjZ13GcqSKZcI0Y35oNogTsP5BKvjTif0l9rlWBp+IPmlfUFfe4A5AkcOWsZwYMWkt0Q6f+6NbEAWdiVhQKjmBznR93Rw42D9bwaqXvUL/HLAP6OqCCjSBpwoUB+tQcNYKx1XQKQoKqNJAFhFrM58BZWaLcJ8aCaTAZSiRPEutWxtidRQ8wpSTkE1Hg2GK5DzuQwF4Kj10n2fNiiv1Ms4Wwy8gZmJyPBoP4B2ZW6U8RpD3Y2k7pN4Vu961GRlVANGB5o3WlqRa55aSpFjJXdSykRP3TnfUI4BZHMeP2FeLcH64gzJQk41ozK5QHOpNJwzxoHGWUFM2a6IP4K9SeKRbY97fR593eC2s92KZPSssngkJ6x9SltlzNNCu5yBpbAQ+w5fUkOz1oN0GZ2209bVeeAi/kMHiKS2UEqZHxPTndTdOnorA8jwLoZdJ99XPN6pB7l/ZGtS+DklaFWmQ0a22DaJQ5dZN+EVqfyQUzo+Yq8olYAV1TjMU9Rm/Lt6ZenpqrrCpQ2ti9BrHvz7zPxTyPWqO5KgZzdKA1DGOXc4xvWHY306oirporPz4fpn61A/KxWTCenIwm0L/8cjE8g8shhTWA4eDXBL5dDActrNNpeCdSFMwiFMql3M2US5SbKbqfVjLzxyygoi48+C7U+LtCYwOZAKeaCFGD8mE8y1rYRL6EPWjrB/BI39ayOwiSRpWEMjxBzzU4TW5cWxHNoIqimrcWvIHvZe5Camy4ybY06gZcO2RK5mBcO1CjrIKmp65QyvJgFq17GVRlo5XL0KvJXtrKfhJz0Gnf0b8=" )
}, {
  filename: 'Spinning Multi-Sided Thingy',
  filetype: 'text/plain',
  autoupdate: true,
  code: decode( "jVRha9swEP28/ArRL1WHUdRCGMRpYfPSZWOF0RT2WbMusYYteSclTlr63yfZchYvGcwYx7577+np7pTZDyP3d7Nx+zOa2RxV7YjF/PaicK6ejsdrUSm9/rJkuanGTwUCsJ/2wlM67H+QsgJNBfdqB/Y89W5EyFYgyUUFKBJic9CQEAQtAQHTmF6Dl3G4T0glHKASpX8DW6QjD1BaOXoVoEKrkA8f/mu10blTRkcAefEx0q1AbomGhjwtHudztgyRyOmWE7aG3HlQo7Q0DVNaA35X0hVkPIgtQK0Ll7bEbgsD5W+ArZLaQtZm6btJEtUTcu1vzvnVMZ3Vxqpgmj17pQnn6ehN65gJKWmHiYT20RdmsOzn3FhRgESjP8U8veHcLxepfREHrAdfzw/CqvwhZmlXMG/NlAanhO94eyUkxhuFsELvaUocbuA0/lV5+VC2Kbnpkq99mUP3Tpanp32Ojv/UIBB7kX5MBkKZ0FthH2OKRoEeyiy4rASBWdjUAnaU71btdQa4VM9AT2YgOTMCvSNp8k0F2rFwqph1+xJYJXCttPfI039izBZwVZrGoy4LJSXoy3NgUdfeXlaoUtKDUWmqeQkB1G7hdTD7hyMRxx/h1wase9+GPeA+9IlG1HFzGBrXItjOm/ros0ybxuu8JZz5KZikZ6D7c9Drv7rFuhcaz/rRUL+ODn8QvwE=" )
} ];

function Store() {
  this.is_new = (localStorage.codeeditor === undefined),
  this.documents = (this.is_new) ?
    [templates[templates.length-1]] :
    JSON.parse(localStorage.codeeditor);
  this.current = this.documents[0];
}

Store.prototype.save = function(code) {
  this.documents[0].code = code;
  this.sync();
};

Store.prototype.createFromTemplate = function(name, template_name) {
  var code = templates.
    reduce(function(code, template) {
      if (template.filename == template_name) return template.code;
      return code;
    }, undefined);

  this.create(code, name);
};

Store.prototype.create = function(code, title) {
  if (!title) title = this._nextUntitled();
  if ( this.documents.length == 0 || this.documents[0].filename != title) {
    this.documents.unshift({
      filetype: 'text/plain',
      autoupdate: this.documents[0].autoupdate
    });
  }

  this.documents[0].filename = title;
  this.save(code);
};

Store.prototype._nextUntitled = function() {
  var nums = this.documents.
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

  return 'Untitled ' + (nums.length == 0 ? 1 : nums[nums.length-1] + 1);
};

Store.prototype.remove = function(filename) {
  var new_documents = [];

  var i = 0, found;
  while (i < this.documents.length) {
    if (this.documents[i].filename == filename) {
      found = this.documents[i];
    }
    else {
      new_documents.push(this.documents[i]);
    }
    i++;
  }

  if (!found) return;

  this.documents = new_documents;
  this.sync();
};

Store.prototype.open = function(filename) {
  var new_documents = [];

  var i = 0, found;
  while (i < this.documents.length) {
    if (this.documents[i].filename == filename) {
      found = this.documents[i];
    }
    else {
      new_documents.push(this.documents[i]);
    }
    i++;
  }

  if (!found) return;

  new_documents.unshift(found);
  this.documents = new_documents;
  this.sync();
};

// The current document, encoded. Mostly useful for sharing.
Store.prototype.currentEncoded = function() {
  return encode(this.current.code);
};

Store.prototype.sync = function() {
  this.current = this.documents[0];
  localStorage.codeeditor = JSON.stringify(this.documents);
};

Store.templates = templates;

// Export the Store class constructor on the public API.
if (!window.ICE) ICE = {};
ICE.Store = Store;

})();
