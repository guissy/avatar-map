import * as Rx from 'rxjs';

var canvas1 = document.createElement('canvas'),
    canvas2 = document.createElement('canvas'),
    context1,
    context2,
    img1 = new Image(),
    img2 = new Image();

function doing() {
    console.log('f**k');
    context1 = canvas1.getContext('2d');
    context2 = canvas2.getContext('2d');
    canvas1.width = img1.width;
    canvas1.height = img1.height;
    canvas2.width = img1.width;
    canvas2.height = img1.height;
    context1.drawImage(img1, 0, 0);//画地图
    document.querySelector('body').appendChild(canvas1);
    var box = [12, 12];
    var bgColor = context1.getImageData(2, 2, 1, 1).data;
    for (var x = 0; x < img1.width / box[0]; x++) {
        for (var y = 0; y < img1.height / box[1]; y++) {
            var color1 = context1.getImageData(x * box[0], y * box[1], 1, 1).data;
            var color2 = context1.getImageData((x + 1) * box[0], (y + 1) * box[1], 1, 1).data;
            if (color1[0] != bgColor[0] && color1[1] != bgColor[1] && color1[2] != bgColor[2]
                && color2[0] != bgColor[0] && color2[1] != bgColor[1] && color2[2] != bgColor[2]
                && (x + 1) * box[0] < img1.width
                && (y + 1) * box[1] < img1.height
            ) {
                var img = img2;
                if (Math.random() > 0.4) {
                    var n = (Math.random() * imgs.length >> 0);
                    img = imgs[n];
                }
                coordsSet.add({img:img, delay:Math.random()*5000>>0, x: x * box[0], y: y * box[1], w: box[0], h: box[0]});
//                    context2.drawImage(img2, x * box[0], y * box[1], box[0], box[1]);
            }
        }
    }
    Rx.Observable.from(Array.from(coordsSet)).flatMap(function (coords) {
        return Rx.Observable.timer(coords.delay, 40).take(10).map(function (i) {
            context2.globalAlpha = i/10;
            context2.drawImage(coords.img, coords.x, coords.y, coords.w, coords.h);
        })
    }).subscribe(function (v) {
        console.log(v)
    },null,function(){console.log('ok!!!')});
    document.querySelector('body').removeChild(canvas1);
    document.querySelector('body').appendChild(canvas2);
}
img1.src = 'map.jpg';
img2.src = 'guissy.jpg';


var urls = [], imgs = [], coordsSet = new Set();
for (var i = 1; i < 15; i++) {
    var url = 'emotion/Expression_' + (i).toString().substr(0) + '.png';
    urls.push(url);
}
urls.unshift(Promise.resolve());
urls.reduce(function (promise, url) {
    return promise.then(function (str) {
        console.log('已完成....' + str);
        console.log('正准备....' + url);
        return new Promise(function (resolve) {
            var img = new Image();
            img.onload = function () {
                console.log('loaded:' + url)
                resolve(img.src);
            };
            img.src = url;
            imgs.push(img);
        });
    });
}).then(function (v) {
    console.log('all loaded!!!');
    imgs.shift();
    doing();
});

