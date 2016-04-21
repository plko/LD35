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

var pk_FlickCount = 30 
var ek_FlickCount = 30 
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

var d_HP = 0
var d_MP = 0
var d_ATK = 0
var d_DEF = 0
//Battle data
var pk_HPNow = 0
var ek_HPNow = 0
var pk_MPNow = 0
var ek_MPNow = 0
var battleLog={}
var criticalFlag = false //for log display
var koFlag = false

var pk_MB = 0 //Metallic body
var ek_MB = 0

var battleInfo = //For ani display. record what happen in this round
{
	count : 0,
	nowCount : -1,
	type : {},   //event type, use string.
	//PAE
	//EAP
	//PAEC
	//EAPC
	//EM1
	//PM1
	//PW
	//EW
	
	value : {}  //event value (dmg etc.)
}
function pushBattleInfo(t,v)
{
	battleInfo.type[battleInfo.count] = t
	battleInfo.value[battleInfo.count] = v
	battleInfo.count = battleInfo.count+1
}


//some static value
var NAME_LIMIT = 32
var COMMENT_LIMIT = 256
var COMMENT_NUM_MAX = 10
var KAIJU_TYPE_MAX = 3
var BATTLELOG_MAX = 7

var ImageUpBound = 20 //px
var ImageLRBound = 30 //px

var MP_ABSORB = 25
var MP_CURE = 15
var MP_MB = 20
//State
var STATE_SELECT_MODE=1
//CK: create kaiju
var STATE_CK_INPUT_PKNAME=2
var STATE_CK_STATDISPLAY=3
var STATE_CK_INPUT_PKCOMMENT=4
var STATE_CK_END=5

var STATE_CK_SHOWCHANGE = 10
//VS
var STATE_VS_WAIT_INPUT=6
var STATE_VS_FIGHT=7

var STATE_VS_RESULT = 8

var STATE_VS_SHOWANI = 9

var STATE_VS_SHOWPK = 11
var STATE_VS_SHOWEK = 12
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
	if (pk_FlickCount >= 30)
	{
		stretch_blit(pk_Bitmap,canvas,0,0,48*4,48*4,ImageLRBound,ImageUpBound,48*4,48*4)
		
	}
	else if( (pk_FlickCount>=0 && pk_FlickCount <= 4) || (pk_FlickCount>=10 && pk_FlickCount <= 14) || (pk_FlickCount >=20 && pk_FlickCount <= 24) )
	{
		stretch_blit(pk_Bitmap,canvas,0,0,48*4,48*4,ImageLRBound,ImageUpBound,48*4,48*4)
		pk_FlickCount = pk_FlickCount+1
	}
	else if( (pk_FlickCount>=5 && pk_FlickCount <= 9) || (pk_FlickCount>=15 && pk_FlickCount<=19) || (pk_FlickCount >=25 && pk_FlickCount<=29))
	{
		pk_FlickCount = pk_FlickCount+1
	}
}

