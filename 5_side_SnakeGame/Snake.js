var c, ctx;
var score=0;
var GO_LEFT=1, GO_RIGHT=2, GO_UP=3, GO_DOWN=4;
var SIDE_TOP=1, SIDE_FRONT=2, SIDE_BOTTOM=3, SIDE_LEFT = 4, SIDE_RIGHT = 5;
var len=500, rowcount=9;
var tableX=40, tableY;
var Snake=0, Line = 1, RedPoint=2, HalfPoint=3, SlowPoint=4, BlackPoint=5;
var BlackCnt = 0, BlackStandardScore = 20;
var direction=[GO_UP]; //1-left, 2-right, 3-up, 4-down
var timerId, speed;
var MaximumSpeed = 95;
var SpeedChange = 90;
var StandardScore = 2;
var SlowCnt = 2, HalfCnt = 3;
var mycanvas = document.getElementById('myCanvas');
var points = [{col:parseInt(rowcount/2), row:rowcount-4, side:SIDE_BOTTOM},
				{col:parseInt(rowcount/2), row:rowcount-3, side:SIDE_BOTTOM},
				{col:parseInt(rowcount/2), row:rowcount-2, side:SIDE_BOTTOM},
				{col:parseInt(rowcount/2), row:rowcount-1, side:SIDE_BOTTOM}];

if(localStorage.getItem("HighScore") == "null"){
    localStorage.setItem('HighScore', 0);      
}
else if(localStorage.getItem("HighScore") == null){
    localStorage.setItem('HighScore', 0);
}
//[{5,4,3},{6,4,3},{7,4,3},{8,4,3}]
//맨처음 맵에 뱀이 소환되는 위치 ㅇㅎ
$(document).ready(function()  {
	c = $("#myCanvas")[0];
	//alert(c);
	ctx = c.getContext("2d");
	//alert("loaded");
	drawTable();//돌아다닐 공간 그림
	drawSnake();//뱀소환
});

var Redpickpoint = null;
var BlackPickPoint = [null];
var HalfPickpoint = null;
var SlowPickPoint = null;
var gameStarted=false;
var gamePaused=false;
var skipnext=false;

window.addEventListener("keydown", function(e){
	e.preventDefault();
	e.stopPropagation();
}, false);//방향키로 스코롤이동 방지

window.addEventListener("keydown", function(e)
{
	if (gameStarted == false)
	{
		return;
	}
	else if ((gamePaused == true) && (e.keyCode != 80))
	{
		return;
	}
	else if (e.keyCode == 80)
	{
		pauseclick();
	}

	var dir=direction[direction.length-1];//direction의 마지막부분
	//==마지막 입력받은 방향

	if ((e.keyCode == 38) && (dir != GO_DOWN) && (dir != GO_UP))
	{
		direction.push(GO_UP);
		callbackfn();
		skipnext=true;
	}
	else if ((e.keyCode == 40) && (dir != GO_UP) && (dir != GO_DOWN)) 
	{
		direction.push(GO_DOWN);
		callbackfn();
		skipnext=true;
	}
	else if ((e.keyCode == 37) && (dir != GO_RIGHT) && (dir != GO_LEFT)) 
	{
		direction.push(GO_LEFT);
		callbackfn();
		skipnext=true;
	}
	else if ((e.keyCode == 39) && (dir != GO_LEFT) && (dir != GO_RIGHT))
	{
		direction.push(GO_RIGHT);
		callbackfn();
		skipnext=true;
	}
});

var bottomPoints1=[];
var bottomPoints2=[];

var topPoints1=[];
var topPoints2=[];

var frontPoints1=[];
var frontPoints2=[];

var leftPoints1=[];
var leftPoints2=[];

var rightPoints1=[];
var rightPoints2=[];

var matrixTop=[];
var matrixBottom=[];
var matrixLeft=[];
var matrixRight=[];

function clearArrays()
{
	bottomPoints1=[];
	bottomPoints2=[];
	topPoints1=[];
	topPoints2=[];
	frontPoints1=[];
	frontPoints2=[];

	leftPoints1=[];
	leftPoints2=[];

	rightPoints1=[];
	rightPoints2=[];

	matrixTop=[];
	matrixBottom=[];
	matrixLeft=[];
	matrixRight=[];
}

var backgroundcolor = "rgb(230,230,230)";

