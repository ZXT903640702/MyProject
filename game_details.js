/*-----------------------猴子爬树动画的变量----------------------------*/

var body_open_top=$(".body_open").offset().top;//游戏盒子距顶部的距离
var arrGift=[];//礼物的offset——Top值
var arrEnd=[];//最终每个人的位置
var arr_data=[];//树枝数据
var branch_arr=[];//划线的数据
var all_len=$(".user_out_box>a").length;
var branch_wid=Math.floor($(".body_open>.column-2>a").outerWidth());//树枝的宽------jing
var branch_hei=Math.floor($(".body_open>div>a").find("i").height());//树枝的高------jing
var monkey_wid=Math.floor($(".user").width());//猴子的宽------jing
var monkey_hei=Math.floor($(".user").height());//猴子的高------jing
var column_wid=Math.ceil($(".column-6").outerWidth());//每条的宽
//body左偏
$(".body").css({"margin-left":"-"+column_wid/2+"px","padding-right":column_wid/2+"px"});

//礼物的x  y值
for(var sss=0; sss<all_len; sss++){
	arrGift.push([Math.ceil($(".prize>a").eq(sss).offset().left),Math.ceil($(".prize>a").eq(sss).offset().top-body_open_top)]);
}


//将十个初始变量保存到数组里
var ms=[];

//将8个初始变量保存到数组里（有几个猴子遍历几次）
for(var ss=0; ss<all_len; ss++){
  var obj={};
  ms.push([0,0,0,0,0,obj,0]);
  obj.intervalId1=null;//直线定时器
  obj.intervalId2=null;//右拐定时器
  obj.intervalId3=null;//左拐定时器
  obj.intervalId4=null;//得到奖品定时器
  /*
      0.猴子的left值
      1.猴子的bottom值
      2.获取的猴子当前x坐标
      3.获取的猴子当前y坐标
      4.拐弯时要执行的次数
      5.定时器
      6.猴子动画的背景定位值
   */
}


