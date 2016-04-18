var x = 20,y = 350;

//
var NowGameState = 0
var fontColor = makecol(255,255,255)
//
var dummySprite
var titleImg
var objImg
var obj2Img //hand part
var eggImg //I forget...
//sprite

var pk_Bitmap
var ek_Bitmap


//base(16,16) in 48x48
//

var sprOffset =
{
	T1:
	{
		L1:{x:-1*4,y:14*4},L2:{x:-1*4,y:11*4},L3:{x:0*4,y:11*4},
		H1:{x:-1*4,y:-4*4},H2:{x:-1*4,y:-8*4},H3:{x:0*4,y:-2*4}
	},
	
	T2:
	{
		L1:{x:0,y:15*4},L2:{x:0,y:13*4},L3:{x:0,y:14*4},
		H1:{x:0,y:-9*4},H2:{x:0,y:-8*4},H3:{x:0,y:-6*4}
	},
		
	T3:
	{
		L1:{x:0,y:9*4},L2:{x:1*4,y:14*4},L3:{x:-1*4,y:12*4},
		H1:{x:0,y:-10*4},H2:{x:1*4,y:-10*4},H3:{x:-5*4,y:-13*4}
	}
}
/*
var T1L1 = (-1,14)
var T1L2 = (-1,11)
var T1L3 = (0,11)

var T1H1 = (-1,-4)
var T1H2 = (-1,-8)
var T1H3 = (0,-2)

//
var T2L1 = (0,15)
var T2L2 = (0,13)
var T3L3 = (0,14)

var T2H1 = (0,-9)
var T2H2 = (0,-8)
var T2H3 = (0,-6)

//
T3L1 = (0,9)
T3L2 = (1,14)
T3L3 = (-1,12)

T3H1 = (0,-10)
T3H2 = (1,-10)
T3H3 = (-5,-13)
*/


//sound
var fightNoise
var evolveSE


//kaiju info. //pk: player kaiju, ek: enemy kaiju
var pk_name = ""

var pk_TYPE = 0
var pk_HEAD = -1
var pk_LEG = -1
var pk_HAND = -1

var pk_HP = 0
var pk_MP = 0
var pk_ATK = 0
var pk_DEF = 0
var pk_comment = []


var ek_name = ""

var ek_TYPE = 0
var ek_HEAD = -1
var ek_LEG = -1
var ek_HAND = -1

var ek_HP = 0
var ek_MP = 0
var ek_ATK = 0
var ek_DEF = 0
var ek_comment = []

//CK data
var nowComment = 0
//Battle data
var pk_HPNow = 0
var ek_HPNow = 0
var pk_MPNow = 0
var ek_MPNow = 0
var battleLog={}
var criticalFlag = false //for log display
var koFlag = false

//some static value
var NAME_LIMIT = 32
var COMMENT_LIMIT = 256
var COMMENT_NUM_MAX = 10
var KAIJU_TYPE_MAX = 3
var BATTLELOG_MAX = 7

var ImageUpBound = 20 //px
var ImageLRBound = 30 //px

//State
var STATE_SELECT_MODE=1
//CK: create kaiju
var STATE_CK_INPUT_PKNAME=2
var STATE_CK_STATDISPLAY=3
var STATE_CK_INPUT_PKCOMMENT=4
var STATE_CK_END=5

//VS
var STATE_VS_WAIT_INPUT=6
var STATE_VS_FIGHT=7

var STATE_VS_RESULT = 8

//
function drawSpriteToCanvas(spr,x,y,sx,sy,w,h)
{
	blit(spr,canvas,sx,sy,x,y,w,h) //draw sprite sheet
}

//data for json
var jsonData =
{
	name : "",
	TYPE : 0,
	HEAD: -1,
	LEG: -1,
	HAND: -1,
	HP : 0,
	MP : 0,
	ATK : 0,
	DEF : 0,
	comment : []
}

//change json to ascii-safe, use base64 to encode
function dataToEncString(d)
{
	var jsonstr=JSON.stringify(d)
	jsonstr = jsonstr.replace
	(
		/[\u007f-\uffff]/g,
		function(c)
		{return '\\u'+('0000'+c.charCodeAt(0).toString(16)).slice(-4);}
	)
	
	jsonstr = btoa(jsonstr)
	return jsonstr
}

function encStringToData(estr)
{
	estr = atob(estr)
	//alert(estr)
	return JSON.parse(estr)
}

function updatePlayerCode()
{
	jsonData.name = pk_name
	jsonData.TYPE = pk_TYPE
	jsonData.HEAD = pk_HEAD
	jsonData.LEG = pk_LEG
	jsonData.HAND = pk_HAND
	
	jsonData.HP = pk_HP
	jsonData.MP = pk_MP
	jsonData.ATK = pk_ATK
	jsonData.DEF = pk_DEF
	
	for(i = 0; i < COMMENT_NUM_MAX; i++)
	{
		jsonData.comment[i] = pk_comment[i]
	}
	document.getElementById('pk-code').value = dataToEncString(jsonData)
}

