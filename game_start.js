
  var column_wid=Math.ceil($(".column-6").outerWidth());//每条的宽
 //body左偏
 $(".body").css({"margin-left":"-"+column_wid/2+"px","padding-right":column_wid/2+"px"});

 function chooseFun (e){
 	if($(e).hasClass("active3")){
		alert("位置已被占用，请选择其他位置");
	}else{
		$(e).toggleClass("active4").parent().siblings().find("img").removeClass("active4");
	 }

 }

$(document).ready(function(){
		//点击提交出现弹框二次确认
		$("#sub-btn").click(function(){
			$(".alert-box").toggleClass("dis-none");
		});
		//点击确定弹框消失并提交
		$(".sure-submit").click(function(){
			$(".alert-box").addClass("dis-none");
			$(".v_btn").removeAttr("name");
		});
		$(".get-back").click(function(){
			$(".alert-box").addClass("dis-none");

		});
		/* 手机页面***/ 
		if(document.body.offsetWidth<768){
			$('#ofpro_discount_content').css("display","none");
		}
		$("#ofpro_discount").click(function(){
			if($(this).html()=="查看"){
				$("#ofpro_discount_content").slideDown();
				$(this).html("收起");
			}else if($(this).html()=="收起"){
				$("#ofpro_discount_content").slideUp();
				$(this).html("查看");
			}

		})
		 //选中游戏位置添加样式 
		$('.geme_location').on("click","img",function(){
			var txt = $(this).attr("src");
			if(txt.indexOf("morentouxiang")==-1){
				// 温馨提示跳转 调用选择对话框
				layer.open({
	    		  title : ['温馨提示' , true],
                  content: "该位置已被占用!"
                      ,btn: ['确定']
                      ,yes: function(index){
                        layer.close(index);
                      }
                    });
				return ;
			}else{
				$(".geme_location a").removeClass("active4");
				$(this).parent().toggleClass("active4");
			}
		});
 });

		  /* window.onload=function(){
			    draw_vertical_btn();
			    zuo_biao();
			    draw_hline();
		   }*/
	       //游戏开始        
            var base ="";//绝对路径
            var self = false;
            var success = false ;//是否是画成功路线 默认否

			/*var canvas_bg=document.getElementById("canvas_bg");
		    var ctx=canvas_bg.getContext("2d");
		    var canvas=document.getElementById("canvas");
            var context=canvas.getContext("2d");*/
		    /*var hor_opint = 10; //x轴的份数
		    var v_opint = 10; //y轴的份数
		    var A = $(".game-box ");
		    var aw = A.width();
		 	var ah = A.height();
		    var w = canvas.width/hor_opint ;//  每格的宽度
		    var h = canvas.height/v_opint -4; //  每格的高度
*/		    
		    var data_cache = []; //记录本次游戏中 之前的划线路径数据
		    data_cache['info'] = [];
		    
		    var init_num=1; //券数量
		    var isFirst=1;//判断是否第一次随机 默认 1 是 ; 0否
          
		    //确定提交
			var  attCount = 0;
			var rute_num=2;//默认成功1次  成功画下的路线
			var sarr =[];
			var idarr=[];
		    //socket通信
			var socket =null;
		  	var rId=$("#roomId").val();//房间号
		     //绘制y坐标轴 
		    function zuo_biao(){
				var xw = $(".game-box").width()/10;
				var yh = $(".game-box").height()/10;
				var xleft = $(".box").width()*0.05;
				var th = $(".geme_location a").height();
                //y轴添加刻度值
				for (var f = 1; f<=10; f++){
					var y_btn1 = document.createElement("button");
					y_btn1.style.width = 20 + "px";
					y_btn1.style.height = 20 + "px";
					y_btn1.style.border = "0 none";
					y_btn1.style.padding = "0";
		            y_btn1.style.fontSize = "14px";
					y_btn1.style.display = "block";
					y_btn1.style.backgroundColor = "transparent";
					y_btn1.style.position = "absolute";
					y_btn1.type = "button";
					y_btn1.style.left = "-"+20+"px";
					y_btn1.style.top = (yh-2.5)*f-10+ "px";
					y_btn1.innerText= f ;
					y_btn1.id = "y_btn1";
					$(".game-box").append(y_btn1);
				}
			}
		    //绘制10条垂直线
		  /*  for(var col=0;col<hor_opint;col++){
		        var xzhou=col*w; //x轴坐标值
		        if(xzhou==0){
		        	xzhou+=1;
		        }
		        ctx.beginPath();
		        ctx.moveTo(xzhou,0);
		        ctx.lineTo(xzhou,canvas_bg.height);
		        ctx.lineWidth=1;
		        ctx.strokeStyle="#111";
		        ctx.stroke();
		    }*/
             
		    function draw_vertical_btn() {

		        for( var i = 0; i < 9; i++ ) {
		            var elem_div = document.createElement("div");
		            elem_div.style.width ="2px";
		            elem_div.style.height = ah+ "px";
		            elem_div.style.left = ( aw/ 10)* i+ "px";
		            elem_div.id = "line_"+i;
		            $(".game-box").append(elem_div);
		            for (var q = 1; q <= 10; q++){
		                var elem_btn = document.createElement("a");
		                elem_btn.style.width = aw/ 10 + "px"; 
		                elem_btn.style.height = ah / 10 + "px"; 
		                elem_btn.style.border = "0 none";
		                elem_btn.style.backgroundColor = "transparent";
		                elem_btn.style.position = "absolute";
		                elem_btn.type = "button";
		                elem_btn.style.top = ((ah / 11) * (q-1))+15+ "px";
		                elem_btn.id = "a"+q;
		                elem_btn.value = q;
		                elem_btn.name = "";
		                elem_btn.setAttribute("class","v_btn");
		                elem_div.appendChild(elem_btn);
		            }
		        }
		    }
		    function ticket_num(){
				init_num++;
				if(init_num>=10){
					return;
				}
				$(".ticket_num").html(init_num);
		   };
		   function draw_hline(){
		    	var x1,y1,x2,y2;
		        var btn = document.getElementsByClassName("v_btn");
		        for(var i=0;i<btn.length;i++){
		            btn[i].onclick=function(){
		                for(var j=0;j<10;j++){
		                    var pid = "line_"+j;//pid表示第几列
		                    if(this.parentNode.id==pid && this.name==""){
		                        // 获取name=block的个数 也就是生成横线的数量
		                        var name_val = document.getElementsByName("block");//name_val表示已经划过线的位置
		                        var d=name_val.length;//已经划过线的数量
		                            if(d < 10 && this.name=="" && $(".geme_location a").hasClass("active4")){ //判断 <10的时候 画一条线 增加一个的数量
		                                x1 = j;
		                                y1 = this.value;
		                                x2 = j + 1;
		                                y2 = this.value;
		                                this.name = "block";
		                                //  画线
		                                context.beginPath();
		                                context.moveTo(x1 * w, y1 * h);
		                                context.lineTo(x2 * w, y2 * h);
		                                context.lineWidth = 2;
		                                context.strokeStyle = "#ff606e";
		                                context.stroke();
		                                d++;
		                            }else if(d > 10 && this.name=="block"&&success==false){ //如果>10 只显示10条线并且按钮禁止点击
		                            	d =10;
		                            	this.disabled=true;
		                            }else if(!$(".geme_location a").hasClass("active4")){//如果头像位置没有被选中  进行提示 选择位置
		                    				 layer.open({
		                    	    		  title : ['温馨提示' , true],
		                                      content: '请先选择位置'
		                                          ,btn: ['确定']
		                                          ,yes: function(index){
		                                            layer.close(index);
		                                          }
		                    	             }) ;
		                    		}else if(d==10&&success==false){
                                     //if(!self){//点的不是随机  别删
			                    			layer.open({
					               	    		  title : ['温馨提示' , true],
					                                 content: '最多能画10条线,请提交或修改 '
					                                     ,btn: ['确定']
					                                     ,yes: function(index){
					                                       layer.close(index);
					                                     }
						               	        }) ;
                                      //} 
		                    		}
		                         
		                    } else if(this.parentNode.id==pid && this.name=="block"){
		                            this.removeAttribute("name");
		                            //清除横线
		                            x1 = j;
		                            y1 = this.value;
		                            x2 = j+1;
		                            y2 = this.value;
		                            context.clearRect((x1*w),(y1*h-1),w,2); //指定清除区域 x,y,width,height
		                    }
		                }
		            }
		        }
		    }
		   
