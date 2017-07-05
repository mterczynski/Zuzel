const game =
{
    on:false,
    numberOfPlayers:4,
    loop:null,
    pathDuration:60,
    players:[], 
    pathHandler:[],
    drawBoard:function()
    {
        let canvas = document.getElementById("mainCanvas");
        let ctx = canvas.getContext("2d");
        ctx.lineWidth = 5;
        ctx.strokeStyle = "rgb(0,0,0)";
        ctx.beginPath();
        ctx.rect(0, 0, 600, 300);
        ctx.fillStyle = "#00968e";
        ctx.fill();
        ctx.closePath();
        ctx.beginPath();
        ctx.arc(450 , 150 , 150, Math.PI/2,3/2*Math.PI, true);
        ctx.arc(150 , 150 , 150, -Math.PI/2,-3/2*Math.PI, true);
        ctx.closePath();
        ctx.fillStyle = "white";
        ctx.fill()
        ctx.stroke();
        ctx.beginPath();
        ctx.arc(450 , 150 , 50, Math.PI/2,3/2*Math.PI, true);
        ctx.arc(150 , 150 , 50, -Math.PI/2,-3/2*Math.PI, true);
        ctx.closePath();
        ctx.fillStyle = "#00968e";
        ctx.fill()
        ctx.stroke();   
    },
    resetPlayers:function()
    {
        var colors = document.getElementsByClassName("color");
        var img1 = new Image();
        img1.src = "gfx/car.png";
        
        game.players = 
        [
            {
                name:"Player1",
                model:img1,
                x:170,
                y:230,
                color:colors[0].value,
                speed:3.5,
                turnSpeed: 0.03,
                angle:0,
                alive: true,
                leftKey:document.getElementById("p1Left").value,
                rightKey:document.getElementById("p1Right").value
            },
            {
                name:"Player2",
                model:img1,
                x:160,
                y:240,
                color:colors[1].value,
                speed:3.5,
                turnSpeed: 0.03,
                angle:0,
                alive: true,
                leftKey:document.getElementById("p2Left").value,
                rightKey:document.getElementById("p2Right").value
            },
            {
                name:"Player3",
                model:img1,
                x:150,
                y:250,
                color:colors[2].value,
                speed:3.5,
                turnSpeed: 0.03,
                angle:0,
                alive: true,
                leftKey:document.getElementById("p3Left").value,
                rightKey:document.getElementById("p3Right").value
            },
            {
                name:"Player4",
                model:img1,
                x:140,
                y:260,
                color:colors[3].value,
                speed:3.5,
                turnSpeed: 0.03,
                angle:0,
                alive: true,
                leftKey:document.getElementById("p4Left").value,
                rightKey:document.getElementById("p4Right").value
            }
        ];
    },
    init:function()
    {
        game.drawBoard();
        document.getElementById("start").onclick = function()
        {
            game.on = true;
            game.start();
        }
    },
    start:function()
    {
        var canvas = document.getElementById("mainCanvas");
        var ctx = canvas.getContext("2d");
        game.numberOfPlayers = Number(document.querySelector("select").value);

        pressedKeys = {};
        game.pathHandler = [];
        clearInterval(game.loop);
        game.drawBoard();
        game.resetPlayers();
        game.loop = setInterval(game.render,1000/60);  
    },
    stop:function()
    {
        pressedKeys = {};
        clearInterval(game.loop);
    },
    render:function()
    {
        function isColliding(imgData)
        {
            if(imgData.toString().includes("0,0,0"))
                return true; //found collision with black
            else
                return false; //no collision with black
        }  
        var canvas = document.getElementById("mainCanvas");
        var ctx = canvas.getContext("2d");
        var alivePlayerNames = [];
        
        game.drawBoard();
        
        for(let i=0; i<game.numberOfPlayers; i++)
        {
            var player = game.players[i];
            var imgData = ctx.getImageData( player.x,player.y,1,1).data;
            if(pressedKeys[player.leftKey])
            {
                player.angle += player.turnSpeed;
            }
            if(pressedKeys[player.rightKey])
            {
                player.angle -= player.turnSpeed;
            }
            if(player.alive)
            {
                var imageCtx = canvas.getContext("2d");
                alivePlayerNames.push(player.name)
                ctx.beginPath();
                ctx.strokeStyle = player.color;
                ctx.moveTo(player.x,player.y)
                player.x += player.speed * Math.cos(player.angle);
                player.y -= player.speed * Math.sin(player.angle);
                ctx.lineTo(player.x,player.y);
                ctx.stroke();
                ctx.closePath();
                
                game.pathHandler.push(
                    {
                        lifespan:game.pathDuration,
                        style:player.color,
                        from:{x:player.x-player.speed * Math.cos(player.angle),y:player.y+player.speed * Math.sin(player.angle)},
                        to:{x:player.x,y:player.y}
                    }
                );

                var width = 50;
                var height = 30;
                var angle = -player.angle + Math.PI
                
                ctx.translate(player.x, player.y);
                ctx.rotate(angle);
                ctx.drawImage(player.model, -width / 2, -height / 2, width, height);
                ctx.rotate(-angle);
                ctx.translate(-player.x, -player.y);          
            }
            if(isColliding(imgData) && player.alive)
            {
                player.alive = false;
            }
        }
        
        for(let i=0; i<game.pathHandler.length; i++)
        {
            let path = game.pathHandler[i]
            path.lifespan--;
            if(path.lifespan<0)
            {
                game.pathHandler.shift();
            }
            else
            {
                ctx.beginPath();
                ctx.moveTo(path.from.x,path.from.y);
                ctx.strokeStyle = path.style;
                ctx.lineTo(path.to.x,path.to.y);
                ctx.stroke();
                ctx.closePath();
                
                // Draw fade:
                
                ctx.beginPath();
                ctx.moveTo(path.from.x,path.from.y);
                ctx.strokeStyle = `rgba(255,255,255,${(game.pathDuration-path.lifespan)/game.pathDuration})`;
                ctx.lineTo(path.to.x,path.to.y);
                ctx.stroke();
                ctx.closePath();
            }   
        }
        
        if(alivePlayerNames.length == 1)
        {
            game.stop();
            alert(`The winner is ${alivePlayerNames[0]} !`);
        }
        else if(alivePlayerNames.length == 0)
        {
            game.stop();
            alert("Game draw !");
        }
    }
}