function updatePlayerBitmap()
{
	clear_to_color(pk_Bitmap,makecol(96,96,96));
	blit(objImg,pk_Bitmap,pk_TYPE*16*4,0,16*4,16*4,16*4,16*4)
	
	
	//head
	if (pk_HEAD != -1)
	{
		switch(pk_HEAD)
		{
		case 0:
			switch(pk_TYPE)
			{
			case 0:
				//blit(objImg,pk_Bitmap,0,(pk_TYPE+1)*32,16+sprOffset.T1.H1.x,16+sprOffset.T1.H1.y,16,16)
				blit(objImg,pk_Bitmap,0,(pk_TYPE+1)*128,64+sprOffset.T1.H1.x,64+sprOffset.T1.H1.y,64,64)
				break;
			case 1:
				//blit(objImg,pk_Bitmap,0,(pk_TYPE+1)*32,16+sprOffset.T2.H1.x,16+sprOffset.T2.H1.y,16,16)
				blit(objImg,pk_Bitmap,0,(pk_TYPE+1)*128,64+sprOffset.T2.H1.x,64+sprOffset.T2.H1.y,64,64)
				break;
			case 2:
				//blit(objImg,pk_Bitmap,0,(pk_TYPE+1)*32,16+sprOffset.T3.H1.x,16+sprOffset.T3.H1.y,16,16)
				blit(objImg,pk_Bitmap,0,(pk_TYPE+1)*128,64+sprOffset.T3.H1.x,64+sprOffset.T3.H1.y,64,64)
				break;
			}
			break;
		case 1:
			switch(pk_TYPE)
			{
			case 0:
				//blit(objImg,pk_Bitmap,16,(pk_TYPE+1)*32,16+sprOffset.T1.H2.x,16+sprOffset.T1.H2.y,16,16)
				blit(objImg,pk_Bitmap,64,(pk_TYPE+1)*128,64+sprOffset.T1.H2.x,64+sprOffset.T1.H2.y,64,64)
				break;
			case 1:
				//blit(objImg,pk_Bitmap,16,(pk_TYPE+1)*32,16+sprOffset.T2.H2.x,16+sprOffset.T2.H2.y,16,16)
				blit(objImg,pk_Bitmap,64,(pk_TYPE+1)*128,64+sprOffset.T2.H2.x,64+sprOffset.T2.H2.y,64,64)
				break;
			case 2:
				//blit(objImg,pk_Bitmap,16,(pk_TYPE+1)*32,16+sprOffset.T3.H2.x,16+sprOffset.T3.H2.y,16,16)
				blit(objImg,pk_Bitmap,64,(pk_TYPE+1)*128,64+sprOffset.T3.H2.x,64+sprOffset.T3.H2.y,64,64)
				break;
			}
	
			break;
		case 2:
			switch(pk_TYPE)
			{
			case 0:
				//blit(objImg,pk_Bitmap,32,(pk_TYPE+1)*32,16+sprOffset.T1.H3.x,16+sprOffset.T1.H3.y,16,16)
				blit(objImg,pk_Bitmap,128,(pk_TYPE+1)*128,64+sprOffset.T1.H3.x,64+sprOffset.T1.H3.y,64,64)
				break;
			case 1:
				//blit(objImg,pk_Bitmap,32,(pk_TYPE+1)*32,16+sprOffset.T2.H3.x,16+sprOffset.T2.H3.y,16,16)
				blit(objImg,pk_Bitmap,128,(pk_TYPE+1)*128,64+sprOffset.T2.H3.x,64+sprOffset.T2.H3.y,64,64)
				break;
			case 2:
				//blit(objImg,pk_Bitmap,32,(pk_TYPE+1)*32,16+sprOffset.T3.H3.x,16+sprOffset.T3.H3.y,16,16)
				blit(objImg,pk_Bitmap,128,(pk_TYPE+1)*128,64+sprOffset.T3.H3.x,64+sprOffset.T3.H3.y,64,64)
				break;
			}

			break;
		}
	}
	
	//leg
	if (pk_LEG != -1)
	{
		switch(pk_LEG)
		{
		case 0:
			switch(pk_TYPE)
			{
			case 0:
				//blit(objImg,pk_Bitmap,0,(pk_TYPE*32)+16,16+sprOffset.T1.L1.x,16+sprOffset.T1.L1.y,16,16)
				blit(objImg,pk_Bitmap,0,(pk_TYPE*128)+64,64+sprOffset.T1.L1.x,64+sprOffset.T1.L1.y,64,64)
				break;
			case 1:
				//blit(objImg,pk_Bitmap,0,(pk_TYPE*32)+16,16+sprOffset.T2.L1.x,16+sprOffset.T2.L1.y,16,16)
				blit(objImg,pk_Bitmap,0,(pk_TYPE*128)+64,64+sprOffset.T2.L1.x,64+sprOffset.T2.L1.y,64,64)
				break;
			case 2:
				//blit(objImg,pk_Bitmap,0,(pk_TYPE*32)+16,16+sprOffset.T3.L1.x,16+sprOffset.T3.L1.y,16,16)
				blit(objImg,pk_Bitmap,0,(pk_TYPE*128)+64,64+sprOffset.T3.L1.x,64+sprOffset.T3.L1.y,64,64)
				break;
			}
			break;
		case 1:
			switch(pk_TYPE)
			{
			case 0:
				//blit(objImg,pk_Bitmap,16,(pk_TYPE*32)+16,16+sprOffset.T1.L2.x,16+sprOffset.T1.L2.y,16,16)
				blit(objImg,pk_Bitmap,64,(pk_TYPE*128)+64,64+sprOffset.T1.L2.x,64+sprOffset.T1.L2.y,64,64)
				break;
			case 1:
				//blit(objImg,pk_Bitmap,16,(pk_TYPE*32)+16,16+sprOffset.T2.L2.x,16+sprOffset.T2.L2.y,16,16)
				blit(objImg,pk_Bitmap,64,(pk_TYPE*128)+64,64+sprOffset.T2.L2.x,64+sprOffset.T2.L2.y,64,64)
				break;
			case 2:
				//blit(objImg,pk_Bitmap,16,(pk_TYPE*32)+16,16+sprOffset.T3.L2.x,16+sprOffset.T3.L2.y,16,16)
				blit(objImg,pk_Bitmap,64,(pk_TYPE*128)+64,64+sprOffset.T3.L2.x,64+sprOffset.T3.L2.y,64,64)
				break;
			}
	
			break;
		case 2:
			switch(pk_TYPE)
			{
			case 0:
				//blit(objImg,pk_Bitmap,32,(pk_TYPE*32)+16,16+sprOffset.T1.L3.x,16+sprOffset.T1.L3.y,16,16)
				blit(objImg,pk_Bitmap,128,(pk_TYPE*128)+64,64+sprOffset.T1.L3.x,64+sprOffset.T1.L3.y,64,64)
				break;
			case 1:
				//blit(objImg,pk_Bitmap,32,(pk_TYPE*32)+16,16+sprOffset.T2.L3.x,16+sprOffset.T2.L3.y,16,16)
				blit(objImg,pk_Bitmap,128,(pk_TYPE*128)+64,64+sprOffset.T2.L3.x,64+sprOffset.T2.L3.y,64,64)
				break;
			case 2:
				//blit(objImg,pk_Bitmap,32,(pk_TYPE*32)+16,16+sprOffset.T3.L3.x,16+sprOffset.T3.L3.y,16,16)
				blit(objImg,pk_Bitmap,128,(pk_TYPE*128)+64,64+sprOffset.T3.L3.x,64+sprOffset.T3.L3.y,64,64)
				break;
			}

			break;
		}
	}
	
	//hand
	if (pk_HAND != -1)
	{
		switch(pk_HAND)
		{
		case 0:
			//blit(obj2Img,pk_Bitmap,0,(pk_TYPE*48),0,16,48,16)
			blit(obj2Img,pk_Bitmap,0,(pk_TYPE*192),0,64,192,64)
			break;
		case 1:
			//blit(obj2Img,pk_Bitmap,0,(pk_TYPE*48)+16,0,16,48,16)
			blit(obj2Img,pk_Bitmap,0,(pk_TYPE*192)+64,0,64,192,64)
			break;
		case 2:
			//blit(obj2Img,pk_Bitmap,0,(pk_TYPE*48)+32,0,16,48,16)
			blit(obj2Img,pk_Bitmap,0,(pk_TYPE*192)+128,0,64,192,64)
			break;
		}
	}
}