function drawEK()
{
	if (ek_FlickCount >= 30)
	{
		stretch_blit(ek_Bitmap,canvas,0,0,48*4,48*4,640-(ImageLRBound+(48*4)),ImageUpBound,48*4,48*4)
		
	}
	else if( (ek_FlickCount>=0 && ek_FlickCount <= 4) || (ek_FlickCount>=10 && ek_FlickCount <= 14) || (ek_FlickCount >=20 && ek_FlickCount <= 24) )
	{
		stretch_blit(ek_Bitmap,canvas,0,0,48*4,48*4,640-(ImageLRBound+(48*4)),ImageUpBound,48*4,48*4)
		ek_FlickCount = ek_FlickCount+1
	}
	else if( (ek_FlickCount>=5 && ek_FlickCount <= 9) || (ek_FlickCount>=15 && ek_FlickCount<=19) || (ek_FlickCount >=25 && ek_FlickCount<=29))
	{
		ek_FlickCount = ek_FlickCount+1
	}
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
	
	else if(NowGameState == STATE_CK_SHOWCHANGE)
	{
		textout(canvas,font,"Day "+(nowComment),x,y,15,fontColor);
		y=y+20
		textout(canvas,font,"name: "+pk_name,x,y,15,fontColor);
		y = y+20

		//info
		textout(canvas,font,"HP: "+(pk_HP-d_HP)+" -> "+pk_HP,x,y,15,fontColor);
		y = y+20 
		
		textout(canvas,font,"MP: "+(pk_MP-d_MP)+" -> "+pk_MP,x,y,15,fontColor);
		y = y+20
		
		textout(canvas,font,"ATK: "+(pk_ATK-d_ATK)+" -> "+pk_ATK,x,y,15,fontColor);
		y = y+20
		
		textout(canvas,font,"DEF: "+(pk_DEF-d_DEF)+" -> "+pk_DEF,x,y,15,fontColor);
		y=y+40
		
		textout(canvas,font,"「"+pk_comment[nowComment-1]+"」 You say to your kaiju.",x,y,15,fontColor)
		y = y+20
		
		if (nowComment==3 || nowComment == 5 || nowComment == 8)
		{
			textout(canvas,font,"Your kaiju seems like got a new power.",x,y,15,fontColor)
			y=y+20
		}
		else
		{
			//say something...?
		}
		
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
	
		if(nowComment <3)
		{
			textout(canvas,font,"Hey, why don't you talk with it, it looks so lonely",x,y,15,fontColor);
			y=y+20
		}
		
		else if(nowComment < 5)
		{
			textout(canvas,font,"Still growing...it looks so cute...",x,y,15,fontColor);
			y=y+20
		}
		
		else if(nowComment < 8)
		{
			textout(canvas,font,"I can't wait to see the final form of your kaiju",x,y,15,fontColor);
			y=y+20
		}
		
		else if (nowComment < COMMENT_NUM_MAX)
		{
			textout(canvas,font,"Almost done, a ultimate kaiju...",x,y,15,fontColor);
			y=y+20
		}
		
		if(nowComment == COMMENT_NUM_MAX)
		{
			textout(canvas,font,"Good job!! You made it.",x,y,15,fontColor);
			y=y+20
			textout(canvas,font,"Now you can use your code let your kaiju fight with other!!",x,y,15,fontColor);
			y=y+20
			
			var cx = ImageLRBound + 220
			var cy = ImageUpBound
			textout(canvas,font,"What you say to your kaiju",cx,cy,15,fontColor);
			cy = cy+20
			for(c = 0; c<10; c++)
			{
				textout(canvas,font,"「"+pk_comment[c]+"」",cx,cy,15,fontColor)
				cy=cy+20
			}
			
		}
		//textout(canvas,font,"hint: Your",x,y,15,fontColor);
		//y=y+20
		textout(canvas,font,"Press space to continue",x,y,15,fontColor);
	}
	
	
}

function showPKData() //with comment
{
	var x = ImageLRBound, y = 250
	textout(canvas,font,"HP: "+pk_HPNow,x,y,15,fontColor)
	y = y+20
	
	textout(canvas,font,"MP: "+pk_MPNow,x,y,15,fontColor)
	y = y+20
	
	textout(canvas,font,"ATK: "+pk_ATK,x,y,15,fontColor)
	y = y+20
	
	textout(canvas,font,"DEF: "+pk_DEF,x,y,15,fontColor)
	y = y+20
	y = y+20
	
	var cx = ImageLRBound + 220
	var cy = ImageUpBound
	textout(canvas,font,"What player says to player's kaiju",cx,cy,15,fontColor);
	cy = cy+20
	for(c = 0; c<10; c++)
	{
		textout(canvas,font,"「"+pk_comment[c]+"」",cx,cy,15,fontColor)
		cy=cy+20
	}
			
	textout(canvas,font,"Press space to continue",x,y,15,fontColor);
}

