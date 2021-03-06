/// READ SCALA FILE OR ARRAY
/// Node app that reads a scala file and coverts it to a list
/// of frequencies or cents offset . Results are dumped into a txt
/// for further use in the retuning of synthesizer hardware & software
// Carlo Cattano 2019

const express = require('express');
const app = express();
const server = require('http').createServer(app);
const io = require('socket.io').listen(server);
const fs = require('fs');
const readline = require('readline');
const stream = require('stream');
const clc = require('cli-color');
console.log(clc.red('Text in red'));

var scalaRatios = [];
var toFreqList = [];
var toCentslist = [];

var clients = [];
var sessions = [];

app.use(express.static(__dirname + '/node_modules'));
app.use(express.static(__dirname + '/public'));
app.get('/', function(req, res,next) {
    res.sendFile(__dirname + '/index.html');
});

server.listen(8080);

console.log("<----server listening on 8080----> \n");
console.log(".....serving index.html \n");

io.on('connection', function(socket){
    var socketId = socket.id;
	var clientIp = socket.request.connection.remoteAddress;
   	
	console.log('user '+ socket.id +' connected '+ clientIp.substr(7) );
    console.log("\t \t \t \t \t @ " + getDateTime());
        
	sessions.push(socketId);
    	if(!clients.includes(clientIp.substr(7))){
		clients.push(clientIp.substr(7));
	}

    socket.on('loadScala',function(){
        io.emit('s_ratios',{ ratio: scalaRatios, freq: toFreqList });
    });
    
	console.log(clc.yellow("Runing Sessions :  "+ sessions.length));
	console.log("clients :"+ clients.length);

    socket.on('disconnect', function() {
        var i = sessions.indexOf(socket);
	var y = clients.indexOf(clientIp.substr(7));
	console.log("client "+ y + " disconected");
        console.log('session'+ i + " Terminated ");
       
	sessions.splice(i, 1);

	if(clients.indexOf(clientIp.substr(7))){
		clients.splice(y, 1);
        }

	console.log(sessions.length+" Conected users : \n "  );
     });
  });

///////////////////////////////////////////////////////////////////////////////////////////////
const refHz = process.argv[2];      //  reference pitch
const scl_file = process.argv[3];   //  scala_file

////////////////////////////////////////////////////////////////////////////////////////////////////////////

if(scl_file != null){
    var instream = fs.createReadStream(scl_file);
    console.log("\n <-   scl file loaded   ->");
}else{                                                              /// scala File loader
    var instream = fs.createReadStream('./scala_files/turkish_24.scl');
    console.log("<-   default rast scl file loaded   ->"+'\n');
}

const outstream = new stream;
const rl = readline.createInterface(instream, outstream);

let counter = 0;

rl.on('line', function (line) {                                   /// READ TEXT SCALA FILE RATIO FORMATED "3/4"
    counter++;
    if (counter > 5 && line !== "!") {
        let valueX = parseFloat(eval(line).toFixed(4));             // Evaluate ratio string
        scalaRatios.push(valueX);
        calcCents(valueX);     // Calc pitch offset in cents
    }
});

rl.on('close', function () {
    getFreqs();
    outputTXT();
    console.log("Nº cents list : "+ toCentslist.length);
    console.log(clc.green("\n nº notes : "+ toFreqList.length));
    console.log(clc.green("\n scala ratios size : "+ scalaRatios.length));
    console.log(scalaRatios);
    console.log("\n <------- Used Ratios ------->\n \n");	
});

function outputTXT(){
    let text = toFreqList.join(',');                   // add a coma & line end (','+'\r') between values
    fs.writeFileSync('freqsArray.txt', text, (err) => {     /// Write Values to text file
        if(err) throw err;
        console.log("Error ");
    }); 
    }

function calcCents(x){                                      /// Gets the list of pitchbend
    var centsOut = 1200.0 * Math.log(x) / Math.log(2);
    toCentslist.push(centsOut);
}

function getFreqs(){

    let oct = 1;

    if(refHz != null){
        var referenceHz =  refHz/16;        ///Set refernce pitch
    }else{
        var referenceHz = 440/16;
    }

    scalaRatios.unshift(1);
    //scalaRatios.pop();
    toCentslist.unshift(100);
  //  toCentslist.push(1200); if scala file is 12

    let result;

    for(oct;oct<1200;oct*=2){
        for(let y=0;y<scalaRatios.length;y++){
            result = (scalaRatios[y] * referenceHz )* oct ;
            toFreqList.push(result.toFixed(5));
        }
    }
    console.log(" Freq List \r " + toFreqList.length + " \r to cents list length " + toCentslist + " \r to cents \r "+toCentslist);
    toFreqList.splice(toFreqList.length-5, toFreqList.length);
   
}

function getDateTime() {

    var date = new Date();

    var hour = date.getHours();
    hour = (hour < 10 ? "0" : "") + hour;

    var min  = date.getMinutes();
    min = (min < 10 ? "0" : "") + min;

    var sec  = date.getSeconds();
    sec = (sec < 10 ? "0" : "") + sec;

    var year = date.getFullYear();

    var month = date.getMonth() + 1;
    month = (month < 10 ? "0" : "") + month;
    
    var day = date.getDate();
    day = (day < 10 ? "0" : "")+day;	

    return  day + "/"+month + "/"+ year+"  " + hour + ":" + min;

}
