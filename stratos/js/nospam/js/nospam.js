/*
 * :::::::::::::::::::::::::::::::::::::::::::::::::::::
 * Name: NoSpam
 * Short Desc: masks plain text email adresses/links 
 * Version: 1.0
 * For: MODx Revolution CMS (modx.com)
 * License: GPLv2
 * Author: 
 *     Erman Aydin (erman-aydin.de)
 * :::::::::::::::::::::::::::::::::::::::::::::::::::::
 * 
 * Adapted from:
 *     emo - E-Mail Obfuscation 1.4 (Evolution compatible)
 *     Written by: Florian Wobbe (www.eprofs.de)
 *     Patched by: manu37
 *     Updated to 1.4 by: Jako (www.partout.info)
 *     Adapted to NoSpam 1.0 (Revolution compatible) by: Erman Aydin
 * :::::::::::::::::::::::::::::::::::::::::::::::::::::
 * 
 * Created: 2012-03-2012 - v1.0
 * :::::::::::::::::::::::::::::::::::::::::::::::::::::
 */


// addLoadEvent is Simon Willison's function that allows for convenient
// addition of multiple fuctions that are all supposed to be triggered
// on window.onload event.
// takes function name as the argument. e.g. addLoadEvent(doPopups);
function addLoadEvent(func) {
  var oldonload = window.onload;
  if (typeof window.onload != 'function') {
    window.onload = func;
  }
  else {
    window.onload = function() {
      oldonload();
      func();
    }
  }
}

// Decrypt all email addresses
function nsp_replace() {
  for (var i = 1; i < nsp_addresses.length; i++) {
    var id = '_nspaddrId' + i;
    var elem = document.getElementById(id);
    if (elem) {
      if (elem.firstChild) {
        elem.removeChild(elem.firstChild);
      }
      elem.innerHTML = decrypt_string(i);
    }
  }
}

// Manage decryption cache
var decryption_cache = new Array();
function decrypt_string(n) {
  var cache_index = "'"+n+"'";

  if(decryption_cache[cache_index])		// If this string has already been decrypted, just
    return decryption_cache[cache_index];	// return the cached version.

  if(nsp_addresses[n])				// Is crypted_string an index into the addresses array?
    var crypted_string = nsp_addresses[n];

  if(!crypted_string.length)			// Make sure the string is actually a string
    return "Error, not a valid index.";

  var decrypted_string = decode_base64(crypted_string);

  // Cache this string for any future calls
  decryption_cache[cache_index] = decrypted_string;

  return decrypted_string;
}

// Custom base 64 decoding
function decode_base64(data) {
  var tab = nsp_addresses[0];
  var out = "", c1, c2, c3, e1, e2, e3, e4;
  for (var i = 0; i < data.length; ) {
    e1 = tab.indexOf(data.charAt(i++));
    e2 = tab.indexOf(data.charAt(i++));
    e3 = tab.indexOf(data.charAt(i++));
    e4 = tab.indexOf(data.charAt(i++));
    c1 = (e1 << 2) + (e2 >> 4);
    c2 = ((e2 & 15) << 4) + (e3 >> 2);
    c3 = ((e3 & 3) << 6) + e4;
    out += String.fromCharCode(c1);
    if (e3 != 64)
      out += String.fromCharCode(c2);
    if (e4 != 64)
      out += String.fromCharCode(c3);
  }
  return out;
}
