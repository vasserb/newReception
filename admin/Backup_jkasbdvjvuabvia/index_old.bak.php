<?php
//Отображение всех ошибок
error_reporting(E_ALL);
ini_set('display_errors', 'On');
//конец

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


//Запрос к БД с параметром GUID
$result = $mysqli->query("SELECT * FROM `users` where GUID='".$GUID."'");
    if (mysqli_num_rows($result)!=0){
        if ($result == true){
            while($myrow = mysqli_fetch_array($result)){
                $users_result=('{');
                $users_result=$users_result.'"FIO": "'.$myrow['FIO'].'",';
                $users_result=$users_result.'"Place": "'.$myrow['Place'].'",';
                $users_result=$users_result.'"GUID": "'.$myrow['GUID'].'",';
                $users_result=$users_result.'"Id": "'.$myrow['Id'].'",';
            }
        }else{
            echo "Информация не прочитана";
            $users_result="none";
            echo $mysqli->error;
        }
    }else{
        $users_result="none";
        echo('Ничего не найдено');
    }

if($users_result!="none"){//Если инфа прочитана, все найдено итд
    //Запрос к БД на предмет доступных дат больше текущей и меньше чем за 1 месяц
    $dates = $mysqli->query("SELECT * FROM `time` where GUID='".$GUID."' AND Date>=CURDATE() AND Date<=ADDDATE(CURDATE(), 31) AND Archive=0 ORDER BY Date");
    if (mysqli_num_rows($dates)!=0){
        if ($dates == true){
            $dates_result=' "dates": [';//Формируем json массив с датами
            $zap="";//Служит для отсутствия первой запятой
            while($myrow = mysqli_fetch_array($dates)){
                //Запрос к БД на предмет 
                $result_time=[];
                $time_request = $mysqli->query("SELECT * FROM `time` where Id='".$myrow['Id']."'");
                    if (mysqli_num_rows($time_request)!=0){
                        if ($time_request == true){
                            while($myrow1 = mysqli_fetch_array($time_request)){
                                $time = explode(";", $myrow1['Time']);
                                for($x=0; $x<sizeof($time); $x++){
                                    $check = $mysqli->query("SELECT * FROM `event` where IdDate='".$myrow['Id']."' AND Time='".$time[$x]."' AND Archive=0");
                                    if(mysqli_num_rows($check)==0){
                                        array_push($result_time, $time[$x]);
                                    }
                                }
                            }
                        }
                    }
                $time_json=json_encode($result_time);

                $dates_result=$dates_result.$zap.'{"IdDate": "'.$myrow['Id'].'", "Date": "'.$myrow['Date'].'", "Time": '.$time_json.'}';
                $zap=', ';//Служит для отсутствия первой запятой
            }
            $dates_result=$dates_result."]";
            $users_result=$users_result.$dates_result."}";
            echo($users_result);

        }
    }else{
        $users_result=$users_result."'dates': []}";
        echo($users_result);
    }
}
?>