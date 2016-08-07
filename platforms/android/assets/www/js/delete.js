$(function(){

	try{
        var db = window.openDatabase('notebookdb', '1.0','记事本数据', 10*1024*1024);
        // console.log("success!");
    }catch(err){
        alert(err.message);
    }
    if(!db) alert("不能链接到数据库");
	
	db.transaction(isDatatableExist);

	//搜索按钮添加事件监听
	$("img#searchbutton").on("touchend", searchDataTable);

	//全选按钮添加事件监听
	$("li#allselect").on("touchend", allSelect);

	//给动态生成的li添加事件
	$(document).on("touchend", "section#allcontent ul li", noteToDeleteOrNot);

	//删除按钮添加事件监听
	$("#deletebutton").on("touchend", toDeleteNote);

	//给手机返回按钮添加事件
	document.addEventListener("backbutton", onBackKeyDown, false);	
});

function onBackKeyDown() {
	if($("li#allselect").html()==="全不选") {
		window.location="delete.html";
	} else {
		window.location="index.html";
	}

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

function loadNoteData(tx, result) {

	var listElement = $("#allcontent");
	var len = result.rows.length;
	var output = '';
	// console.log(len);
	for(var i = 0; i <len; i++){
		if(result.rows.item(i).title==='') {
			output = '<li id ="title'+ result.rows.item(i).id + '">' + 
			'<span class="the-title">' + '无标题' +'</span>' + '<span>' + result.rows.item(i).date + '</span>' +'</li>' + output;			
		} else {
			output = '<li id ="title'+ result.rows.item(i).id + '">' + 
			'<span class="the-title">' + result.rows.item(i).title +'</span>' + '<span>' + result.rows.item(i).date + '</span>' +'</li>' + output;
		}
	}

	listElement.html('<ul>' + output + '</ul>');

	if(len === 0) {
		window.location="index.html";
	}
}

function allSelect() {
	
	//全选全不选变换，并作相应处理
	if($(this).html() === "全选"){
		$(this).html("全不选");
		$("#allcontent ul li a").css("background-color", "rgba(235, 235, 235, 0.6)");
		$("#allcontent ul li span").css("background-color", "rgba(235, 235, 235, 0.6)");	
		$(".record input").removeClass('deletedisable');
		$(".record input").addClass('deleteable');
		$("#allcontent ul li").addClass('todelete');
	}
	else{
		$(this).html("全选");
		$("#allcontent ul li a").css("background-color", "#ffffff");
		$("#allcontent ul li span").css("background-color", "#ffffff");
		$(".record input").removeClass('deleteable');
		$(".record input").addClass('deletedisable');
		$("#allcontent ul li").removeClass('todelete');		
	}		

}
var db = window.openDatabase('notebookdb', '1.0','记事本数据', 10*1024*1024);


function toDeleteNote() {

	//window.plugins.toast.showShortBottom('确定删除选中便签？');

	var allNoteToDelete = $(".todelete");
	var db = window.openDatabase('notebookdb', '1.0','记事本数据', 10*1024*1024);

	var result = confirm("确定删除选中标签？");
	if(result) {
		for(var i = 0; i < allNoteToDelete.length; i++) {

    		(function(j){
    			var deleteid = allNoteToDelete[j].id;
    			var strid = deleteid.split('e')[1];
    			var id = parseInt(strid);
    			db.transaction(function(tx) {
    				var sql = "DELETE FROM mynotebook WHERE id = '" + id + "'";
    				tx.executeSql(sql);
    			});
    		})(i);
    	}

    	db.transaction(function(tx) {
    		tx.executeSql("SELECT * FROM mynotebook", [], loadNoteData, queryError);
    	});
    	window.location="delete.html";
	} else {
		window.location="delete.html";
	}
	$(".record input").removeClass('deleteable');
	$(".record input").addClass('deletedisable');
}

function noteToDeleteOrNot() {

	if($(this).hasClass('todelete')) {
		$(this).removeClass('todelete');
		$(this).children().css("background-color", "#ffffff");
	} else {
		$(this).addClass('todelete');
		$(this).children().css("background-color", "rgba(235, 235, 235, 0.6)");
	}

	//判断是否还有元素被选中
	if($("section#allcontent ul li").hasClass("todelete")) {
		$(".record input").removeClass('deletedisable');
		$(".record input").addClass('deleteable');			
	} else {
		$(".record input").removeClass('deleteable');
		$(".record input").addClass('deletedisable');	
	}

	//判断是否有元素没有被选中
	var allNote = $("section#allcontent ul li");
	var j = 0;
	for(var i = 0; i < allNote.length; i++) {
		if(allNote[i].className == "todelete") {
			j++;
		}
	}

	if(allNote.length===j) {
		$("li#allselect").html("全不选");
	} else {
		$("li#allselect").html("全选");
	}
}

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
			output = '<li id ="title'+ contentToShow[i][0] + '">' + 
			'<span class="the-title">' + contentToShow[i][1] +'</span>' + '<span>' + contentToShow[i][2] + '</span>' +'</li>' + output;
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



