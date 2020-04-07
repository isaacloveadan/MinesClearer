var items = document.getElementsByClassName('tabs-item');
var gameItems = document.getElementsByClassName('gameItem');

function handleClickItemTab(e, index) {
  if (!e.target.classList.contains('tabs-click')) {
    e.target.classList.add("tabs-click")
  }
  for (let a = 0; a < items.length; a += 1) {
    if (a !== index) {
      items[a].classList.remove('tabs-click')
    }
  }
  for (let a = 0; a < gameItems.length; a += 1) {
    if (a == index) {
      if (gameItems[a].classList.contains('hideSelf')) {
        gameItems[a].classList.remove('hideSelf');
      }
    } else if (!gameItems[a].classList.contains('hideSelf')) {
      gameItems[a].classList.add('hideSelf')
    }
  }
}

for (let a = 0; a < items.length; a += 1) {
  items[a].addEventListener('click', (e) => handleClickItemTab(e, a))
}

