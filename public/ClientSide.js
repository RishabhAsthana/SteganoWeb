var allowed_size = 0;

function uploadBallast(){
    
    let input, file;
    
    if (!window.FileReader) {
        bodyAppend("p", "The file API isn't supported on this browser yet.");
        return;
    }    
    input = document.getElementById('ballast-fileinput');
    if (!input.files) {
        updatePrompt("ballast-size", "This browser doesn't seem to support the `files` property of file inputs.");
    }
    else if (!input.files[0]) {
        updatePrompt("ballast-size", "Please select a file before clicking 'Load'");
    }
    else {
        
        var formData = new FormData();
        formData.append("file", input.files[0]);
        
        // Client-side file extension validation
        let file_name = input.files[0].name;
        if(  file_name.indexOf('.wav') != -1
              || file_name.indexOf('.png') != -1
              || file_name.indexOf('.jpg') != -1
              || file_name.indexOf('.bmp') != -1){

                var xhr = new XMLHttpRequest();
                xhr.open("POST", "http://localhost:8080/upload_ballast");
                xhr.onload = function(){
                    //console.log(xhr.response);
                    allowed_size = parseInt(xhr.response);
                    updatePrompt("allowed-size", xhr.response + " bytes");
                    document.getElementById("step2").classList.toggle('collapsed');
                }
                xhr.send(formData);

                file = input.files[0];
                updatePrompt("ballast-size", "File " + file.name + " is " + file.size + " bytes in size");
        }
        else{
            updatePrompt("ballast-size", "Invalid extension");
        }
    }
}

function uploadSecret(){
    
    let input, file;
    
    if (!window.FileReader) {
        bodyAppend("p", "The file API isn't supported on this browser yet.");
        return;
    }    
    input = document.getElementById('secret-fileinput');
    if (!input.files) {
        updatePrompt("secret-size", "This browser doesn't seem to support the `files` property of file inputs.");
    }
    else if (!input.files[0]) {
        updatePrompt("secret-size", "Please select a file before clicking 'Load'");
    }
    else {
        
        var formData = new FormData();
        formData.append("file", input.files[0]);
        
        var xhr = new XMLHttpRequest();
        xhr.open("POST", "http://localhost:8080/upload_secret");
        xhr.onload = function(){
            document.getElementById("step3").classList.toggle('collapsed');
        }
        xhr.send(formData);

        file = input.files[0];
        updatePrompt("secret-size", "File " + file.name + " is " + file.size + " bytes in size");
        
    }
}

function uploadEncoded(){
    
    let input, file;
    
    if (!window.FileReader) {
        bodyAppend("p", "The file API isn't supported on this browser yet.");
        return;
    }    
    input = document.getElementById('decode-fileinput');
    if (!input.files) {
        updatePrompt("secret-size", "This browser doesn't seem to support the `files` property of file inputs.");
    }
    else if (!input.files[0]) {
        updatePrompt("secret-size", "Please select a file before clicking 'Load'");
    }
    else {
        
        var formData = new FormData();
        formData.append("file", input.files[0]);
        
        var xhr = new XMLHttpRequest();
        xhr.open("POST", "http://localhost:8080/decode");
        xhr.onload = function(){
            document.getElementById("decode_download_link").classList.toggle('hidden');
        }
        xhr.send(formData);   
    }
}

function encode(){

    var xhr = new XMLHttpRequest();
    xhr.open("GET", "http://localhost:8080/encode");
    xhr.onload = function(){
        document.getElementById("encode_download_link").classList.toggle('hidden');
    }
    xhr.send();
    
}


function updatePrompt(element_id, message){
    let ele = document.getElementById(element_id);
    ele.innerHTML = message;
}