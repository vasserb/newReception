window.onload = function(){
	GetUser();
	UserCustom();
	$('#FreeDates').on('change', function(){ViewTime()});
	
	jQuery.validator.addMethod("tel_val", function(value, element) {
		var re = /^\+7\(9[0-9][0-9]\)[0-9][0-9][0-9]-[0-9][0-9]-[0-9][0-9]$/;
		if (re.test(value) || value == ''){
			return true;
		}else{
			return false;
		}
	});	
	jQuery.validator.addMethod("isstudent", function(value, element) {
		if ($('#isstudent').is(":checked")){
			if(value == ''){
				return false;
			}else{
				return true;
			}
		}else{
			return true;
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
							Questionviziter:{
								required: true,
							},
							FreeDates:{
								required: true,
							},
							FIOchild:{
								isstudent: true,
							},
							Classchild:{
								isstudent: true,
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
							Questionviziter:{
								required: "Это поле обязательно для заполнения",
							},
							FreeDates:{
								required: "Это поле обязательно для заполнения",
							},
							FIOchild:{
								isstudent: "Это поле обязательно для заполнения",
							},
							Classchild:{
								isstudent: "Это поле обязательно для заполнения",
							},
						 }
					  });
}

function UserCustom(){

		if (getQueryVariable("url")=="d.a.denisova"){
			$('#Questionviziter').replaceWith('<select class="inputField short" id="Questionviziter" name="Questionviziter">'+
					'<option value="" selected="selected"></option>'+
					'<option value="Подача документов в ГКП/в группу полного дня">Подача документов в ГКП/в группу полного дня</option>'+
					'<option value="Предоставление медицинской карты для сада и первого класса">Предоставление медицинской карты для сада и первого класса</option>'+
					'<option value="Отчисление из школы/из дошкольного отделения">Отчисление из школы/из дошкольного отделения</option>'+
					'<option value="Получение дополнительного соглашения">Получение дополнительного соглашения</option>'+
					'<option value="Предоставление ЦПМПК">Предоставление ЦПМПК</option>'+
					'<option value="Подача заявления на заочную (очно-заочную) форму обучения">Подача заявления на заочную(очно-заочную) форму обучения</option>'+
					'<option value="Подача заявления на перевод в другой класс/группу">Подача заявления на перевод в другой класс/группу</option>'+
					'<option value="Предоставление документов на лготу (дошкольники)">Предоставление документов на лготу (дошкольники)</option>'+
					'<option value="Вторичный прием">Отказ от зачисления</option>'+
					'<option value="Вторичный прием">Вторичный прием</option>'+

				'</select><span class="downbar" id="downbar">▼</span>');
			//$('#Questionviziter').prop( "disabled", true );
			$('#chkstud').remove();	
		}else{
			//console.log("noext");
		}
		
		
		if (getQueryVariable("url")=="priemsad"){
			$('#Questionviziter').replaceWith('<select class="inputField short" id="Questionviziter" name="Questionviziter">'+
					'<option value="" selected="selected"></option>'+
					'<option value="Подача документов в ГКП/в группу полного дня">Подача документов в ГКП/в группу полного дня</option>'+
					'<option value="Вторичный прием">Отказ от зачисления</option>'+

				'</select><span class="downbar" id="downbar">▼</span>');
			//$('#Questionviziter').prop( "disabled", true );
			$('#chkstud').remove();	
		}else{
			//console.log("noext");
		}
		
		
		
		if (getQueryVariable("url")=="ppk"){
			$('#Questionviziter').parent().hide();
			$('#Questionviziter').val('Входной ППК');
			$('#Questionviziter').prop( "disabled", true );
		}else{
			//console.log("noext");
		}
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
	var url = "api/?url="+param+"&off="+offTime();
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
			var Post = data.Post
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
			UserToHtml(FIO,Place,dates,Post);
		}else{
			empty('Ошибка. Нет доступных дат для записи')
		}
	}else{
		empty('Ошибка. Проверьте адрес')
	}
}

function UserToHtml(FIO,Place,dates,Post){
	$('#FIODescr').append(''+FIO);
	if(Post != 'nohuman'){
		$('#Post').append(''+Post);
	}
	$('#Post').show();
	$('#PlaceDescr').append('Место приёма: <span id="Place">'+Place+'</span>');
	window.currentUser = {
		FIO: FIO,
		Post: Post,
		Place: Place
	};
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
	for(j=0;j<20;j++){
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
	if ($("#abc").valid()){
		$('.loaderdiv').fadeIn();
		$('.bluebutton').prop( "disabled", true );
		var FIOViz = $('#FIOviziter').val();
		var Telviz = $('#Telviziter').val();
		var Questionviz = 'Собеседование';
		var SelDate = $('#FreeDates').val();
		var SelTime = $('#FreeTime').val();
		var FIOChild = '-';
		$.ajax({
	        url: "api/new-event.php",
	        type: "POST",
	        data : {FIO: FIOViz,Tel: Telviz, IdDate: SelDate, DopInfo: Questionviz, Time: SelTime, FIOChild: FIOChild},
	        success: Succcess,
	        error: (function(data,textStatus){alert('Возникла непредвиденная ошибка: '+data.responseText);$('.loaderdiv').fadeOut();$('.bluebutton').prop( "disabled", false );}),
	    });
	}
}

function Succcess(){
	var SelDate = $('#FreeDates option:selected').text();
	var SelTime = $('#FreeTime').val();
	var SelQuest = $('#Questionviziter').val();
	if(currentUser.Post == 'nohuman'){
		kuda = '';
		newpost = '';
	}else{
		kuda = 'Сотрудник:';
		newpost = ', '+currentUser.Post;
	}
	
	$('#form').html('');
	html='<div><img style="width:150px" src="logo.png"></div>'+
	'<div><h1>Запись успешно создана</h1></div>'+
	'<div><div class="success"><b>'+kuda+'</b> '+currentUser.FIO+ newpost +'</div></div>'+
	'<div><div class="success"><b>Место приема:</b> '+currentUser.Place+'</div></div>'+
	'<div><div class="success"><b>Дата и время приема:</b> '+ SelDate +' в '+ SelTime +'</div></div>';
	$('.TopHead').html(html);
	if(SelQuest == 'Подача документов в ГКП/в группу полного дня'){
		$('.TopHead').append('<div><div class="success">Перед приемом необходимо заполнить анкету: <a href="https://1298.ru/priemsad">https://1298.ru/priemsad</a></div></div>')
	}
	$('.TopHead').append('<div id="buttondiv"><button class="bluebutton" onclick="location.href=\'https://sch1298sz.mskobr.ru\'">Готово</button></div>');
	$('.loaderdiv').fadeOut();

	
	
	//$('body').append('<div class="grayblank"></div>')
	//$('body').append('<div class="modal-success"></div>')
	//
	//alert("Запись успешно создана. Ждем Вас "+SelDate+" в "+SelTime+".");
	//location.href="https://sch1298sz.mskobr.ru"
}

function empty(error){
	$('.loaderdiv').html('');
	$('.loaderdiv').append('<div class="err">'+error+'</div>')
}

function IsStudent(){
	if($('#isstudent').is(":checked")) { 
		$(".isstudent").fadeIn();
    }else{ 
		$(".isstudent").fadeOut();
	}

}

function offTime(){
	var off = "612000";
	if(getQueryVariable("url")=="d.a.denisova"){
		var off = "0";
	}
	return (off);
}