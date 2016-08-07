//检查数据表是否存在的函数
$(function() {
	document.addEventListener("deviceready", onDeviceReady, false);
	addRecordEvent();
	loadNoteData();
});

function onDeviceReady() {
	//创建数据库或者建立连接
    try{
        var db = window.openDatabase('notebookdb', '1.0','记事本数据', 10*1024*1024);
    }catch(err){
        console.log(err.message);
    }

    if(!db) console.log("不能链接到数据库");
	db.transaction(callback);		
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

		} else{
			//数据表不存在进行下一步操作
			var sql;
			sql = "CREATE TABLE notebook(ID INTEGER AUTOINCREMENT, TITLE TEXT NOT NULL, CONTENT TEXT, DATE TEXT NOT NULL)";
        	tx.executeSql(sql);
		}
	}catch(err){
		console.log(err.message);
	}
}

function checkTableIsExistError(tx,err) {
	console.log(err.message);
}

function callback(tx) {
	//在事务中执行SQL操作
	var sql;
	sql = "SELECT COUNT(*) AS CNT FROM sqlite_master where type='table' and name='notebook'";
	tx.executeSql(sql, [], checkTableIsExistResult,checkTableIsExistError);
}

//录音按钮事件
function addRecordEvent() {
	$("#record-icon").on("touchstart", function() {
		$(this).attr('src', "images/record_down.png");  
		$(this).css("width", "54px");
		$(this).css("height", "54px");
		$(".record").css("bottom", "16px");
	});
	$("#record-icon").on("touchend", function() {
		$(this).attr('src', "images/record.png"); 
		$(this).css("width", "50px");
		$(this).css("height", "50px");
		$(".record").css("bottom", "18px");
	});		
}

function loadNoteData() {
	
}






