var elem = document.getElementById('gameCanvas'),
context = elem.getContext('2d'),
started = false,
paused = false,
theme = "Default",
diff = 0,
points = 0,
user = "",
hit = 0,
missed = 0,
misClicked = 0,
numCircles = 10,
elements = [];

const colors = {
  "Default":{
    numColors: 4,
    success: "#B0F54D",
    background: "#FFFFFF",
    text: "#000000",
    0: "#603060",
    1: "#a8b2ba",
    2: "#ffe0c0",
    3: "#338dd8"
  },
  "Dawn Winery":{
    numColors: 4,
    success: "#B0F54D",
    background: "#FFFFFF",
    text: "#000000",
    0: "#603060",
    1: "#a8b2ba",
    2: "#ffe0c0",
    3: "#338dd8"
  },
  "Hotto Dogu":{
    numColors: 4,
    success: "#B0F54D",
    background: "#FFFFFF",
    text: "#000000",
    0: "#603060",
    1: "#a8b2ba",
    2: "#ffe0c0",
    3: "#338dd8"
  },
  "Umbrella":{
    numColors: 4,
    success: "#B0F54D",
    background: "#FFFFFF",
    text: "#000000",
    0: "#603060",
    1: "#a8b2ba",
    2: "#ffe0c0",
    3: "#338dd8"
  },
};

const DIFFICULTY = {
  0: {size: 50, acceleration: 1, points: 1, interval: 10},
  1: {size: 40, acceleration: 5, points: 2, interval: 7},
  2: {size: 30, acceleration: 7, points: 3, interval: 5},
};

const DIRECTION = {
  0: {x: 0, y: -1, key: 'w', keyCode: 87, winX: elem.width/2, winY: 0}, //up
  1: {x: -1, y: 0, key: 'a', keyCode: 65, winX: 0, winY: elem.height/2}, //left
  2: {x: 0, y: 1, key: 's', keyCode: 83, winX: elem.width/2, winY: elem.height}, //down
  3: {x: 1, y: 0, key: 'd', keyCode: 68, winX: elem.width, winY: elem.height/2}, //right
  4: {x: 0, y: 0, key: 'q', keyCode: 81, winX: 0, winY: 0} //stopped
};

// add to stop function
//deleteCookie("diff");
//deleteCookie("theme");

function start(){
  started = true;
  generate();
  context.fillStyle = colors[theme].background;
  context.rect(0, 0, elem.width, elem.height);
  context.fill();
  elements.forEach(function(element){
    draw(element.x, element.y, element.radius, element.color);
  });
  var sn = setInterval(function(){
    iterate();
    if(elements.length == 0){
      generate();
      numCircles--;
    }
    if(numCircles <= 0){
      clearInterval(sn);
      stop();
    }
  }, DIFFICULTY[diff].interval);
}

function iterate(){
  elements.forEach(function(element){
    var pos = {
      x: element.direction.winX,
      y: element.direction.winY
    };
    //chagnes color, if neccesary
    if(intersect(pos, element)){
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

    if((!intersect(pos, element) && element.ready) || element.clicked){
      //missed circle
      if(!element.clicked){
        missed++;
      }
      //erases
      draw(element.x, element.y, element.radius, colors[theme].background);
      elements.splice(elements.indexOf(element));
    }
  });
}

function pause(){
  elements.forEach(function(element){
    element.previous.dir = element.direction;
    element.direction = DIRECTION[4];
  })
}

function resume(){
  elements.forEach(function(element){
    element.direction = element.previous.dir;
  })
}

function stop(){
  console.log("game stopped");
  if(hit == numCircles){
    document.getElementsByName("games.won") = 1;
  }else{
    document.getElementsByName("games.lost") = 1;
  } 
  alert("you have gotten " + points + " points, hit " + hit + " circles, and missed " + missed + "circles");
  //add points to some value in database
  document.getElementByName("user_name") = user;
  document.getElementByName("points") = points;
  document.getElementByName("circles.hit") = hit;
  document.getElementByName("circles.miss") = missed;
  document.getElementByName("game").submit();
  window.location.replace("/mainmenu");
}

function handleClick(clicked){
  var goodClick = false;
  elements.forEach(function(element){
    //succesful click
    if((element.direction.keyCode == clicked && element.ready && !element.clicked)){
      goodClick = true;
      element.clicked = true;
      hit++;
      points += DIFFICULTY[diff].points;
    }
  });
//incorrect click
  if(!goodClick){
    misClicked++;
  }
}

function intersect(point, circle){
  return Math.sqrt((point.x-circle.x) ** 2 + (point.y-circle.y) ** 2) < circle.radius;
}

function draw(x, y, r, c){
  context.fillStyle = c;
  context.beginPath();
  context.arc(x, y, r, 0, 2 * Math.PI);
  context.fill();
}

function generate(){
  elements.push({
    color: colors[theme][Math.floor(Math.random() * colors[theme].numColors)],
    radius: DIFFICULTY[diff].size,
    x: elem.width/2,
    y: elem.height/2,
    speed: DIFFICULTY[diff].acceleration,
    ready: false,
    clicked: false,
    direction: DIRECTION[Math.floor(Math.random() * 4)],
    previous: {
      x: elem.width/2,
      y: elem.height/2,
      radius: DIFFICULTY[diff].acceleration + 5,
      dir: this.direction,
    }
  });
}

function getCookie(cname) {
  var name = cname + "=";
  var decodedCookie = decodeURIComponent(document.cookie);
  var ca = decodedCookie.split(';');
  for(var i = 0; i <ca.length; i++) {
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

function deleteCookie(cname){
  document.cookie=cname+"=expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
}

document.addEventListener('keydown', function(event) {
  if(event.keyCode == 32){
    if(started){
      if(paused){
        resume();
        paused = false;
      }else{
        pause();
        paused = true;
      }
    }else{
      start();
    }
  }else{
    handleClick(event.keyCode);
  }
}, false);

document.addEventListener('DOMContentLoaded', function(){
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