function updateEnemyBitmap()
{
	clear_to_color(ek_Bitmap,makecol(96,96,96));
	//blit(objImg,ek_Bitmap,ek_TYPE*16,0,16,16,16,16)
	blit(objImg,ek_Bitmap,ek_TYPE*64,0,64,64,64,64)
	
	
	//head
	if (ek_HEAD != -1)
	{
		switch(ek_HEAD)
		{
		case 0:
			switch(ek_TYPE)
			{
			case 0:
				//blit(objImg,ek_Bitmap,0,(ek_TYPE+1)*32,16+sprOffset.T1.H1.x,16+sprOffset.T1.H1.y,16,16)
				blit(objImg,ek_Bitmap,0,(ek_TYPE+1)*128,64+sprOffset.T1.H1.x,64+sprOffset.T1.H1.y,64,64)
				break;
			case 1:
				//blit(objImg,ek_Bitmap,0,(ek_TYPE+1)*32,16+sprOffset.T2.H1.x,16+sprOffset.T2.H1.y,16,16)
				blit(objImg,ek_Bitmap,0,(ek_TYPE+1)*128,64+sprOffset.T2.H1.x,64+sprOffset.T2.H1.y,64,64)
				break;
			case 2:
				//blit(objImg,ek_Bitmap,0,(ek_TYPE+1)*32,16+sprOffset.T3.H1.x,16+sprOffset.T3.H1.y,16,16)
				blit(objImg,ek_Bitmap,0,(ek_TYPE+1)*128,64+sprOffset.T3.H1.x,64+sprOffset.T3.H1.y,64,64)
				break;
			}
			break;
		case 1:
			switch(ek_TYPE)
			{
			case 0:
				//blit(objImg,ek_Bitmap,16,(ek_TYPE+1)*32,16+sprOffset.T1.H2.x,16+sprOffset.T1.H2.y,16,16)
				blit(objImg,ek_Bitmap,64,(ek_TYPE+1)*128,64+sprOffset.T1.H2.x,64+sprOffset.T1.H2.y,64,64)
				break;
			case 1:
				//blit(objImg,ek_Bitmap,16,(ek_TYPE+1)*32,16+sprOffset.T2.H2.x,16+sprOffset.T2.H2.y,16,16)
				blit(objImg,ek_Bitmap,64,(ek_TYPE+1)*128,64+sprOffset.T2.H2.x,64+sprOffset.T2.H2.y,64,64)
				break;
			case 2:
				//blit(objImg,ek_Bitmap,16,(ek_TYPE+1)*32,16+sprOffset.T3.H2.x,16+sprOffset.T3.H2.y,16,16)
				blit(objImg,ek_Bitmap,64,(ek_TYPE+1)*128,64+sprOffset.T3.H2.x,64+sprOffset.T3.H2.y,64,64)
				break;
			}
	
			break;
		case 2:
			switch(ek_TYPE)
			{
			case 0:
				//blit(objImg,ek_Bitmap,32,(ek_TYPE+1)*32,16+sprOffset.T1.H3.x,16+sprOffset.T1.H3.y,16,16)
				blit(objImg,ek_Bitmap,128,(ek_TYPE+1)*128,64+sprOffset.T1.H3.x,64+sprOffset.T1.H3.y,64,64)
				break;
			case 1:
				//blit(objImg,ek_Bitmap,32,(ek_TYPE+1)*32,16+sprOffset.T2.H3.x,16+sprOffset.T2.H3.y,16,16)
				blit(objImg,ek_Bitmap,128,(ek_TYPE+1)*128,64+sprOffset.T2.H3.x,64+sprOffset.T2.H3.y,64,64)
				break;
			case 2:
				//blit(objImg,ek_Bitmap,32,(ek_TYPE+1)*32,16+sprOffset.T3.H3.x,16+sprOffset.T3.H3.y,16,16)
				blit(objImg,ek_Bitmap,128,(ek_TYPE+1)*128,64+sprOffset.T3.H3.x,64+sprOffset.T3.H3.y,64,64)
				break;
			}

			break;
		}
	}
	
	//leg
	if (ek_LEG != -1)
	{
		switch(ek_LEG)
		{
		case 0:
			switch(ek_TYPE)
			{
			case 0:
				//blit(objImg,ek_Bitmap,0,(ek_TYPE*32)+16,16+sprOffset.T1.L1.x,16+sprOffset.T1.L1.y,16,16)
				blit(objImg,ek_Bitmap,0,(ek_TYPE*128)+64,64+sprOffset.T1.L1.x,64+sprOffset.T1.L1.y,64,64)
				break;
			case 1:
				//blit(objImg,ek_Bitmap,0,(ek_TYPE*32)+16,16+sprOffset.T2.L1.x,16+sprOffset.T2.L1.y,16,16)
				blit(objImg,ek_Bitmap,0,(ek_TYPE*128)+64,64+sprOffset.T2.L1.x,64+sprOffset.T2.L1.y,64,64)
				break;
			case 2:
				//blit(objImg,ek_Bitmap,0,(ek_TYPE*32)+16,16+sprOffset.T3.L1.x,16+sprOffset.T3.L1.y,16,16)
				blit(objImg,ek_Bitmap,0,(ek_TYPE*128)+64,64+sprOffset.T3.L1.x,64+sprOffset.T3.L1.y,64,64)
				break;
			}
			break;
		case 1:
			switch(ek_TYPE)
			{
			case 0:
				//blit(objImg,ek_Bitmap,16,(ek_TYPE*32)+16,16+sprOffset.T1.L2.x,16+sprOffset.T1.L2.y,16,16)
				blit(objImg,ek_Bitmap,64,(ek_TYPE*128)+64,64+sprOffset.T1.L2.x,64+sprOffset.T1.L2.y,64,64)
				break;
			case 1:
				//blit(objImg,ek_Bitmap,16,(ek_TYPE*32)+16,16+sprOffset.T2.L2.x,16+sprOffset.T2.L2.y,16,16)
				blit(objImg,ek_Bitmap,64,(ek_TYPE*128)+64,64+sprOffset.T2.L2.x,64+sprOffset.T2.L2.y,64,64)
				break;
			case 2:
				//blit(objImg,ek_Bitmap,16,(ek_TYPE*32)+16,16+sprOffset.T3.L2.x,16+sprOffset.T3.L2.y,16,16)
				blit(objImg,ek_Bitmap,64,(ek_TYPE*128)+64,64+sprOffset.T3.L2.x,64+sprOffset.T3.L2.y,64,64)
				break;
			}
	
			break;
		case 2:
			switch(ek_TYPE)
			{
			case 0:
				//blit(objImg,ek_Bitmap,32,(ek_TYPE*32)+16,16+sprOffset.T1.L3.x,16+sprOffset.T1.L3.y,16,16)
				blit(objImg,ek_Bitmap,128,(ek_TYPE*128)+64,64+sprOffset.T1.L3.x,64+sprOffset.T1.L3.y,64,64)
				break;
			case 1:
				//blit(objImg,ek_Bitmap,32,(ek_TYPE*32)+16,16+sprOffset.T2.L3.x,16+sprOffset.T2.L3.y,16,16)
				blit(objImg,ek_Bitmap,128,(ek_TYPE*128)+64,64+sprOffset.T2.L3.x,64+sprOffset.T2.L3.y,64,64)
				break;
			case 2:
				//blit(objImg,ek_Bitmap,32,(ek_TYPE*32)+16,16+sprOffset.T3.L3.x,16+sprOffset.T3.L3.y,16,16)
				blit(objImg,ek_Bitmap,128,(ek_TYPE*128)+64,64+sprOffset.T3.L3.x,64+sprOffset.T3.L3.y,64,64)
				break;
			}

			break;
		}
	}
	
	//hand
	if (ek_HAND != -1)
	{
		switch(ek_HAND)
		{
		case 0:
			//blit(obj2Img,ek_Bitmap,0,(ek_TYPE*48),0,16,48,16)
			blit(obj2Img,ek_Bitmap,0,(ek_TYPE*192),0,64,192,64)
			break;
		case 1:
			//blit(obj2Img,ek_Bitmap,0,(ek_TYPE*48)+16,0,16,48,16)
			blit(obj2Img,ek_Bitmap,0,(ek_TYPE*192)+64,0,64,192,64)
			break;
		case 2:
			//blit(obj2Img,ek_Bitmap,0,(ek_TYPE*48)+32,0,16,48,16)
			blit(obj2Img,ek_Bitmap,0,(ek_TYPE*192)+128,0,64,192,64)
			break;
		}
	}
}

