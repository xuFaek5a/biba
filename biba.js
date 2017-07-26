function init(){
    var gameData = [];
    var images = [
        'fork.svg',
        'dumpling.svg',
        ];
    var count = 0;
    var dataLoader = function(){
        if (++count >= images.length){
            gameStart(gameData);
        }
    }
    // TODO for/in loop
    images.forEach(function(item){
        var datum = new Image();
        gameData.push(datum);
        datum.addEventListener('load', dataLoader);
        datum.src = item;
    });
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
        dumplings.push(new clsSprite (ctx, gameData[1], 300 + i * 100, 300));
    }
    var fork = new clsSprite (ctx, gameData[0], 0, 0);
    fork.taken = false;
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
        var dumpling;
        for (d in dumplings){
            dumpling = dumplings[d];
            if (dumpling.collision(ev.clientX, ev.clientY)){
                canvas.removeEventListener('click', takeDumpling);
                canvas.addEventListener('mousemove',
                        function moveDumpling(ev){
                            dumpling.move(ev.clientX, ev.clientY);
                        }
                );
                break;
            }
        }
    };
    dumplings.forEach(function(d){d.draw()});
    fork.move(100, 100);
    fork.draw();
    var anim = function(){
        if (fork.taken){
            ctx.clearRect(0, 0, canvas.width, canvas.height);
            dumplings.forEach(function(d){d.draw()});
            fork.draw();
        }
        window.requestAnimationFrame(anim);
    }
    anim();
}

init();