function showEKData()
{
	var x = ImageLRBound, y = 250
	textout(canvas,font,"HP: "+ek_HPNow,640-x-48*4,y,15,fontColor)
	y = y+20
	
	textout(canvas,font,"MP: "+ek_MPNow,640-x-48*4,y,15,fontColor)
	y = y+20
	
	textout(canvas,font,"ATK: "+ek_ATK,640-x-48*4,y,15,fontColor)
	y = y+20
	
	textout(canvas,font,"DEF: "+ek_DEF,640-x-48*4,y,15,fontColor)
	y = y+20
	y = y+20
	
	var cx = ImageLRBound
	var cy = ImageUpBound
	textout(canvas,font,"What enemy says to enemy's kaiju",cx,cy,15,fontColor);
	cy = cy+20
	for(c = 0; c<10; c++)
	{
		textout(canvas,font,"「"+ek_comment[c]+"」",cx,cy,15,fontColor)
		cy=cy+20
	}
	
	textout(canvas,font,"Press space to continue",x,y,15,fontColor);
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
	for (c=0; c<10; c++)
	{
		pk_comment[c] = d.comment[c]
	}
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
	for (c=0; c<10; c++)
	{
		ek_comment[c] = d.comment[c]
	}
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
	
	
	d_HP = calNextInfo(v,pk_HP)
	pk_HP = pk_HP + d_HP//calNextInfo(v,pk_HP)
	v = myRandomNumber(v)
	
	d_MP = calNextInfo(v,pk_MP)
	pk_MP = pk_MP + d_MP//calNextInfo(v,pk_MP)
	v = myRandomNumber(v)
	
	d_ATK = calNextInfo(v,pk_ATK)
	pk_ATK = pk_ATK + d_ATK//calNextInfo(v,pk_ATK)
	v = myRandomNumber(v)
	
	d_DEF = calNextInfo(v,pk_DEF)
	pk_DEF = pk_DEF + d_DEF// + calNextInfo(v,pk_DEF)
}

function calDmg(a,d,mbtime)
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
	
	if (mbtime > 0)
	{
		d = Math.ceil(d * 0.75)
	}
	return d
}

function calCure(m,n)
{
	var per = rand() % 8 + 8  //8~15%
	var c = Math.floor(m * per)
	n = n + c
	if (n > m)
		n = m
	return n
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
		else if(pk_HP < 120)
			pk_LEG = 2
		else
			pk_LEG = 0
		play_sample(evolveSE)
	}
	else if (nowComment == 8) //body
	{
		if (pk_ATK > 135)
			pk_HAND = 2
		else if(pk_DEF < 130)
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
		if(checkIsVaildData(s))
			setPKData(s)
		else
			return
	}
	
	//enemy
	var s = encStringToData(document.getElementById('ek-code').value)
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
	
	//TODO: check data vaild
}


