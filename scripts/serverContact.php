<?php
	header('Content-type: application/json');

	$user_name = "root";
	$database = "hoc";
	$server = "localhost";
	$password = "";

	$db_handle = mysql_connect($server, $user_name, $password);
	$db_found = mysql_select_db($database, $db_handle);

	$timesStamps = $_POST['time'];
	$type = $_POST['type'];
	$fileNames = $_POST['file']; 
	$user = $_POST['user']; 
	$timeCreated = $_POST['timeCreated']; 

	$SQL = "INSERT INTO annotations (
			usr, 
			timecode, 
			file, 
			timeCreated,
			type
		) 
		VALUES (
			'$user', 
			'$timesStamps', 
			'$fileNames', 
			'$timeCreated',
			'$type'
		)";
	
	$result = mysql_query($SQL);

	mysql_close($db_handle);
?>