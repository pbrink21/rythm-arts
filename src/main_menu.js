function setCookie(){
  var d = document.forms["gameSet"]["difficulty"].value;
  var t = document.forms["gameSet"]["theme"].value;
  document.cookie="diff="+d+";"+"path=/";
  document.cookie="theme="+t+";"+"path=/";
  window.location.replace("board.html");
}