function battleNextRound()
{
	//roll dice for who attack first //add spd system next time
	
	battleInfo.count = 0
	battleInfo.nowCount = 0
	var ek_tempHP = ek_HPNow
	var pk_tempHP = pk_HPNow

	if (rand() % 2 == 0) //player
	{
		if (pk_TYPE != 0 && rand()>58980) //skill
		{
			if (pk_TYPE==1 && pk_MPNow >= MP_MB)
			{
				pk_MB = 3
				//Math.ceil(*0.75)
			}//mb
			else (pk_TYPE==2 && pk_MPNow >= MP_CURE)
			{
				pk_tempHP = calCure(pk_HP,pk_tempHP)
			}//cure
			
			pushBattleInfo("PSKILL",pk_tempHP)
		}
		else //attack
		{
			var d = calDmg(pk_ATK,ek_DEF,ek_MB)
			if(ek_MB>0)
				ek_MB = ek_MB-1
			ek_tempHP = ek_tempHP - d
			if (criticalFlag)
			{
				criticalFlag = false
				//pushBattleLog("CRITICAL!! Player "+pk_name+" attack enemy "+ek_name+", "+d+" dmg.")		
				pushBattleInfo("PAEC",d)
				//ek_FlickCount = 0
			}
			else
			{
				//pushBattleLog("Player "+pk_name+" attack enemy "+ek_name+", "+d+" dmg.")
				pushBattleInfo("PAE",d)
				//ek_FlickCount = 0
			}
				
			if(rand()>58980) //about 10%
			{
				if(ek_TYPE==0 && ek_MPNow>=MP_ABSORB)
				{
					ek_tempHP = ek_tempHP + d
					//pk_tempMP = pk_tempMP-10
					//pushBattleLog("Enemy "+ek_name+" uses auto cure, "+d+" dmg restore.")
					pushBattleInfo("ESKILL",ek_tempHP)
				}
			}
		}
		
		if(ek_tempHP <= 0)  //TODO: check temp hp
		{
			//go winner
			ek_tempHP = 0
			//koFlag = true
			pushBattleInfo("PW",0)
		}
		else
		{
			if (ek_TYPE != 0 && rand()>58980) //skill
			{
				if (ek_TYPE==1 && ek_MPNow>=MP_MB)
				{
					ek_MB = 3
					//Math.ceil(*0.75)
				}//mb
				else (ek_TYPE==2 && ek_MPNow>=MP_CURE)
				{
					ek_tempHP = calCure(ek_HP,ek_tempHP)
				}//cure
				pushBattleInfo("ESKILL",ek_tempHP)
			}
			else
			{
				d = calDmg(ek_ATK,pk_DEF,pk_MB)
				if(pk_MB>0)
					pk_MB= pk_MB-1
				pk_tempHP = pk_tempHP - d
				if (criticalFlag)
				{
					criticalFlag = false
					//pushBattleLog("CRITICAL!! Enemy "+ek_name+" attack player "+pk_name+", "+d+" dmg.")
					pushBattleInfo("EAPC",d)
					//pk_FlickCount = 0
				}
				else
				{
					//pushBattleLog("Enemy "+ek_name+" attack player "+pk_name+", "+d+" dmg.")
					pushBattleInfo("EAP",d)
					//pk_FlickCount = 0
				}
				if(rand()>58980) //about 10%
				{
					if(pk_TYPE == 0 && pk_MPNow>=MP_ABSORB)
					{
						pk_tempHP = pk_tempHP + d
						//pk_MPNow = pk_MPNow-10
						//pushBattleLog("Player "+pk_name+" uses auto cure, "+d+" dmg restore.")
						pushBattleInfo("PSKILL",pk_tempHP)
					}
				}
				if(pk_tempHP <= 0)
				{
					//go loser
					pk_tempHP = 0
					//koFlag = true
					pushBattleInfo("EW",0)
				}
			}
		}
	}
	else //enemy
	{
		if (ek_TYPE != 0 && rand()>58980) //skill
		{
			if (ek_TYPE==1 && ek_MPNow>=MP_MB)
			{
				ek_MB = 3
				//Math.ceil(*0.75)
			}//mb
			else (ek_TYPE==2 && ek_MPNow>=MP_CURE)
			{
				ek_tempHP = calCure(ek_HP,ek_tempHP)
			}//cure
			
			pushBattleInfo("ESKILL",ek_tempHP)
		}
		else
		{
			var d = calDmg(ek_ATK,pk_DEF,pk_MB)
			if(pk_MB>0)
				pk_MB = pk_MB-1
			pk_tempHP = pk_tempHP - d
			if (criticalFlag)
			{
				criticalFlag = false
				//pushBattleLog("CRITICAL!! Enemy "+ek_name+" attack player "+pk_name+", "+d+" dmg.")
				pushBattleInfo("EAPC",d)
				//pk_FlickCount = 0
			}
			else
			{
				//pushBattleLog("Enemy "+ek_name+" attack player "+pk_name+", "+d+" dmg.")
				pushBattleInfo("EAP",d)
				//pk_FlickCount = 0
			}
			if(rand()>58980) //about 10%
			{
				if(pk_TYPE == 0 && pk_MPNow>=MP_ABSORB)
				{
					pk_tempHP = pk_tempHP + d
					//pk_MPNow = pk_MPNow-10
					//pushBattleLog("Player "+pk_name+" uses auto cure, "+d+" dmg restore.")
					pushBattleInfo("PSKILL",pk_tempHP)
				}
			}
		}
		
		if(pk_tempHP <= 0)
		{
			//go loser
			pk_tempHP = 0
			//koFlag = true
			pushBattleInfo("EW",0)
		}
		else
		{
			if (pk_TYPE != 0 && rand()>58980) //skill
			{
				if (pk_TYPE==1 && pk_MPNow>=MP_MB)
				{
					pk_MB = 3
					//Math.ceil(*0.75)
				}//mb
				else (pk_TYPE==2 && pk_MPNow>=MP_CURE)
				{
					pk_tempHP = calCure(pk_HP,pk_tempHP)
				}//cure
				
				pushBattleInfo("PSKILL",pk_tempHP)
			}
			else
			{
				d = calDmg(pk_ATK,ek_DEF,ek_MB)
				if(ek_MB>0)
					ek_MB = ek_MB-1
				ek_tempHP = ek_tempHP - d
				if (criticalFlag)
				{
					criticalFlag = false
					//pushBattleLog("CRITICAL!! Player "+pk_name+" attack enemy "+ek_name+", "+d+" dmg.")		
					pushBattleInfo("PAEC",d)
					//ek_FlickCount = 0
				}
				else
				{
					//pushBattleLog("Player "+pk_name+" attack enemy "+ek_name+", "+d+" dmg.")
					pushBattleInfo("PAE",d)
					//ek_FlickCount = 0
				}
				
				if(rand()>58980) //about 10%
				{
					if(ek_TYPE==0 && ek_MPNow>=MP_ABSORB)
					{
						ek_tempHP = ek_tempHP + d
						//pk_tempMP = pk_tempMP-10
						//pushBattleLog("Enemy "+ek_name+" uses auto cure, "+d+" dmg restore.")
						pushBattleInfo("ESKILL",ek_tempHP)
					}
				}
				if(ek_tempHP <= 0)
				{
					//go winner
					ek_tempHP = 0
					//koFlag = true
					pushBattleInfo("PW",0)
				}
			}
		}
	}
}


