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
// start点击事件
function tetrisClick() {
    goGameFrame();
    var content = document.getElementsByClassName('gameFrame')[0];
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
}
// 初始化方块
function initDiamond() {
    // L 四竖四横
    var diamondList = ['L'];
    window.tetris.diamondList = diamondList;
}
// 方块下滑
function godownDiamond() {
    // 目前测试 只随机到L方块
    var item = 'L';
    switch (item) {
        // 生成L快
        case 'L':
            // 初始化生成的L块位置信息
            var ptions = ['1-1', '1-2', '1-3', '1-4'];
            // 更新方块位置
            function initLBaseByPostions(old, positions) {
                var stop = false;
                // 如果有老的删除老的class
                if (old) {
                    old.forEach((o) => {
                        var pItem = document.querySelector(`.tetris_block[data-location="${o}"]`);
                        pItem.classList.remove('newDiamond');
                    })
                }
                // 批量增加class
                positions.forEach((p) => {
                    var pItem = document.querySelector(`.tetris_block[data-location="${p}"]`);
                    pItem.classList.add('newDiamond');
                    // 如果当前某一块的高度到了40 则停止
                    if (p.split('-')[0] == '40') {
                        stop = true;
                    }
                })
                if (!stop) {
                    // 隔一秒更新位置
                    setTimeout(() => {
                        initLBaseByPostions(positions, positions.map((p) => {
                            var first = parseInt(p.split('-')[0]);
                            var second = parseInt(p.split('-')[1]);
                            p = `${first + 1}-${second}`;
                            return p;
                        }))
                    }, 1000)
                }
            }
            initLBaseByPostions([], ptions);
            break;
        default:
            break;
    }
}
// 一开始执行函数
function init() {
    // 初始化window对象
    window.tetris = {};
    document.getElementsByClassName('tetris_startButton')[0].addEventListener('click', tetrisClick);
}
init();