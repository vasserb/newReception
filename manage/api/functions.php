<?php
function SQLdata($data){
	$dates = explode(".", $data);//делаем дату из формата ДД.ММ.ГГГГ - ГГГГ-ММ-ДД
	return($dates[2] . '-' . $dates[1] . '-' .$dates[0]);
}

function russData($data){	
	$dates = explode("-", $data);//делаем дату из формата ДД.ММ.ГГГГ - ГГГГ-ММ-ДД
	return ($dates[2] . '.' . $dates[1] . '.' .$dates[0]);
}

function replaceJson($str){
	$vowels = array("\"", "'", "\\", "(", ")", "<", ">", "{", "}", ":", "-", "[", "]", ";", "\t", "  ", "    ", "    ");
	$str = str_replace($vowels, ' ', $str);
	$str = str_replace(array("\r\n", "\r", "\n"), '<br>', $str);
	return($str);
}
?>