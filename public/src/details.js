window.onload = function() {
    displayOwnedPerks();
  };

function displayOwnedPerks(){
    var user = getCookie("user");
    var points = getCookie("points");
    var saves = getCookie("saves");
    var slows = getCookie("time");
    var balls = getCookie("ball");

    document.getElementById("numsaves").innerHTML = "More Saves Level: " + saves;
    document.getElementById("numslows").innerHTML = "Slows Level: " + slows;
    document.getElementById("numballs").innerHTML = "Balls Level: " + balls;
    document.getElementById("pointsdisplay").innerHTML = "Points: " + points;
    document.getElementById("usernamedisplay").innerHTML = "User: " +
        "<a href='/account'>" + user + "</a>";//TODO: Add link to account page
  }

  function getCookie(cname) {
    var name = cname + "=";
    var decodedCookie = decodeURIComponent(document.cookie);
    var ca = decodedCookie.split(';');
    for (var i = 0; i < ca.length; i++) {
      var c = ca[i];
      while (c.charAt(0) == ' ') {
        c = c.substring(1);
      }
      if (c.indexOf(name) == 0) {
        return c.substring(name.length, c.length);
      }
    }
    return "";
  }