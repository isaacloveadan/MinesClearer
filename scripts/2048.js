var content = document.getElementsByClassName('class2048')[0];

const numList = Array.from(new Array(16).keys()).slice(0);

// 随机从数组中选择count项
function getRandomArrayElements(arr, count) {
  var shuffled = arr.slice(0), i = arr.length, min = i - count, temp, index;
  while (i-- > min) {
    index = Math.floor((i + 1) * Math.random());
    temp = shuffled[index];
    shuffled[index] = shuffled[i];
    shuffled[i] = temp;
  }
  return shuffled.slice(min);
}

// 初始化格子
async function initdom() {
  await new Promise(() => {
    for (let a = 0; a < 16; a += 1) {
      var grid = document.createElement('div');
      grid.classList.add('gridItem');
      grid.dataset.row = parseInt(a/4) + 1;
      grid.dataset.column = a % 4;
      grid.dataset.num = a;
      content.appendChild(grid);
    }
  })
}

// 初始化两个带数字的格子
function init() {
  if (items.length == 0) {
    init();
  } else {
    const initList = getRandomArrayElements(numList, 2);
    initList.forEach(i => {
      const item = document.querySelector(`.gridItem[data-num="${i}"]`);
      item.classList.add('num2');
    })
  }
}

// 生成一个新的带数字的格子
function initNewNum() {
  setTimeout(() => {
    let existNumList = [];
    document.querySelectorAll('.gridItem').forEach(i => {
      if (i.classList.toString().includes('num')) {
        existNumList.push(parseInt(i.dataset.num));
      }
    });
    const rest = numList.filter(ea=>existNumList.every(eb=>eb!==ea));
    const num = getRandomArrayElements(rest, 1);
    document.querySelector(`.gridItem[data-num="${num}"]`).classList.add('num2');
  }, 200)
}

//左方向的事件
function leftEvent() {
  let canNew = false;
  let hasNum = [];
  // 先找到带有数字的格子
  document.querySelectorAll('.gridItem').forEach(i => {
    if (i.classList.toString().includes('num')) {
      hasNum.push(i);
    }
  });
  //再按照同一行 左边排在前面的顺序 排列
  hasNum.sort((a,b) => {
    const itemRowA = a.dataset.row;
    const itemColumnA = a.dataset.column;
    const itemRowB = b.dataset.row;
    const itemColumnB = b.dataset.column;
    if (itemRowA == itemRowB) {
      if (itemColumnA < itemColumnB) {
        return a - b;
      } else {
        return b - a;
      }
    } else {
      return a - b;
    }
  }).forEach(i => {
    // 循环判断将这有数字的格子放在最左边没有数字的格子上
    const itemRow = i.dataset.row;
    const itemColumn = i.dataset.column;
    const existNum = i.classList.toString().split(' ').find(i => i.includes('num'));
    for (let j = 0; j < 4; j ++) {
      const grid = document.querySelector(`.gridItem[data-row="${itemRow}"][data-column="${j}"]`);
      // 如果目标格子没有num 或者当前格子本来就在最左边
      if (!grid.classList.toString().includes('num') || itemColumn == String(j)) {
        if (itemColumn !== String(j)) {
          canNew = true;
        }
        i.classList.remove(existNum);
        grid.classList.add(existNum);
        break;
      } else if (grid.classList.toString().includes('num') && itemColumn !== String(j)) {
      //  如果目标格子有num
        const gridNum = grid.classList.toString().split(' ').find(i => i.includes('num'));
        // 并且目标格子的num等于当前的num
        if (gridNum == existNum) {
          canNew = true;
          i.classList.remove(existNum);
          const newNum = `num${parseInt(existNum.replace(/[^0-9]/ig,""))*2}`
          grid.classList.remove(existNum);
          grid.classList.add(newNum);
          break;
        }
      }
    }
  });
  if (canNew) {
    initNewNum();
  }
}

// 初始化键盘事件
function initOperation() {
  document.onkeydown = function(e) {
    var e=e ? e : window.event;
    var currKey = e.keyCode||e.which||e.charCode;
    if (currKey == 37) {
      leftEvent();
    }
  }
}

initdom();
init();
initOperation();