function drawPK()
{
	//stretch_blit(pk_Bitmap,canvas,0,0,48,48,ImageLRBound,ImageUpBound,48*4,48*4)
	stretch_blit(pk_Bitmap,canvas,0,0,48*4,48*4,ImageLRBound,ImageUpBound,48*4,48*4)
}

function drawEK()
{
	stretch_blit(ek_Bitmap,canvas,0,0,48*4,48*4,640-(ImageLRBound+(48*4)),ImageUpBound,48*4,48*4)
}


function showCKInfo()
{
	//Show day, and kaiju info
	var x = ImageLRBound, y = 250
	
	if(NowGameState == STATE_CK_INPUT_PKNAME)
	{
		textout(canvas,font,"Day 0",x,y,15,fontColor);
		y = y+20
		textout(canvas,font,"name: null exception",x,y,15,fontColor);
		y = y+20
		y = y+20
		textout(canvas,font,"You noticed there is a Kaiju egg on your desktop...",x,y,15,fontColor);	
		y=y+20
		textout(canvas,font,"You want to a kaiju for a long time, it's time to become a kaiju master.",x,y,15,fontColor);	
		y=y+20
		textout(canvas,font,"But first...your new friend need a name.",x,y,15,fontColor);	
		y=y+20
		textout(canvas,font,"Press space to continue",x,y,15,fontColor);
		
	}
	else
	{
		if(nowComment != COMMENT_NUM_MAX)
			textout(canvas,font,"Day "+(nowComment+1),x,y,15,fontColor);
		y = y+20
		textout(canvas,font,"name: "+pk_name,x,y,15,fontColor);
		y = y+20

		//info
		textout(canvas,font,"HP: "+pk_HP,x,y,15,fontColor);
		y = y+20
		
		textout(canvas,font,"MP: "+pk_MP,x,y,15,fontColor);
		y = y+20
		
		textout(canvas,font,"ATK: "+pk_ATK,x,y,15,fontColor);
		y = y+20
		
		textout(canvas,font,"DEF: "+pk_DEF,x,y,15,fontColor);
		y = y+20
		y = y+20
		if (nowComment==3 || nowComment == 5 || nowComment == 8)
		{
			textout(canvas,font,"Your kaiju seems like got a new power.",x,y,15,fontColor)
			y=y+20
		}
	
		if(nowComment <3)
		{
			textout(canvas,font,"Hey, why don't you talk with it, it looks so longly",x,y,15,fontColor);
			y=y+20
		}
		
		if(nowComment == COMMENT_NUM_MAX)
		{
			textout(canvas,font,"Good job!! You made it.",x,y,15,fontColor);
			y=y+20
			textout(canvas,font,"Now you can use your code let your kaiju fight with other!!",x,y,15,fontColor);
			y=y+20
		}
		//textout(canvas,font,"hint: Your",x,y,15,fontColor);
		//y=y+20
		textout(canvas,font,"Press space to continue",x,y,15,fontColor);
	}
	
	
}