function getNextBattleInfo()
{
	if (battleInfo.nowCount == battleInfo.count)
		return
	
	var t = battleInfo.type[battleInfo.nowCount]
	var v = battleInfo.value[battleInfo.nowCount]
	//TODO: push log, cal dmg.
	if (t == "PAE")
	{
		pushBattleLog("Player "+pk_name+" attack enemy "+ek_name+", "+v+" dmg.")
		ek_FlickCount = 0
		ek_HPNow = ek_HPNow - v
		
		if (ek_HPNow < 0)
			ek_HPNow = 0
		play_sample(fightNoise)
	}
	else if(t == "EAP")
	{
		pushBattleLog("Enemy "+ek_name+" attack player "+pk_name+", "+v+" dmg.")
		pk_FlickCount = 0
		pk_HPNow = pk_HPNow - v
		
		if (pk_HPNow < 0)
			pk_HPNow = 0
		play_sample(fightNoise)
	}
	else if(t == "PAEC")
	{
		pushBattleLog("CRITICAL!! Player "+pk_name+" attack enemy "+ek_name+", "+v+" dmg.")		
		ek_FlickCount = 0
		ek_HPNow = ek_HPNow - v
		
		if (ek_HPNow < 0)
			ek_HPNow = 0
		play_sample(fightNoise)
	}
	else if(t == "EAPC")
	{
		pushBattleLog("CRITICAL!! Enemy "+ek_name+" attack player "+pk_name+", "+v+" dmg.")
		pk_FlickCount = 0
		pk_HPNow = pk_HPNow - v
		
		if (pk_HPNow < 0)
			pk_HPNow = 0
		play_sample(fightNoise)
	}
	
	else if (t == "PSKILL") //skill
	{
		var r = v
		switch(pk_TYPE)
		{
		case 0: //absorb
			pk_MPNow = pk_MPNow - MP_ABSORB
			r = v - pk_HPNow
			pushBattleLog("Player "+pk_name+" uses Damage absorb, "+r+" dmg restore.")
			pk_HPNow = v
			break;
		case 1: //mb
			pk_MPNow = pk_MPNow - MP_MB
			pushBattleLog("Player "+pk_name+" uses Metallic body, damage reduce 25% thrice.")
			break;
		case 2: //cure
			pk_MPNow = pk_MPNow - MP_CURE
			r = v - pk_HPNow
			pushBattleLog("Player "+pk_name+" uses Cure, "+r+" dmg restore.")
			pk_HPNow = v
			break;
		}
		play_sample(evolveSE)
	}
	else if (t == "ESKILL")
	{
		var r = v
		switch(ek_TYPE)
		{
		case 0: //absorb
			ek_MPNow = ek_MPNow - MP_ABSORB
			r = v - ek_HPNow
			pushBattleLog("Enemy "+ek_name+" uses Damage absorb, "+r+" dmg restore.")
			ek_HPNow = v
			break;
		case 1: //mb
			ek_MPNow = ek_MPNow - MP_MB
			pushBattleLog("Enemy "+ek_name+" uses Metallic body, damage reduce 25% thrice.")
			break;
		case 2: //cure
			ek_MPNow = ek_MPNow - MP_CURE
			r = v - ek_HPNow
			pushBattleLog("Enemy "+ek_name+" uses Cure, "+r+" dmg restore.")
			ek_HPNow = v
			break;
		}
		play_sample(evolveSE)
	}
	else if(t == "PW")
	{
		pushBattleLog("Enemy fainted!!")
		koFlag = true
	}
	else if(t == "EW")
	{
		pushBattleLog("Player fainted!!")
		koFlag = true
	}
	
	
}
//TODO: hash function to change value
//function play