//****************************************************************
 
		   
		   /*手动点击生成树枝*/
	function lineFun (target){
			  
		if($(".active4").length==1){
		   			if($(target).find("i").hasClass("block")){
		   				/*树枝收回动画*/
		   				var t = 0;
		   				var timer="";
		   				t=7;
		   				timer = window.setInterval(function(){
		   					if(t>0){
		   						$(target).find("i").css({"background-position":"0 "+(-24*t)+"px"});
		   						t--;
		   					}
		   					if(t==0){
		   						window.clearInterval(timer);
		   						timer =null;
		   						$(target).find("i").removeClass("block");
		   				}
		   				},10);
		   			}else{
		   				var block_length=$(".body").find(".block").length;
		   			
		   				if(block_length<10){
			   				
			   				$(target).find("i").addClass("block");
			   				/*树枝生长动画*/
			   				var t = 0;
			   				var timer0="";
			   				t=0;
			   				timer0 = window.setInterval(function(){
			   					t++;
			   					if(t>=0 && t<8){
			   						$(target).find("i").css({"background-position":"0 "+(-24*t)+"px"});
			   					}
			   					if(t>=8){
			   						window.clearInterval(timer);
			   						timer0 =null;
			   					}
			   				},50);
			   			  }else{
					   			if($(target).find("i.block").length==1){
					   				$(target).find("i").toggleClass("block");
					   			}else{
					   				radom();
					   				//alert("最多可画10条线，您可提交或修改");
					   			}
				   		  }
		   			}	
		   	}else{
		   		alert("请先选择位置");
		   	}
		   }
		   
		   
		   
	//随机调用   获取位置
	function check(p){
		
		$("i.block").removeClass("block");
		
		$("#posation").val(p);
		var rId=$("#roomId").val();
//		var checked=$("i.block").parent();
//		checked.each(function(index){
//		  console.log(7);
//		  $(this).click();
//		});
		$.ajax({
            type: "POST",
            url: base+"/game/random.json",
            data: {"current":p,"rId":rId,"isFirst":isFirst},
            dataType: "json",
            async:false,
            success: function(data){
            	isFirst=0;
            	if(data.code==1){
            		if(data.data.type==2){
            		    //划线 随机且分散的水平线  10条
            			
            			for(var i=0;i<10;i++){
                			var daStr=data.data.data[i];//后台获取的数组
                			if(daStr!=null){
                				
                				for(var j=0;j<daStr.length;j++){
                					var b = 10-daStr[j];
                					var this_a = $( "#line_"+i).find("a:eq("+b+")")[0];
                					lineFun(this_a);
                					}
                			    }
                			}
                		}else if(data.data.type==1) {
                			success = true ;
                           // 画有中奖记录的随机路线 
                           var one=JSON.parse(data.data.data);
     	                    if(one.length==1){ //过滤竖线
     	                    	return ;
     	                    }
              		    	for(var i=0;i<one.length;i++){
              		    	//如果daStr[j+1]超出数据长度没有值则停止
              					if(one[i+1]==null ||one[i+1]==undefined){
              						return;
              					}

              					//判断二维数组里的前一个数组的第一位和后一个数组的第一位比较 哪个值小就用哪个数组决定a的位置
              					if(one[i][0]<one[i+1][0]){

              						//获取列和这个列的所有a标签
              						var btns =$("#line_"+(one[i][0]-1)).find("a");

              						//确定a的位置并点击
              						btns[one[i][1]-1].click();

              					}
              					if(one[i][0]>one[i+1][0]){
              						var btns =$("#line_"+(one[i+1][0]-1)).find("a");
              						btns[one[i+1][0]-1].click();
              					}
   	           		    	}
              		    }
              		    
            		}else if(data.code==0){
				}
            }
        });
	}
	//随机生成
	var sId;
	function radom(){
		success = false ;
		self = true ;//点击的是随机
		var seat=$("img.active4").parent().attr("name");
		
		var txt = $("img.active4").attr("src");
		if(seat==null||seat==""){//如果位置为空
			// 温馨提示跳转 调用选择对话框
			layer.open({
				title : ['温馨提示' , true],
				content: "请先选择位置"
				,btn: ['确定']
				,yes: function(index){
					layer.close(index);
				}
			});
			return ;
		}else if(txt.indexOf("morentouxiang")==-1){
			// 温馨提示跳转 调用选择对话框
			layer.open({
				title : ['温馨提示' , true],
				content: "该位置已被占用，请选择其他位置"
				,btn: ['确定']
				,yes: function(index){
					layer.close(index);
				}
			});
			return ;
		}else{
			sId=seat.substring(seat.length-1);
		}
		check(sId);
	}
	
		function sureConfirm(){
			var ticketNum=$("#ticketCount").val();
			var attNum=$("#attNum").val();//剩余 参与次数
			$("#sureConfirm").attr("disabled",true); 
			var seat=$(".active4").parent().attr("name");
			var checked=$("i.block");
			var rId=$("#roomId").val();
			var img=$("#headimg").val();
			var name=$("#memberName").val();
			var txt = $("img.active4").attr("src");
			var sId;
			var s=false;//是否可以提交
			if(seat==null||seat==""){
				// 温馨提示跳转 调用选择对话框
				layer.open({
	    		  title : ['温馨提示' , true],
                  content: "请先选择位置"
                      ,btn: ['确定']
                      ,yes: function(index){
                        layer.close(index);
                      }
                    });
				return false;
			}else if(txt.indexOf("morentouxiang")==-1){
				// 温馨提示跳转 调用选择对话框
				layer.open({
					title : ['温馨提示' , true],
					content: "该位置已被占用，请选择其他位置"
					,btn: ['确定']
					,yes: function(index){
						layer.close(index);
					}
				});
				return ;
			}else{
				sId=seat.substring(seat.length-1);
				if(sId==0){
					sId=10;
				}
				layer.open({
		    		title : ['温馨提示' , true],
	                content: "提交后不可更改，是否确定提交?",
	                btn: ['确定','修改'],
	                btn1: function(index){
	                	  s = true ;
	                      layer.close(index);
	                      $(".v_btn").removeAttr("name");
	                      suresub();
	                },
	                btn2:function(index){
                	    layer.close(index);
                    }    
	            });
			}
		  function suresub(){
			if(checked.length==0){//用户一条线都没画
		       layer.confirm('还未画线，确定要提交么?',{icon:3},// 温馨提示跳转 调用选择对话框
			      function(index){
					 if(s){//允许  提交
							var dataStr="";
							//无数据  此处for循环多余
							for(var i=0;i<10;i++){
								var pId="line_"+i;
								var iStr="";
								checked.each(function(){//遍历获取选中a标签的位置
									var yStr=$(this).attr("id");
									var parentId=$(this).parent().attr("id");// 获取父类id
									if(pId==parentId){
										iStr=yStr.substring(yStr.length-1)+",";
										
									}
								});
								if(iStr==""){
									iStr="0,"
								}
								dataStr=dataStr+iStr+";";
								
							}
							console.log(dataStr);
							$.ajax({
					            type: "POST",
					            url: base+"/game/parttake.json",
					            data: {"userData":dataStr,"roomId":rId,"positions":sId},
					            dataType: "json",
					            success: function(data){
					            	data_cache['pos']  = sId;
					            	data_cache['info'].push(dataStr);
					            	if(data.code==1){
					            		if(joinNum>1){//参与次数超过一次时
					            			if(rute_num>joinNum){//最后一次提交
						            			layer.open({
									    		     title : ['温馨提示' , true],
								                     content:"提交成功!",
								                     btn: ['确定'],
								                     yes: function(index){
							                    	    rute_num++;
							                    	    ticket_num();
									            		$(".active4").addClass("loc_active");
									            		$(".active4").attr("src","http://img.iuchou.com/"+img);
								            			var rNum=$("#remain").val();
								            			var uNum=$("#userNum").val();
									            		$("#remain").val(rNum-1);
									            		$("#userNum").val(parseInt(uNum)+1);
									            		$("#userSpan").html(parseInt(uNum)+1);
									            		$("#remainSpan").html(rNum-1);
									            		$("#ticketCount").val(ticketNum-1);
									            		var n=ticketNum-1;
									            		$("#ticketOwnNum").html(" "+n+" ");
									            		var shengyu=attNum-1;
									            		$("#attNum").val(shengyu);
									            		//重新为随机按钮 赋予 点击不提示的权限
									            		self = false;
									            		// 清除上一次的定时器
														window.clearInterval(timer);
									            		//清除当前的timer值
										            	timer = null;
									            		if(uNum==9||ticketNum==1||attNum==1){
									            			window.location.href=base+"/game/result"+rId+"/.html";
									            			window.location.hash=base+"/game/result"+rId+"/.html";
									            		}
								                        layer.close(index);
							                         }
							                    });
						            		}else{//不是最后一次提交
					                    	    
					                    	    ticket_num();
							            		$(".active4").addClass("loc_active");
							            		$(".active4").attr("src","http://img.iuchou.com/"+img);
							            		/*alert(name);*///用户名称  暂时先不加
						            			var rNum=$("#remain").val();
						            			var uNum=$("#userNum").val();
							            		$("#remain").val(rNum-1);
							            		$("#userNum").val(parseInt(uNum)+1);
							            		$("#userSpan").html(parseInt(uNum)+1);
							            		$("#remainSpan").html(rNum-1);
							            		$("#ticketCount").val(ticketNum-1);
							            		var n=ticketNum-1;
							            		$("#ticketOwnNum").html(" "+n+" ");
							            		var shengyu=attNum-1;
							            		$("#attNum").val(shengyu);
							            		//重新为随机按钮 赋予 点击不提示的权限
							            		self = false;
							            		//清除上一次的定时器
												window.clearInterval(timer);
							            		//清除当前的timer值
								            	timer = null;
								            	// 启动新的定时器
								            	run();
								            	//清除已提交的路线
								            	$("i.block").removeClass("block");
//								            	if($('.pre_btn').html()=='隐藏已设置路线'){
//								            		back_canvas(data_cache);
//								            	}
						            			layer.open({
									    		     title : ['温馨提示' , true],
								                     content:"提交成功!请获取第"+rute_num+"张券的路线",
								                     btn: ['确定'],
								                     yes: function(index){
									            		if(uNum==9||ticketNum==1||attNum==1){
									            			window.location.href=base+"/game/result"+rId+"/.html";
									            			window.location.hash=base+"/game/result"+rId+"/.html";
									            		}
							                            layer.close(index);
							                         }
							                    });
						            			rute_num++;
						            		}
					            		}else{//只参与啦一次
					            	 		layer.open({
						      	    		    title : ['温馨提示' , true],
						                        content: '提交成功!',
						                        btn: ['确定'],
						                        yes: function(index){
						                            layer.close(index);
											        $('.confirm_dialog').css('display','none');
								            		$(".active4").addClass("loc_active");
								            		$("[name=seat]").attr("src","http://img.iuchou.com/"+img);
							            			var rNum=$("#remain").val();
							            			var uNum=$("#userNum").val();
								            		$("#remain").val(rNum-1);
								            		$("#userNum").val(parseInt(uNum)+1);
								            		$("#userSpan").html(parseInt(uNum)+1);
								            		$("#remainSpan").html(rNum-1);
								            		$("#ticketCount").val(ticketNum-1);
								            		var n=ticketNum-1;
								            		$("#ticketOwnNum").html(" "+n+" ");
								            		var shengyu=attNum-1;
								            		$("#attNum").val(shengyu);
								            		//重新为随机按钮 赋予 点击不提示的权限
								            		self = false;
								            		if(uNum==9||ticketNum==1||attNum==1){
								            			window.location.href=base+"/game/result"+rId+"/.html";
								            			window.location.hash=base+"/game/result"+rId+"/.html";
								            		}
											  }
										  });
					            		}	
					            	}else if(data.code==2){
					            		layer.msg(data.message);
					            	}else{
					            		layer.msg(data.message);
					            	}
					            	$("#sureConfirm").attr("disabled",false); 
					            }
				            });
						}
			    	  layer.close(index);
			      },function(index){
			    	  s = false;
			    	  layer.close(index);
			      });
			}else{//如果用户划线了(随机+手动)
				 if(s){//允许提交
						var dataStr="";
						for(var i=0;i<10;i++) {
							var iStr = "";
							var pId="line_"+i;
							var idsarr=[];
							//遍历被点击a标签
							$(".block").each(function () {
								//获取a标签位置
								var this_index = 10-$(this).parent().parent().find("i").index($(this));
								// 获取父类id
								var parentId=$(this).parent().parent().attr("id");
								idsarr.push(parentId+this_index);
								//判断横线是否在同一列
								if(pId==parentId){
									
									iStr +=this_index+",";
								}
							});
							//如果数列没有横线数据补0
							if (iStr == "") {
								iStr = "0,"
							}
							
							dataStr+=iStr+";";
						}
						idarr.push(idsarr);
						
						$.ajax({
				            type: "POST",
				            url: base+"/game/parttake.json",
				            data: {"userData":dataStr,"roomId":rId,"positions":sId},
				            dataType: "json",
				            success: function(data){
				            	data_cache['pos']  = sId;
				            	data_cache['info'].push(dataStr);
				            	if(data.code==1){
				            		if(joinNum>1){//参与次数超过一次时
					            		if(rute_num>joinNum){//最后一次提交
				            			    rute_num++;
				                    	    ticket_num();
						            		$(".active4").addClass("loc_active");
						            		$(".active4").attr("src","http://img.iuchou.com/" +img);
						            		$(".user_out_box a").removeClass("active4")
					            			var rNum=$("#remain").val();
					            			var uNum=$("#userNum").val();
						            		$("#remain").val(rNum-1);
						            		$("#userNum").val(parseInt(uNum)+1);
						            		$("#userSpan").html(parseInt(uNum)+1);
						            		$("#remainSpan").html(rNum-1);
						            		$("#ticketCount").val(ticketNum-1);
						            		var n=ticketNum-1;
						            		$("#ticketOwnNum").html(" "+n+" ");
						            		var shengyu=attNum-1;
						            		$("#attNum").val(shengyu);
						            		//重新为随机按钮 赋予 点击不提示的权限
						            		self = false;
						            		// 清除上一次的定时器
											window.clearInterval(timer);
						            		//清除当前的timer值
							            	timer = null;
					            			layer.open({
								    		     title : ['温馨提示' , true],
							                     content:"提交成功!",
							                     btn: ['确定'],
							                     yes: function(index){
								            		if(uNum==9||ticketNum==1||attNum==1){
								            			window.location.href=base+"/game/result"+rId+"/.html";
								            			window.location.hash=base+"/game/result"+rId+"/.html";
								            	    }
							                         layer.close(index);
						                         }
						                    });
					            		}else{ //参与次数还有剩余
					            			layer.open({
								    		     title : ['温馨提示' , true],
							                     content:"提交成功!请获取第"+rute_num+"张券的路线"
							                      ,btn: ['确定']
							                      ,yes: function(index){
							                    	    rute_num++;
							                    	    ticket_num();
									            		$(".active4").addClass("loc_active");
									            		$(".active4").attr("src","http://img.iuchou.com/" +img);
									            		$(".user_out_box a").removeClass("active4");
								            			var rNum=$("#remain").val();
								            			var uNum=$("#userNum").val();
									            		$("#remain").val(rNum-1);
									            		$("#userNum").val(parseInt(uNum)+1);
									            		$("#userSpan").html(parseInt(uNum)+1);
									            		$("#remainSpan").html(rNum-1);
									            		$("#ticketCount").val(ticketNum-1);
									            		var n=ticketNum-1;
									            		$("#ticketOwnNum").html(" "+n+" ");
									            		var shengyu=attNum-1;
									            		$("#attNum").val(shengyu);
									            		//重新为随机按钮 赋予 点击不提示的权限
									            		self = false;
									            		// 清除上一次的定时器
														window.clearInterval(timer);
									            		//清除当前的timer值
										            	timer = null;
										            	// 启动新的定时器
										            	run();
										            	//清空已提交的横线
										            	$("i.block").removeClass("block");
										            	/*if($('.pre_btn').html()=='隐藏已设置路线'){
										            		back_canvas(data_cache);
										            	}*/
									            		if(uNum==9||ticketNum==1||attNum==1){
									            			window.location.href=base+"/game/result"+rId+"/.html";
									            			window.location.hash=base+"/game/result"+rId+"/.html";
									            		}
							                            layer.close(index);
						                      }
						                    });
					            		}
				            		}else{//只参与一次
					            		layer.open({
					      	    		  title : ['温馨提示' , true],
					                        content: '提交成功!'
					                            ,btn: ['确定']
					                            ,yes: function(index){
					                              layer.close(index);
										        $('.confirm_dialog').css('display','none');
							            		$(".active4").addClass("loc_active");
							            		$("[name=seat]").attr("src","http://img.iuchou.com/"+img);
							            		$(".active4").attr("src",base +img);
						            			var rNum=$("#remain").val();
						            			var uNum=$("#userNum").val();
							            		$("#remain").val(rNum-1);
							            		$("#userNum").val(parseInt(uNum)+1);
							            		$("#userSpan").html(parseInt(uNum)+1);
							            		$("#remainSpan").html(rNum-1);
							            		$("#ticketCount").val(ticketNum-1);
							            		var n=ticketNum-1;
							            		$("#ticketOwnNum").html(" "+n+" ");
							            		var shengyu=attNum-1;
							            		$("#attNum").val(shengyu);
							            		//重新为随机按钮 赋予 点击不提示的权限
							            		self = false;
							            		if(uNum==9||ticketNum==1||attNum==1){
							            			window.location.href=base+"/game/result"+rId+"/.html";
							            			window.location.hash=base+"/game/result"+rId+"/.html";
							            		}
										      }
										});
				            		}
				            	}else if(data.code==2){
				            		layer.msg(data.message);
				            		return ;
				            	}else{
				            		layer.msg(data.message);
				            	}
				            	$("#sureConfirm").attr("disabled",false); 
				            }
			            });
					}
			    }
			}
		}
		//显示隐藏 已经划过的线
		/*$(".pre_btn").click(function(){
			if($(this).html()=="显示已设置路线"){
				$(this).html("隐藏已设置路线");
				back_canvas(data_cache);
			}else{
				$(this).html("显示已设置路线");
				//清空 背景画布  重绘10条垂线
				ctx.clearRect(0,0,canvas_bg.width,canvas_bg.height);//清空画布(底层)
	    			for(var col=0;col<hor_opint;col++){
						 画10条垂直线 
	    		        var xzhou=col*w; //x轴坐标值
	    		        ctx.beginPath();
	    		        ctx.moveTo(xzhou,0);
	    		        ctx.lineTo(xzhou,canvas_bg.height);
	    		        ctx.lineWidth=1;
	    		        ctx.strokeStyle="#111";
	    		        ctx.stroke();
	    		    }
			}
		})*/
		//在背景画布上划线
		/*function back_canvas(data){
			var p = parseInt(data['pos']); //所选位置  暂时没用
			//进行数据处理
			for(var a = 0,sum_length=data['info'].length;a<sum_length;a++){
				var info = [];
			    var str = data['info'][a].split(';');
			        str.pop();
		        for(var j = 0 ,len0 =str.length;j<len0;j++){//检测其中所有数字取出
		        	var str_small ;
		        	var len_num =  str[j].match(/[0-9]/g).length; //数组长度
		            if(len_num>1){
		                str_small = str[j].split(",");
			        	for(var k =0,len1 = str_small.length,cache_num=[];k<len1;k++){
			        		cache_num.lentgh=0; //置空数组
				        	if(!isNaN(parseInt(str_small[k]))){
				        		cache_num.push(parseInt(str_small[k]));
				        	}
			        	}
			        	info.push(cache_num);
		            }else if(len_num=1){
		            	str_small = str[j].split(",");
		            	info.push([parseInt(str_small[0])]);
		            }else{
		            	
		            }
				} 
	            //划线
	            info.pop();
				for(var i = 0,len = info.length;i<len;i++){
					for(var q = 0,len_q = info[i].length;q<len_q;q++){
						if(info[i][q]==0){ //则不进行划线
							continue;
						}
				        ctx.beginPath();
						ctx.moveTo(w*i,info[i][q]*h); //起点坐标
						ctx.lineTo(w*(i+1),info[i][q]*h);    //终点坐标
				    	ctx.lineWidth=3;
				    	ctx.strokeStyle="#aaa";
				    	ctx.stroke();
					}
				}
			}
		}*/
		var isBegin=false;//是否点击过开始
		//退出房间
		function outRoom(){
			var rId=$("#roomId").val();
			var goodsId=$("#goodsId").val();
			var attNum=$("#attNum").val();
			if(!isBegin){
				window.location.href=base+"/goods/detail"+goodsId+".html";
				return false;
			}
			$.ajax({
		 		url:base+"/game/outRoom.json",
		 		type:"post",
		 		data:{rId:rId,attNum:attNum},
		 		async: false,
		 		success:function(result){
		 			if(result.code == "1"){
		 				window.location.href=base+"/goods/detail"+goodsId+".html";
		 			}else{
		 				layer.msg(result.message);
		 
		 			}
		 		}
		 	});
		}
		//开始游戏 
	var rNum;
	var joinNum = 0;//游戏初始参与次数
	function begin(){
	 	data_cache.length=0;
		var attNum= joinNum= $("#qty").val();//参与次数
		//初始参与次数
		var rId=$("#roomId").val();//房间id
		var val = $("#qty").val();
		var num_max = $("#ticketOwnNum").text();
		isBegin=true;
		 //修改设置次数
		if((val*1) <= (num_max*1)){
			 $.ajax({
		 		url:base+"/game/updateActiveNum.json",
		 		type:"post",
		 		data:{rId:rId,attNum:attNum},
		 		async: false,
		 		success:function(result){
		 			if(result.code==1){
		 				$("#attNum").val(attNum);
		 				$(".bg_box").remove();
		 				$(".room-details-1").remove();
		 				$(".count_user").html(val);
		 				/* 调用倒计时 */
		 				run(); 
		 				$(".progress").addClass("progress_start");
		 				if(attNum==1){
		 					$(".pre_btn").css('display','none');
		 					$(".pre_btn").attr('disabled','false');
		 				}
		 			}else{
		 				layer.msg(result.message+"，本房间剩余"+$("#qty").attr("max")+"人次");
		 			}
		 		}
		 	});
		 }else  if((val*1) > (num_max*1)){
			 layer.msg("您的参与次数超出拥有的参与券数量！",{time:3000});
		 }
	}
		
	//以下是socket 通信
	$(function(){
	    function parseObj(strData){//转换对象
	        return (new Function( "return " + strData ))();
	    };
	    //创建socket对象
	    socket = new WebSocket("ws://"+ window.location.host+"/"+base+"/roomInfo/"+rId+"/info");
	    //连接创建后调用
	    socket.onopen = function() {
	       
	    };
	    //接收到服务器消息后调用
	    socket.onmessage = function(message) {
	        if(message.data!=null){
	        	var data=parseObj(message.data);
        		var userNum=$("#userSpan").html();//以参与人数
        		var remainNum=$("#remainSpan").html();//剩余人数
        		if(data.data.num!=userNum){
        			rNum=parseInt(10)-parseInt(data.data.num);
        			if(rNum==0){
        				window.location.href=base+"/game/result"+rId+"/.html";
            			window.location.hash=base+"/game/result"+rId+"/.html";
        			}else{
        				$("#userSpan").html(data.data.num);
            			$("#remainSpan").html(rNum);
            			$("#qty").attr("max",rNum);
            			for(var i=0;i<data.data.mgList.length;i++){//遍历参与者头像信息
            				for(var j=0;j<10;j++){
            					var seat=j+1;
            					if(data.data.mgList[i].mg_member_seat==seat){
            						 $("#img"+seat).attr("src","http://img.iuchou.com/" +data.data.mgList[i].icon_picture);//获奖人头像
            						 $("#p"+seat).find("img").addClass("loc_active");
            						 $("#p"+seat).find("img").removeClass("active4");
            					}
            				}
            			}
        			}
        		}
	        }
	    };
	    //关闭连接的时候调用
	    socket.onclose = function(){
	        //alert("close");
	    };
	    //出错时调用
	    socket.onerror = function() {
	        //alert("error");
	    };
	   //无限循环获取结果
	    function getResult(){ 
    		socket.send("123");
    	} 
    	//重复执行某个方法 
    	var t1=window.setInterval(getResult,2000); 
	});

