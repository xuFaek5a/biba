function init() {
    var gameData = {};
    var images = [
        {path: 'fork.svg', name: 'fork'},
        {path: 'dumpling.svg', name: 'dumpling'},
        {path: 'mouth.svg', name: 'mouth'},
        //{path: 'face.svg', name: 'face'},
        //{path: 'body.svg', name: 'body'},
        //{path: 'lhand.svg', name: 'lhand'},
        //{path: 'rhand.svg', name: 'rhand'},
        ];
    var sounds = [];
    var dataLoader = (function() {
        var total = images.length + sounds.length;
        var count = 0;
        var loader = function() {
            progressBar((100 * (++count / total)).toFixed())
            if (count == total) {
                gameStart(gameData);
            }
        };
        return loader
    })();
    images.forEach(function(image) {
        var img = new Image();
        gameData[image.name] = {image: img};
        img.addEventListener('load', dataLoader);
        img.src = image.path;
    });
}

function progressBar(persent) {
    var elem = document.getElementById("pbar");
    elem.style.width = persent + '%';
    if (persent >= 100) {
        document.getElementById("pbarCont").hidden = true;
    }
}

function clsSprite(ctx, img, x, y){
    this.ctx = ctx;
    this.img = img;
    if (x && y) {
        this.x = x;
        this.y = y;
    }
    else {
        this.x = 0;
        this.y = 0;
    }
    this.draw = function(){
        this.ctx.drawImage(this.img, this.x, this.y);
    } 
    this.move = function(x, y){
        this.x = x;
        this.y = y;
    }
    this.collision = (x, y) => x > this.x && x < this.x + this.img.naturalWidth && y > this.y && y < this.y + this.img.naturalHeight;
}

function gameStart(gameData){
    var canvas = document.getElementById('main');
    canvas.width  = window.innerWidth;
    canvas.height = window.innerHeight;
    var ctx = canvas.getContext('2d');
    ctx.width  = window.innerWidth;
    ctx.height = window.innerHeight;

    var dumplings = [];
    for (i = 0; i < 6; i++){
        dumplings.push(new clsSprite(ctx, gameData.dumpling.image, 300 + i * 100, 300));
    }
    var fork = new clsSprite(ctx, gameData.fork.image, 0, 0);
    fork.taken = false;
    var mouth = new clsSprite(ctx, gameData.mouth.image, 0, 0);

    canvas.addEventListener('click', function takeFork(ev){
        if (fork.collision(ev.clientX, ev.clientY))
        {
            fork.taken = true;
            canvas.style.cursor = 'none';
            canvas.addEventListener('mousemove', function(ev){
                fork.move(ev.clientX, ev.clientY);
            });
            canvas.removeEventListener('click', takeFork);
            canvas.addEventListener('click', takeDumpling);
        }
    });
    function takeDumpling(ev){
        if (dumplings.length == 0) {return};
        var dumpling;
        for (d in dumplings){
            dumpling = dumplings[d];
            if (dumpling.collision(ev.clientX, ev.clientY)){
                canvas.removeEventListener('click', takeDumpling);
                canvas.addEventListener('mousemove',
                        function moveDumpling(ev){
                            dumpling.move(ev.clientX, ev.clientY);
                            if (mouth.collision(ev.clientX, ev.clientY)){
                                canvas.removeEventListener(
                                    'mousemove',
                                    moveDumpling
                                );
                                dumplings.splice(d, 1);
                                canvas.addEventListener(
                                    'click',
                                    takeDumpling
                                );
                            }
                        }
                );
                break;
            }
        }
    };

    dumplings.forEach(function(d){d.draw()});
    mouth.move(Math.floor(canvas.width / 2), Math.floor(canvas.height / 2));
    mouth.draw();
    fork.move(100, 100);
    fork.draw();
    var anim = function(){
        if (fork.taken){
            ctx.clearRect(0, 0, canvas.width, canvas.height);
            mouth.draw();
            dumplings.forEach(function(d){d.draw()});
            fork.draw();
        }
        window.requestAnimationFrame(anim);
    }
    anim();
}

init();
