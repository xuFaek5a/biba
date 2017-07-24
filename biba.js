var forkImg = new Image();

function init(){
    forkImg.addEventListener('load', draw);
    forkImg.src='fork.svg';
}

function sprite(ctx, img, x, y){
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

function draw(){
    var canvas = document.getElementById('main');
    canvas.width  = window.innerWidth;
    canvas.height = window.innerHeight;
    var ctx = canvas.getContext('2d');
    var fork = new sprite (ctx, forkImg, 0, 0);
    fork.taken = false;
    canvas.addEventListener('click', function(ev){
        if (!fork.taken && ev.clientX > fork.x && ev.clientX < fork.x + fork.img.naturalWidth
        && ev.clientY > fork.y && ev.clientY < fork.y + fork.img.naturalHeight)
        {
            fork.taken = true;
            canvas.style.cursor = 'none';
        }
    });
    canvas.addEventListener('mousemove', function(ev){
        if (fork.taken){
            fork.move(ev.clientX, ev.clientY);
        }
    });
    fork.move(100, 100);
    fork.draw();
    var anim = function(){
        if (fork.taken){
            ctx.clearRect(0, 0, canvas.width, canvas.height);
            fork.draw();
        }
        window.requestAnimationFrame(anim);
    }
    anim();
}

init();
