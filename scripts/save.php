<?php
	ini_set('display_errors',1);
	error_reporting(E_ALL);

	foreach(array('video', 'audio') as $type) {
	    if (isset($_FILES["${type}-blob"])) {
	        
			$fileName = $_POST["${type}-filename"];
	        $uploadDirectory = '../annotations/audio/'.$fileName;
	        
	        if (!move_uploaded_file($_FILES["${type}-blob"]["tmp_name"], $uploadDirectory)) {
	            echo("Unsucessful");
	        }
			
			echo($fileName);
	    }
	}
?>