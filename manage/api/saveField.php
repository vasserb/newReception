  <?php
	$servername = "localhost";
	$username = "user";
	$password = "password";
	$dbname = "reception";
	$tableName = "users"; 
    $conn = new mysqli($servername, $username, $password, $dbname);

    // Check connection
    if ($conn->connect_error) {
        die("Connection failed: " . $conn->connect_error);
    }
	
	$editableColumns = ['FIO', 'Place', 'Post', 'email', 'url', 'kaf', 'Archive'];
	
	if ($_SERVER["REQUEST_METHOD"] == "POST") {
        // Assume 'new_data_value' is the name of the input field in your form
        $newData = $_POST['newData']; 
		$field = $_POST['field']; 
		$id = $_POST['Id']; 
		if(in_array($field, $editableColumns)){		
			$stmt = $conn->prepare("UPDATE ".$tableName." SET ".$field." = ? WHERE Id = ?");
			$stmt->bind_param("si", $newData, $id); // "s" for string, "i" for integer
			
			// Execute the statement
			if ($stmt->execute()) {
				echo $newData." ".$field." ".$id."     ";
				echo "Record updated successfully";
			} else {
				echo "Error updating record: " . $stmt->error;
			}

			$stmt->close();
		}else{
			echo "Error updating record field error";
		}
        
    }else{
		echo "NotPost";
	}
    ?>