function showVSInfo()
{
	//Show pk & ek data
	var x = ImageLRBound, y = 250
	textout(canvas,font,"HP: "+pk_HPNow,x,y,15,fontColor)
	textout(canvas,font,"HP: "+ek_HPNow,640-x-48*4,y,15,fontColor)
	y = y+20
	
	textout(canvas,font,"MP: "+pk_MPNow,x,y,15,fontColor)
	textout(canvas,font,"MP: "+ek_MPNow,640-x-48*4,y,15,fontColor)
	y = y+20
	
	textout(canvas,font,"ATK: "+pk_ATK,x,y,15,fontColor)
	textout(canvas,font,"ATK: "+ek_ATK,640-x-48*4,y,15,fontColor)
	y = y+20
	
	textout(canvas,font,"DEF: "+pk_DEF,x,y,15,fontColor)
	textout(canvas,font,"DEF: "+ek_DEF,640-x-48*4,y,15,fontColor)
	y = y+20
}

function showBattleLog()
{
	var x = ImageLRBound, y = 350
	for(i=0; i<BATTLELOG_MAX; i++)
	{
		textout(canvas,font,battleLog[i],x,y,15,fontColor)
		y = y+20
	
	}
	
	/*textout(canvas,font,"L1",x,y,15,fontColor)
	y = y+20
	textout(canvas,font,"L2",x,y,15,fontColor)
	y = y+20
	textout(canvas,font,"L3",x,y,15,fontColor)
	y = y+20
	textout(canvas,font,"L4",x,y,15,fontColor)
	y = y+20
	textout(canvas,font,"L5",x,y,15,fontColor)
	y = y+20
	textout(canvas,font,"L6",x,y,15,fontColor)
	y = y+20
	textout(canvas,font,"L77",x,y,15,fontColor)
	y = y+20*/
}

//basic calculate function
function gameVarInit()
{
	font = create_font("monospace"); //change default font to monospace
	nowComment = 0
	NowGameState = STATE_SELECT_MODE
	
	for(i=0; i < COMMENT_NUM_MAX; i++)
	{
		pk_comment[i] = ""
		ek_comment[i] = ""
		jsonData.comment[i] = ""
	}
	
	for(i=0; i < BATTLELOG_MAX; i++)
	{
		battleLog[i] = ""
	}
	
	//load image
	dummySprite = load_bitmap("dummy.png")
	titleImg = load_bitmap("title.png")
	//objImg = load_bitmap("object.png")
	objImg = load_bitmap("Bobject.png")
	//obj2Img = load_bitmap("object2.png")
	obj2Img = load_bitmap("Bobject2.png")
	eggImg = load_bitmap("Begg.png")
	fightNoise = load_sample("kaijufight.wav")
	evolveSE = load_sample("evolve.wav")
	
	//pk_Bitmap = create_bitmap(48,48)
	//ek_Bitmap = create_bitmap(48,48)
	pk_Bitmap = create_bitmap(48*4,48*4)
	ek_Bitmap = create_bitmap(48*4,48*4)
	
}