function drawTable()
{

	// first clear the whole canvas
	ctx.clearRect(0,0,c.width,c.height);

	var x = (c.width-len)/2; //(c.width-len)/2;
	var y = (c.height-len)/2;
	tableY=y;

	ctx.fillStyle=backgroundcolor;
	ctx.lineWidth=2;
	ctx.strokeStyle="darkblue";
	//ctx.fillRect(x,y,3,3);
	//ctx.moveTo(x,y);
	//ctx.lineTo(x+len,y);
	//ctx.stroke();
	ctx.strokeRect(x,y,len,len);
	ctx.fillRect(x,y,len,len);

	ctx.strokeRect(x+len/4,y+len/4,len/2,len/2);
	//가운데 정사각형 격자
	ctx.moveTo(x,y);
	ctx.lineTo(x+len/4,y+len/4);
	//좌측상단에서 가운데 좌상으로

	ctx.moveTo(x+len,y);
	ctx.lineTo(x+3*len/4,y+len/4);
	//우상에서 중앙 우상으로

	ctx.moveTo(x,y+len);
	ctx.lineTo(x+len/4,y+3*len/4);
	//좌하시작

	ctx.moveTo(x+len,y+len);
	ctx.lineTo(x+3*len/4,y+3*len/4);
	//우하


	//ctx.stroke();

	bottomPoints1.push({x1:x+len/4, y1:y+3*len/4,x2:x,y2:y+len});
	//좌하 중앙,좌하

	bottomPoints2.push({x1:x+len/4,  y1:y+3*len/4,x2:x+3*len/4,y2:y+3*len/4});
	//좌하 중앙, 우하 중앙

	//바닥 좌표인듯

	topPoints1.push({x1:x,y1:y,x2:x+len/4,y2:y+len/4});
	//좌상, 좌상 중앙

	topPoints2.push({x1:x, y1:y,x2:x+len,y2:y});
	//좌상, 우상

	//아마 천장 좌표겠지??
	frontPoints1.push({x1:x+len/4,  y1:y+len/4,	x2:x+3*len/4,y2:y+len/4});
	//좌상 중앙, 우상 중앙
	frontPoints2.push({x1:x+len/4,y1:y+len/4,x2:x+len/4,y2:y+3*len/4});
	//좌상 중앙, 좌하 중앙
	//뒷면ㅇㅇ

	//와 계산하자!!
	leftPoints2.push({x1:x, y1:y,x2:x+len/4,y2:y+len/4});
	//좌상,우하
	leftPoints1.push({x1:x,y1:y,x2:x,y2:y+len});
	//좌상, 좌상중앙

	rightPoints2.push({x1:x+3*len/4, y1:y+len/4,x2:x+len,y2:y});
	//우상중앙, 우하중앙
	rightPoints1.push({x1:x+3*len/4,y1:y+len/4,	x2:x+3*len/4,y2:y+3*len/4});
	//우상중앙. 우상



	for (i=1;i<rowcount;i++)
	{
		//top side
		x1=x+i*len/rowcount;
		y1=y;
		ctx.moveTo(x1,y1);
		x2=x+len/4+i*len/(2*rowcount);
		y2=y+len/4
		ctx.lineTo(x2,y2);
		topPoints1.push({x1:x1,y1:y1,x2:x2,y2:y2});
		//윗면 위에서 아래로 선그음


		x3=x+i*len/(4*rowcount);
		y3=y+i*len/(4*rowcount);
		ctx.moveTo(x3,y3);
		x4=x+len-i*len/(4*rowcount);
		y4=y+i*len/(4*rowcount);
		ctx.lineTo(x4,y4);
		topPoints2.push({x1:x3,y1:y3,x2:x4,y2:y4});
		//윗면 

		//front side
		x5=x+len/4;
		y5=y+len/4+i*len/(2*rowcount);
		ctx.moveTo(x5,y5);
		x6=x+3*len/4;
		y6=y5;
		ctx.lineTo(x6,y6);
		frontPoints1.push({x1:x5,y1:y5,x2:x6,y2:y6});

		x7=x+len/4+i*len/(2*rowcount);
		y7=y+len/4;
		ctx.moveTo(x7,y7);
		x8=x7;
		y8=y+3*len/4;
		ctx.lineTo(x8,y8);
		frontPoints2.push({x1:x7,y1:y7,x2:x8,y2:y8});

		//bottom side
		x9=x+len/4+i*len/(2*rowcount);
		y9=y+3*len/4;
		ctx.moveTo(x9,y9);
		x10=x+i*len/rowcount;
		y10=y+len;
		ctx.lineTo(x10,y10);
		bottomPoints1.push({x1:x9,y1:y9,x2:x10,y2:y10});

	

		x11=x+len/4-i*len/(4*rowcount);
		y11=y+3*len/4+i*len/(4*rowcount);
		ctx.moveTo(x11,y11);
		x12=x+3*len/4+i*len/(4*rowcount);
		y12=y11;
		ctx.lineTo(x12,y12);
		bottomPoints2.push({x1:x11,y1:y11,x2:x12,y2:y12});


		//left
		x13=x+i*len/(4*rowcount);
		y13=y+i*len/(4*rowcount);
		ctx.moveTo(x13,y13);
		x14=x13;//x+len/4;
		y14=y+len-i*len/(4*rowcount);//y+len/4+i*len/(2*rowcount);
		ctx.lineTo(x14,y14);
		leftPoints1.push({x1:x13,y1:y13,x2:x14,y2:y14});

		x15=x;
		y15=y+i*len/(rowcount);
		ctx.moveTo(x15,y15);
		x16=x+len/4;
		y16=y+len/4+i*len/(2*rowcount);
		ctx.lineTo(x16,y16);
		leftPoints2.push({x1:x15,y1:y15,x2:x16,y2:y16});

		//right
		x17=x+3*len/4;
		y17=y+len/4+i*len/(2*rowcount);
		ctx.moveTo(x17,y17);
		x18=x+len;
		y18=y+i*len/rowcount;
		ctx.lineTo(x18,y18);
		rightPoints2.push({x1:x17,y1:y17,x2:x18,y2:y18});

		x19=x+3*len/4+i*len/(4*rowcount);
		y19=y+len/4-i*len/(4*rowcount);
		ctx.moveTo(x19,y19);
		x20=x19;
		y20=y+3*len/4+i*len/(4*rowcount);
		ctx.lineTo(x20,y20);
		rightPoints1.push({x1:x19,y1:y19,x2:x20,y2:y20});
	}

	topPoints1.push({x1:x+len,y1:y,x2:x+3*len/4,y2:y+len/4});
	topPoints2.push({x1:x+len/4,y1:y+len/4,x2:x+3*len/4,y2:y+len/4});

	bottomPoints1.push({x1:x+3*len/4,y1:y+3*len/4,x2:x+len,y2:y+len});
	bottomPoints2.push({x1:x,y1:y+len,x2:x+len,y2:y+len});

	frontPoints1.push({x1:x+len/4,y1:y+3*len/4,x2:x+3*len/4,y2:y+3*len/4});
	frontPoints2.push({x1:x+3*len/4,y1:y+len/4,x2:x+3*len/4,y2:y+3*len/4});

	leftPoints2.push({x1:x,y1:y+len,x2:x+len/4,y2:y+3*len/4});
	leftPoints1.push({x1:x+len/4,y1:y+len/4,x2:x+len/4,y2:y+3*len/4});

	rightPoints2.push({x1: x+3*len/4, y1: y+3*len/4, x2: x+len, y2: y+len});
	rightPoints1.push({x1: x+len, y1: y, x2: x+len, y2: y+len});

	//마지막 선들

	ctx.stroke();


	//이거부터 뭔지 모르겠네 ㅁㄴㅇㄹ 아마도 빨간거 만드는 함수인가? 아니네 뱀 좌표표시하는 함수였네 
	//걍 사각형 애들 좌표 집어넣고 계산하는 부분이였음
	for (i=0; i < topPoints2.length; i++)
	{
		var line=[];
		for (j=0; j < topPoints1.length; j++)
		{
			var pt = intersection(topPoints1[j].x1, topPoints1[j].y1,
				topPoints1[j].x2, topPoints1[j].y2,
				topPoints2[i].x1, topPoints2[i].y1,
				topPoints2[i].x2, topPoints2[i].y2);
			line.push(pt);
		}
		matrixTop.push(line);
	}
	

	for (i=0; i < bottomPoints2.length; i++)
	{
		var line=[];
		for (j=0; j < bottomPoints1.length; j++)
		{
			var pt = intersection(bottomPoints1[j].x1, bottomPoints1[j].y1,
				bottomPoints1[j].x2, bottomPoints1[j].y2,
				bottomPoints2[i].x1, bottomPoints2[i].y1,
				bottomPoints2[i].x2, bottomPoints2[i].y2);
			line.push(pt);
		}
		matrixBottom.push(line);
	}


	for (i=0; i < leftPoints2.length; i++)
	{
		var line=[];
		for (j=0; j < leftPoints1.length; j++)
		{
			var pt = intersection(leftPoints1[j].x1, leftPoints1[j].y1,
				leftPoints1[j].x2, leftPoints1[j].y2,
				leftPoints2[i].x1, leftPoints2[i].y1,
				leftPoints2[i].x2, leftPoints2[i].y2);
			line.push(pt);
		}
		matrixLeft.push(line);
	}

	for (i=0; i < rightPoints2.length; i++)
	{
		var line=[];
		for (j=0; j < rightPoints1.length; j++)
		{
			var pt = intersection(rightPoints1[j].x1, rightPoints1[j].y1,
				rightPoints1[j].x2, rightPoints1[j].y2,
				rightPoints2[i].x1, rightPoints2[i].y1,
				rightPoints2[i].x2, rightPoints2[i].y2);
			line.push(pt);
		}
		matrixRight.push(line);
	}


	eraseScore();
	drawScore();
}

