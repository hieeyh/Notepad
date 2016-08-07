//判断数据表是否存在
function isDatatableExist(tx) {

	//在事务中执行SQL操作
	var sql;
	sql = "SELECT COUNT(*) AS CNT FROM sqlite_master where type='table' and name='mynotebook'";
	tx.executeSql(sql, [], checkTableIsExistResult, checkTableIsExistError);
}

function queryError(tx, err){

	alert(err.message);
}

function checkTableIsExistError(tx,err) {  

	alert(err.message);
}

//加载录音按钮事件
function addRecordEvent() {

	//按下
	$("#recordicon").on("touchstart", function() {
		$(this).attr('src', "img/record_down.png");
		$(this).css("width", "76px");
		$(this).css("height", "76px");
		$(".record").css("bottom", "16px");

	});
	//抬起
	$("#recordicon").on("touchend", function() {
		$(this).attr('src', "img/record.png");
		$(this).css("width", "68px");
		$(this).css("height", "68px");
		$(".record").css("bottom", "20px");
	});		
}


function searchDataTable() {

	//打开数据库
	try{
        var db = window.openDatabase('notebookdb', '1.0', '记事本数据', 10*1024*1024);
        // console.log("success!");
    }catch(err){
        alert(err.message);
    }
    if(!db) alert("不能链接到数据库");

	db.transaction(function(tx) {
		var sql = "SELECT * FROM mynotebook";
		tx.executeSql(sql, [], toSearchNoteData, queryError);
	});

	$("li#allselect").html("全选");
}

//显示时间
function showTime() {

	var date = new Date();
	var month = date.getMonth()+1;
	var day = date.getDate();
	var hour = date.getHours();
	var minute = date.getMinutes();
	// var second = date.getSeconds();

	if(month < 10) month = '0'+ month;
	if(day < 10) day = '0' + day;
	if(hour < 10) hour = '0' + hour;
	if(minute < 10) minute = '0' + minute;
	// if(second < 10) second = '0' + second;
	
	$("#time").html(month+"月"+day+"日"+hour+":"+minute);

	var mydate = month+"/"+day+" "+hour+":"+minute;

	return mydate;
}

function sendMessage() {

	$("#myfinish").attr("href","index.html");
}