function resetData()
{
	pk_name = ""

	pk_TYPE = 0
	pk_HEAD = -1
	pk_LEG = -1
	pk_HAND = -1

	pk_HP = 0
	pk_MP = 0
	pk_ATK = 0
	pk_DEF = 0
	pk_comment = []


	ek_name = ""

	ek_TYPE = 0
	ek_HEAD = -1
	ek_LEG = -1
	ek_HAND = -1

	ek_HP = 0
	ek_MP = 0
	ek_ATK = 0
	ek_DEF = 0
	ek_comment = []

	//CK data
	nowComment = 0
}

function battleVarInit()
{
	
}

function getRandomNumber()
{
   return 4; // chosen by fair dice roll.
             // guaranteed to be random.
}

function myRandomNumber(n) //between 0~32767
{
	n = (n * 63481) + 79321    //real random number
	if (isNaN(n) == true)
		n = 4382
	return n%32768;
}

function getKaijuType(v)
{
	v = v * getRandomNumber()
	if (isNaN(v)==true)
		return getRandomNumber() % KAIJU_TYPE_MAX
	else
		return v % KAIJU_TYPE_MAX
}

function setPKData(d)
{
	pk_name = d.name
	pk_TYPE = d.TYPE
	pk_HEAD = d.HEAD
	pk_LEG = d.LEG
	pk_HAND = d.HAND
	pk_HP = d.HP
	pk_MP = d.MP
	pk_ATK = d.ATK
	pk_DEF = d.DEF
}

function setEKData(d)
{
	ek_name = d.name
	ek_TYPE = d.TYPE
	ek_HEAD = d.HEAD
	ek_LEG = d.LEG
	ek_HAND = d.HAND
	ek_HP = d.HP
	ek_MP = d.MP
	ek_ATK = d.ATK
	ek_DEF = d.DEF
}
//stat:  max 255, start between 5~19
//basic stat
function setInitStat(v)
{
	v = v * getRandomNumber()
	if (isNaN(v) == true)
		v = getRandomNumber()
	v = myRandomNumber(v)
	pk_HP = (v % 15) + 5
	v = myRandomNumber(v)
	pk_MP = (v % 15) + 5
	v = myRandomNumber(v)
	pk_ATK = (v % 15) + 5
	v = myRandomNumber(v)
	pk_DEF = (v % 15) + 5
}

function calNextInfo(ran,v)
{
	if (v < 80)
	{
		return (ran%45)+5
	}
	else if(v >=80 && v < 120)
	{
		return (ran%15)+5
	}
	else if(v >=120 && v < 200)
	{
		return (ran%50)-20
	}
	else if(v >= 200)
	{
		if(ran < 984)
		{
			return (ran%15)+15
		}
		else
		{
			return (ran%15)-29
		}
	}
	return 0
}

function setNextInfo(v)
{
	//TODO:
	
	//before 80, value up range is 5~49
	//80~120, value up range is 5~19
	//120~200, value up range is -20~29
	//over200, value up change only 3%, range is 15~39, 97% -29~-15
	v = v * getRandomNumber()
	if (isNaN(v) == true)
		v = getRandomNumber()
	v = myRandomNumber(v)
	
	pk_HP = pk_HP + calNextInfo(v,pk_HP)
	v = myRandomNumber(v)
	pk_MP = pk_MP + calNextInfo(v,pk_MP)
	v = myRandomNumber(v)
	pk_ATK = pk_ATK + calNextInfo(v,pk_ATK)
	v = myRandomNumber(v)
	pk_DEF = pk_DEF + calNextInfo(v,pk_DEF)
}

function calDmg(a,d)
{
	var d = a - d
	if (d < 0)
		d = 0
	d = d + (rand()%8) + 1
	if (rand() < 3000) //about 4.5%
	{
		d = Math.floor(d * 1.5)
		criticalFlag = true
	}
	return d
}

function pushBattleLog(str)
{
	for(i = BATTLELOG_MAX; i > 1; i--)
	{
		battleLog[i-1] = battleLog[i-2]
	}
	battleLog[0] = str
}

//game flow function
function playerInputName()
{
	var nameCheck = true
	do
	{
		pk_name = prompt('Input your Kaiju name (Max 32 character)')
		key[KEY_SPACE] = false
		if (!pk_name)
		{
			alert("Error: Please input name.")
			nameCheck = false
		}
		else
		{
			if (pk_name.length > NAME_LIMIT)
			{
				alert("Error: Input name too long.")
				nameCheck = false
			}
			else if(pk_name.length == 0)
			{
				alert("Error: Please input name.")
				nameCheck = false
			}
			else
				nameCheck = true
		}
		
	}while(nameCheck == false)
	
	var nameLen = pk_name.length
	var nameValue = 0
	
	for(i=0; i<nameLen; i++)
	{
		nameValue = nameValue+(pk_name.charCodeAt(i) * i)
	}
	pk_TYPE = getKaijuType(nameValue)
	
	//TODO: put image to pk bitmap
	//clear_to_color(pk_Bitmap,makecol(96,96,96));
	//blit(objImg,pk_Bitmap,pk_TYPE*16,0,16,16,16,16)
	updatePlayerBitmap()
	
	setInitStat(nameValue)
}

