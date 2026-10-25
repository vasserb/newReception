window.onload = function(){
	window['count'] = 1;
	GetUser();

	$('#FreeDates').on('change', function(){ViewTime()});
	
	jQuery.validator.addMethod("tel_val", function(value, element) {
		var re = /^\+7\(9[0-9][0-9]\)[0-9][0-9][0-9]-[0-9][0-9]-[0-9][0-9]$/;
		if (re.test(value) || value == ''){
			return true;
		}else{
			return false;
		}
	});	
	$(function(){
		$("#Telviziter").mask("+7(999)999-99-99", {placeholder: "+7(___)___-__-__"});
	});

	$("#abc").validate({
						 rules:{
							FIOviziter:{
								required: true,
							},
							Telviziter:{
								required: true,
								tel_val: true,
							},
							Emailviziter:{
								required: true,
								email: true,
							},
							
							FreeDates:{
								required: true,
							},
							FIOchild1:{
								required: true,
							},
							Classchild1:{
								required: true,
							},
							FIOchild2:{
								required: true,
							},
							Classchild2:{
								required: true,
							},
							FIOchild3:{
								required: true,
							},
							Classchild3:{
								required: true,
							},
							FIOchild4:{
								required: true,
							},
							Classchild4:{
								required: true,
							},
							FIOchild5:{
								required: true,
							},
							Classchild5:{
								required: true,
							},
							FIOchild6:{
								required: true,
							},
							Classchild6:{
								required: true,
							},
							FIOchild7:{
								required: true,
							},
							Classchild7:{
								required: true,
							},
							FIOchild8:{
								required: true,
							},
							Classchild8:{
								required: true,
							},
							FIOchild9:{
								required: true,
							},
							Classchild9:{
								required: true,
							},
							FIOchild10:{
								required: true,
							},
							Classchild10:{
								required: true,
							},
							
						 },

						 messages:{
							FIOviziter:{
								required: "Это поле обязательно для заполнения",
							},
							Telviziter:{
								required: "Это поле обязательно для заполнения",
								tel_val: "Введите корректный номер телефона",
							},
							Emailviziter:{
								required: "Это поле обязательно для заполнения",
								email: "Введите корректный адрес почты",
							},
							
							FreeDates:{
								required: "Это поле обязательно для заполнения",
							},
							FIOchild1:{
								required: "Это поле обязательно для заполнения",
							},
							Classchild1:{
								required: "Это поле обязательно для заполнения",
							},
							FIOchild2:{
								required: "Это поле обязательно для заполнения",
							},
							Classchild2:{
								required: "Это поле обязательно для заполнения",
							},
							FIOchild3:{
								required: "Это поле обязательно для заполнения",
							},
							Classchild3:{
								required: "Это поле обязательно для заполнения",
							},
							FIOchild4:{
								required: "Это поле обязательно для заполнения",
							},
							Classchild4:{
								required: "Это поле обязательно для заполнения",
							},
							FIOchild5:{
								required: "Это поле обязательно для заполнения",
							},
							Classchild5:{
								required: "Это поле обязательно для заполнения",
							},
							FIOchild6:{
								required: "Это поле обязательно для заполнения",
							},
							Classchild6:{
								required: "Это поле обязательно для заполнения",
							},
							FIOchild7:{
								required: "Это поле обязательно для заполнения",
							},
							Classchild7:{
								required: "Это поле обязательно для заполнения",
							},
							FIOchild8:{
								required: "Это поле обязательно для заполнения",
							},
							Classchild8:{
								required: "Это поле обязательно для заполнения",
							},
							FIOchild9:{
								required: "Это поле обязательно для заполнения",
							},
							Classchild9:{
								required: "Это поле обязательно для заполнения",
							},
							FIOchild10:{
								required: "Это поле обязательно для заполнения",
							},
							Classchild10:{
								required: "Это поле обязательно для заполнения",
							},
						 }
					  });
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
	var param = getQueryVariable("url");
	var url = "api/?url="+param+"&off=61200&all=yes";
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
			empty('Ошибка. Нет доступных дат для записи')
		}
	}else{
		empty('Ошибка. Проверьте адрес')
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
}

 

function ViewTime(){
	try{
		$("#TimeList").empty();
		$("#buttondiv").remove();
		var IdDate = $('#FreeDates').val()
		var time = window[String('idday'+IdDate)]
		//console.log(time);
		for (var i = 0; i < time.length; i++) {
			$("#TimeList").append('<span class="TimeSel" id="Time'+i+'" onclick="ViewButton(\''+i+'\')">'+time[i]+'</span>')
		}
		var destination = $('#TimeList').offset().top;
		$('html, body').animate({ scrollTop: destination }, 1000);
	}catch(err){
		//console.log("Пустой элемент")
	}
};

function ViewButton(id){
	for(j=0;j<300;j++){
		$('#Time'+j).removeClass("selected");
	}
	$('#Time'+id).addClass("selected");
	$('#FreeTime').val($('#Time'+id).text());
	$("#buttondiv").remove();
	$("#ButtonPlace").append('<div id="buttondiv"><button class="bluebutton" onclick="NewEvent()">Записаться</button></div>')
	var destination = $('#ButtonPlace').offset().top;
	$('html, body').animate({ scrollTop: destination }, 1000);
}

function NewEvent(time){
	$('.loaderdiv').show();
	if ($("#abc").valid()){
		var FIOViz = $('#FIOviziter').val();
		var Telviz = $('#Telviziter').val();
		var Questionviz = $('#Emailviziter').val();
		var SelDate = $('#FreeDates').val();
		var SelTime = $('#FreeTime').val();
		var FIOChild = "";
		for(var a=1;a<=window['count'];a++){
			var FIOChild = FIOChild + $('#FIOchild'+a).val()+' '+$('#Classchild'+a).val()+', ';
		}
		//var FIOChild = $('#FIOchild').val()+" ";
		$.ajax({
	        url: "api/new-event.php",
	        type: "POST",
	        data : {FIO: FIOViz,Tel: Telviz, IdDate: SelDate, DopInfo: Questionviz, Time: SelTime, FIOChild: FIOChild},
	        success: Succcess,
	        error: (function(data,textStatus){alert('Возникла непредвиденная ошибка: '+data.responseText);$('.loaderdiv').hide();}),
	    });
	}else{
		$('.loaderdiv').hide();
		$('html, body').animate({ scrollTop: 0}, 1000);
	}
}

function Succcess(){
	var SelDate = $('#FreeDates option:selected').text();
	var SelTime = $('#FreeTime').val();
	alert("Запись успешно создана. Ждем Вас "+SelDate+" в "+SelTime+".");
	location.href="https://sch1298sz.mskobr.ru"
}

function empty(error){
	$('.loaderdiv').html('');
	$('.loaderdiv').append('<div class="err">'+error+'</div>')
}

function addChildren(){
	if(window['count']<10){
		var a = window['count']+1;
		window['count'] = a;
		$('#childdiv').append('<div class="children"><span class="modalcaption">Фaмилия Имя ребенка №'+a+': </span><input class="inputField short" name="FIOchild'+a+'" id="FIOchild'+a+'" placeholder=""/></div>'+
		'<div class="children"><span class="modalcaption">Класс ребенка №'+a+': </span><input class="inputField short" name="Classchild'+a+'" id="Classchild'+a+'" placeholder=""/></div></div>');
	}else{
		alert("Можно добавить не более 10 детей");
	}
}