function setCookie(){
  var d = document.forms["gameSet"]["difficulty"].value;
  var t = document.forms["gameSet"]["theme"].value;
  var p = new Date();
  p.setTime(p.getTime() + (3*24*60*60*1000));
  var expires = "expires="+ p.toUTCString();
  document.cookie="diff="+d+";"+expires+"path=/";
  document.cookie="theme="+t+";"+expires+"path=/";
  window.location.replace("board.html");
}
