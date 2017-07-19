var forkImg = new Image();

function init(){
    forkImg.addEventListener('load', draw);
    forkImg.src='fork.svg';
}

function draw(){
    var canvas = document.getElementById('main')
    canvas.width  = window.innerWidth;
    canvas.height = window.innerHeight;
    var ctx = canvas.getContext('2d');
    var fork = {
        img: forkImg,
        x: 0,
        y: 0,
        draw: function(){
            ctx.drawImage(this.img, this.x, this.y);
        },
        taken: false
    };
    canvas.addEventListener('click', function(ev){
        if (!fork.taken && ev.clientX > fork.x && ev.clientX < fork.x + fork.img.naturalWidth
        && ev.clientY > fork.y && ev.clientY < fork.y + fork.img.naturalHeight)
        {
            fork.taken = true;
            canvas.style.cursor = 'none';
        }
    })
    canvas.addEventListener('mousemove', function(ev){
        if (fork.taken){
            fork.x = ev.clientX;
            fork.y = ev.clientY;
        }
    })
    fork.x = 100;
    fork.y = 100;
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