//引导步骤
function guide_fun(){
	step1();
}
function step1(){
	//第一步
	for(var i=1; i<=10; i++){
		var img=$(".geme_location").find("a>img[src='/assets/images/morentouxiang.png']").eq(0);
		var imgId=img.attr("id");
		img.parents("a").addClass("step step1 ys");
		img.click();
		if(imgId=="img8" || imgId=="img9" || imgId=="img10"){
			$(".step1").append("<div class='stepsay step1say step1say_last'>点击头像选定想选的位置<div class='clearfix'><a class='next next1'>下一步</a></div></div>");
		}else{
			$(".step1").append("<div class='stepsay step1say'>点击头像选定想选的位置<div class='clearfix'><a class='next next1'>下一步</a></div></div>");
		}
		
		$("#wrapper").append("<div class='step_out'></div>");
		
		//第二步
		$("#wrapper").find(".next1").click(function(){
			step2();
		});
	}
	
	
	
	
}
function step2(){
	var left=0,
		top=0,
		wid=$("#line_2>#a4").outerWidth(),
		hei=$("#line_2>#a4").outerHeight();
	
	if($(".game-box").find("a[name='block']").length>=10){
		$(".game-box").find("a[name='block']").eq(0).click();
		var line_n=$(".game-box").find("a[name='block']").eq(0).parents("div").attr("id");
		console.log(line_n);
		var a_n=$(".game-box").find("a[name='block']").eq(0).attr("id");
		$("#"+line_n).append("<div class='step step2'></div>");
		left=$("#"+line_n+">#"+a_n).css("left");
		top=$("#"+line_n+">#"+a_n).css("top");
	}else{
		left=$("#line_2>#a4").css("left");
		top=$("#line_2>#a4").css("top");
		if($("#line_2>#a4").attr("name")!="block"){
			$("#line_2>#a4").click();
		}
		$("#line_2").append("<div class='step step2'></div>");
	}
	$(".ys").removeClass('step step1');
	$(".step1say").remove();
	$(".step2").css({"width":wid,"height":hei,"left":left,"top":top});
	$(".step2").append("<div class='stepsay step2say'>点击空白处即可划线<div class='clearfix'><a class='pro pro1'>上一步</a><a class='next next2'>下一步</a><div></div>");
	
	//第三步
	$("#wrapper").find(".next2").click(function(){
		step3();
	});
	$("#wrapper").find(".pro1").click(function(){
		step1();
		$(".step2").remove();
	});
}
function step3(){
	$(".step2").remove();
	$(".box").append("<div class='step step3'></div>");
	$(".step3").append("<div class='stepsay step3say'>如果相邻的两条线段并排出现，则前面一条线的右端会自动降低半格<div class='clearfix'><a class='pro pro2'>上一步</a><a class='next next3'>下一步</a><div></div>");
	
	//第四步
	$("#wrapper").find(".next3").click(function(){
		step4();
	});
	$("#wrapper").find(".pro2").click(function(){
		step2();
		$(".step3").remove();
	});
}
function step4(){
	$(".step3").remove();
	$(".box").append("<div class='step step4'></div>");
	$(".step4").append("<div class='stepsay step4say'>同一个位置多个人设定线个数为奇数保留，偶数则取消<div class='clearfix'><a class='pro pro3'>上一步</a><a class='next next4'>下一步</a><div></div>");
	
	//第五步
	$("#wrapper").find(".next4").click(function(){
		step5();
	});
	$("#wrapper").find(".pro3").click(function(){
		step3();
		$(".step4").remove();
	});
}
function step5 () {
	$(".step4").remove();
	$(".btn_rondom").append("<div class='step step5'></div>");
	$(".step5").append("<div class='stepsay step5say'>也可点击“随机生成”<div class='clearfix'><a class='pro pro4'>上一步</a><a class='next next5'>下一步</a><div></div>");
	radom();
	//第六步
	$("#wrapper").find(".next5").click(function(){
		step6();
	});
	$("#wrapper").find(".pro4").click(function(){
		$(".step5").remove();
		context.clearRect(0,0,canvas.width,canvas.height);
		$(".v_btn").removeAttr("name");
		step4();
	});
}
function step6 (){
	$(".step5").remove();
	$(".btn_submit").append("<div class='step step6'></div>");
	$(".step6").append("<div class='stepsay step6say'>完成后点“提交”即可<div class='clearfix'><a class='pro pro5'>上一步</a><a class='next next6'>下一步</a><div></div>");
	$(".step_out").addClass("step_out6").removeClass("step_out5");
	
	//第七步
	$("#wrapper").find(".next6").click(function(){
		step7();
	});
	$("#wrapper").find(".pro5").click(function(){
		step5();
		$(".step6").remove();
	});
}
function step7 (){
	var wids=$(".left_info_box").outerWidth(),
		heis=$(".left_info_box").outerHeight();
	$(".step6").remove();
	$(".box").append("<div class='step step7'></div>");
	$(".step7").append("<div class='stepsay step7say'>会根据您选择的位置向下运动，碰到横线就转弯只    到终点得到相应奖品<div class='clearfix'><a class='pro pro6'>上一步</a> <a class='next i_know'>我知道了</a><div></div>");
	$(".left_info_box").append("<div class='step7left'></div>");
	//第八步
	$(".i_know").click(function(){
		i_know();
	});
	$("#wrapper").find(".pro6").click(function(){
		step6();
		$(".step7").remove();
		$(".step7left").remove();
	});
}
function i_know (){
	$(".step_out").remove();
	$(".step7").remove();
	$(".step7left").remove();
}
	
	

 