//Use name to decide type and base stat
function playerInputComment()
{
	var stringCheck = true
	var comment = ""
	do
	{
		comment = prompt('Input your comment (Max 256 character)')
		key[KEY_SPACE] = false
		if (!comment)
		{
			alert("Error: Please say something to your KaiJu")
			stringCheck = false
		}
		else
		{
			if (comment.length > COMMENT_LIMIT)
			{
				alert("Error: Input comment too long")
				stringCheck = false
			}
			else if (comment.length == 0)
			{
				alert("Error: Please say something to your KaiJu")
				stringCheck = false
			}
			else
				stringCheck = true
		}
	}while(stringCheck == false)
	
	//TODO: check string value, cal kaiju stat
	var commentLen = comment.length
	commentValue = 0
	for(i = 0; i < comment.length; i++)
	{
		var nowType = i % 3
		var dis = 0
		if (nowType == 0)
		{
			dis = comment.charCodeAt(i) % 255
		}
		else if (nowType == 1)
		{
			dis = comment.charCodeAt(i) * i
		}
		else if (nowType == 2)
		{
			dis = comment.charCodeAt(i) * nowType
		}
		else
			dis = 0		
		commentValue = commentValue + dis
	}
	setNextInfo(commentValue)
	pk_comment[nowComment] = comment
	nowComment = nowComment + 1
	//TODO: get body
	
	//use kaiju info decide what you get
	if (nowComment == 3) //head
	{
		if (pk_HP > 110)
			pk_HEAD = 0
		else if(pk_DEF > 95)
			pk_HEAD = 1
		else
			pk_HEAD = 2
		play_sample(evolveSE)
	}
	else if (nowComment == 5) //leg
	{
		if (pk_MP > 120)
			pk_LEG = 1
		else if(pk_HP < 140)
			pk_LEG = 2
		else
			pk_LEG = 0
		play_sample(evolveSE)
	}
	else if (nowComment == 8) //body
	{
		if (pk_ATK > 180)
			pk_HAND = 2
		else if(pk_DEF < 150)
			pk_HAND = 1
		else
			pk_HAND = 0
		play_sample(evolveSE)
	}
	updatePlayerBitmap()
	
}


function checkIsVaildData(s)
{
	return true
	if(s && s.name && s.TYPE && s.HEAD && s.LEG && s.HAND && s.HP && s.MP && s.ATK && s.DEF)
		return true
	return false
}

function checkVSInput(useNowPlayer)
{
	if (useNowPlayer)
	{
	}
	else
	{
		var s = encStringToData(document.getElementById('pk-code').value)
		/*pk_name = s.name
		pk_TYPE = s.TYPE
		pk_HP = s.HP
		pk_MP = s.MP
		pk_ATK = s.ATK
		pk_DEF = s.DEF*/
		if(checkIsVaildData(s))
			setPKData(s)
		else
			return
	}
	
	//enemy
	var s = encStringToData(document.getElementById('ek-code').value)
	/*ek_name = s.name
	ek_TYPE = s.TYPE
	ek_HP = s.HP
	ek_MP = s.MP
	ek_ATK = s.ATK
	ek_DEF = s.DEF*/
	if (checkIsVaildData(s))
		setEKData(s)
	else
		return
	
	updatePlayerBitmap()
	updateEnemyBitmap()
	//init battle data
	pk_HPNow = pk_HP
	pk_MPNow = pk_MP
	ek_HPNow = ek_HP
	ek_MPNow = ek_MP
	
	for(i=0; i < BATTLELOG_MAX; i++)
	{
		battleLog[i] = ""
	}
	koFlag = false
	criticalFlag = false
	
	NowGameState = STATE_VS_FIGHT
	//TODO: check data vaild
}


function battleNextRound()
{
	//roll dice for who attack first //add spd system next time
	if (rand() % 2 == 0) //player
	{
		var d = calDmg(pk_ATK,ek_DEF)
		ek_HPNow = ek_HPNow - d
		if (criticalFlag)
		{
			criticalFlag = false
			pushBattleLog("CRITICAL!! Player "+pk_name+" attack enemy "+ek_name+", "+d+" dmg.")		
		}
		else
			pushBattleLog("Player "+pk_name+" attack enemy "+ek_name+", "+d+" dmg.")		
			
		if(rand()>58980) //about 10%
		{
			if(ek_MPNow>=10)
			{
				ek_HPNow = ek_HPNow + d
				ek_MPNow = ek_MPNow-10
				pushBattleLog("Enemy "+ek_name+" uses auto cure, "+d+" dmg restore.")
			}
		}
		if(ek_HPNow <= 0)
		{
			//go winner
			ek_HPNow = 0
			koFlag = true
		}
		else
		{
			d = calDmg(ek_ATK,pk_DEF)
			pk_HPNow = pk_HPNow - d
			if (criticalFlag)
			{
				criticalFlag = false
				pushBattleLog("CRITICAL!! Enemy "+ek_name+" attack player "+pk_name+", "+d+" dmg.")
			}
			else
				pushBattleLog("Enemy "+ek_name+" attack player "+pk_name+", "+d+" dmg.")
			if(pk_HPNow <= 0)
			{
				//go loser
				pk_HPNow = 0
				koFlag = true
			}
		}
		
	}
	else //enemy
	{
		var d = calDmg(ek_ATK,pk_DEF)
		pk_HPNow = pk_HPNow - d
		if (criticalFlag)
		{
			criticalFlag = false
			pushBattleLog("CRITICAL!! Enemy "+ek_name+" attack player "+pk_name+", "+d+" dmg.")
		}
		else
			pushBattleLog("Enemy "+ek_name+" attack player "+pk_name+", "+d+" dmg.")
		if(rand()>58980) //about 10%
		{
			if(pk_MPNow>=10)
			{
				pk_HPNow = pk_HPNow + d
				pk_MPNow = pk_MPNow-10
				pushBattleLog("Player "+pk_name+" uses auto cure, "+d+" dmg restore.")
			}
		}
		if(pk_HPNow <= 0)
		{
			//go loser
			pk_HPNow = 0
			koFlag = true
		}
		else
		{
			d = calDmg(pk_ATK,ek_DEF)
			ek_HPNow = ek_HPNow - d
			if (criticalFlag)
			{
				criticalFlag = false
				pushBattleLog("CRITICAL!! Player "+pk_name+" attack enemy "+ek_name+", "+d+" dmg.")		
			}
			else
				pushBattleLog("Player "+pk_name+" attack enemy "+ek_name+", "+d+" dmg.")
			if(ek_HPNow <= 0)
			{
				//go winner
				ek_HPNow = 0
				koFlag = true
			}
		}
	}
	
}
//TODO: hash function to change value





