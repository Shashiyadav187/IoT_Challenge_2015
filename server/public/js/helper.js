function replaceAll(str, find, replace) {
  return str.replace(new RegExp(find, 'g'), replace);
}

function getParameterByName(name) {
    name = name.replace(/[\[]/, "\\[").replace(/[\]]/, "\\]");
    var regex = new RegExp("[\\?&]" + name + "=([^&#]*)");
    var results = regex.exec(location.search);
    return results === null ? "" : decodeURIComponent(results[1].replace(/\+/g, " "));
}

function revDateFormat(date) {
	var res = date.split("-");
	return (res[2] + "-" + res[1] + "-" + res[0]);
}