document.addEventListener('DOMContentLoaded', () => {
  const grid = document.querySelector('.grid');
  const doodler = document.createElement('div');
  let doodlerleftSpace = 50;
  let startPoint = 150;
  let doodlerbottomSpace = startPoint;
  let platCount = 5;
  let platformArray = [];
  let upTimerId;
  let downTimerId;
  let isGameOver = false;
  let isGoingLeft = false;
  let isGoingRight = false;
  let isJumping = true;
  let leftTimerId;
  let rightTimerId;
  let score = 0;

  class Platform {
    constructor(newPlatBottom) {
      this.left = Math.random() * 315
      this.bottom = newPlatBottom;
      this.platform = document.createElement('div');

      const platform = this.platform
      platform.classList.add('platform');
      platform.style.left = this.left + 'px'
      platform.style.bottom = this.bottom + 'px'
      grid.appendChild(platform);
    }
  }

  function createPlatform() {
    for (i = 0; i < platCount; i++) {
      let platGap = 600 / platCount
      let newPlatBottom = 100 + i * platGap
      let newPlatform = new Platform(newPlatBottom);
      platformArray.push(newPlatform);
    }
  }

  function movePlatform() {
    if (doodlerbottomSpace > 50) {
      platformArray.forEach(item => {
        item.bottom -= 4
        let platform = item.platform
        platform.style.bottom = item.bottom + 'px'

        if (item.bottom < 0){
          let firstPlat = platformArray[0].platform
          firstPlat.classList.remove('platform') 
          platformArray.shift()
          score++;
          let newPlatform = new Platform(600);
          platformArray.push(newPlatform);
        
       }
      });
    }
    
  }

  function createDoodler() {
    grid.appendChild(doodler)
    doodler.classList.add('doodler');
    doodlerleftSpace = platformArray[0].left;
    doodler.style.left = doodlerleftSpace + 'px'
    doodler.style.bottom = doodlerbottomSpace + 'px'
    doodler.addEventListener('click', start)
  }

  function gameOver() {
    console.log('Game Over')
    isGameOver = true
    while(grid.firstChild){
      grid.removeChild(grid.firstChild);
    }
    grid.innerHTML = score;
    clearInterval(downTimerId)
    clearInterval(upTimerId)
    clearInterval(leftTimerId)
    clearInterval(rightTimerId)
  }

  function fall() {
    clearInterval(upTimerId)
    isJumping = false;
    downTimerId = setInterval(
      function () {
        doodlerbottomSpace -= 5
        doodler.style.bottom = doodlerbottomSpace + 'px'
        if (doodlerbottomSpace <= 0) {
          gameOver()
        }
        platformArray.forEach(item => {
          if (
            (doodlerbottomSpace >= item.bottom) &&
            (doodlerbottomSpace <= (item.bottom + 15)) &&
            ((doodlerleftSpace + 60) >= item.left) && 
            (doodlerleftSpace <= (item.left + 85)) &&
            !isJumping
            ) {
              startPoint = doodlerbottomSpace
              jump()
            }
        })
      }, 30);
  }
 
  function jump() {
    clearInterval(downTimerId)
    isJumping = true;
    upTimerId = setInterval(function () {
      doodlerbottomSpace += 20
      doodler.style.bottom = doodlerbottomSpace + 'px'
      if (doodlerbottomSpace > startPoint + 150) {
        fall()
      }
    }, 50);
  };
  function control(e) {
    doodler.style.bottom = doodlerbottomSpace + 'px'
    if(e.key === 'ArrowLeft') {
      moveLeft()
    } else if (e.key === 'ArrowRight') {
      moveRight()
    } else if (e.key === 'ArrowUp') {
      moveStraight()
    }
  }
  function moveLeft() {
    if (isGoingRight) {
        clearInterval(rightTimerId)
        isGoingRight = false
    }
    isGoingLeft = true
    leftTimerId = setInterval(function () {
        if (doodlerleftSpace >= 0) {  
          doodlerleftSpace -=5
          doodler.style.left = doodlerleftSpace + 'px'
        } else moveRight()
    },30)
  }

  function moveRight() {
    if (isGoingLeft) {
        clearInterval(leftTimerId)
        isGoingLeft = false
    }
    isGoingRight = true
    rightTimerId = setInterval(function () {
      if (doodlerleftSpace <= 313) {
        doodlerleftSpace +=5
        doodler.style.left = doodlerleftSpace + 'px'
      } else moveLeft()
    },30)
  }
  function moveStraight() {
    isGoingLeft = false
    isGoingRight = false
    clearInterval(leftTimerId)
    clearInterval(rightTimerId)
    
  }

  


  function start() {
    if (!isGameOver) {
      createPlatform();
      createDoodler();
      setInterval(movePlatform, 60);
      jump();
      document.addEventListener('keyup', control)
    }
  }
  start();
})