var content = document.getElementsByClassName('class2048')[0];

async function initdom() {
  await new Promise(() => {
    for (let a = 0; a < 16; a += 1) {
      var grid = document.createElement('div');
      grid.classList.add('gridItem');
      grid.dataset.row = parseInt(a/4) + 1;
      grid.dataset.column =
      grid.dataset.num = a;
      content.appendChild(grid);
    }
  })
}


function init() {
  if (items.length == 0) {
    init();
  } else {
    const initList = [Math.ceil(Math.random() * 15), Math.ceil(Math.random() * 15)];
    initList.forEach(i => {
      const item = document.querySelector(`.gridItem[data-num="${i}"]`);
      item.classList.add('num2');
    })
  }

}

initdom();
init();
