window.onload = function() {
    document.oncontextmenu = function(){
        　　return false;
    }
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
    function failed() {
        alert('玩完了');
        showall();
    }
    function success() {
        alert('这么牛逼，恭喜你！~');
        showall();
    }
    function expandItem(location) {
        var i = document.querySelector(`.mines[data-location="${location}"]`)
        if (i.dataset.boom && !i.classList.contains('marked')) {
            failed();
        } else {
            if (!i.classList.contains('clicked')) {
                i.classList.add('clicked');
                if (i.dataset.around && i.dataset.around !== '0') {
                    i.innerText = i.dataset.around;
                }
            }
        }
        // if (i.classList.contains('marked')) {
        //     i.classList.remove('marked');
        // }
    }
    function expand(item) {
        expandItem(item.dataset.location);
        var around = window[item.dataset.location];
        for (let a = 0; a < around.length; a ++) {
            var i = document.querySelector(`.mines[data-location="${around[a]}"]`)
            if (!i.classList.contains('clicked') && i.dataset.around == '0') {
                expand(i)
            } else {
                expandItem(around[a]);
            }
        }
    }
    function handleMinesClick(e) {
        var item = e.target;
        if (e.button == '0') {
            if (item.classList.contains('clicked')) {
                const num = item.dataset.around;
                const arounds = window[item.dataset.location];
                var total = 0;
                for (let i = 0; i < arounds.length; i ++) {
                    var ii = document.querySelector(`.mines[data-location="${arounds[i]}"]`)
                    if (ii.classList.contains('marked')) {
                        total += 1;
                    }
                }
                if (total == parseInt(num)) {
                    expand(item);
                }
            } else {
                if (item.dataset.boom) {
                    failed();
                } else if (item.dataset.around == '0') {
                    expand(item)
                } else {
                    expandItem(item.dataset.location);
                }
            }
        } else {
            if (!item.classList.contains('clicked')) {
                var booms = parseInt(document.getElementsByClassName('booms')[0].innerText.split('/')[0]);
                var total = parseInt(document.getElementsByClassName('booms')[0].innerText.split('/')[1])
                if (item.classList.contains('marked')) {
                    item.classList.remove('marked');
                    document.getElementsByClassName('booms')[0].innerText = `${booms - 1}/${total}`;
                } else {
                    item.classList.add('marked');
                    document.getElementsByClassName('booms')[0].innerText = `${booms + 1}/${total}`;
                    if (((booms + 1) == total) && item.dataset.boom) {
                        success();
                    }
                }
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
    function initMines() {
        var content = document.getElementsByClassName('mainContent')[0];
        var booms = 0;
        for (let i = 0; i < 625; i ++) {
            var mines = document.createElement('div');
            mines.classList.add('mines');
            mines.dataset.num = i + 1;
            var row = 0;
            var column = 0;
            row = parseInt(i / 25, 10) + 1;
            columns = parseInt(i % 25) + 1;
            mines.dataset.location = `${row}-${columns}`;
            var hasBoom = Math.floor(Math.random()*10) > 7;
            if (hasBoom) {
                // 这里可显示炸弹位置
                // mines.innerText = '9';
                mines.dataset.boom = true;
                booms += 1;
            }
            window.total = booms;
            document.getElementsByClassName('booms')[0].innerText = `0/${booms}`;
            mines.addEventListener('mouseup', handleMinesClick)
            content.appendChild(mines);
        }
    }
    function initNumber() {
        const items = document.getElementsByClassName('mines');
        for (let i = 0; i < items.length; i ++) {
            var item = items[i];
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
                window[location] = aroundArray;
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
    function handleStart() {
        document.getElementsByClassName('mainContent')[0].innerHTML = ''
        initMines();
        initNumber();
    }
    document.getElementsByClassName('start')[0].addEventListener('click', handleStart);
    initMines();
    initNumber();
};