function drawPart(part, erase)
//part=points[i],erase=0;->snake
//part=Redpickpoint,erase=2;->redsq
{
	
	if (part.side==SIDE_BOTTOM) // bottom
	{
		x1=matrixBottom[part.row][part.col].xint;
		y1=matrixBottom[part.row][part.col].yint;
		x2=matrixBottom[part.row][part.col+1].xint;
		y2=matrixBottom[part.row][part.col+1].yint;
		x3=matrixBottom[part.row+1][part.col+1].xint;
		y3=matrixBottom[part.row+1][part.col+1].yint;
		x4=matrixBottom[part.row+1][part.col].xint;
		y4=matrixBottom[part.row+1][part.col].yint;
	}
	else if (part.side==SIDE_TOP) // top
	{
		x1=matrixTop[part.row][part.col].xint;
		y1=matrixTop[part.row][part.col].yint;
		x2=matrixTop[part.row][part.col+1].xint;
		y2=matrixTop[part.row][part.col+1].yint;
		x3=matrixTop[part.row+1][part.col+1].xint;
		y3=matrixTop[part.row+1][part.col+1].yint;
		x4=matrixTop[part.row+1][part.col].xint;
		y4=matrixTop[part.row+1][part.col].yint;
	}
	else if (part.side==SIDE_FRONT) // front
	{
		x1=frontPoints2[part.col].x1;
		y1=frontPoints1[part.row].y1;
		x2=frontPoints2[part.col+1].x1;
		y2=y1;
		x3=x2;
		y3=frontPoints1[part.row+1].y1;
		x4=x1;
		y4=y3;
	}
	else if (part.side==SIDE_LEFT) // left
	{
		x1=matrixLeft[part.row][part.col].xint;
		y1=matrixLeft[part.row][part.col].yint;
		x2=matrixLeft[part.row][part.col+1].xint;
		y2=matrixLeft[part.row][part.col+1].yint;
		x3=matrixLeft[part.row+1][part.col+1].xint;
		y3=matrixLeft[part.row+1][part.col+1].yint;
		x4=matrixLeft[part.row+1][part.col].xint;
		y4=matrixLeft[part.row+1][part.col].yint;
	}
	else if (part.side==SIDE_RIGHT) // right
	{
		x1=matrixRight[part.row][part.col].xint;
		y1=matrixRight[part.row][part.col].yint;
		x2=matrixRight[part.row][part.col+1].xint;
		y2=matrixRight[part.row][part.col+1].yint;
		x3=matrixRight[part.row+1][part.col+1].xint;
		y3=matrixRight[part.row+1][part.col+1].yint;
		x4=matrixRight[part.row+1][part.col].xint;
		y4=matrixRight[part.row+1][part.col].yint;
	}

	ctx.beginPath();
	ctx.moveTo(x1, y1);
	ctx.lineTo(x2, y2);
	ctx.lineTo(x3, y3);
	ctx.lineTo(x4, y4);
	ctx.lineTo(x1, y1);
	if (erase==Line) // fill with background color and line
	{
		ctx.fillStyle=backgroundcolor;
		ctx.strokeStyle="darkblue";
	}
	else if (erase==RedPoint) // red part
	{
		ctx.fillStyle="red";
		ctx.strokeStyle="darkblue";
	}
	else if(erase == HalfPoint){
		ctx.fillStyle="rgb(33,197,255)";
		ctx.strokeStyle="darkblue";
	}
	else if(erase == SlowPoint){
		ctx.fillStyle="rgb(255,207,55)";
		ctx.strokeStyle="darkblue";
	}
	else if(erase == BlackPoint){
		ctx.fillStyle="rgb(0,0,0)";
		ctx.strokeStyle="darkblue";

	}
	else if(erase == Snake) //snake
	{
		ctx.fillStyle="rgb(199,232,94)";
		ctx.strokeStyle="rgb(124,165,57)";
	}
	ctx.fill();
	//if (erase==1)
	ctx.stroke();
	

	ctx.strokeStyle="darkblue";
}

