<?php
	header('Content-type: application/json');
	error_reporting(0);

	$db_handle;
	$action = $_POST["action"];

	function openConnection() {
		$user_name = "root";
		$database = "hoc";
		$server = "localhost";
		$password = "";

		$db_handle = mysql_connect($server, $user_name, $password);
		$db_found = mysql_select_db($database, $db_handle);
	}

	function closeConnection() {
		mysql_close($db_handle);
	}

	
	//Open connection
	openConnection();

	//Setting annotation
	if($action == "set") {
		
		$timesStamps = $_POST['time'];
		$endTime = $_POST['endTime'];
		$type = $_POST['type'];
		$fileNames = $_POST['file']; 
		$user = $_POST['user']; 
		$timeCreated = $_POST['timeCreated']; 

		$query = "INSERT INTO annotations (
				usr, 
				timecode, 
				endTime,
				file, 
				timeCreated,
				type
			) 
			VALUES (
				'$user', 
				'$timesStamps',
				'$endTime', 
				'$fileNames', 
				'$timeCreated',
				'$type'
			)";
		
		$result = mysql_query($query);
	}

	//Getting annotations
	if($action == "get") {

		$result = mysql_query("SELECT * FROM annotations");		
		$return_arr = array();

	

		while ($row = mysql_fetch_array($result, MYSQL_ASSOC)) {
		    $row_array['id'] = $row['id'];
		    $row_array['type'] = $row['type'];
		    $row_array['usr'] = $row['usr'];
		    $row_array['timeCreated'] = $row['timeCreated'];
		    $row_array['timecode'] = $row['timecode'];
		    $row_array['endTime'] = $row['endTime'];
		    $row_array['file'] = $row['file'];
		    $row_array['scene'] = $row['scene'];

		    array_push($return_arr,$row_array);
		}
		
		print json_encode($return_arr);
	}

	//Close connection
	closeConnection();
?>