<?php
function SQLdata($data){
	$dates = explode(".", $data);//делаем дату из формата ДД.ММ.ГГГГ - ГГГГ-ММ-ДД
	return($dates[2] . '-' . $dates[1] . '-' .$dates[0]);
}

function russData($data){	
	$dates = explode("-", $data);//делаем дату из формата ДД.ММ.ГГГГ - ГГГГ-ММ-ДД
	return ($dates[2] . '.' . $dates[1] . '.' .$dates[0]);
}

function seconds($time,$date){
	$arr = explode(":", $time);
	$tdate = date("Y").'-'.date("m").'-'.date("d");
	$seconds = ($arr[0]*3600)+($arr[1]*60);
	$tseconds = time() - strtotime('today');
	if ($seconds < $tseconds and $date==$tdate){
		return false;
	}else{
		return true;
	}
}
?>