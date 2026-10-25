<?php
require('../vendor/autoload.php');
use PHPMailer\PHPMailer\PHPMailer;
use PHPMailer\PHPMailer\Exception;
error_reporting(E_ALL);
ini_set('display_errors', 'On');
include ("functions.php");

$db_host = "localhost"; 
$db_user = "user"; // Логин БД
$db_password = "password"; // Пароль БД
$db_base = 'reception'; // Имя БД
    
// Подключение к базе данных
$mysqli = new mysqli($db_host,$db_user,$db_password,$db_base);

alertEmail('f29e4bbe4d4c4a67b5fcb7e735ed24a3','TestFIO','TestFIOCHILD','TestTel','Test IdDate','Test DopInfo','Test Time',$mysqli);





function alertEmail($guid,$FIO,$FIOChild,$Tel,$IdDate,$DopInfo,$Time,$mysqli){
	$result = $mysqli->query("SELECT * FROM `users` where GUID='".$guid."'");
	if (mysqli_num_rows($result)!=0){
		$Usermail = mysqli_fetch_array($result)['email'];
		if ($Usermail != null){
			$mail = new PHPMailer(true);                              // Passing `true` enables exceptions
			try {
				//Server settings
				$mail->SMTPDebug = 0;                                 // Enable verbose debug output
				$mail->isSMTP();                                      // Set mailer to use SMTP
				$mail->Host = 'smtp.mail.com';  						// Specify main and backup SMTP servers
				$mail->SMTPAuth = true;                               // Enable SMTP authentication
				$mail->Username = 'example@mail.com';                 // SMTP username
				$mail->Password = 'password';                           // SMTP password
				$mail->SMTPSecure = 'tls';                            // Enable TLS encryption, `ssl` also accepted
				$mail->Port = 587;   
				$mail->CharSet = "utf-8";	// TCP port to connect to

				//Recipients
				$mail->setFrom('robot@example.com', 'ГБОУ Школа № 1298 "Профиль Куркино');
				$mail->addAddress(Usermail, '');     // Add a recipient
				//$mail->addAddress('ellen@example.com');               // Name is optional
				//$mail->addReplyTo('info@example.com', 'Information');
				//$mail->addCC('cc@example.com');
				//$mail->addBCC('bcc@example.com');

				//Attachments
				//$mail->addAttachment('Docs/'.$_SESSION['Guid_session'].'.docx');         // Add attachments
				//$mail->addAttachment('/tmp/image.jpg', 'new.jpg');    // Optional name

				//Content
				$mail->isHTML(true);                                  // Set email format to HTML
				$mail->Subject = 'Вы успешно заключили договор об обучении по дополнительным образовательным программам.';
				$mail->Body    = ' 
					<html> 
						<head> 
							<title>Вы успешно заключили договор об обучении по дополнительным образовательным программам.</title> 
						</head> 
						<body> 
							<p style="font-family: Arial, Helvetica, sans-serif;font-size:14px;">Вы успешно заключили договор об обучении по дополнительным образовательным программам.</p>
							<p style="font-family: Arial, Helvetica, sans-serif;font-size:14px;"><a href="https://docs.google.com/gview?url=https://apache.school1298.ru/dop/Docs/docx">Ваш экземпляр договора</a></p>

							<p style="font-family: Arial, Helvetica, sans-serif;font-size:14px;">Уважаемые родители, для начала занятий в объединении также напоминаем о необходимости подачи заявления на общегородском портале <a href="https://www.mos.ru/pgu/ru/application/dogm/077060701/">Mos.ru</a>.<br>Код данного объединенияставьте его в строку поиска.</p>
						</body> 
					</html>'; 
				$mail->AltBody = 'Вы успешно заключили договор об обучении по дополнительным образовательным программам. Ваш экземпляр договора: https://docs.google.com/gview?url=http://apache.school1298.ru/dop/Docs/.docx Уважаемые родители, для начала занятий в объединении также напоминаем о необходимости подачи заявления на общегородском портале Mos.ru.<br>Код данного объединенставьте его в строку поиска.';

				$mail->send();
			   // echo 'Message has been sent';
			} catch (Exception $e) {
			   // echo 'Message could not be sent. Mailer Error: ', $mail->ErrorInfo;
			}
		}
}
?>

