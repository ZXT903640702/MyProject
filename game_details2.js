/* 取消中奖提示弹框 */
$(document).ready(function() {
	//屏蔽显示
 	$(".bg_box_0").css('display',"none");
	$(".room-details-0").css('display',"none"); 
	//捕捉页面来源
	if($("#homeState").text().trim()=="游戏已开奖"){
		var url_source = document.referrer;
		if(url_source.indexOf('game/active')!=-1){
			//显示弹框
		}else{
		    //隐藏弹框
	     	$(".bg_box").css('display',"none");
			$(".room-details-1").css('display',"none");
			$(".hb-alert-box").css('display',"none");
			
			//隐藏未开奖按钮
			$("#re_into").css("display","none");
			$(".watch-detail").css("display","none");
			$("#sub-btn").css("display","none");
		}
	}
	 //点击“X”按钮隐藏弹框 
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
	
	
	if(document.body.offsetWidth<768){
		$('.ofpro_discount_content').css("display","none");
	}
	$("#ofpro_info").click(function(){
		if($(this).html()=="查看"){
			$(".ofpro_discount_content").slideDown();
			$(this).html("收起");
		}else if($(this).html()=="收起"){
			$(".ofpro_discount_content").slideUp();
			$(this).html("查看");
		}
	})
});
var base = ""
var data_all = null; // 用来存储所有人数据

var data_seats = null; // 用来存储所有人次的座位

var canvas1 = document.getElementById("canvas1");
var ctx1 = canvas1.getContext("2d");//底层
var canvas = document.getElementById("canvas2");
var ctx = canvas.getContext("2d");//上层
var hor_opint = 10; // x轴的份数
var v_opint = 11; // y轴的份数
var w = canvas.width / hor_opint;// 每格的宽度
var h = canvas.height / v_opint;// 每格的高度
window.onload = function() {
	zuo_biao();
}
/* 绘制y坐标轴 */
function zuo_biao() {
	var xw = $(".game-box2").width() / 10;
	var yh = $(".game-box2").height() / 11;
	var xleft = $(".box").width() * 0.05;
	// y轴
	ctx1.beginPath();
	ctx1.moveTo(0, 0);
	ctx1.lineTo(0, canvas.height);
	ctx1.lineWidth = 3;
	ctx1.strokeStyle = "#ccc";
	ctx1.stroke();
	// y轴添加刻度值
	for (var f = 0; f <= 10; f++) {
		var y_btn = document.createElement("div");
		y_btn.style.width = 20 + "px";
		if(f==0){
			y_btn.style.height = yh/2 + "px";
			y_btn.style.marginLeft = -20 + "px";
			y_btn.style.padding = "0";
			y_btn.style.display = "block";
			y_btn.id = "details_btn_" + f;
			$(".game-box2").append(y_btn);
		}else{
			y_btn.style.height = yh + "px";
			y_btn.style.lineHeight = yh + "px";
			y_btn.style.marginLeft = -20 + "px";
			y_btn.style.padding = "0";
			y_btn.style.border = "1px solid #fff";
			y_btn.style.fontSize = "14px";
			y_btn.style.display = "block";
			y_btn.style.backgroundColor = "transparent";
			//y_btn.style.position = "absolute";
			//y_btn.style.top = (yh) * (f) - yh / 2 + 3 + "px";
			y_btn.innerText = f;
			y_btn.id = "details_btn_" + f;
			$(".game-box2").append(y_btn);
		}
			
			
	}
}
for (var col = 0; col < hor_opint; col++) {
	var xzhou = col * w; // x轴坐标值
	ctx.beginPath();
	ctx.moveTo(xzhou, 0);
	ctx.lineTo(xzhou, canvas.height);
	ctx.lineWidth = 2;
	ctx.strokeStyle = "#ccc";
	ctx.stroke();
}
$(document).ready(function() {
	var rId = $("#roomId").val();
	$.ajax({
		type : "POST",
		url : base + "/admin/discount/memberResult.json",
		data : {
			"pId" : 0,
			"rId" : rId
		},
		dataType : "json",
		success : function(data) {
			if (data.code == 1) {
				if (data.data.data != null) {
					var dataList = data.data.data;
					var seatList = data.data.seatList;
					var allData = data.data.allData;
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
								var nextone = eval(data.data.allData[i + 1]);// 获取后梯子数据
								for (var j = 0; j < nextone.length; j++) {
									if (nextone[j] == y) {// 判断时候存在 存在降半格
										isExits = true;
									}
								}
								ctx.beginPath();
								ctx.moveTo(i * w, y * h);
								if (isExits) {
									ctx.lineTo((i + 1) * w, (y + 0.5) * h);
								} else {
									ctx.lineTo((i + 1) * w, y * h);
								}
								ctx.lineWidth = 2;
								ctx.strokeStyle = "#ccc";
								ctx.stroke();
							}
						});
					}
					// 免单路线
					if (free != null) {
						ctx.beginPath();
						ctx.moveTo((fp - 1) * w, 0 * h);
						var one = eval(free);
						$(one).each(function(j, n) {
							x = n[0] - 1;
							y = n[1];
							ctx.lineTo(x * w, y * h);
						});
						ctx.lineWidth = 2;
						ctx.strokeStyle = "#ff606e";// 红色
						ctx.stroke();
					}

				}
			}
		}
	});
});

