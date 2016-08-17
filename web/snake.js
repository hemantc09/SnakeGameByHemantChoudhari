/**
 * Created by Hemantc09 on 7/20/16.
 */
var direction=0;
window.onload = function() //check the browser page is loaded completely every time
{


    var canvas = document.getElementById('canvas'); //create the canvas element to draw
    var ctx= canvas.getContext('2d');
    ctx.textAlign='center';


    var ctx = canvas.getContext('2d'); //storing the reference of 2D context it will give access to 2D drawing methods
    var score = 0;
    var level = 0;
    var snake=new Array(3); //for generating the snake

    var active=true; //if the game is active set to true
    var speed=500;

    var map=new Array(40); //initialize the matrix
    for(var i=0;i<map.length;i++)
    {
        map[i]=new Array(40);
    }

    canvas.width = 404;
    canvas.height = 404;

    var body = document.getElementsByTagName('a')[0];  //returnt he first element from array list i.e. body tag
    body.appendChild(canvas);//append the canvas element to the body

    map=generateSnake(map); //add the snake
    map=generateFood(map); //add the food


    drawGame(); //call draw game

    window.addEventListener('keydown',function(e){

        if((e.keyCode===38&&direction!==3))
        {

            direction=2;//up direction
        }
        else if(e.keyCode===40&&direction!==2)
        {
            direction=3;//down direction
        }
        else if(e.keyCode===37&&direction!==0)
        {
            direction=1;//left direction
        }
        else if(e.keyCode===39&&direction!==1)
        {
            direction=0;//right direction
        }
    });

    function drawGame() //take care of calling the main function and drawing the snake ad food
    {
        ctx.clearRect(0,0,canvas.width,canvas.height); //clear the canvas

        for(var i=snake.length-1;i>=0;i--) //traverse all the body pieces of snake which will start from last one
        {
            if(i===0) //perform collision detection
            {
                switch (direction)
                {
                    case 0://right direction
                        snake[0]=
                        {
                            x:snake[0].x+1,
                            y:snake[0].y
                        };
                        break;
                    case 1://left direction
                        snake[0]=
                        {
                            x: snake[0].x-1,
                            y:snake[0].y
                        };
                        break;
                    case 2: //up direction
                        snake[0]=
                        {
                            x:snake[0].x,
                            y:snake[0].y-1
                        };
                        break;
                    case 3:
                        snake[0]=
                        {
                            x:snake[0].x,
                            y:snake[0].y+1
                        };
                        break;

                }

                if(snake[0].x<0||snake[0].x>=40||snake[0].y<0||snake[0].y>=40) //check if snake is out of bound? if yes display game over
                {
                    showGameover();
                    return;
                }

                if(map[snake[0].x][snake[0].y]===1) //if food detect increase score by 10 and generate new food
                {
                    score=score+10;
                    map=generateFood(map);

                    snake.push({x:snake[snake.length-1].x,y:snake[snake.length-1].y}); //added new body piece to snake
                    map[snake[snake.length-1].x][snake[snake.length-1].y]=2;

                    if((score%100)==0) //if the scoreis multiplier of 100 increase the level by 1
                    {
                        level+=1;
                    }
                }
                else if(map[snake[0].x][snake[0].y]===2) //if head hits the other body part then show game over
                {
                    showGameover();
                    return;
                }

                map[snake[0].x][snake[0].y]=2;
            }
            else
            {

                if(i===(snake.length-1))
                {
                    map[snake[i].x][snake[i].y]=null;
                }
                snake[i]={x:snake[i-1].x,y:snake[i-1].y};
                map[snake[i].x][snake[i].y]=2;
            }
        }

        drawMain();  //call drawmain to draw border and score details

        for(var x=0;x<map.length;x++)
        {
            for(var y=0;y<map[0].length;y++)
            {
                if(map[x][y]===1) //if 1 draw the food
                {
                    ctx.fillStyle='black';
                    ctx.font='monospace';

                    ctx.fillRect(x*10,y*10,10,10);
                }
                else if(map[x][y]===2) //if 2 it belongs to snake body //also we are levaing vertical offset of 20 to display score and level
                {
                    ctx.fillStyle='blue';
                    ctx.font='monospace';
                    ctx.fillRect(x*10,y*10,10,10);
                }
            }
        }

        if(active)
        {
            setTimeout(drawGame,speed-(level*50));
        }

    }

    function drawMain() //Take care of drawing border and displaying the current score and level
    {
        ctx.lineWidth=2;//border thickness 2 pixel
        ctx.strokeStyle='black';//black border
        ctx.strokeRect(2,2,canvas.height-2,canvas.width-2);
        document.getElementById("scoreInput").value=score;
        document.getElementById("levelInput").value=level;
       // ctx.font = '20px monospace';
        //ctx.fillText('Score:'+ score+' - Level:'+level,102,13);

    }

    function generateFood(map) //geneate the food matrix as a parameter
    {
        var rndx=Math.round(Math.random()*19); //genearate random x point for the food placing on canvas
        var rndy=Math.round(Math.random()*19); //generate random y point for the foo placing on canvas

        while(map[rndx][rndy]===2) //make sure that food point doesnt occupied by part od snake points
        {
            rndx=Math.round(Math.random()*19);
            rndy=Math.round(Math.random()*19);
        }

        map[rndx][rndy]=1;
        return map;

    }

    function generateSnake(map) //genegate snake matrix as a parameter
    {
        var rndx=Math.round(Math.random()*19); //generate random position for row and the column of the head
        var rndy=Math.round(Math.random()*19);

        while((rndx-snake.length)<0) //make sure we are not out of bounds and make space for accomodate two body pieces
        {
            rndx=Math.round(Math.random()*19);
        }

        for(var i=0;i<snake.length;i++)
        {
            snake[i]={x:rndx-i,y:rndy};
            map[rndx-i][rndy]=2;
        }
        return map;
    }

    function showGameover()// to display game over function
    {
       // document.getElementById("controls").style.visibility="hidden";

        active=false;//if the game id over set to false
        ctx.clearRect(0,0,canvas.width,canvas.height);
        ctx.fillStyle='black';

        ctx.font='20px monospace';
        ctx.fillText('Game Over!!!!',(canvas.width/2)-(ctx.measureText('Game Over!!!').width/2),50);
        ctx.font='20px monospace';
        //to place the text in center of the canvas

        ctx.fillText('Your Score was-'+score,((canvas.width/2)-(ctx.measureText('Your Score was-'+score).width/2)),100);


        Restart();

    }

    function Restart()
    {

        if(active == false)
        {
            document.getElementById('divrestart').style.visibility="visible";
            //var a = document.createElement('a');
            //document.getElementById('restarttext').appendChild(a);
            //var linkText = document.createTextNode("Restart");
            //a.appendChild(linkText);
            //a.title = "Restart";
            //a.alignContent='center';
            //a.href = "index.html";
            //document.getElementById('restart').appendChild(a);
        }
    }



};