function drawSnake()
{
	for (i = 0; i < points.length; i++)//뱀길이만큼 돌림ㅇㅇ
	{
		drawPart(points[i], Snake);
	}
}

function drawScore()
{
	ctx.font="15px normal";
	ctx.textBaseline = 'alphabetic';
    ctx.textAlign = 'left';
	ctx.strokeText("SCORE : " + score, c.width/2 - len/2, tableY - 20);
	ctx.strokeText("HIGH SCORE : " + localStorage.getItem("HighScore"), c.width/2 + 130, tableY - 20);
}

function eraseScore()
{
	ctx.clearRect(c.width/2 - len/2, tableY - 70,  c.width/2 + 200,  tableY - 10);
}



function StartGame()
{
	speed = 200;
	
	var options = $("#optionsbtn")[0];
	options.disabled=true;
	$("#pausebtn")[0].disabled=false;
	$("#startbtn")[0].value="Restart";

	timerId = setInterval(callbackfn, speed);//아마 이게 시작이였을듯
	gameStarted=true;
}
var okBtn = new Path2D();

function GameOver(){
	clearInterval(timerId);
	$("#pausebtn")[0].disabled=true;
	$("#optionsbtn")[0].disabled=false;
	gameStarted=false;
    
    ctx.beginPath();
    ctx.rect((c.width-len)/2,(c.height-len)/2, 500, 500);
    ctx.fillStyle = "rgba(0,0,0,0.8)";
    ctx.fill();

    ctx.font = 'bold 50px Arial';
    ctx.fillStyle = 'white';
    ctx.textBaseline = 'middle';
    ctx.textAlign = 'center';
    ctx.fillText("Game Over", (c.width-len)/2 + 250, 150);
    ctx.fillText("Your Score : " + score, (c.width-len)/2 + 250, 250);
    ctx.fillText("High Score : " + localStorage.getItem('HighScore'), (c.width-len)/2 + 250, 350);


    score = 0 ;
    /////////////////////////////////////////

    okBtn.rect(c.width/2 - 100, 400, 200, 100);
    ctx.fillStyle = "#3f5a9d";
    ctx.fill(okBtn); 

	ctx.font = 'bold 50px Arial';
    ctx.fillStyle = 'white';
    ctx.textBaseline = 'middle';
    ctx.textAlign = 'center';
    ctx.fillText("OK", c.width/2, 450);

    document.onclick = ClickBtn;
    var btnEvent = document.getElementById("myBtn");
}