// 选择位置
function check(p, me, currentID) {
	// 清除上一次数据
	// 显示当前的
	ctx1.clearRect(0, 0, canvas.width, canvas.height);
	$("#posation").val(p);
	var rId = $("#roomId").val();
	$.ajax({
		type : "POST",
		url : base + "/admin/discount/memberResult.json",
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
								for (var j = 0; j < nextone.length; j++) {
									if (nextone[j] == y) {// 判断时候存在 存在降半格
										isExits = true;
									}
								}
								ctx1.beginPath();
								ctx1.moveTo(i * w, y * h);
								if (isExits) {
									ctx1.lineTo((i + 1) * w, (y + 0.5) * h);
								} else {
									ctx1.lineTo((i + 1) * w, y * h);
								}
								ctx1.lineWidth = 2;
								ctx1.strokeStyle = "#ccc";
								ctx1.stroke();
							}
						});
					}
					for (var col = 0; col < hor_opint; col++) {
						var xzhou = col * w; // x轴坐标值
						ctx1.beginPath();
						ctx1.moveTo(xzhou, 0);
						ctx1.lineTo(xzhou, canvas.height);
						ctx1.lineWidth = 2;
						ctx1.strokeStyle = "#ccc";
						ctx1.stroke();
					}
					ctx.clearRect(0, 0, canvas.width, canvas.height);
					ctx.beginPath();
					ctx.moveTo((p - 1) * w, 0 * h);
					var one = eval(data.data.data);
					$(one).each(function(i, n) {
						x = n[0] - 1;
						y = n[1];
						ctx.lineTo(x * w, y * h);
					});
					ctx.lineWidth = 2;
					/**判断是否是免单券的**/
					if((p-1)==$(".geme_location>a").find(".crownblock").parent().index()){
						ctx.strokeStyle = "#ff606e";
					}else{
						ctx.strokeStyle = "#36b0c8";
					}
					ctx.stroke();
					
					//头像加样式
					$('.geme_location>a').eq(p - 1).addClass('active4').siblings()
					.removeClass('active4');
					
				}
			}
		}
	});
	var mid = $("#memberId").val(); // 本人ID
	if (me=="未开奖") {// 未开奖
			var data_per = [];
			data_per['info'] = $("#memberData0" + p).val();// 本次点击数据
			if (data_per != null || data_per != undefined) {
				back_canvas(data_per, p);
			}
	}
}
// 免单券高亮显示
$(document).ready(function() {
	$("span.ticket_type:contains('免单券'):eq(0)").removeClass('text-warning');
	$("span.ticket_type:contains('免单券'):eq(0)").addClass('ticket_free');
});

