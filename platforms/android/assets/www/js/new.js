$(function() {

	showTime();
	//给录音按钮添加事件
	addRecordEvent();

	//给完成按钮添加事件
	$(".btnfinish").on("touchstart", storeNote);
	$(".btnfinish").on("touchend", sendMessage);	

	//给手机返回按钮添加事件
	document.addEventListener("backbutton", onBackKeyDown, false);	
});

function onBackKeyDown() {
	window.location="index.html";
}

function storeNote() {

	var isTitleNull = ($("input[type=text]").val().length == 0);
	var isContentNull = ($("textarea").val().length == 0);

	//判断输入内容是否为空，为空则直接跳转到首页
	if( isTitleNull && isContentNull ){
		$("#myfinish").attr("href","index.html");
	}else{
		addNoteToDB();
	}
}

function addNoteToDB() {

	//打开数据库，准备往里面存入数据
	try{
        var db = window.openDatabase('notebookdb', '1.0','记事本数据', 10*1024*1024);
    }catch(err){
        alert(err.message);
    }
    if(!db) alert("不能链接到数据库");

	db.transaction(isDatatableExist);	
}

function checkTableIsExistResult(tx, result) {

	var isExist = false;
	try{
		//判断是否返回了数据
		if(result.rows.length == 1){
			var row = result.rows.item(0);
			if(row.CNT==1){
				isExist = true;
			}
		}
		if(isExist){
			//数据表存在进行下一步操作
			var mysql;
			var mytitle = $("input").val();
			var mycontent = $("textarea").val();
			var mydate = showTime();

			tx.executeSql("insert into mynotebook (title, content, date) values (?, ?, ?)",[mytitle,mycontent,mydate]);
		} else{
			//数据表不存在进行下一步操作
			var mysql;
			mysql = "create table if not exists mynotebook(id INTEGER PRIMARY KEY AUTOINCREMENT, title TEXT, content TEXT, date TEXT)";
        	tx.executeSql(mysql);
		}
	}catch(err){
		alert(err.message);
	}
}
