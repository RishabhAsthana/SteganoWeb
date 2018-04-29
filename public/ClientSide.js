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
        file = input.files[0];
        updatePrompt("ballast-size", "File " + file.name + " is " + file.size + " bytes in size");
    }
}

function updatePrompt(element_id, message){
    let ele = document.getElementById(element_id);
    ele.innerHTML = message;
}