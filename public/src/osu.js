var elem = document.getElementById('gameCanvas'),
  context = elem.getContext('2d'),
  started = false,
  paused = false,
  theme = "Default",
  diff = 0,
  morelives = morelives = getCookie("saves"),
  timeslow = 1 - (getCookie("time") * 0.1),
  largerBalls = 1 + (getCookie("ball") * 0.16),
  points = 0,
  user = "",
  hit = 0,
  missed = 0,
  misClicked = 0,
  numCircles = 10,
  totalCircles = numCircles,
  elements = [];

const colors = {
  "Default": {
    numColors: 2,
    success: "#4CAF50",
    background: "#FFFFFF",
    text: "#000000",
    0: "#ff66aa",
    1: "#bf1f66",
  },
  "Dawn Winery": {
    numColors: 3,
    success: "#cec591",
    background: "#f4a680",
    text: "#000000",
    0: "#6187a5",
    1: "#896689",
    2: "#cc7e81"
  },
  "Hotto Dogu": {
    numColors: 4,
    success: "#de4444",
    background: "#464950",
    text: "#FFFFFF",
    0: "#3bca74",
    1: "#a7d537",
    2: "#e2a232",
    3: "#933d82"
  },
  "Umbrella": {
    numColors: 3,
    success: "#008cd0",
    background: "#f8f9d4",
    text: "#000000",
    0: "#f66555",
    1: "#ffc66f",
    2: "#3cccd0"
  },
};

const DIFFICULTY = {
  0: { size: 30 * largerBalls, acceleration: 3 * timeslow, points: 10, interval: 10 },
  1: { size: 30 * largerBalls, acceleration: 4.5 * timeslow, points: 20, interval: 7},
  2: { size: 30 * largerBalls, acceleration: 6 * timeslow, points: 30, interval: 5},
};

const DIRECTION = {
  0: { x: 0, y: -1, key: 'w', keyCode: 87, winX: elem.width / 2, winY: 0 }, //up
  1: { x: -1, y: 0, key: 'a', keyCode: 65, winX: 0, winY: elem.height / 2 }, //left
  2: { x: 0, y: 1, key: 's', keyCode: 83, winX: elem.width / 2, winY: elem.height }, //down
  3: { x: 1, y: 0, key: 'd', keyCode: 68, winX: elem.width, winY: elem.height / 2 }, //right
  4: { x: 0, y: 0, key: 'q', keyCode: 81, winX: 0, winY: 0 } //stopped
};

function start() {
  console.log(timeslow);
  console.log(DIFFICULTY[1].acceleration);
  console.log(DIFFICULTY[1].size);
  started = true;
  generate();
  context.fillStyle = colors[theme].background;
  context.rect(0, 0, elem.width, elem.height);
  context.fill();
  elements.forEach(function (element) {
    draw(element.x, element.y, element.radius, element.color);
  });
  var sn = setInterval(function () {
    iterate();
    if (elements.length == 0) {
      generate();
      numCircles--;
    }
    if (numCircles <= 0) {
      console.log("hit");
      clearInterval(sn);
      stop();
    }
  }, DIFFICULTY[diff].interval);
}

function iterate() {
  elements.forEach(function (element) {
    var pos = {
      x: element.direction.winX,
      y: element.direction.winY
    };
    //chagnes color, if neccesary
    if (intersect(pos, element)) {
      element.ready = true;
      element.color = colors[theme].success;
    }
    //stores data for previous circle
    element.previous.x = element.x;
    element.previous.y = element.y;
    element.previous.radius = element.radius + 5;
    //moves circle forward
    element.x = element.x + (element.direction.x * element.speed);
    element.y = element.y + (element.direction.y * element.speed);
    //erases old Circles
    draw(element.previous.x, element.previous.y, element.previous.radius, colors[theme].background);
    //prints new Circles
    draw(element.x, element.y, element.radius, element.color);

    if ((!intersect(pos, element) && element.ready) || element.clicked) {
      //missed circle
      if (!element.clicked) {
        missed++;
      }
      //erases
      draw(element.x, element.y, element.radius + 5, colors[theme].background);
      elements.splice(elements.indexOf(element));
    }
  });
}

function pause() {
  elements.forEach(function (element) {
    element.previous.dir = element.direction;
    element.direction = DIRECTION[4];
  })
}

function resume() {
  elements.forEach(function (element) {
    element.direction = element.previous.dir;
  })
}

function stop() {
  //alert("you have gotten " + points + " points, misclicked " + misClicked + " times, hit " + hit + " circles, and missed " + missed + " circles");
  //add points to some value in database

//updates points cookie
  var p = new Date();
  p.setTime(p.getTime() + (3 * 24 * 60 * 60 * 1000));
  var expires = "expires=" + p.toUTCString();
  var l = points + parseInt(getCookie("points"));
  document.cookie = "points=" + l + ";" + expires + "path=/";

  missed = Math.max(missed - morelives, 0);
  document.getElementById("user_name").value = user;
  document.getElementById("points").value = points;
  document.getElementById("circleshit").value = hit;
  document.getElementById("circlesmiss").value = missed;
  if (totalCircles == hit) {
    alert("you have won the game");
    document.getElementById("gameswon").value = 1;
  } else {
    alert("you have lost the game");
    document.getElementById("gameslost").value = 1;
  }
  if(checkCookie()){
    document.getElementById("gameform").submit();
  }else{
    window.location.replace("/mainmenu");
  }
}

function handleClick(clicked) {
  var goodClick = false;
  elements.forEach(function (element) {
    //succesful click
    if ((element.direction.keyCode == clicked && element.ready && !element.clicked)) {
      goodClick = true;
      element.clicked = true;
      hit++;
      points += DIFFICULTY[diff].points;
    }
  });
  //incorrect click
  if (!goodClick) {
    misClicked++;
  }
}

function intersect(point, circle) {
  return Math.sqrt((point.x - circle.x) ** 2 + (point.y - circle.y) ** 2) < circle.radius;
}

function draw(x, y, r, c) {
  context.fillStyle = c;
  context.beginPath();
  context.arc(x, y, r, 0, 2 * Math.PI);
  context.fill();
}

function generate() {
  elements.push({
    color: colors[theme][Math.floor(Math.random() * colors[theme].numColors)],
    radius: DIFFICULTY[diff].size,
    x: elem.width / 2,
    y: elem.height / 2,
    speed: DIFFICULTY[diff].acceleration,
    ready: false,
    clicked: false,
    direction: DIRECTION[Math.floor(Math.random() * 4)],
    previous: {
      x: elem.width / 2,
      y: elem.height / 2,
      radius: DIFFICULTY[diff].size + 5,
      dir: this.direction,
    }
  });
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

function deleteCookie(cname) {
  document.cookie = cname + "=expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
}

function checkCookie() {
  var username = getCookie("user");
  if (username != "") {
    return true;
  } else {
    return false;
  }
}

document.addEventListener('keydown', function (event) {
  if (event.keyCode == 32) {
    if (started) {
      if (paused) {
        resume();
        paused = false;
      } else {
        pause();
        paused = true;
      }
    } else {

      start();
    }
  } else {
    handleClick(event.keyCode);
  }
}, false);

document.addEventListener('DOMContentLoaded', function () {
  diff = getCookie("diff");
  theme = getCookie("theme");
  user = getCookie("user");
  context.fillStyle = colors[theme].background;
  context.rect(0, 0, elem.width, elem.height);
  context.fill();
  context.fillStyle = colors[theme].text;
  context.font = "30px Arial";
  context.fillText("Press space to start", 10, 50);
}, false);