/* 取消中奖提示弹框 */
$(document).ready(function() {
	//猴子爬树--数据--操作
	var rId = $("#roomId").val();
	$.ajax({
		type : "POST",
		url : base + "/game/memberResult.json",
		data : {
			"pId" : 0,
			"rId" : rId
		},
		dataType : "json",
		success : function(data) {
			if (data.code == 1) {
				if (data.data.data != null) {
					var dataList = data.data.data;//所有数据-----二维数组---第一个是列-第二个是位置（都从一开始）
					var seatList = data.data.seatList;
					var allData = data.data.allData;//处理完的数据
					var free = data.data.free;
					var fp = data.data.fp;
					// 获取汇总所有人的数据
					for (var i = 0; i < allData.length; i++) {
						var one = eval(data.data.allData[i]);
						$(one).each(function(index) {// 遍历当前y轴所有的数据
							var y = one[index];
							var isExits = false;
							if (y != 0 && i < allData.length - 1) {// 判断y不等于0且
																	// 不是最后一条梯子
								arr_data.push([i+1,10-y]);
								
							}
						});
					}	
					/*参与次数*/
					if(seatList.length>0){
						$(".freeOwnerTime").html(seatList.length);
					}else{
						$(".allcount>p").html("您未参与本期游戏");
					}
					
					/*显示路线数据*/
					for(i in arr_data){
						$(".body_open>div").eq(arr_data[i][0]).find("i").eq(arr_data[i][1]).addClass("block");
						//树枝位置数据
						var block_x=$(".body_open>div").eq(arr_data[i][0]).find("a").eq(arr_data[i][1]).offset().left;
						var block_y=$(".body_open>div").eq(arr_data[i][0]).find("i").eq(arr_data[i][1]).offset().top-body_open_top;
						branch_arr.push([Math.ceil(block_x),Math.ceil(block_y),arr_data[i][0],arr_data[i][1]]);
					}
					// 免单路线
					if (free != null) {
						var one = eval(free);
						if($(".got").length>=10){
							line_fun(one,fp);
						}
						
					}
				}
			}
		}
	});
	
	/*-------------------------------------页面操作-----------------------------------------*/
	//屏蔽显示
 	$(".bg_box_0").css('display',"none");
	$(".room-details-0").css('display',"none"); 
	//捕捉页面来源
	if($("#homeState").text().trim()=="游戏已开奖"){
		var url_source = document.referrer;
		if(url_source.indexOf('game/active')!=-1){//提交后跳转
			//显示弹框
			$(".game-end-list").addClass("dis-none");
			/*十个猴子一起爬树*/
			for(var useri=0; useri<10; useri++){
				move(useri);
			}
			//隐藏未开奖按钮
			$(".re_into").css({"display":"none"});
			$(".watch-detail").css({"display":"none"});
			$("#sub-btn").css({"display":"none"});
			//显示已开奖按钮
			$(".go-shoping").css({"display":"inline-block"});
			$(".join-new").css({"display":"inline-block"});
			$(".watch-ticket").css({"display":"inline-block"});
			$(".back-home").css({"display":"inline-block"});
		}else{                                     //查看记录
		    //隐藏弹框
	     	$(".bg_box").addClass("dis-none");
			$(".room-details-1").addClass("dis-none");
			$(".hb-alert-box").addClass("dis-none");
			
			//隐藏未开奖按钮
			$(".re_into").css({"display":"none"});
			$(".watch-detail").css({"display":"none"});
			$("#sub-btn").css({"display":"none"});
			//显示已开奖按钮
			$(".go-shoping").css({"display":"inline-block"});
			$(".join-new").css({"display":"inline-block"});
			$(".back-home").css({"display":"inline-block"});
			//查看记录进来不显示爬树，只显示
			$(".user").hide();//不显示猴子
			$(".prize>a").addClass("got");//奖品都动
		}
	}
	//点击“X”按钮隐藏弹框 （红包）
	$(".del-btn").click(function() {
		$(".bg_box").addClass("dis-none");
		$(".room-details-1").addClass("dis-none");
     	$(".bg_box").css('display',"none");
		$(".room-details-1").css('display',"none"); 
		
		$(".bg_box_0").addClass("dis-none");
		$(".room-details-0").addClass("dis-none");
     	$(".bg_box_0").css('display',"none");
		$(".room-details-0").css('display',"none"); 
		//红包弹框隐藏
		$(".hb-alert-box").css('display',"none");
		$(".bg_box").css('display',"none"); 
	});
		
	//查看相关信息
	if(document.body.offsetWidth<768){
		$('.ofpro_discount_content').css("display","none");
		$(".about_massage_pc").remove();
	}
	$(".ofpro_info").click(function(){
		if($(this).html()=="查看"){
			$(".ofpro_discount_content").slideDown();
			$(this).html("收起");
		}else if($(this).html()=="收起"){
			$(".ofpro_discount_content").slideUp();
			$(this).html("查看");
		}
	})
	//用户名
	for(var us=0; us<$(".user_name").length; us++){
		$(".user_name").eq(us).html($(".use_name_hidden").eq(us).val());
	}
});
var base = ""
	
//查看路线--函数
function line_fun (arr,eq){
	$(".line").removeClass("line");
	$(".body_open>div").find("a i").removeClass("right left");
	for(var is=0; is<arr.length; is++){
		var x=arr[is][0];
		var y=Math.ceil(10-arr[is][1]);
		if(arr[is+1]==undefined){
			$(".tree").eq(x-1).find(".top_line").addClass("line");
			return ;
		}
		var x1=arr[is+1][0];
		var y1=Math.ceil(10-arr[is+1][1]);	
		$(".tree").eq(eq-1).find(".bottom_line").addClass("line");//免单者
		$(".user_out_box").eq(eq).find("img").addClass("active3");
		if(is==0 && y>0){
			for(var con=10; con>y; con--){
				$(".tree").eq(x-1).find("a").eq(con-1).addClass("line");//shu
			}
		}else if(is==arr.length-2 && y>0){
			for(var con3=0; con3<y; con3++){
				$(".tree").eq(x-1).find("a").eq(con3).addClass("line");//shu
			}
		}
		if(y==y1){//横线
			if(x>x1){//左拐
				$(".body_open>div:eq("+(x-1)+")").find("a:eq("+(y)+") i").addClass("line block left");//heng
			}else if(x<x1){//右拐
				$(".body_open>div:eq("+x+")").find("a:eq("+(y)+")").find("i").addClass("line block right");//heng
			}
			
		}else if(y!=y1 && y1>=0){//竖线
			if((y1+1)==y){
				if(x==x1){
					$(".tree").eq(x-1).find("a").eq(y-1).addClass("line");//shu
				}
			}else{
				for(var con2=y; con2>y1; con2--){
					$(".tree").eq(x-1).find("a").eq(con2-1).addClass("line block");//shu
				}
				
			}
		}
			
	}
}

