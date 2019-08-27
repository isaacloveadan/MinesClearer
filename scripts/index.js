window.onload = function() {
    // 展开所有格子
    function showall() {
        var all = document.getElementsByClassName('mines');
        for (let a = 0; a < all.length; a ++) {
            var item = all[a];
            if (item.dataset.around) {
                expandItem(item.dataset.location);
            } else {
                item.classList.add('showboom');
            }
        }
    }
    // 失败
    function failed() {
        alert('玩完了');
        showall();
    }
    // 成功
    function success() {
        alert('这么牛逼，恭喜你！~');
        showall();
    }
    // 展开当前格子
    function expandItem(location) {
        var i = document.querySelector(`.mines[data-location="${location}"]`)
        // 如果当前格子有雷 则失败
        if (i.dataset.boom && !i.classList.contains('marked')) {
            failed();
        } else {
            // 如果当前格子没展开过
            if (!i.classList.contains('clicked')) {
                i.classList.add('clicked');
                // 显示当前格子的周围雷数
                if (i.dataset.around && i.dataset.around !== '0') {
                    i.innerText = i.dataset.around;
                }
            }
        }
        // if (i.classList.contains('marked')) {
        //     i.classList.remove('marked');
        // }
    }
    // 递归展开逻辑
    function expand(item) {
        // 先展开当前格子
        expandItem(item.dataset.location);
        var around = window.mines[item.dataset.location];
        // 循环当前格子周围的格子
        for (let a = 0; a < around.length; a ++) {
            var i = document.querySelector(`.mines[data-location="${around[a]}"]`)
            // 如果周围格子没开过 并且周围格子的周围雷数为0 则递归展开
            if (!i.classList.contains('clicked') && i.dataset.around == '0') {
                expand(i)
            } else {
                // 如果不成立 则之展开当前格子
                expandItem(around[a]);
            }
        }
    }
    // 左键点击打开过的格子
    function leftClickOpened(item) {
        const num = item.dataset.around;
        // 拿到当前格子周围的格子坐标
        const arounds = window.mines[item.dataset.location];
        var total = 0;
        // 拿到周围格子的雷总数
        for (let i = 0; i < arounds.length; i ++) {
            var ii = document.querySelector(`.mines[data-location="${arounds[i]}"]`)
            if (ii.classList.contains('marked')) {
                total += 1;
            }
        }
        // 如果周围格子总数等于该格子显示的周围雷总数 则展开
        if (total == parseInt(num)) {
            expand(item);
        }
    }
    // 左键点击事件
    function leftClick(item) {
        // 如果当前格子没有插旗
        if (!item.classList.contains('marked')) {
            // 如果当前格子点击过
            if (item.classList.contains('clicked')) {
                leftClickOpened(item)
            } else {
                // 如果当前格子没有点击过
                // 如果当前格子是雷 则失败
                if (item.dataset.boom) {
                    failed();
                } else if (item.dataset.around == '0') {
                    // 如果当前格子 周围雷数为0 则递归展开
                    expand(item)
                } else {
                    // 否则只单展开当前格子
                    expandItem(item.dataset.location);
                }
            }
        }
    }
    // 右键点击事件
    function rightClick(item) {
        // 如果当前格子没有点击过
        if (!item.classList.contains('clicked')) {
            var booms = parseInt(document.getElementsByClassName('booms')[0].innerText.split('/')[0]);
            var total = parseInt(document.getElementsByClassName('booms')[0].innerText.split('/')[1])
            // 如果当前格子已经插了旗
            if (item.classList.contains('marked')) {
                item.classList.remove('marked');
                document.getElementsByClassName('booms')[0].innerText = `${booms - 1}/${total}`;
            } else {
                // 如果没有插旗
                item.classList.add('marked');
                document.getElementsByClassName('booms')[0].innerText = `${booms + 1}/${total}`;
                // 如果插的旗数等于雷总数 并且当前插的位置是雷 则成功
                if (((booms + 1) == total) && item.dataset.boom) {
                    success();
                }
            }
        }
    }
    // 格子点击事件
    function handleMinesClick(e) {
        var item = e.target;
        // 如果是左键点击
        if (e.button == '0') {
            // 如果是正常模式
            if (window.mines.mode == 'normal') {
                leftClick(item);
            } else {
                // 如果是插旗模式
                // 如果当前格子已经被打开
                if (item.classList.contains('clicked')) {
                    // 如果当前格子没有插旗
                    if (!item.classList.contains('marked')) {
                        leftClickOpened(item)
                    }
                } else {
                    rightClick(item);
                }
            }
        } else {
            // 如果是右键点击
            // 如果是正常模式
            if (window.mines.mode == 'normal') {
                rightClick(item)
            }
        }
        // else {
        //     if (!e.target.classList.contains('clicked')) {
        //         e.target.classList.add('clicked');
        //         if (!e.target.dataset.boom) {
        //             e.target.innerText = e.target.dataset.around;
        //         } else {
        //             e.target.innerText = '9';
        //         }
        //     }
        // }
    }
    // 初始化雷的位置
    function initMines() {
        var content = document.getElementsByClassName('mainContent')[0];
        var booms = 0;
        // 循环每个格子
        for (let i = 0; i < 625; i ++) {
            var mines = document.createElement('div');
            mines.classList.add('mines');
            mines.dataset.num = i + 1;
            var row = 0;
            var column = 0;
            row = parseInt(i / 25, 10) + 1;
            columns = parseInt(i % 25) + 1;
            // 给每个格子加上坐标data
            mines.dataset.location = `${row}-${columns}`;
            // 随机数判断该格子是否有雷
            var hasBoom = Math.floor(Math.random()*10) > 7;
            if (hasBoom) {
                // 这里可显示炸弹位置
                // mines.innerText = '9';
                // 如果有雷 设置雷data
                mines.dataset.boom = true;
                booms += 1;
            }
            // 设置雷总数
            window.mines.total = booms;
            document.getElementsByClassName('booms')[0].innerText = `0/${booms}`;
            // 给每个格子添加点击事件
            mines.addEventListener('mouseup', handleMinesClick)
            // 往mainContent增加格子
            content.appendChild(mines);
        }
    }
    // 初始化每个格子周围雷数
    function initNumber() {
        const items = document.getElementsByClassName('mines');
        // 循环遍历每个格子
        for (let i = 0; i < items.length; i ++) {
            var item = items[i];
            // 如果当前格子是雷 则跳过
            if (item.dataset.boom) {
                continue;
            } else {
                var total = 0;
                var location = item.dataset.location;
                var row = parseInt(location.split('-')[0]);
                var column = parseInt(location.split('-')[1]);
                var aroundArray = [];
                for (let a = row - 1; a <= row + 1; a ++) {
                    if (a > 0 && a < 26) {
                        for(let b = column - 1; b <= column + 1; b ++) {
                            if (b > 0 && b < 26) {
                                if (`${a}-${b}` !== location) {
                                    aroundArray.push(`${a}-${b}`);
                                }
                            }
                        }
                    }
                }
                window.mines[location] = aroundArray;
                for (let a = 0; a < aroundArray.length; a ++) {
                    var arounditem = document.querySelector(`.mines[data-location="${aroundArray[a]}"]`);
                    try {
                        if (arounditem.dataset.boom) {
                            total += 1;
                        }
                    } catch (error) {
                        console.log(error);
                    }
                }
                // 这里可显示数字位置
                // item.innerText = total;
                item.dataset.around = total;
            }
        }
    }
    // 重启开始事件
    function handleStart() {
        document.getElementsByClassName('mainContent')[0].innerHTML = ''
        initMines();
        initNumber();
    }
    // 改变模式事件
    function changeMode() {
        var modeDom = document.getElementsByClassName('mode')[0];
        if (window.mines.mode == 'normal') {
            window.mines.mode = 'flag';
            modeDom.innerText = '模式: 插旗';
        } else {
            window.mines.mode = 'normal';
            modeDom.innerText = '模式: 正常';
        }
    }
    // 初始化函数
    function init() {
        window.mines = {};
        // 初始化定义模式
        window.mines.mode = 'normal';
        // 给开始和重启添加点击事件
        document.getElementsByClassName('start')[0].addEventListener('click', handleStart);
        // 给模式切换添加点击事件
        document.getElementsByClassName('mode')[0].addEventListener('click', changeMode)
        // 禁用鼠标右键
        document.oncontextmenu = function(){
            　　return false;
        }
    }
    init();
    initMines();
    initNumber();
};