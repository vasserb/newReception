<?php
//Отображение всех ошибок
error_reporting(E_ALL);
ini_set('display_errors', 'On');
//конец
include ("functions.php");

//Преобразовать все параметры из строки браузера в переменные
foreach ( $_GET as $key => $value ) 
{$$key = $value;}
//конец

//Подключение к БД
$db_host = "localhost"; 
$db_user = "user"; // Логин БД
$db_password = "password"; // Пароль БД
$db_base = 'reception'; // Имя БД
$mysqli = new mysqli($db_host,$db_user,$db_password,$db_base);

// Если есть ошибка соединения, выводим её и убиваем подключение
if ($mysqli->connect_error) {
    die('Ошибка : ('. $mysqli->connect_errno .') '. $mysqli->connect_error);
}
if (!$mysqli->set_charset("utf8")) {
    //printf("Ошибка при загрузке набора символов utf8: %s\n", $mysqli->error);
exit();
}

if ($_SERVER['REQUEST_METHOD'] == "POST"){
    $Id = $_POST['Id'];
    $result = $mysqli->query("UPDATE `time` SET Archive='1' where Id='".$Id."'");
    if (mysqli_affected_rows($mysqli)>0){
            http_response_code(200);
            echo '{"status": "Данные обновлены"}';
    }else{
        $users_result="none";
        http_response_code(400);
        echo('{"status": "Ошибка. Данные не удалены"}');
    }
}

?>