function ClickBtn(e) {
	MouseX = e.offsetX;
	MouseY = e.offsetY;

	if(ctx.isPointInPath(okBtn, MouseX, MouseY)){
		RestartGame();
	}
}


function Interval(){
	console.log("Change Speed! : " + speed);
	clearInterval(timerId);
	timerId = setInterval(callbackfn, speed);
}//change Snake's speed

function callbackfn()//계속 호출될거임+방향키 누를떄마다
{
	if(speed > MaximumSpeed){
		if(score > StandardScore){
			speed -= 15;
			StandardScore += 3;
			Interval();//change Snake's speed
		}
	}

	if (skipnext == true)
	{
		skipnext = false;
		return;
	}

	//ctx.clearRect(0,0,c.width,c.height);
	var newhead;
	if (direction.length > 1)//direction 길이가 1보다 크면
	{
		direction.shift();//direction[0]을 제거, 대체 왜??
	}//무조건 1보다 크지않나...?

	var dir=direction[0];//진행 방향 받아옴
	
	var newcol, newrow, newside;


	if (dir == GO_LEFT) // left
	{
		var head=points[0];
		//스네이크의 머리

		newcol = head.col-1;
		newrow = head.row;
		newside = head.side;

		var changeSide;

		if (head.col==0)//얘가 -이었으면 newcol은 -1인데...?
		{
			//newhead={row:head.row, col:head.col-1, side:head.side};
			//그래서 바꾸네 마지막 x좌표로 //기본 rowcount=9
			if (head.side == SIDE_LEFT)
			{
				newcol = rowcount - 1;
				newside=SIDE_RIGHT;
			}
			else if (head.side==SIDE_RIGHT)
			{
				newcol = rowcount - 1;
				newside=SIDE_FRONT;
			}
			else if (head.side==SIDE_FRONT)
			{
				newcol = rowcount - 1;
				newside=SIDE_LEFT;
			}
			//왼,오,가운데이동은 상관 없음
			//위,아래서 왼쪽 갈때 바꿔야됨
			else if(head.side == SIDE_TOP){
				//0.0->0.0
				//0.1->1.0
				//0.2->2.0
				//0.3->3.0
				//0.4->4.0
				//0.5->5.0
				//0.6->6.0
				//0.7->7.0
				//0.8->8.0		
				newcol = head.row;
				newrow = 0;
				direction.push(GO_DOWN);

				newside=SIDE_LEFT;
				//dir=GO_DOWN;
			}
			else if(head.side == SIDE_BOTTOM){
				//0.8->0.8
				//0.7->1.8
				//0.6->2.8
				//0.5->3.8
				//0.4->4.8
				//0.3->5.8
				//0.2->6.8
				//0.1->7.8
				//0.0->8.8						
				changeSide = newrow;
				newrow = rowcount-1;
				newcol = newrow - changeSide;
				direction.push(GO_UP);
				//dir = GO_UP;

				newside = SIDE_LEFT;

			}
		}
		newhead={col:newcol, row:newrow, side:newside};
	}
	else if (dir == GO_UP) // up
	{
		var head=points[0];
		newcol=head.col;
		newrow = head.row-1;
		newside=head.side;

		if (head.row==0)//
		{
			newrow=rowcount-1;
			if (head.side==SIDE_BOTTOM)
			{
				newside=SIDE_FRONT;
			}
			else if (head.side==SIDE_FRONT)
			{
				newside=SIDE_TOP;
			}
			else if (head.side==SIDE_TOP)
			{
				newside=SIDE_BOTTOM;
			}
			else if(head.side == SIDE_LEFT){
				//0.0->0.0
				//1.0->0.1
				//2.0->0.2
				//3.0->0.3
				//4.0->0.4
				//5.0->0.5
				//6.0->0.6
				//7.0->0.7
				//8.0->0.8	

				newrow = newcol;
				newcol = 0;
				direction.push(GO_RIGHT);

				newside = SIDE_TOP;
			}
			else if(head.side == SIDE_RIGHT){
				//0.0->8.8
				//1.0->8.7
				//2.0->8.6
				//3.0->8.5
				//4.0->8.4
				//5.0->8.3
				//6.0->8.2
				//7.0->8.1
				//8.0->8.0	
				newrow = (rowcount-1) - newcol;
				newcol = rowcount-1;
				direction.push(GO_LEFT);
				//dir = GO_UP;

				newside = SIDE_TOP;
			}

			//newrow=rowcount-1;
		}
		newhead={col:newcol, row:newrow, side:newside};
	}
	else if (dir == GO_RIGHT) // right
	{
		var head=points[0];
		newcol=head.col+1;
		newside = head.side;
		newrow = head.row;

		if (head.col==rowcount-1)
		{
			newcol=0;
			if (head.side==SIDE_RIGHT)
			{
				newside=SIDE_LEFT;
			}
			else if (head.side==SIDE_LEFT)
			{
				newside=SIDE_FRONT;
			}
			else if (head.side==SIDE_FRONT)
			{
				newside=SIDE_RIGHT;
			}
			else if(head.side==SIDE_TOP){
				//8.0->8.0
				//8.1->7.0
				//8.2->6.0
				//8.3->5.0
				//8.4->4.0
				//8.5->3.0
				//8.6->2.0
				//8.7->1.0
				//8.8->0.0
				newcol=(rowcount-1)-newrow;
				newrow = 0;

				newside = SIDE_RIGHT;
				direction.push(GO_DOWN);
			}
			else if(head.side==SIDE_BOTTOM){
				//8.0->0.8
				//8.1->1.8
				//8.2->2.8
				//8.3->3.8
				//8.4->4.8
				//8.5->5.8
				//8.6->6.8
				//8.7->7.8
				//8.8->8.8
				newcol=newrow;
				newrow = rowcount-1;

				newside = SIDE_RIGHT;
				direction.push(GO_UP);
			}
		}
		
		newhead={col:newcol, row:newrow, side:newside};
	}
	else if (dir == GO_DOWN)
	{
		var head=points[0];
		newrow=head.row+1;
		newside=head.side;
		newcol=head.col;

		if (head.row==rowcount-1)
		{
			if (head.side==SIDE_BOTTOM)
			{
				newrow=0;
				newside=SIDE_TOP;
			}
			else if (head.side==SIDE_FRONT)
			{
				newrow=0;
				newside=SIDE_BOTTOM;
			}
			else if (head.side==SIDE_TOP)
			{
				newrow=0;
				newside=SIDE_FRONT;
			}
			else if(head.side==SIDE_LEFT){
				//0.8->0.8
				//1.8->0.7
				//2.8->0.6
				//3.8->0.5
				//4.8->0.4
				//5.8->0.3
				//6.8->0.2
				//7.8->0.1
				//8.8->0.0
				newrow = newrow - 1 - newcol;
				newcol = 0;

				newside = SIDE_BOTTOM;
				direction.push(GO_RIGHT);
			}
			else if(head.side==SIDE_RIGHT){
				//0.8->8.0
				//1.8->8.1
				//2.8->8.2
				//3.8->8.3
				//4.8->8.4
				//5.8->8.5
				//6.8->8.6
				//7.8->8.7
				//8.8->8.8
				newrow=newcol;
				newcol = rowcount-1;

				newside = SIDE_BOTTOM;
				direction.push(GO_LEFT);
			}
		}
		newhead={col:newcol, row:newrow, side:newside};
	}


	if ((Redpickpoint == null) || (newhead.row!=Redpickpoint.row) || 
		(newhead.col!=Redpickpoint.col) || (newhead.side!=Redpickpoint.side))	{
		//아 조건 드럽게 어렵네 뭔소리지//안 닿은 경우 || 빨간애가 null인경우 
		// erase tail
		var tail=points.pop();//point 배열에 가장 마지막에 있는 부분을 빼서 tail에 넣음
		drawPart(tail, Line);
	}//닿지않았을경우 스네이크 마지막 위치에 선 다시 그림

	else//닿으면 지워버리고 점수올림
	{
		//snake found the brown part
		score++;
		Redpickpoint=null;
		var HighScore;
    	HighScore = localStorage.getItem('HighScore');

	    if(parseInt(HighScore) < score){	
	      HighScore = score;
	    }
	    localStorage.setItem("HighScore", HighScore);


		eraseScore();
		drawScore();
	}
	points.splice(0,0,newhead);
	drawPart(newhead, Snake);
	//////////////////////////
	//halfpoint
	if ((HalfPickpoint == null) || (newhead.row!=HalfPickpoint.row) || 
		(newhead.col!=HalfPickpoint.col) || (newhead.side!=HalfPickpoint.side))	{	}
	else	{
		HalfPickpoint = null;
		var halfLen = (points.length+1)/2;
		for (var i = 0; i < halfLen; i++) {
			//
			var tail=points.pop();
			drawPart(tail, Line);
			//
		}
	}
	//////////////////////////
	//slowpoint
	if ((SlowPickPoint == null) || (newhead.row!=SlowPickPoint.row) || 
		(newhead.col!=SlowPickPoint.col) || (newhead.side!=SlowPickPoint.side))	{	}
	else {
		SlowPickPoint=null;
		speed = 200;
		Interval();//change Snake's speed
	}

	for (var i = 0; i < BlackCnt; i++) {
		// if ((BlackPickPoint[i] == null) || (newhead.row!=BlackPickPoint[i].row) || 
		// (newhead.col!=BlackPickPoint[i].col) || (newhead.side!=BlackPickPoint[i].side))	{		}
		// else {
		// 	GameOver();
		// }
		var crtPoint = BlackPickPoint[i];
		if ((crtPoint.row==newhead.row) && (crtPoint.col==newhead.col) && 
			(crtPoint.side==newhead.side))
		{
			GameOver();
		}
	}

	
	//////////////////////////

	if (Redpickpoint == null)
	{
		Redpickpoint = randomGenerate();
		while (insideSnakeandRedPoint() == true)//뱀의 경로에 소환되면
		{
			Redpickpoint=randomGenerate();//벗어날때까지 재배치
		}
		//drawPart(Redpickpoint, RedPoint);
		drawRedPoint();

	}
	
	if(score > HalfCnt && HalfPickpoint == null){
		HalfCnt += 3;

		HalfPickpoint=randomGenerate();
		while (insideSnakeandHalfPoint() == true)
		{
			HalfPickpoint=randomGenerate();
		}
		//drawPart(HalfPickpoint, HalfPoint);
		drawHalfPoint();
	}


	if (score > BlackStandardScore)
	{
		BlackStandardScore += 2;

		BlackPickPoint[BlackCnt] = randomGenerate();
		while (insideSnakeandBlackPoint() == true)
		{
			BlackPickPoint[BlackCnt]=randomGenerate();
		}
		drawPart(BlackPickPoint[BlackCnt], BlackPoint);
		BlackCnt++;
	}
	
	if(score > SlowCnt && SlowPickPoint == null){
		SlowCnt += 2;

		SlowPickPoint=randomGenerate();
		while (insideSnakeandSlowPoint() == true)
		{
			SlowPickPoint=randomGenerate();
		}
		//drawPart(SlowPickPoint, SlowPoint);
		drawSlowPoint();
	}



	//check for failure
	for (i=1; i<points.length; i++)
	{
		var crtPoint = points[i];
		if ((crtPoint.row==newhead.row) && (crtPoint.col==newhead.col) && 
			(crtPoint.side==newhead.side))
		{
			GameOver();
		}
	}

	//drawTable();
}



