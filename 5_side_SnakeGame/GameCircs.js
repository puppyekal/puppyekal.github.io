function startclick(obj)
{
	if (obj.value=="Start")
	{
		StartGame();
	}
	else if (obj.value=="Restart")
	{
		RestartGame();

		if (gamePaused==true)
		{
			$("#pausebtn")[0].value="Pause";
			ctx.clearRect(c.width/2 - len/2, tableY - 42, c.width/2 - len/2 + 30, (c.height-len)/2 - 82 );
			gamePaused=false;
		}
	}
}

function optionsclick()
{
	var rows = prompt("Enter number of columns: ", rowcount);
	var isnumber = parseInt(rows)||0;
	//alert(isnumber);
	if (isnumber != 0)
	{
		//alert("is integer");
		rowcount = parseInt(rows);
		points = [{row:rowcount-4, col:parseInt(rowcount/2), side:SIDE_BOTTOM},
		{row:rowcount-3, col:parseInt(rowcount/2), side:SIDE_BOTTOM}, 
		{row:rowcount-2, col:parseInt(rowcount/2), side:SIDE_BOTTOM}, 
		{row:rowcount-1, col:parseInt(rowcount/2), side:SIDE_BOTTOM}];

		clearArrays();
		drawTable();
		drawSnake();

		RestartGame();
	}
}
function pauseclick()
{
	if (gameStarted==false)
	{
		return;
	}
	//alert(x);
	var pausebtn = $("#pausebtn")[0];
	if (pausebtn.value=="Pause")
	{
		gamePaused=true;
		clearInterval(timerId);
		pausebtn.value="Resume";
		ctx.font="15px normal";
		ctx.strokeText("Paused", c.width/2 - len/2, tableY - 43);
		console.log(c.width/2 - len/2, tableY - 43);
	}
	else if (pausebtn.value=="Resume")
	{
		gamePaused=false;
		//StartGame();
		timerId = setInterval(callbackfn, speed);
		pausebtn.value="Pause";
		ctx.clearRect(c.width/2 - len/2, tableY - 73, c.width/2 - len/2 + 30, tableY - 33);
	}
}


function RestartGame()
{
	clearInterval(timerId);

	points = [{row:rowcount-4, col:parseInt(rowcount/2), side:SIDE_BOTTOM},
			{row:rowcount-3, col:parseInt(rowcount/2), side:SIDE_BOTTOM}, 
			{row:rowcount-2, col:parseInt(rowcount/2), side:SIDE_BOTTOM}, 
			{row:rowcount-1, col:parseInt(rowcount/2), side:SIDE_BOTTOM}];

	Redpickpoint = null;
	BlackPickPoint = [null];
	HalfPickpoint = null;
	SlowPickPoint = null;
	gameStarted=false;
	gamePaused=false;
	skipnext=false;

	StandardScore = 2;
	BlackCnt = 0;
	BlackStandardScore = 0;	
	SlowCnt = 2;
	HalfCnt = 3;
	direction=[GO_UP];
	score=0;

	$("#pausebtn")[0].disabled=true;
	$("#pausebtn")[0].value="Pause"
	//obj.value="Start";
	$("#startbtn")[0].value="Start";
	$("#optionsbtn")[0].disabled=false;
	gameStarted=false;

	clearArrays();
	drawTable();//돌아다닐 공간 그림
	drawSnake();//뱀소환
}

//StartGame();
