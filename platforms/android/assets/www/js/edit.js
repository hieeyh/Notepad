$(function(){

	showTime();
	//给录音按钮添加事件
	addRecordEvent();
	getThisNote();

	//给删除按钮添加事件
	$("#deleteicon").on("touchstart", deleteNote);
	$("#deleteicon").on("touchend", sendDeleteMessage);

	//给完成按钮添加事件
	$("#myfinish").on("touchstart", storeNoteAgain);
	$("#myfinish").on("touchend", sendMessage);	

	//给手机返回按钮添加事件
	document.addEventListener("backbutton", onBackKeyDown, false);	
});

function onBackKeyDown() {
	window.location="index.html";
}

function getThisNote() {

	var database = window.openDatabase('notebookdb', '1.0','记事本数据', 10*1024*1024);

	database.transaction(function(tx){
	var sql = "SELECT * FROM mynotebook";
	tx.executeSql(sql, [], loadThisNote, queryError);
	});
}

function loadThisNote(tx, result) {

	var str = window.location.href; //取地址参数部分
	var mystr = str.toString();
	var myid = mystr.split('?')[1];

	var mytitle = $("#title");
	var mycontent = $("#content");

	//获取所有记录行
	var rowList = result.rows;
	//获取每个记录行
	for(var i = 0; i < rowList.length; i++) {
		if(rowList.item(i).id == myid){
			var searchid = i;
		}
	}

	mytitle.val(result.rows.item(searchid).title);
	mycontent.val(result.rows.item(searchid).content);
}

function deleteNote() {
	//window.plugins.toast.showShortBottom('确定删除该便签？');

	try{
        var db = window.openDatabase('notebookdb', '1.0','记事本数据', 10*1024*1024);
    }catch(err){
        alert(err.message);
    }
    if(!db) alert("不能链接到数据库");

    var str = window.location.href; //取地址参数部分
	var mystr = str.toString();
	var myid = mystr.split('?')[1];

	myid = parseInt(myid);

	var result = confirm("确定删除此标签？");

	if(result) {
		db.transaction(function(tx) {
    		tx.executeSql("DELETE FROM mynotebook WHERE id = '" + myid + "'");
    	});
		sendDeleteMessage();
	}

}

function sendDeleteMessage() {

	window.location="index.html";
}

function storeNoteAgain() {

	var isTitleNull = ($("input[type=text]").val().length == 0);
	var isContentNull = ($("textarea").val().length == 0);

	//判断输入内容是否为空，为空则直接跳转到首页
	if( isTitleNull && isContentNull ){
		$("#myfinish").attr("href","index.html");
	}else{
//		console.log('插入数据准备');
		updateNoteToDB();
	}
}

function updateNoteToDB() {

	//打开数据库，准备往里面存入数据
	try{
        var db = window.openDatabase('notebookdb', '1.0','记事本数据', 10*1024*1024);
    }catch(err){
        alert(err.message);
    }
    if(!db) alert("不能链接到数据库");

	db.transaction(function(tx) {

		tx.executeSql("SELECT * FROM mynotebook", [], checkIfNewData, queryError);
	});	
}

function checkIfNewData(tx, result) {

	var str = window.location.href; //取地址参数部分
	var mystr = str.toString();
	var myid = mystr.split('?')[1];

	myid = parseInt(myid);

	var mytitle = $("input").val();
	var mycontent = $("textarea").val();
	var mydate = showTime();

	for(var i = 0; i < result.rows.length; i++){	
		var id = result.rows.item(i).id;			
		if(myid === id && (mytitle !== result.rows.item(i).title || mycontent !== result.rows.item(i).content)) {
			console.log("zhege")
			tx.executeSql("DELETE FROM mynotebook WHERE id = '" + myid + "'");
			tx.executeSql("insert into mynotebook (title, content, date) values (?, ?, ?)",[mytitle,mycontent,mydate]);
		} 
	}
}