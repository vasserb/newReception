window.onload = function(){
	setdate();
	SetUser();
	$('#FreeDates').on('change', function(){ViewTime()});

}

function setdate(){
	try{
		var dat=getQueryVariable("dat");
		$('#FreeDates').val(dat);
		ViewTime();
	}catch{

	}
}


//Кусок отвечает за выбор дат и времени
//получение данных  с ервера
function SetUser(){
	$("#url").val(getQueryVariable("url"));
	GetUser();
	/*var url = "https://apache.school1298.ru/reception/manage/api/currentusername.php";
 	$.ajax({
		url: url,
		type: "GET",
		success: function(data, request){$("#url").val(data);GetUser()}
	});*/
}

function getQueryVariable(variable){
	var query = window.location.search.substring(1);
	var vars = query.split("&");
	for (var i=0;i<vars.length;i++) {
		var pair = vars[i].split("=");
		if(pair[0] == variable){return pair[1];}
	}
	return(false);
}

function GetUser(){
	var param = $("#url").val();
	var arch = getQueryVariable("arch");
	if(arch=="yes"){
		param=param+"&archive=yes";
	}
	var url = "api/take.php?url="+param;
 	$.ajax({
		url: url,
		dataType: "json",
		type: "GET",
		success: PharseUser,
		error: onerr,
	});
}

function onerr(xhr){
	if(xhr.status!='200'){
		empty('Ошибка. Проверьте адрес')
	}
}

function PharseUser(data, request,xhr) {
	if(xhr.status=='200'){
		if(data.dates!=""){
			var FIO = data.FIO;
			var Place = data.Place;
			var dates = [];
			var len = data.dates.length;
			for (var i = 0; i < len; i++) {
				var it = data.dates[i];
				if(it.Time!=""){
					dates.push({
						IdDate: it.IdDate,
						Date: it.Date,
						Time: it.Time,
					});
					var string = 'idday'+it.IdDate;
					window[String(string)] = it.Time;
				}
			}
			UserToHtml(FIO,Place,dates);
		}else{
			alert('Ошибка. Нет доступных дат для записи')
		}
	}else{
		alert('Ошибка. Проверьте адрес')
	}
}

function UserToHtml(FIO,Place,dates){
	$('#FIODescr').append(''+FIO);
	$('#PlaceDescr').append('Место приёма: '+Place);
	if(dates.length>0){
		for (var i = 0; i < dates.length; i++) {
			var disabled = "";
	    	$('#FreeDates').append('<option value="'+dates[i].IdDate+'">'+dates[i].Date+'</option>');
		}
	}else{
		$('#FreeDates').append('<option selected="selected">Нет доступного времени для записи</option>')
	}
	$('.loaderdiv').fadeOut();
	Autonext();
}

function Autonext(){
	var dat=getQueryVariable("dat");
	$("#FreeDates").val(dat);
	ViewTime();

}


function ViewTime(){
	$('.loaderdiv').show();
	try{
		$("#TimeLists").empty();
		$("#buttondiv").remove();
		var IdDate = $('#FreeDates').val()
		var time = window[String('idday'+IdDate)]
		if (time.length>0){
		//console.log(time);
			$("#TimeLists").append('<table class="bluetable" cellspacing="0"><thead><tr><th>Время</th><th>ФИО посетителя</th><th>ФИО и класс ребенка</th><th>Вопрос</th><th>телефон</th><th>Дата записи</th><th></th></tr></thead><tbody id="tbdy"></tbody></table>');
			for (var i = 0; i < time.length; i++) {
				$("#tbdy").append('<tr v-time="'+time[i]+'"><td>'+time[i]+'<b></b></td><td></td><td></td><td></td><td></td><td></td><td></td></tr>')
			}
			GetEvents();
		}
		//var destination = $('#TimeList').offset().top;
		//$('html, body').animate({ scrollTop: destination }, 1000);
	}catch{
		console.log("Пустой элемент")
		$('.loaderdiv').fadeOut();
	}
};



function GetEvents(){
	var IdDate = $('#FreeDates').val()
	
	var url = "api/takeevent.php?IdDate="+IdDate;
 	$.ajax({
		url: url,
		dataType: "json",
		type: "GET",
		success: PharseEvent,
		error: onerr,
	});
}




function PharseEvent(data, request){
	var len = data.length;
	for (var i = 0; i < len; i++) {
		var it = data[i];
		if (it.CreateTime == '0000-00-00 00:00:00'){
			var RuCreateTime = 'Нет даты';
		}else{
			var createTime = new Date(it.CreateTime+'');
			var RuCreateTime = addNull(createTime.getDate())+"."+addNull(createTime.getMonth()+1)+"."+createTime.getFullYear() +" "+ addNull(createTime.getHours())+":"+addNull(createTime.getMinutes());
		}
		$('tr[v-time="'+it.Time+'"]:parent').html('<td>'+it.Time+'</td><td>'+it.FIO+'</td><td>'+it.FIOChild+'</td><td>'+it.DopInfo+'</td><td nowrap>'+it.Tel+'</td><td nowrap>'+RuCreateTime+'</td><td><span class="xdel" onclick="delevent(\''+it.Id+'\')">X</span></td>')
	}
	try{
		if (data.status=="Ничего не найдено"){
			$("#tbdy").prepend('<tr><td colspan="7">На эту дату нет записей</td></tr>')
		}
	}catch{}
	$('.loaderdiv').fadeOut();
}

function addNull(add){
	if (Number(add)<10){
		return ("0"+add);
	}else{
		return(""+add);
	}
}



function empty(error){
	$('.loaderdiv').html('');
	$('.loaderdiv').append('<div class="err">'+error+'</div>')
}

function delevent(id){
	if (confirm('Вы дествительно хотите отменить данную запись?')) {
		var url = "api/del.php?Id="+id;
	 	$.ajax({
			url: url,
			dataType: "json",
			type: "GET",
			success: refresh,
			error: onerr,
		});	
	} else {
	}
}

function refresh(){
	var IdDate = $('#FreeDates').val();
	location.href="take.html?dat="+IdDate;
}