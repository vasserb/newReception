window.onload = function(){
	$('#AddDates').datepicker({
		inline:true,
		multipleDates: true,
		multipleDatesSeparator: ";",
		onSelect: function(formattedDate, date, inst){
			UpdateDates();
		}
	})

	var slider = document.getElementById('slider');
	noUiSlider.create(slider, {
	    start: ["16:00", "18:45"],
	    connect: true,
	    step: 1,
	    range: {
	    	'min': 0,
	        'max': 51,
	    },
	    format: {
	        to: function (value) {
	        	var a = times();
	            return a[Math.round(value)];
	        },
	        from: function (value) {
	        	var a = times();
	            return Number(a.indexOf(value));
	        },
	    },
	    tooltips: true,
	});
	$('.loaderdiv').fadeOut();
}
//Кусок отвечает за выбор дат и времени
function UpdateDates(){
	var a=$("#AddDates").val().split(";")
	$("#SelectedDatesList").html('');
	if (a[0] != ""){
		for (i=0;i<a.length;i++){
				$("#SelectedDatesList").append('<span class="date" onclick="deltime(\''+a[i]+'\')">'+a[i]+'</span>');
		}
	}
}

function times(){
	var inter = $('#interval').val();
	var time15 = ["8:00","8:15","8:30","8:45","9:00","9:15","9:30","9:45","10:00","10:15","10:30","10:45","11:00","11:15","11:30","11:45","12:00","12:15","12:30","12:45","13:00","13:15","13:30","13:45","14:00","14:15","14:30","14:45","15:00","15:15","15:30","15:45","16:00","16:15","16:30","16:45","17:00","17:15","17:30","17:45","18:00","18:15","18:30","18:45","19:00","19:15","19:30","19:45","20:00","20:15","20:30","20:45"];
	var time10 = ["8:00","8:10","8:20","8:30","8:40","8:50","9:00","9:10","9:20","9:30","9:40","9:50","10:00","10:10","10:20","10:30","10:40","10:50","11:00","11:10","11:20","11:30","11:40","11:50","12:00","12:10","12:20","12:30","12:40","12:50","13:00","13:10","13:20","13:30","13:40","13:50","14:00","14:10","14:20","14:30","14:40","14:50","15:00","15:10","15:20","15:30","15:40","15:50","16:00","16:10","16:20","16:30","16:40","16:50","17:00","17:10","17:20","17:30","17:40","17:50","18:00","18:10","18:20","18:30","18:40","18:50","19:00","19:10","19:20","19:30","19:40","19:50","20:00","20:10","20:20","20:30","20:40","20:50"];
	var time20 = ["8:00","8:20","8:40","9:00","9:20","9:40","10:00","10:20","10:40","11:00","11:20","11:40","12:00","12:20","12:40","13:00","13:20","13:40","14:00","14:20","14:40","15:00","15:20","15:40","16:00","16:20","16:40","17:00","17:20","17:40","18:00","18:20","18:40","19:00","19:20","19:40","20:00","20:20","20:40"];
	var time30 = ["8:00","8:30","9:00","9:30","10:00","10:30","11:00","11:30","12:00","12:30","13:00","13:30","14:00","14:30","15:00","15:30","16:00","16:30","17:00","17:30","18:00","18:30","19:00","19:30","20:00","20:30","21:00"];
	
	var time = eval('time'+inter);
	return time;
}

function setrange(){
	time = times();
	var a = time.length - 1;
	slider.noUiSlider.updateOptions({
        range: {
            'min': 0,
            'max': a
        }
    });
    slider.noUiSlider.set([time[0], time[a]]);
}

function filterarray(){
	var fltr = slider.noUiSlider.get();
	var time = times();
	var arr = [];
	for (i=time.indexOf(fltr[0]);i<=time.indexOf(fltr[1]);i++){
		arr.push(time[i]);
	}
	return arr;
}

function DatetoDate(text){
	var arr = text.split(".");
	var date = new Date(arr[2],arr[1]-1,arr[0]);
	return date;
}

function deltime(text){
	var Datepicker = $('#AddDates').datepicker().data('datepicker');
	Datepicker.removeDate(DatetoDate(text));
}


