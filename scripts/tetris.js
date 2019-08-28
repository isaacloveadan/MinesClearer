// 随机选择对象属性
function pickRandomProperty(obj) {
    var result;
    var count = 0;
    for (var prop in obj)
        if (Math.random() < 1/++count)
           result = prop;
    return result;
}
// 跳转游戏
function goGameFrame() {
    document.getElementsByClassName('startFrame')[0].style.display = 'none';
    document.getElementsByClassName('gameFrame')[0].style.display = 'flex';
}
// 跳转开始界面
function goStartFrame() {
    document.getElementsByClassName('startFrame')[0].style.display = 'block';
    document.getElementsByClassName('gameFrame')[0].style.display = 'none';
}
// 键盘事件
function handleKeydown(e) {
    // 上
    if (e.keyCode == '38') {
        if (!window.tetris.top) {
            window.tetris.top = 1;
        } else {
            window.tetris.top += 1;
        }
        e.preventDefault();
    } else if (e.keyCode == '40') {
        e.preventDefault();
    } else if (e.keyCode == '37') {
        // 左
        if (!window.tetris.left) {
            window.tetris.left = 1;
        } else {
            window.tetris.left += 1;
        }
        e.preventDefault();
    } else if (e.keyCode == '39') {
        // 右
        if (!window.tetris.right) {
            window.tetris.right = 1;
        } else {
            window.tetris.right += 1;
        }
        e.preventDefault();
    }
}
// start点击事件
function tetrisClick() {
    goGameFrame();
    var content = document.getElementsByClassName('gameFrame')[0];
    content.innerHTML = '';
    // 生成坐标格
    for(let x = 0; x < 1000; x ++) {
        var block = document.createElement('div');
        block.dataset.num = x + 1;
        block.classList.add('tetris_block');
        var row = 0;
        var column = 0;
        row = parseInt(x / 25) + 1;
        column = parseInt(x % 25) + 1;
        block.dataset.location = `${row}-${column}`;
        content.appendChild(block);
    }
    initDiamond();
    godownDiamond();
    document.addEventListener('keydown', handleKeydown)
}
// 消除滑动中的指定位置块
function clearBlocks(o) {
    var pItem = document.querySelector(`.tetris_block[data-location="${o}"]`);
    pItem.classList.remove('newDiamond');
    pItem.dataset.key = '';
}
// 消除停止中的指定位置块
function clearStopBlocks(o) {
    var pItem = document.querySelector(`.tetris_block[data-location="${o}"]`);
    pItem.classList.remove('stopDiamond');
}
// 清除行后 整理剩余停止的模块
function resizeStopBlock() {
    for (let x = 40; x >= 1; x --) {
        for (let y = 1; y <= 25; y ++) {
            try {
                var item = document.querySelector(`.tetris_block[data-location="${x}-${y}"]`);
                if (item.classList.contains('stopDiamond')) {
                    var downBlock = document.querySelector(`.tetris_block[data-location="${x+1}-${y}"]`)
                    // 如果有下一个 并且下一个不是停止的模块
                    if (downBlock && !downBlock.classList.contains('stopDiamond')) {
                        item.classList.remove('stopDiamond');
                        downBlock.classList.add('stopDiamond');
                    }
                }
            } catch (error) {
                console.log(error)
            }
        }
    }
}
// 消除行逻辑
function clearWholeLine() {
    // 循环每行
    let hasClear = false;
    for (let x = 1; x <= 40; x ++) {
        let whole = true;
        // 循环每列
        for (let y = 1; y <= 25; y ++) {
            if (!document.querySelector(`.tetris_block[data-location="${x}-${y}"]`).classList.contains('stopDiamond')) {
                whole = false;
                break;
            }
        }
        // 如果这一行都有则清除
        if (whole) {
            hasClear = true;
            for (let y = 1; y <= 25; y ++) {
                clearStopBlocks(`${x}-${y}`)
            }
        }
    }
    if (hasClear) {
        resizeStopBlock();
    }
    // 清除行后 整理剩余停止的模块
}
// 初始化方块
function initDiamond() {
    // L 四竖四横
    var diamondList = {
        'L': ['@2-10', '@1-10', '0-10', '1-10', '1-11', '1-12', '1-13'],
        '田': ['@1-10','@1-11','@1-12','0-10', '0-11', '0-12', '1-10', '1-11', '1-12'],
        // 'long-': ['1-1','1-2','1-3','1-4','1-5','1-6','1-7','1-8','1-9','1-10','1-11','1-12','1-13','1-14','1-15','1-16','1-17','1-18','1-19','1-20','1-21','1-22'],
        '-': ['1-1', '1-2', '1-3', '1-4', '1-5', '1-6', '1-7', '1-8'],
    };
    window.tetris.diamondList = diamondList;
}
// 更新位置方法
function initLBaseByPostions(old, positions, key) {
    var stop = false;
    // 如果有老的删除老的class
    if (old) {
        old.forEach((o) => {
            // 非负数才去掉 负数说明还没出现到板上
            if (!o.split('-')[0].includes('@') && o.split('-')[0] != '0') {
                clearBlocks(o)
            }
        })
    }
    // 这里定义一个新作为的数组 目的是如果更新坐标时 有左右命令 forEach改变单个 无法改变原数组
    var newPositions = [];
    // 批量增加class
    positions.forEach((p, pIndex) => {
        // 非负数才加上 负数说明还没出现到板上
        var { left, right, top } = window.tetris;
        // 如果有左命令
        if (left && left > 0) {
            // 如果当前位置有已经在最左边的 则不能继续往左
            if(positions.some((ps) => {
                if (ps.split('-')[1] == '1') {
                    return true;
                }
                else {
                    // 如果左边已经有占的格子 也不能往左
                    if (!ps.includes('@') && ps.split('-')[0] !== '0') {
                        var psLeft = `${ps.split('-')[0]}-${parseInt(ps.split('-')[1]) - 1}`;
                        var psLeftHasDiamand = document.querySelector(`.tetris_block[data-location="${psLeft}"]`).classList.contains('stopDiamond');
                        if (psLeftHasDiamand && !newPositions.includes(psLeft)) {
                            return true;
                        }
                    }
                }
            })) {
                console.log('cant');
            } else {
                p = `${p.split('-')[0]}-${parseInt(p.split('-')[1]) - 1}`;
                newPositions.push(p);
            }
            // 如果都变完了 则left - 1
            if (pIndex == (positions.length - 1)) {
                window.tetris.left -= 1;
            }
        } else if (right && right > 0) {
            // 如果有右命令
            // 如果当前位置有已经在最左边的 则不能继续往左
            if (positions.some((ps) => {
                if (ps.split('-')[1] == '25') {
                    return true;
                } else {
                    // 如果左边已经有占的格子 也不能往左
                    if (!ps.includes('@') && ps.split('-')[0] !== '0') {
                        var psLeft = `${ps.split('-')[0]}-${parseInt(ps.split('-')[1]) + 1}`;
                        var psLeftHasDiamand = document.querySelector(`.tetris_block[data-location="${psLeft}"]`).classList.contains('stopDiamond');
                        if (psLeftHasDiamand && !newPositions.includes(psLeft)) {
                            return true;
                        }
                    }
                }
            })) {

            } else {
                p = `${p.split('-')[0]}-${parseInt(p.split('-')[1]) + 1}`;
                newPositions.push(p);
            }
            // 如果都变完了 则left - 1
            if (pIndex == (positions.length - 1)) {
                window.tetris.right -= 1;
            }
        } else if (top && top > 0) {
            console.log(positions,newPositions, key);
        }
        if (!p.split('-')[0].includes('@') && p.split('-')[0] != '0') {
            var pItem = document.querySelector(`.tetris_block[data-location="${p}"]`);
            pItem.classList.add('newDiamond');
            pItem.dataset.key = key;
            var dItem;
            // 如果当前块的下一个位置没有到达40 则先拿到下一个位置的dom
            if (p.split('-')[0] < 40) {
                dItem = document.querySelector(`.tetris_block[data-location="${parseInt(p.split('-')[0]) + 1}-${parseInt(p.split('-')[1])}"]`)
            }
            // 如果当前某一块的高度到了40 或者下一个位置已经有了 则停止
            if (p.split('-')[0] == '40' || dItem.classList.contains('stopDiamond')) {
                stop = true;
            }
        }
    })
    // 如果没有停下 继续更新位置
    if (!stop) {
        // 隔一秒更新位置
        setTimeout(() => {
            var po = newPositions.length > 0 ? newPositions : positions;
            initLBaseByPostions(po, po.map((p) => {
                var first = p.split('-')[0];
                var second = parseInt(p.split('-')[1]);
                // 如果是负数
                if (first.includes('@')) {
                    var negative = parseInt(first.slice(1));
                    negative = negative - 1;
                    if (negative == 0) {
                        p = `0-${second}`;
                    } else {
                        p = `@${negative}-${second}`;
                    }
                } else {
                    // 如果不是负数
                    p = `${parseInt(first) + 1}-${second}`;
                }
                return p;
            }), key)
        }, 100)
    } else {
        // 如果停下了
        window.tetris.left = 0;
        window.tetris.right = 0;
        window.tetris.top = 0;
        newPositions.forEach((p) => {
            if (!p.includes('@') && p.split('-')[0] != '0') {
                document.querySelector(`.tetris_block[data-location="${p}"]`).classList.remove('newDiamond');
                document.querySelector(`.tetris_block[data-location="${p}"]`).classList.add('stopDiamond');
                document.querySelector(`.tetris_block[data-location="${p}"]`).dataset.key = '';
            }
        })
        // 如果停止滑块下滑的时候 位置信息有负数或者0则游戏结束
        if (positions.some((o) => o.includes('@') || o.split('-')[0] == '0')) {
            alert('玩完了');
            goStartFrame();
        } else {
            clearWholeLine();
            // 不然继续下滑
            godownDiamond();
            // 清除一整行的格子
        }
    }
}
// 方块下滑
function godownDiamond() {
    var diamondList = window.tetris.diamondList;
    // 目前测试 只随机到L方块
    // var item = '田';

    // 初始化生成的L块位置信息 @代表负数
    var key = pickRandomProperty(diamondList);
    var ptions = diamondList[key];
    // 更新方块位置

    initLBaseByPostions([], ptions, key);
}
// 一开始执行函数
function init() {
    // 初始化window对象
    window.tetris = {};
    document.getElementsByClassName('tetris_startButton')[0].addEventListener('click', tetrisClick);
}
init();