//function play


function draw()
{
	//textout(canvas,font,name+" Type check:"+getKaijuType(nameChange),x,y,24,makecol(0,0,0));
	//draw_sprite(canvas,dummySprite,200,200)
	//pivot_sprite(canvas,dummySprite,200,200,
	//blit(dummySprite,canvas,0,0,0,0,64,64) //draw sprite sheet
	clear_to_color(canvas,makecol(0,0,0));
	switch(NowGameState)
	{
	case STATE_SELECT_MODE:
		clear_to_color(canvas,makecol(255,255,255));
		draw_sprite(canvas,titleImg,320,240)
		break;
		
	case STATE_CK_INPUT_PKNAME:
		drawPK()
		showCKInfo()
		break;
		
	case STATE_CK_STATDISPLAY:
		//scaled_sprite(canvas,pk_Bitmap,200,200,4,4)
		showCKInfo()
		drawPK()
		break;
		
	case STATE_CK_INPUT_PKCOMMENT:
		showCKInfo()
		drawPK()
		break;
		
	case STATE_CK_END:
		showCKInfo()
		drawPK()
		break;
		
	case STATE_VS_WAIT_INPUT:
		textout(canvas,font,"Wait code input",x,y,15,fontColor);
		textout(canvas,font,"Press Space to continue",x,y+20,15,fontColor)
		
		drawPK()
		drawEK()
		break;

	case STATE_VS_FIGHT:
		showVSInfo()
		showBattleLog()
		drawPK()
		drawEK()
		break;
		
	case STATE_VS_RESULT:
		if(pk_HPNow == 0)
		{
			drawEK()
			textout(canvas,font,"Winner: " + ek_name,20,350,15,fontColor);
		}
		else
		{
			drawPK()
			textout(canvas,font,"Winner:" + pk_name,20,350,15,fontColor);
		}
		
	default:
		break;
	}
}

function update()
{
//TODO: mouse
	switch(NowGameState)
	{
	case STATE_SELECT_MODE:
		//press C to CK, press L to VS
		
		if ((mouse_x >=19 && mouse_x <= 290 && mouse_y >= 368 && mouse_y <= 437 && mouse_pressed) || (pressed[KEY_C]))
		{
			resetData()
			NowGameState = STATE_CK_INPUT_PKNAME
			clear_to_color(pk_Bitmap,makecol(96,96,96));
			blit(eggImg,pk_Bitmap,0,0,32,32,128,128)
		}
		if ((mouse_x >=351 && mouse_x <= 621 && mouse_y >= 367 && mouse_y <= 437 && mouse_pressed) || (pressed[KEY_L]))
		{
			resetData()
			NowGameState = STATE_VS_WAIT_INPUT
			clear_to_color(pk_Bitmap,makecol(0,0,0));
			clear_to_color(ek_Bitmap,makecol(0,0,0));
		}
		break;
		
	case STATE_CK_INPUT_PKNAME:
		if (pressed[KEY_SPACE])
		{
			playerInputName()  //init p-kaiju
			NowGameState = STATE_CK_STATDISPLAY
		}
		break;
		
	case STATE_CK_STATDISPLAY:
		if (pressed[KEY_SPACE])
			NowGameState = STATE_CK_INPUT_PKCOMMENT
		break;
		
	case STATE_CK_INPUT_PKCOMMENT:
	
		//check go end
		playerInputComment()
		if (nowComment == COMMENT_NUM_MAX)
		{
			//update p-code
			updatePlayerCode()
			NowGameState = STATE_CK_END
		}
		else
			NowGameState = STATE_CK_STATDISPLAY
		break;
		
	case STATE_CK_END:
		//if (pressed[KEY_A])
		if (pressed[KEY_SPACE])
		{
			//jsonData = encStringToData(document.getElementById('pk-code').value)
			NowGameState = STATE_SELECT_MODE
		}
		break;
	
	case STATE_VS_WAIT_INPUT:
		if (pressed[KEY_SPACE])
			checkVSInput(false)
		break;
	
	case STATE_VS_FIGHT:
	
		if(koFlag == true && fightNoise.element.paused == true)
		{
			if(pressed[KEY_SPACE])
				NowGameState = STATE_VS_RESULT
		}
		else if(fightNoise.element.paused == true)
		{
			if (pressed[KEY_SPACE])
			{
				play_sample(fightNoise)
				battleNextRound()
			}
		}
			
		break;
		
	case STATE_VS_RESULT:
		if (pressed[KEY_SPACE])
			NowGameState = STATE_SELECT_MODE
		break;
	
	default:
		break;
	}
}

function main()
{
	//enable_debug('debug');
	allegro_init_all("game_canvas", 640, 480,false);
	gameVarInit()
	ready(function(){
		loop(function(){
			update();
			draw();
		},BPS_TO_TIMER(60));
	});
	return 0;
}
END_OF_MAIN();

 