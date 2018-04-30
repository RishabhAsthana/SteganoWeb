# SteganoWeb
Web application that allows end user to perform image and audio steganography
This application is built as a final project submission for UIUC CS 460 : Cyber Security Lab.

## Demo
A demo can be found at this address : http://165.227.49.237:8080/

NOTE: This demo will be taken down at a later point and is being only served as a proof of concept for grading purposes.

## Installation
```
npm install
make (Create the required wavcodec binary, you'll need gcc for this)
npm start (The application can be accessed at localhost:8080 unless specified by you)
```

## Deployement Notes
Change the host url in 'public/ClientSide.js' from localhost:8080 to your hosting address. Do the same for two links in index.html

Forever is a great npm utility if you want this app to be daemonized

## Supported Types
WAV, PNG, JPG and BMP files are supported as of now. In case of images (PNG, JPG, BMP) every byte of secret is encoded per pixel (we take lower 2 bits each from RGBA channels). As transparency is required, output file is always going to be a PNG file.
NOTE: This application uses JIMP to read PNG, JPG and BMP files and as of 4/29/2018, Jimp has has some issues with maintaining file compression (it automatically increases bit-depth from 8 to 32) and as such the file size is bloated considerably. This is unintended behavior and when the library fixes this issue or I discover an alternative, the encoded files should be comparable in size to the given input images.

For WAV files, a variable number of bits are used to encode the secret depending on the relative size difference between them. In worst case, the size of secret can be almost half the size of input ballast wav file.

## Author

Rishabh Asthana {asthana4@illinois.edu}