// 以下是socket 通信
var socket = null;
var rId = $("#roomId").val();
var mId = $("#memberId").val();

$(function() {
	function parseObj(strData) {// 转换对象
		return (new Function("return " + strData))();
	}
	//if($("#homeState").text().trim()=="游戏进行中"){
		//socketon();

		// 创建socket对象
		socket = new WebSocket("ws://" + window.location.host +"/"+ base + "/game/" + rId + "/info");
		// 连接创建后调用
		socket.onopen = function() {

		};
		// 接收到服务器消息后调用
		socket.onmessage = function(message) {
			if (message.data != null) {
				var data = parseObj(message.data);
				if (data.code == 2) {// 开奖
					var ticket = "";
					for (var i = 0; i < data.data.resultList.length; i++) {
						ticket += data.data.resultList[i].num + "张"
								+ data.data.resultList[i].typeName + "，";
					}
					ticket = ticket.substring(0, ticket.length - 1);
					if(typeof(data.data.fMember)!="undefined"){
						$("#freeOwnerImg").attr("src",
								"http://img.iuchou.com/" + data.data.fMember.iconPicture);// 获奖人头像
						$("#freeOwnerName").html(data.data.fMember.memberName);// 获奖人名称
						$("#freeOwnerNo").html(data.data.fMember.memberUid);// 获奖人编号
					}
					$("#ticketResult").html(ticket);
					$("#freeOwnerTime").html(data.data.count);// 参与次数
					$("#openTime").html(data.data.openTime);// 开奖时间
					$("#homeState").html("游戏已开奖");
					$("#titleInfo").html("中奖者信息");
					//地址
					if(data.data.pArea!=null){
						var address=data.data.pArea.areaname;
						if(data.data.cArea!=null){
							address+=data.data.cArea.areaname;
						}
						$("#freeAdd").html(address);
					}
					//左侧皇冠显示
					$("#crown1Img").css("display","block");
					var fSeat=5;
					//获得免单人位置
					if(typeof(data.data.fMember)!="undefined"){
						var fSeat=data.data.freeMember.mgMemberSeat;
						//加皇冠
						$("#crownImg" + fSeat).css("display","block");
					}
					//开奖结果
					var resultHtml="<tr><td class='bor-right-1'>位置</td><td>用户名</td><td>获得券</td><td>操作</td><td>操作</td></tr>";

					$(".close_prize").removeAttr("onclick"); //移除onclick  属性 所绑订的事件
					// 遍历参与者头像信息 及开奖结果
					for (var i = 0; i < data.data.mgList.length; i++) {
						for (var j = 0; j < 10; j++) {
							var seat = j + 1;
							if (data.data.mgList[i].mg_member_seat == seat) {
								$("#img" + seat).attr("src",
										"http://img.iuchou.com/"+data.data.mgList[i].icon_picture);
								
								$("#img"+seat).attr("onclick","check("+seat+",'已开奖',"+data.data.mgList[i].mg_member_id+")"); //注册check
							}
						}
						resultHtml+='<input type="hidden"  id="memberData'+data.data.mgList[i].mg_member_seat
						+'"  value="'+data.data.mgList[i].mg_member_data+'">';
						resultHtml+='<tr><td class="bor-right-1 size-12">'+data.data.mgList[i].mg_member_seat+'</td>';
						resultHtml+="<td><a href='/member/outcenter"+data.data.mgList[i].mg_member_id+"/1.html' >"+
						"<img src='http://img.iuchou.com/"+data.data.mgList[i].icon_picture+"'"
						+"style='width: 30px; height: 30px; border-radius: 50%;'></a>"+
						data.data.mgList[i].member_name+"</td>";
						if(data.data.mgList[i].tNames!=null && data.data.mgList[i].tNames!=""){
							resultHtml+='<td><span class="text-warning ticket_type size-12">'+data.data.mgList[i].tNames +'</span></td>';
						}else{
							resultHtml+='<td><span class="text-warning ticket_type size-12">谢谢参与</span></td>';
						}
						resultHtml+='<td><a href="#game_details" onclick="linefun('+data.data.mgList[i].mg_member_seat+',\''
						+data.data.mgList[i].mg_member_data+'\');">TA的筹划</a></td>';    
						resultHtml+='<td><a href="#game_details" onclick="checkfun('+data.data.mgList[i].mg_member_seat+');">TA的路线</a></td></tr>';   
					}
					
					$("#waiting").css("display","none");
					$("#tableId").html(resultHtml);
					//捕捉页面来源
					if($("#homeState").text().trim()=="游戏已开奖"){
						if($(".got").lenght<=0){
							/*十个猴子一起爬树*/
							for(var useri=0; useri<10; useri++){
								move(useri);
							}
							//隐藏未开奖按钮
							$(".re_into").css({"display":"none"});
							$(".watch-detail").css({"display":"none"});
							$("#sub-btn").css({"display":"none"});
							//显示已开奖按钮
							$(".go-shoping").css({"display":"inline-block"});
							$(".join-new").css({"display":"inline-block"});
							$(".watch-ticket").css({"display":"inline-block"});
							$(".back-home").css({"display":"inline-block"});
						}
							
					}
					// 关闭定时任务
					window.clearInterval(t1);
				}
				if (data.code == 1) {//未开奖  参与人数
					var userNum = $("#userNum").html();
					var remainNum = $("#remainNum").html();
					if (data.data.num != userNum) {
						var rNum = parseInt(10) - parseInt(data.data.num)
						$("#userNum").html(data.data.num);
						$("#remainNum").html(rNum);
						for (var i = 0; i < data.data.mgList.length; i++) {// 遍历参与者头像信息
							for (var j = 0; j < 10; j++) {
								var seat = j + 1;
								if (data.data.mgList[i].mg_member_seat == seat) {
									$("#img" + seat)
											.attr("src","http://img.iuchou.com/"+ data.data.mgList[i].icon_picture);// 获奖人头像
								}
							}
						}
					}
				}
			}
		};
		// 关闭连接的时候调用
		socket.onclose = function() {
			// alert("close");
		};
		// 出错时调用
		socket.onerror = function() {
			layer.msg('error');
		};

		// 无限循环获取结果
		function getResult() {
			socket.send(mId);
		}
		// 重复执行某个方法
		var t1 = window.setInterval(getResult, 1000);


/*	}else{//游戏已开奖

	}*/
});

