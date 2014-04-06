function PostBlob(blob, fileType, fileName) {
	// FormData
	var formData = new FormData();
	formData.append(fileType + '-filename', fileName);
	formData.append(fileType + '-blob', blob);

	// POST the Blob
	xhr('./scripts/save.php', formData, function(dir) {
		console.log(dir);
	}); 
}


function toggleRecording() {
	if (!recording) {			
		recording = true; console.log("recording...");

		navigator.getUserMedia({ audio: true }, function(stream) {
			//Creating recorder
			recorder = RecordRTC(stream);
        	recorder.startRecording(); 
        	//Collecting annotation data
			var timecode = video.currentTime;
			var timeCreated = new Date().getTime();
			audioFileName = timeCreated;

 			//Sending annotation data to database
			$.ajax({
			  	type: "POST",
			  	url: "./scripts/serverContact.php",
			  	data: {timecode:timecode, file: audioFileName, timeCreated: timeCreated, user: user, type: 'audio'},
			  	success: function(data) {console.log("Successfully updated database");},
			  	dataType: "JSON"
			});     	   
		}, function(error) {
            alert( JSON.stringify (error, null, '\t') );
        });

	} else {
		recording = false; console.log("recording stopped");

		//Creating new annotation object
   		//...

    	recorder.stopRecording();
    	//Saving recording to "./annotation/audio"
    	PostBlob(recorder.getBlob(), 'audio', audioFileName + '.wav');    	
	}
}


function deleteAudioVideoFiles() {
	deleteFiles.disabled = true;
	if (!fileName) return;
	var formData = new FormData();
	formData.append('delete-file', fileName);
	xhr('delete.php', formData, null, function(response) {
		console.log(response);
	});
	fileName = null;
	container.innerHTML = '';
}

function xhr(url, data, callback) {
	var request = new XMLHttpRequest();

	request.onreadystatechange = function () {
        if (request.readyState == 4 && request.status == 200) {
            callback(request.responseText);
        }
    };

	request.open('POST', url);
	request.send(data);
	console.log("saving sucessful");
}