function insideSnakeandRedPoint()
{
	console.log(1);
	var ret = false;

	
	for (i=0; i<points.length; i++)
	{
		var crtPoint = points[i];
		if ((crtPoint.row==Redpickpoint.row) && (crtPoint.col==Redpickpoint.col) && (crtPoint.side==Redpickpoint.side))
		{
			ret=true;
			break;
		}
	}
	for (i=0; i<BlackCnt; i++)
	{
		var crtPoint = BlackPickPoint[i];
		if ((crtPoint.row==Redpickpoint.row) && (crtPoint.col==Redpickpoint.col) && (crtPoint.side==Redpickpoint.side))
		{
			ret=true;
			break;
		}
	}
	if ((SlowPickPoint != null) && (SlowPickPoint.row==Redpickpoint.row) && (SlowPickPoint.col==Redpickpoint.col) && (SlowPickPoint.side==Redpickpoint.side))
	{
		ret=true;
	}
	if ((HalfPickpoint != null) &&(HalfPickpoint.row==Redpickpoint.row) && (HalfPickpoint.col==Redpickpoint.col) && (HalfPickpoint.side==Redpickpoint.side))
	{
		ret=true;
	}

	return ret;
}
function insideSnakeandSlowPoint()
{
	var ret = false;
	for (i=0; i<points.length; i++)
	{
		var crtPoint = points[i];
		if ((crtPoint.row==SlowPickPoint.row) && (crtPoint.col==SlowPickPoint.col) && 
			(crtPoint.side==SlowPickPoint.side))
		{
			ret=true;
			break;
		}
	}
	for (i=0; i<BlackCnt; i++)
	{
		var crtPoint = BlackPickPoint[i];
		if ((crtPoint.row==SlowPickPoint.row) && (crtPoint.col==SlowPickPoint.col) && 
			(crtPoint.side==SlowPickPoint.side))
		{
			ret=true;
			break;
		}
	}
	if ((Redpickpoint.row==SlowPickPoint.row) && (Redpickpoint.col==SlowPickPoint.col) && (Redpickpoint.side==SlowPickPoint.side))
	{
		ret=true;
	}
	if ((HalfPickpoint != null)&&(HalfPickpoint.row==SlowPickPoint.row) && (HalfPickpoint.col==SlowPickPoint.col) && (HalfPickpoint.side==SlowPickPoint.side))
	{
		ret=true;
	}
	return ret;
}
function insideSnakeandHalfPoint()
{
	var ret = false;
	for (i=0; i<points.length; i++)
	{
		var crtPoint = points[i];
		if ((crtPoint.row==HalfPickpoint.row) && (crtPoint.col==HalfPickpoint.col) && 
			(crtPoint.side==HalfPickpoint.side))
		{
			ret=true;
			break;
		}
	}
	for (i=0; i<BlackCnt; i++)
	{
		var crtPoint = BlackPickPoint[i];
		if ((crtPoint.row==HalfPickpoint.row) && (crtPoint.col==HalfPickpoint.col) && 
			(crtPoint.side==HalfPickpoint.side))
		{
			ret=true;
			break;
		}
	}
	if ((SlowPickPoint.row==HalfPickpoint.row) && (SlowPickPoint.col==HalfPickpoint.col) && (SlowPickPoint.side==HalfPickpoint.side))
	{
		ret=true;
	}
	if ((Redpickpoint.row==HalfPickpoint.row) && (Redpickpoint.col==HalfPickpoint.col) && (Redpickpoint.side==HalfPickpoint.side))
	{
		ret=true;
	}
	return ret;
}
function insideSnakeandBlackPoint()
{
	var ret = false;
	for (i=0; i<points.length; i++)
	{
		var crtPoint = points[i];
		if ((crtPoint.row==BlackPickPoint.row) && (crtPoint.col==BlackPickPoint.col) && 
			(crtPoint.side==BlackPickPoint.side))
		{
			ret=true;
			break;
		}
	}
	if ((SlowPickPoint != null) && (SlowPickPoint.row==BlackPickPoint.row) && (SlowPickPoint.col==BlackPickPoint.col) && (SlowPickPoint.side==BlackPickPoint.side))
	{
		ret=true;
	}
	if ((HalfPickpoint) && (HalfPickpoint.row==BlackPickPoint.row) && (HalfPickpoint.col==BlackPickPoint.col) && (HalfPickpoint.side==BlackPickPoint.side))
	{
		ret=true;
	}
	if ((Redpickpoint.row==BlackPickPoint.row) && (Redpickpoint.col==BlackPickPoint.col) && (Redpickpoint.side==BlackPickPoint.side))
	{
		ret=true;
	}
	return ret;
}

