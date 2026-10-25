<?php

//error_reporting(E_ALL);
//ini_set('display_errors', 'On');

include ("functions.php");

$db_host = "localhost"; 
$db_user = "user"; // Логин БД
$db_password = "password"; // Пароль БД
$db_base = 'reception'; // Имя БД
    
// Подключение к базе данных
$mysqli = new mysqli($db_host,$db_user,$db_password,$db_base);

if (isset($_POST['FIO'])){
    if ($_POST['FIO']==''){
        http_response_code(400);exit("Введены не все данные");
    }else{
        $FIO = mysqli_real_escape_string($mysqli, $_POST['FIO']);
    }
}else{
    http_response_code(400);exit("Введены не все данные");
}

if (isset($_POST['FIOChild'])){
    if ($_POST['FIOChild']==''){
        http_response_code(400);exit("Введены не все данные");
    }else{
        $FIOChild = mysqli_real_escape_string($mysqli, $_POST['FIOChild']);
    }
}else{
    http_response_code(400);exit("Введены не все данные");
}

if (isset($_POST['Tel'])){
    if ($_POST['Tel']==''){
        http_response_code(400);exit("Введены не все данные");
    }else{
        $Tel = mysqli_real_escape_string($mysqli, $_POST['Tel']);
    }
}else{
    http_response_code(400); exit("Введены не все данные");
}

if (isset($_POST['IdDate'])){
    if ($_POST['IdDate']==''){
        http_response_code(400);exit("Введены не все данные");
    }else{
        $IdDate = mysqli_real_escape_string($mysqli, $_POST['IdDate']);
    }
}else{
    http_response_code(400); exit("Введены не все данные");
}

if (isset($_POST['DopInfo'])){
    if ($_POST['DopInfo']==''){
        http_response_code(400);exit("Введены не все данные");
    }else{
        $DopInfo = mysqli_real_escape_string($mysqli, $_POST['DopInfo']);
    }
}else{
    http_response_code(400); exit("Введены не все данные");
}
if (isset($_POST['Time'])){
    if ($_POST['Time']==''){
        http_response_code(400);exit("Введены не все данные");
    }else{
        $Time = mysqli_real_escape_string($mysqli, $_POST['Time']);
    }
}else{
    http_response_code(400); exit("Введены не все данные");
}


$db_host = "localhost"; 
$db_user = "user"; // Логин БД
$db_password = "password"; // Пароль БД
$db_base = 'reception'; // Имя БД
    
// Подключение к базе данных
$mysqli = new mysqli($db_host,$db_user,$db_password,$db_base);

// Если есть ошибка соединения, выводим её и убиваем подключение
if ($mysqli->connect_error) {
    die('Ошибка : ('. $mysqli->connect_errno .') '. $mysqli->connect_error);
}
if (!$mysqli->set_charset("utf8")) {
    //printf("Ошибка при загрузке набора символов utf8: %s\n", $mysqli->error);
exit();
}
//Проверка времени на занятость
if((time() - strtotime('today'))<61200){
		$timestrict = 'Date>=CURDATE()';
	}else{
		$timestrict = 'Date>CURDATE()';
	}
$result = $mysqli->query("SELECT * FROM `time` where Id='".$IdDate."' AND ".$timestrict."");
if (mysqli_num_rows($result)!=0){
    if ($result == true){
        while($myrow = mysqli_fetch_array($result)){
            $timeresult = explode(";", $myrow['Time']);
            $check=0;
            for($x=0; $x<sizeof($timeresult); $x++){
                if($timeresult[$x]==$Time){
                    $check=$check+1;
                }
            }
            if($check==0){
                http_response_code(400); exit("Это время недоступно для записи");
            }
        }
    }
}else{
    http_response_code(400); exit("Эта дата недоступна для записи");
}

$result = $mysqli->query("SELECT * FROM `event` where IdDate=".$IdDate." AND Time='".$Time."' AND Archive=0");
if (mysqli_num_rows($result)!=0){
    http_response_code(400); exit("Данное время уже занято, выберите другое время");
}

$insert = $mysqli->query("INSERT INTO `event` (FIO, FIOChild, Tel, IdDate, DopInfo, Time) VALUES ('$FIO','$FIOChild','$Tel','$IdDate','$DopInfo','$Time')");
if ($insert == true){
    http_response_code(200);
    echo "Информация занесена в базу данных";
}else{
    http_response_code(400);
    echo "Информация не занесена в базу данных";
    echo $mysqli->error;
}
?>