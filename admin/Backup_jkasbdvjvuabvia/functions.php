<?php
function SQLdata($data){
	$dates = explode(".", $data);//делаем дату из формата ДД.ММ.ГГГГ - ГГГГ-ММ-ДД
	return($dates[2] . '-' . $dates[1] . '-' .$dates[0]);
}

function russData($data){	
	$dates = explode("-", $data);//делаем дату из формата ДД.ММ.ГГГГ - ГГГГ-ММ-ДД
	return ($dates[2] . '.' . $dates[1] . '.' .$dates[0]);
}
?>