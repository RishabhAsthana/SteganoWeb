var express = require('express');
var axios = require('axios');

var app = express();
const fileUpload = require('express-fileupload');

var path = require('path');
let port = 8080;
express.static('./static')

app.use(fileUpload());

app.use(express.static(path.join(__dirname, 'public')));

var fs = require('fs');

var Jimp = require("jimp");

// viewed at http://localhost:8080
app.get('/', function(req, res) {

    res.sendFile(path.join(__dirname + '/index.html'));
});

app.post('/upload', function(req, res) {
  if (!req.files)
    return res.status(400).send('No files were uploaded.');
    
    console.log(req.files.file);
    let sampleFile = req.files.sampleFile;
    //console.log(sampleFile);
    //console.log(sampleFile.name);
 	// Upload only .txt files to the server filesystem,
//    if(  sampleFile.name.indexOf('.wav') != -1
//      || sampleFile.name.indexOf('.png') != -1
//      || sampleFile.name.indexOf('.jpg') != -1
//      || sampleFile.name.indexOf('.bmp') != -1){
////        sampleFile.mv('./public/graphs/' + sampleFile.name, function(err) {
////   	    if (err)
////            return res.status(500).send(err);
////        });
//        console.log("File uploaded");
//        res.send('File uploaded!');
//        return;
//    }
    res.send("Unsupported file type");
});

app.listen(port, function(){
    console.log("Listening on port " + port);
});

function encode(secret_buffer){

    Jimp.read("test.png", function (err, image) {
	    if (err) throw err;

		let width = image.bitmap.width;
		let height = image.bitmap.height;
        
        // +1 is to account for end of secret symbol '#'
		if ( width * height < secret_buffer.length + 1){
			console.log("Image too small");
		}
        
        let current_index = 0;
        let counter = 0;
        
        console.log("Encoded length : ", secret_buffer.length, "Bin", secret_buffer.length.toString(2));
        for (let i = 0; i < width; i++){
			for (let j = 0; j < height; j++){
                
                let pixel_color = this.getPixelColor(i, j);
                let stubbed_color = pixel_color & 4244438268;

                if (counter < 32){
                
                    let to_encode = 0;
                    
                    for (let k = 0; k < 4; k++){
                        
                        let len_bits = (secret_buffer.length >> counter) & 3;
                        if (k != 0 )
                            to_encode = to_encode << 8;
                        to_encode ^= len_bits;
                        counter += 2;
                    }
                    
                    //console.log("Original color : ", pixel_color, pixel_color.toString(2));
                    
                    let augmented_color = stubbed_color ^ to_encode;
                    this.setPixelColor(augmented_color, i, j);
                    
                    //console.log("Augmented color : ", augmented_color, augmented_color.toString(2));
                    //console.log("Modulated color : ", image.getPixelColor(i, j), image.getPixelColor(i, j).toString(2));

                    if (counter % 8 == 0){
                        continue;    
                    }
                }
                else{
                    let secret_byte = secret_buffer[current_index];
                    let to_encode = 0;
                    
                    if (current_index < secret_buffer.length){

                        let red_bits = secret_byte & 3;
                        let green_bits = (secret_byte & 12) >> 2;
                        let blue_bits = (secret_byte & 48) >> 4;
                        let alpha_bits = (secret_byte & 192) >> 6;

                        to_encode ^= red_bits;
                        to_encode <<= 8;
                        to_encode ^= green_bits;
                        to_encode <<= 8;
                        to_encode ^= blue_bits;
                        to_encode <<= 8;
                        to_encode ^= alpha_bits;
                        
                        let augmented_color = stubbed_color ^ to_encode;
                        
                        if(current_index < 5){
                            console.log("Secret byte : ", secret_byte.toString(2));
                            console.log("Augmented color : ", augmented_color.toString(2));   
                        }
                        this.setPixelColor(augmented_color, i, j);
                        
                        current_index++;
                    }    
                }
                
                

			}
		}
        
        this.write("del.png")

	});

}


function decode(){
	Jimp.read("del.png", function (err, image) {
	    if (err) throw err;

		let width = image.bitmap.width;
		let height = image.bitmap.height;
        
        let counter = 0;
        let secret_length = 0;
        let extracted_byte = 0;
        let current_index = 0;
        
		for (let i = 0; i < width; i++){
			for (let j = 0; j < height; j++){
                

                let pixel_color = this.getPixelColor(i, j);
                //console.log("Pixel color", pixel_color);
                if (counter < 32){
                
                    for (let k = 0; k < 4; k++){   
                        let len_bits = ( pixel_color >> (k * 8) ) & 3;
                        //console.log("Len bits", counter/2, len_bits);
                        extracted_byte = extracted_byte << 2;
                        extracted_byte ^= len_bits;
                        counter += 2;
                    }
                    if (counter % 8 == 0){
                        
                        if (counter == 8){
                            secret_length = extracted_byte;
                        }
                        else{
                            extracted_byte <<= (counter - 8);
                            secret_length ^= extracted_byte;
                        }
                        extracted_byte = 0;
                        continue;    
                    }
                }
                else{
                    let secret_byte = 0;
                    
                    if (current_index == 0){
                        console.log("Decoded Length", secret_length);
                        var buf = new Buffer(secret_length);
                    }
                    
                    if (current_index < secret_length){
                        
                        secret_byte = pixel_color & 3;
                        secret_byte <<= 2;
                        secret_byte ^= (pixel_color >> 8) & 3;
                        secret_byte <<= 2;
                        secret_byte ^= (pixel_color >> 16) & 3;
                        secret_byte <<= 2;
                        secret_byte ^= (pixel_color >> 24) & 3;
                        
                        buf[current_index] = secret_byte;
                        current_index++;
                    }
                }
               
			}
		}
        
        fs.writeFile('message.png', buf, "binary", function(){
            console.log("SUCCESS!");
        });
        
	});

}



//fs.readFile("test.jpg", function(err, data) {
//  if (err) throw err;
//  //encode(data);
//  decode();
//});

//test();
    