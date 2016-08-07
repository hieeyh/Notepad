//录音文件
var src = "myrecording.amr";
var oMedia = new Media(src,
	function() {
		console.log("录制完成。");
	},
	function(err) {
		console.log("录制过程出现错误: " + err.code);
	});

//检查数据表是否存在的函数
$(function() {

	document.addEventListener("deviceready", onDeviceReady, false);

	//加载录音按钮监听事件
	addRecordEvent();

//	try{
//       var db = window.openDatabase('notebookdb', '1.0','记事本数据', 10*1024*1024);
//       // console.log("success!");
//   }catch(err){
//       alert(err.message);
//   }
//
//   if(!db) alert("不能链接到数据库");
//
//	db.transaction(isDatatableExist);

	//搜索按钮添加事件监听
	$("#searchbutton").on("touchend", searchDataTable);

	//给录音按钮添加事件
	$("#recordicon").on("touchstart", startSpeechRecord);
	$("#recordicon").on("touchend", endSpeechRecord);

});

function startSpeechRecord() {
	oMedia.startRecord();
}

function endSpeechRecord() {
	oMedia.stopRecord();
}

function onDeviceReady() {

	//建立或者连接数据库
    try{
        var db = window.openDatabase('notebookdb', '1.0','记事本数据', 10*1024*1024);
    }catch(err){
        alert(err.message);
    }

    if(!db) alert("不能链接到数据库");

	db.transaction(isDatatableExist);	

	//给手机返回按钮添加事件
	document.addEventListener("backbutton", onBackKeyDown, false);	
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
}

//检测数据表成功调用
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
			var database = window.openDatabase('notebookdb', '1.0','记事本数据', 10*1024*1024);
			database.transaction(function(tx){
				var sql = "SELECT * FROM mynotebook";
				tx.executeSql(sql, [], loadNoteData, queryError);
			});
		} else{
			//数据表不存在进行下一步操作
			var sql;
			sql = "create table if not exists mynotebook(id INTEGER PRIMARY KEY AUTOINCREMENT, title TEXT, content TEXT, date TEXT)";
        	tx.executeSql(sql);
		}
	}catch(err){
		console.log(err.message);
	}
}

//数据表存在时调用，加载数据
function loadNoteData(tx, result) {

	var listElement = $("#allcontent");
	var len = result.rows.length;
	var output = '';

	for(var i = 0; i <len; i++){
		if(result.rows.item(i).title==='') {
			output = '<li id ="title'+ result.rows.item(i).id + '">' + 
			'<a href="edit.html'+ '?' + result.rows.item(i).id +'">' + '无标题' +'</a>' + '<span>' + result.rows.item(i).date + '</span>' +'</li>' + output;
		} else {
			output = '<li id ="title'+ result.rows.item(i).id + '">' + 
			'<a href="edit.html'+ '?' + result.rows.item(i).id +'">' + result.rows.item(i).title +'</a>' + '<span>' + result.rows.item(i).date + '</span>' +'</li>' + output;
		}
	}

	listElement.html('<ul>' + output + '</ul>');
}

//搜索操作
function toSearchNoteData(tx, result) {

	//搜索框中的数据
	var searchValue = $("#searchtext").val();

	//存储搜索到的数据
	var contentToShow = new Array();

	//开始搜索
	var index = new Array();

	for(var i = 0; i < searchValue.length; i++) {
		for(var j = 0; j < result.rows.length; j++){
			index[j] = false;		
			var title = result.rows.item(j).title;			

			if(title.indexOf(searchValue.charAt(i)) !== -1) {
				index[j] = true;
			}
		}
	}

	//存储搜索到的数据
	for(var j = 0, k = 0; j < result.rows.length; j++){
		if(index[j] === true) {
			contentToShow[k] = [result.rows.item(j).id, result.rows.item(j).title, result.rows.item(j).date];
			k++;
		}
	}

	if(searchValue !== "") {
		// 显示搜索到的数据
		var listElement = $("#allcontent");
		var output = '';
		listElement.html(output);
	
		for(var i = 0; i <contentToShow.length; i++){
			output = '<li id ="title' + contentToShow[i][0] + '">' + 
			'<a href="edit.html'+ '?' + contentToShow[i][0] +'">' + contentToShow[i][1] +'</a>' + '<span>' + contentToShow[i][2] + '</span>' +'</li>' + output;
		}

		listElement.html('<ul>' + output + '</ul>');			
	} else {
		//搜索内容为空，显示所有数据
		var database = window.openDatabase('notebookdb', '1.0','记事本数据', 10*1024*1024);
		database.transaction(function(tx){
			var sql = "SELECT * FROM mynotebook";
			tx.executeSql(sql, [], loadNoteData, queryError);		
		});
	}

}

function onBackKeyDown() {  

	navigator.app.exitApp();
}  