function socketon(){}

//查看筹划操作
function back_canvas(data, pos) {
	// 进行数据处理
	var info = [];
	var str = data['info'].split(';');
	str.pop();
	for (var j = 0, len0 = str.length; j < len0; j++) {// 检测其中所有数字取出
		var str_small;
		if(str[j]==null||str[j]==""){
			str[j]="0,";
		}
		var len_num = str[j].match(/[0-9]/g).length; // 数组长度
		if (len_num > 1) {
			str_small = str[j].split(",");
			for (var k = 0, len1 = str_small.length, cache_num = []; k < len1; k++) {
				cache_num.lentgh = 0; // 置空数组
				if (!isNaN(parseInt(str_small[k]))) {
					cache_num.push(parseInt(str_small[k]));
				}
			}
			info.push(cache_num);
		} else if (len_num = 1) {
			str_small = str[j].split(",");
			info.push([ parseInt(str_small[0]) ]);
		} else {

		}
	}
	$(".block").removeClass("block");
	$(".line").removeClass("line");
	for(var id1=0; id1<info.length-1; id1++){
		for(var id2=0; id2<info[id1].length; id2++){
			$(".body_open>div").eq(id1+1).find("a").eq(info[id1][id2]-1).find("i").addClass("block");
		}
	}
	
}