function draw()
{
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
		
	case STATE_CK_SHOWCHANGE:
		showCKInfo()
		drawPK()
		break;
		
	case STATE_CK_STATDISPLAY:
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
		
		//drawPK()
		//drawEK()
		break;
	
	case STATE_VS_SHOWPK:
		showPKData()
		drawPK()
		break;
	case STATE_VS_SHOWEK:
		showEKData()
		drawEK()
		break

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
		break;
	case STATE_VS_SHOWANI:
		showVSInfo()
		showBattleLog()
		drawPK()
		drawEK()
		break;
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
	
	case STATE_CK_SHOWCHANGE:
		if (pressed[KEY_SPACE])
		{
			NowGameState = STATE_CK_STATDISPLAY
		}
		break
	
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
			NowGameState = STATE_CK_SHOWCHANGE
		break;
		
	case STATE_CK_END:
		if (pressed[KEY_SPACE])
		{
			NowGameState = STATE_SELECT_MODE
		}
		break;
	
	case STATE_VS_WAIT_INPUT:
		if (pressed[KEY_SPACE])
		{
			checkVSInput(false)
			NowGameState = STATE_VS_SHOWPK
		}
		break;
	
	case STATE_VS_SHOWPK:
		if (pressed[KEY_SPACE])
			NowGameState = STATE_VS_SHOWEK
		break;
		
	case STATE_VS_SHOWEK:
		if (pressed[KEY_SPACE])
		{
			NowGameState = STATE_VS_FIGHT
			pushBattleLog("Press space to start")
		}
		break;
	
	case STATE_VS_FIGHT:
	
		if(koFlag == true/*fightNoise.element.paused == true && */)
		{
			if(pressed[KEY_SPACE])
				NowGameState = STATE_VS_RESULT
		}
			
		else if(pressed[KEY_SPACE])
		{
			//get next round info, pass to vs ani.
			battleNextRound()
			NowGameState = STATE_VS_SHOWANI
		}
		break;
		
	case STATE_VS_RESULT:
		if (pressed[KEY_SPACE])
			NowGameState = STATE_SELECT_MODE
		break;
	
	case STATE_VS_SHOWANI:
		//get info and show. if no info, back to fight.
		if (fightNoise.element.paused == true && evolveSE.element.paused == true && pk_FlickCount>=30 && ek_FlickCount>=30)
		{
			getNextBattleInfo()
			
			if (battleInfo.nowCount == battleInfo.count)
			{
				NowGameState = STATE_VS_FIGHT
			}
			battleInfo.nowCount = battleInfo.nowCount+1
		}
		
		
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

 
 
//Generate enemy by random
function enemyGenerator()
{
	//console.log("test")
	
	//TODO: get name from list.
	//TODO: get 10 comment from list
	//TODO: generate code.
	//TODO: test
}