function drawRedPoint(){
	drawPart(Redpickpoint, RedPoint);
}
function drawSlowPoint(){
	drawPart(SlowPickPoint, SlowPoint);
}
function drawHalfPoint(){
	drawPart(HalfPickpoint, HalfPoint);
}

function randomGenerate()
{
	var randrow=parseInt((Math.random()*100)%rowcount);
	var randcol=parseInt((Math.random()*100)%rowcount);
	var randside = parseInt((Math.random()*10)%5)+1;
	for(;randside == points[0].side;){
		var randside = parseInt((Math.random()*10)%5)+1;
	} 

	return {col:randcol, row:randrow, side:randside};
}

function intersection(x1,y1,x2,y2,x3,y3,x4,y4)
{
	var xr, yr;

	if (x2==x1)
	{
		xr=x1;
		yr=(y4-y3)*(x1-x3)/(x4-x3) + y3;
	}
	else if (x3==x4)
	{
		xr=x3;
		yr=(y2-y1)*(x3-x1)/(x2-x1) + y1;
	}
	else
	{
		xr=(x1*(y2-y1)/(x2-x1)-x3*(y4-y3)/(x4-x3)+y3-y1)/((y2-y1)/(x2-x1)-(y4-y3)/(x4-x3));
		yr=(y2-y1)*(xr-x1)/(x2-x1)+y1;
	}
	return {xint:xr,yint:yr};
}