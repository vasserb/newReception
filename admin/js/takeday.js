window.onload = function(){
	$('.loaderdiv').fadeOut()

	$('#SelDate').on('change', function(){GetUser()});
	$('.loaderdiv').on('click', function(){$('.loaderdiv').fadeOut()})
	var ruDate = {
                            previousMonth : 'Предыдущий месяц',
                            nextMonth     : 'Следующий месяц',
                            months        : ['Январь','Февраль','Март','Апрель','Май','Июнь','Июль','Август','Сентябрь','Октябрь','Ноябрь','Декабрь'],
                            weekdays      : ['Воскресенье','Понедельник','Вторник','Среда','Четверг','Пятница','Суббота'],
                            weekdaysShort : ['Вс','Пн','Вт','Ср','Чт','Пт','Сб']
                        };
    var pickerrod = new Pikaday({ field: document.getElementById('SelDate'), 
			toString(date, format) {
				// you should do formatting based on the passed format,
				// but we will just return 'D/M/YYYY' for simplicity
				var day = date.getDate();
				if (day <10){
					day = '0' + day;
				}
				var month = date.getMonth() + 1;
				if (month <10){
					month = '0' + month;
				}
				const year = date.getFullYear();
				return `${year}-${month}-${day}`;
			},
			parse(dateString, format) {
				// dateString is the result of `toString` method
				const parts = dateString.split('.');
				const day = parseInt(parts[0], 10);
				const month = parseInt(parts[1], 10) - 1;
				const year = parseInt(parts[2], 10);
				return new Date(year, month, day);
			},
		i18n: ruDate,
        firstDay: 1,

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
	$('.loaderdiv').fadeIn()
	$('#form1').empty();
	var param = $('#SelDate').val();
	var url = "api/takeday.php?Date="+param;
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
		len = data.length
		window[String('Last')] = data[len-1].Id;
		for(i=0;i<len;i++){
			var it = data[i];

			$('#form1').append('<div id="dat'+it.Id+'" class="Itog" style="display:none"><div style="margin:10px">'+it.FIO+'; '+it.Place+'</div></div>');
			GetEvents(it.Id);
		}
		//$('.loaderdiv').fadeOut();
	
	}else{
		empty('Ошибка. Проверьте адрес')
	}
}


function GetEvents(IdDate){
	var url = "api/takeevent.php?IdDate="+IdDate;
 	$.ajax({
		url: url,
		dataType: "json",
		type: "GET",
		success: PharseEvent.bind(this),
		error: onerr,
	});
}




function PharseEvent(data, request){
	try{
		if (data.status=="Ничего не найдено"){
			$('#dat'+data.IdDate).append('<div class="Itog"><span class="itogEmpt">Нет записей</span></div>')
			if(data.IdDate==window[String('Last')]){
				$('.loaderdiv').fadeOut();
			}
		}
	}catch(err){}
	try{
		var len = data.length;
		for (var i = 0; i < len; i++) {
			var it = data[i];
			$('#dat'+it.IdDate).append('<div class="Itog"><span class="itogTime">'+it.Time+'</span><span class="itogFIO">'+it.FIO+'</span></div>');
			$('#dat'+it.IdDate).show();
			if(it.IdDate==window[String('Last')]){
				$('.loaderdiv').fadeOut();
			}
		}
	}catch(err){}

	
}





function empty(error){
	$('.loaderdiv').html('');
	$('.loaderdiv').append('<div class="err">'+error+'</div>')
}