//查看TA的筹划
function linefun(pos, info) {
	var lineObj = {
		"pos" : pos,
		"info" : info
	};
	back_canvas(lineObj, pos);
	
};
//查看TA的路线
function checkfun(num) {
	check(num);
}


// 查看个人中心 优惠券情况
function toTicket() {
	location.href = base + '/member/ticket0/1.html';
}

// 追加人次
function buyAgain(rId) {
	$.ajax({
		type : "POST",
		url : base + "/game/Additional.json",
		data : {
			"rId" : rId
		},
		dataType : "json",
		async : false,
		success : function(data) {
			if (data.code == 2) {// 房间参与人数已满
				layer.msg(data.message);
			} else if (data.code == 3) {// 房间已开奖
				layer.msg(data.message);
			} else if (data.code == 4) {// 参与券不足
				layer.msg(data.message);
			} else if (data.code == 1) {
				location.href ="/game/active"+rId+".html";
			}
		}
	});
}

/*未开奖时点击头像--提示*/
function tip(rId) {
	layer.open({
		title : "温馨提示",
		content : "本局游戏还未开奖!",
		btn : [ "我要补位", "确定" ],
		btnAlign : 'l',// l：左对齐；c：居中对齐；r：右对齐
		yes : function() {
			buyAgain(rId)
		},
		cancel : function() {

		}
	});
}

/*查看商品详情--操作*/
function getdetail(id){
	var goods_id = id;
	if (goods_id!=null||goods_id!="") {
		location.href = base+"/goods/detail"+goods_id+".html";	
	}
}

/*阻止 “.tab-btn” 发生默认行为*/
$(".tab-btn").on("click",function(e){
	e.preventDefault();
});

//查看路线操作
function check (p, me, currentID){
	$("#posation").val(p);
	var rId = $("#roomId").val();
	$.ajax({
		type : "POST",
		url : base + "/game/memberResult.json",
		data : {
			"pId" : p,
			"rId" : rId
		},
		dataType : "json",
		async : false,
		success : function(data) {
			var free = data.data.free;
			if (data.code == 1) {
				var allData = data.data.allData;
				if (data.data.data != null) {
					// 获取汇总所有人的数据
					for (var i = 0; i < allData.length; i++) {
						var one = eval(data.data.allData[i]);
						$(one).each(function(index) {// 遍历当前y轴所有的数据
							var y = one[index];
							var isExits = false;
							if (y != 0 && i < allData.length - 1) {// 判断y不等于0且
																	// 不是最后一条梯子
								var nextone = eval(data.data.allData[i + 1]);// 获取后梯子数据
							}
						});
					}
					var one = eval(data.data.data);
					line_fun(one,p);
					//成功路线的宽
					$(".body_open>div>a>.line").height($(".body>div .tree>.line").width());
					console.log($(".body_open>div>a>.line").height(),$(".body>div .tree>.line").width());
					/**判断是否是免单券的**/
					if((p-1)==$(".geme_location>a").find(".crownblock").parent().index()){
						$(".user_out_box>a>img").removeClass("active4");
						$(".miandan").addClass("active4");
					}else{
						$(".user_out_box>a>img").removeClass("active4");
						$(".user_out_box>a>img").eq(p).addClass("active4");
					}
					//头像加样式
					$('.user_out_box>a').find("img").removeClass("active4");
					$('.user_out_box>a').eq(p - 1).find("img").addClass('active4');
				}
			}
		}
	});
	var mid = $("#memberId").val(); // 本人ID
	if (me=="未开奖") {// 未开奖
		if (mid != currentID) {// 不是自己
			// 调用温馨提示对话框
			layer.open({
				title : [ '温馨提示', true ],
				content : "开奖前不可查看他人路线!",
				btn : [ '确定' ],
				yes : function(index) {
					layer.close(index);
				}
			});
			return false;
		} else {// 是自己
			var data_per = [];
			data_per['info'] = $("#memberData0" + p).val();// 本次点击数据
			if (data_per != null || data_per != undefined) {
				back_canvas(data_per, p);
			}
		}
	}
}