// 以下是socket 通信
var socket = null;
var rId = $("#roomId").val();
var mId = $("#memberId").val();
$(function() {
	function parseObj(strData) {// 转换对象
		return (new Function("return " + strData))();
	}
	/*if($("#homeState").text().trim()=="游戏进行中"){*/
	// 创建socket对象
	socket = new WebSocket("ws://" + window.location.host +"/"+ base + "/game/"
			+ rId + "/info");
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
				$("#crownImg" + fSeat).css("display","block");}
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
				// // 获取汇总所有人的数据
				ctx1.clearRect(0, 0, canvas1.width, canvas1.height);
				ctx.clearRect(0, 0, canvas.width, canvas.height);
				var allData = data.data.allData;
				for (var i = 0; i < allData.length; i++) {
					var one = eval(data.data.allData[i]);
					$(one).each(function(index) {// 遍历当前y轴所有的数据
						var y = one[index];
						var isExits = false;
						if (y != 0 && i < allData.length - 1) {// 判断y不等于0且
																// 不是最后一条梯子
							var nextone = eval(data.data.allData[i + 1]);// 获取后梯子数据
							for (var j = 0; j < nextone.length; j++) {
								if (nextone[j] == y) {// 判断时候存在 存在降半格
									isExits = true;
								}
							}
							ctx1.beginPath();
							ctx1.moveTo(i * w, y * h);
							if (isExits) {
								ctx1.lineTo((i + 1) * w, (y + 0.5) * h);
							} else {
								ctx1.lineTo((i + 1) * w, y * h);
							}
							ctx1.lineWidth = 2;
							ctx1.strokeStyle = "#ccc";
							ctx1.stroke();
						}
					});
				}
				for (var col = 0; col < hor_opint; col++) {
					var xzhou = col * w; // x轴坐标值
					ctx1.beginPath();
					ctx1.moveTo(xzhou, 0);
					ctx1.lineTo(xzhou, canvas.height);
					ctx1.lineWidth = 2;
					ctx1.strokeStyle = "#ccc";
					ctx1.stroke();
				}
				ctx.beginPath();
				ctx.moveTo((fSeat - 1) * w, 0 * h);
				if(typeof(data.data.freeMember)!="undefined"){
					var one = eval(data.data.freeMember.mgResultData);
					$(one).each(function(i, n) {
						x = n[0] - 1;
						y = n[1];
						ctx.lineTo(x * w, y * h);
					});
				}
				ctx.lineWidth = 2;
				ctx.strokeStyle = "#ff606e";
				ctx.stroke();
				
				//捕捉页面来源
				if($("#homeState").text().trim()=="游戏已开奖"){
					var url_source = document.referrer;
					if(url_source.indexOf('game/active')!=-1){
						//显示弹框
					 	$(".bg_box_0").css('display',"block");
						$(".hb-alert-box").css('display',"block"); 
						//隐藏未开奖按钮
						$("#re_into").css("display","none");
						$(".watch-detail").css("display","none");
						$("#sub-btn").css("display","none");
						//显示已开奖按钮
						$(".go-shoping").removeClass("dis-none");
						$(".join-new").removeClass("dis-none");
						$(".watch-ticket").removeClass("dis-none");
						$(".back-home").removeClass("dis-none");
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
	/*}else{//游戏已开奖
		
	}*/
});

// 在背景画布上划线
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
	// 清空画布
	ctx.clearRect(0, 0, canvas.width, canvas.height);// 清空画布
	for (var col = 0; col < hor_opint; col++) {
		/* 画10条垂直线 */
		var xzhou = col * w; // x轴坐标值
		ctx1.beginPath();
		ctx1.moveTo(xzhou, 0);
		ctx1.lineTo(xzhou, canvas.height);
		ctx1.lineWidth = 1;
		ctx1.strokeStyle = "#ccc";
		ctx1.stroke();
	}
	// 选中头像
	$('.geme_location>a').eq(pos - 1).addClass('active4').siblings().removeClass('active4');

	// 划线
	info.pop();

	for (var i = 0, len = info.length; i < len; i++) {
		for (var q = 0, len_q = info[i].length; q < len_q; q++) {
			if (info[i][q] == 0) { // 则不进行划线
				continue;
			}
			ctx.beginPath();
			ctx.moveTo(w * i, info[i][q] * h); // 起点坐标
			ctx.lineTo(w * (i + 1), info[i][q] * h); // 终点坐标
			ctx.lineWidth = 3;
			/**判断是否是免单券中奖者**/
			if((pos-1)==$(".geme_location>a").find(".crownblock").parent().index()){
				ctx.strokeStyle = "#ff606e";
			}else{
				ctx.strokeStyle = "#36b0c8";
			}
			ctx.stroke();
		}
	}
}

// 查看TA的筹划
function linefun(pos, info) {
	var lineObj = {
		"pos" : pos,
		"info" : info
	};
	back_canvas(lineObj, pos);
};
//查看TA的路线
function checkfun(num) {
	// 选中头像
	$('.geme_location>a').eq(num - 1).addClass('active4').siblings()
			.removeClass('active4');
	check(num);
 
}

//
$("#re_into").click(function() {
	var url = window.location.search;
	var rId = url.substring(url.indexOf("=") + 1);
	sessionStorage.setItem('rId', rId);
});
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
function getdetail(id){
	var goods_id = id;
	if (goods_id!=null||goods_id!="") {
		location.href = base+"/goods/detail"+goods_id+".html";	
	}
}
$(".tab-btn").on("click",function(e){
	e.preventDefault();
});