//Кусок отвечает за выбор дат и времени
//получение данных  с ервера



function getQueryVariable(variable){
	var query = window.location.search.substring(1);
	var vars = query.split("&");
	for (var i=0;i<vars.length;i++) {
		var pair = vars[i].split("=");
		if(pair[0] == variable){return pair[1];}
	}
	return(false);
}







function Clear(){
	$('#FIODescr').html('');
	$('#FIOPost').html('');
	$('#PlaceDescr').html('');
	$("#DateLists").html('');
	
}


function GetUser(){
	Clear();
	$('.loaderdiv').fadeIn();
	var param = $("#urlurl").val();
	if($('#arch').is(':checked')){
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

function PharseUser(data, request, xhr) {
	if(xhr.status=='200'){
		//if(data.dates!=""){
			window['GUID'] = data.GUID;
			var FIO = data.FIO;
			var Id = data.Id;
			var Place = data.Place;
			var Post = data.Post;
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
			UserToHtml(FIO,Place,Post,dates);
		//}else{
		//	alert('Ошибка. Нет доступных дат для записи')
		//	$('.loaderdiv').fadeOut();

		//}
	}else{
		alert('Ошибка. Проверьте адрес')
		$('.loaderdiv').fadeOut();
	}
}

function UserToHtml(FIO,Place,Post,dates){
	$('#FIODescr').append(''+FIO);
	$('#FIOPost').append(''+Post);
	$('#PlaceDescr').append('Место приёма: '+Place);
	if($('#arch').is(':checked')){
		var arch = "&arch=yes";
	}else{
		var arch = "";
	}
	if(dates.length>0){
		$("#DateLists").html('');
		$("#DateLists").append('<table class="bluetable" cellspacing="0"><thead><tr><th>Дата приема</th><th>Время приема</th><th>Посмотреть дату</th><th>Удалить дату</th></tr></thead><tbody id="tbdy" style="text-align:center"></tbody></table>');
		for (var i = 0; i < dates.length; i++) {
	    	$('#tbdy').append('<tr><td>'+dates[i].Date+'</td><td>'+StEnTime(dates[i].Time)+'</td><td><a href="https://apache.school1298.ru/reception/manage/take_secret.html?dat='+dates[i].IdDate+'&url='+$('#urlurl').val()+arch+'">Посмотреть дату</a></td><td><a href="#" onclick="DelDate(\''+dates[i].IdDate+'\')">Удалить дату</a></td></tr>');
		}
	}else{
		$('#DateLists').append('<option selected="selected">Нет доступного времени для записи</option>')
	}
	$('.hidedafault').fadeIn();
	$('.loaderdiv').fadeOut();
}

function StEnTime(arr){
	var st = arr[0];
	var en = arr[arr.length -1];
	return(st+' - '+en);
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
	setTimeout(function(){
        location.href=window.location.href;
    }, 3000);
	
}

function showAddDate(){
	$('.add').fadeIn();
	$('.ten').fadeIn();
}

function hidemodal(){
	$('.add').fadeOut();
	$('.ten').fadeOut();
}

function NewDate(){
	$("#fuck").attr("disabled", true);

	var a=$("#AddDates").val().split(";")
	var time = filterarray();
	var GUID = window['GUID'];
	if (a[0] != ""){
		for (i=0;i<a.length;i++){
				console.log('Data '+ a[i] +' | '+ time +' | '+ GUID);
				AddNewDate(a[i],JSON.stringify(time),GUID)
		}
	}
}

function AddNewDate(ADate,ATime,AGUID){
	$.ajax({
	  url: 'api/AddNewDate.php',
	  type: "POST",
	  data: {Date: ADate, Time: ATime, GUID: AGUID},
	  success: refresh,
	  error: onerr,
	});
}


function DelDate(Id){
	if (confirm("Вы действительно хотите удалить дату приема?")) {
	    $.ajax({
		 	url: 'api/deltime.php',
			type: "POST",
			data: {Id: Id},
		 	success: refresh,
		 	error: onerr,
		});
  	} else {
		return false;
  	}
}