//-----------------------------------------猴子爬树-----------------------------------------------------

function move_top (mn){ 
    /*猴子动画*/
    $(".monkey_me").eq(mn).css({"background-position":"0 "+(ms[mn][6])*50+"%"});
    if(ms[mn][6]==0){
        ms[mn][6]+=1;
    }else{
        ms[mn][6]=0;
    }
    ms[mn][2]=Math.floor($(".monkey_me").eq(mn).offset().left)+(monkey_wid/2);//猴子left值（中心）
    ms[mn][3]=Math.floor($(".monkey_me").eq(mn).offset().top)+(monkey_hei/3)-body_open_top;//猴子top值（中心）
    /*猴子直线爬*/
    ms[mn][1]+=3;
    $(".monkey_me").eq(mn).css({"bottom":ms[mn][1]+"px"});
    /*判断猴子爬行位置是否遇到树枝*/
    for(idx in branch_arr){
        var tle=branch_arr[idx][0];//当前树枝位置--left
        var tto=branch_arr[idx][1];//当前树枝位置--top
        /*右拐*/
        if(Math.abs(ms[mn][2]-tle)<10 && Math.floor(ms[mn][3]-(tto+branch_hei))<3 && Math.floor(ms[mn][3]-(tto+branch_hei))>=0){
            clearInterval(ms[mn][5].intervalId1);
            $(".monkey_me").eq(mn).addClass("monkey_right");
            ms[mn][4]=0;
            ms[mn][5].intervalId2=setInterval("move_right("+mn+","+branch_arr[idx][2]+")",80);
        /*左拐*/
        }else if(Math.abs(ms[mn][2]-(tle+branch_wid))<10 && Math.floor(ms[mn][3]-(tto))<3 && Math.floor(ms[mn][3]-(tto))>=0){
            clearInterval(ms[mn][5].intervalId1);
            $(".monkey_me").eq(mn).addClass("monkey_left");
            ms[mn][4]=0;
            ms[mn][5].intervalId3=setInterval("move_left("+mn+","+branch_arr[idx][2]+")",80);
        }

    }
    
    //每只猴子碰到对应的奖品时清除定时器----并转身
	for(i in arrGift){
		var left_=arrGift[i][0]+$(".prize>a").outerWidth()/2;
		var top_=arrGift[i][1]-10;
		if(Math.abs(ms[mn][2]-left_)<=10 && ms[mn][3]<=top_+35){
			//保存结束后每个人的位置
			arrEnd.push([ms[mn][2],idx]);
			//清除直线定时器
			clearInterval(ms[mn][5].intervalId1);
			//执行得奖  
			$(".prize>a").eq(i).addClass("got");
			$(".user").eq(mn).find(".user_span").addClass("dis-none");
			var str=$(".user").eq(mn).find("b").html();
			$(".prize>a").eq(i).append("<b class='user_name'>"+str+"</b>");
			if($(".got").length==10){
				$("body").css({"height":"auto","overflow":"auto"});
				var url_source = document.referrer;
				if(url_source.indexOf('game/active')!=-1){
					//显示弹框
				 	$(".bg_box_0").css('display',"block");
					$(".hb-alert-box").css('display',"block"); 
					//隐藏未开奖按钮
					$(".re_into").css({"display":"none"});
					$(".watch-detail").css({"display":"none"});
					$("#sub-btn").css({"display":"none"});
					//显示已开奖按钮
					$(".go-shoping").css({"display":"inline-block"});
					$(".join-new").css({"display":"inline-block"});
					$(".watch-ticket").css({"display":"inline-block"});
					$(".back-home").css({"display":"inline-block"});
				} 
				$(".hb-alert-box").show();
				$(".bg_box").show();
				/*暂时屏蔽开奖散花效果*/
				/*rain_open();*/
				$(".miandan").click();
				$(".game-end-list").removeClass("dis-none");
			}
		}
	
	}
    
}
function move_left (mn,tree){
    /*猴子动画*/
    $(".monkey_me").eq(mn).css({"background-position":"0 "+(ms[mn][6])*50+"%"});
    if(ms[mn][6]==0){
        ms[mn][6]+=1;
    }else{
        ms[mn][6]=0;
    }
    /*左拐*/
    /*路线*/ 
	    
    if(ms[mn][4]<branch_wid/3){
        ms[mn][4]++;
        ms[mn][1]-=branch_hei/2/branch_wid*3;
	    $(".monkey_me").eq(mn).css({"bottom":ms[mn][1]+"px","left":ms[mn][0]+"px"});
	    ms[mn][0]-=3;
    }else{
        var ple=$(".monkey_me").eq(mn).parent().offset().left;
        var treele=$(".user").eq(tree-1).offset().left;
        $(".monkey_me").eq(mn).css({"left":(treele-ple)+"px"});
    	ms[mn][0]=treele-ple;
        clearInterval(ms[mn][5].intervalId3);
        $(".monkey_me").eq(mn).removeClass("monkey_left");
        ms[mn][5].intervalId1=setInterval("move_top("+mn+")",80);
    }
}
function move_right (mn,tree){
    /*猴子动画*/
    $(".monkey_me").eq(mn).css({"background-position":"0 "+(ms[mn][6])*50+"%"});
    if(ms[mn][6]==0){
        ms[mn][6]+=1;
    }else{
        ms[mn][6]=0;
    }
    /*右拐*/
    /*路线*/
    if(ms[mn][4]<branch_wid/3){
        ms[mn][4]++;
        ms[mn][1]+=(branch_hei)/branch_wid*3;
	    $(".monkey_me").eq(mn).css({"bottom":ms[mn][1]+"px","left":ms[mn][0]+"px"});
	    ms[mn][0]+=3;
    }else{
        var ple=$(".monkey_me").eq(mn).parent().offset().left;
        var treele=$(".user").eq(tree).offset().left;
        $(".monkey_me").eq(mn).css({"left":(treele-ple)+"px"});
    	ms[mn][0]=treele-ple;
        clearInterval(ms[mn][5].intervalId2);
        $(".monkey_me").eq(mn).removeClass("monkey_right");
        ms[mn][5].intervalId1=setInterval("move_top("+mn+")",80);
    }
}
function move(mn){
	$("body").scrollTop($("#game_wrapper").offset().top);
	console.log($("#game_wrapper").offset().top);
	//$("body").css({"height":$(window).height,"overflow":"hidden"});
    $(".user_span").addClass("monkey_me monkey_me_move");
    ms[mn][5].intervalId1=setInterval("move_top("+mn+")",80);
}


//花雨效果
var container = document.getElementById('container');
var img = [];
function rain_open(){
	for(var k=0; k<260;k++){
		var img0 =  document.createElement('img');
		img0.id = 'img_'+k;
        var rand_img =Math.floor(Math.random()*3+22)//img
		var rand = Math.floor(Math.random()*5+1);//
		var rand_l = Math.random()*20+40;//left
		var rand_t = Math.random()*300-1000;//top
		var rand_time = Math.random()*2.5+2.5;//旋转动画时间
        var rand_left = Math.floor((Math.random())*100);//向两边散开 第一段动画
        var rand_kuo  = Math.floor(Math.random()*5500+10000);
        var rand_bome = Math.floor(Math.random()*21+40);

		$(img0).attr("src","/assets/images/new-game/"+rand_img+".png");
		$(img0).css({"z-index":"9999999","width":"20px","height":"20px","top":rand_t+'px',"left":rand_bome+'%',"animation-duration":rand_time+'s'})
		$(img0).addClass("gold"+rand);
		$(img0).animate({"left":rand_left+"%","top":$(document).height()+600},rand_kuo);
		container.appendChild(img0); 
	 }
}

//暂时隐藏红包弹框
$(".hb-alert-box").hide();
$(".bg_box").hide();
