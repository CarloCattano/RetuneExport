/// READ SCALA FILE OR ARRAY
/// Node app that reads a scala file and coverts it to a list
/// of frequencies or cents offset . Results are dumped into a txt
/// for further use in the retuning of synthesizer hardware & software
// Carlo Cattano 2019

const fs = require('fs');
const readline = require('readline');
const stream = require('stream');

var scalaRatios = [];
var toFreqList = [];
var toCentslist = [];

const refHz = process.argv[2];      //  reference pitch
const scl_file = process.argv[3];   //  scala_file

// set server with express 



if(scl_file != null){
    var instream = fs.createReadStream(scl_file);
    console.log("scl not null ");
}else{
    var instream = fs.createReadStream('custom4.scl');
}

const outstream = new stream;
const rl = readline.createInterface(instream, outstream);

let counter = 0;

rl.on('line', function (line) {                         /// READ TEXT SCALA FILE RATIO FORMATED "3/4"              
    counter++;
    if (counter > 5 && line !== "!") {
        let valueX = parseFloat(eval(line).toFixed(4)); // Evaluate ratio string  
        scalaRatios.push(valueX);                       
        calcCents(valueX);                              // Calc pitch offset in cents
    }
});

rl.on('close', function () {
    getFreqs();
    outputTXT();
    console.log("Nº cents list : "+ toCentslist.length);
    console.log("nº notes : "+ toFreqList.length);
    console.log("scala ratios size : "+ scalaRatios.length);
    console.log(scalaRatios);
});

function outputTXT(){
    let text = toFreqList.join('\r');                   // add a coma & line end (','+'\r') between values
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

    toCentslist.unshift(100);
    toCentslist.push(1200);

    let result;

    for(oct;oct<=1200;oct*=2){
        for(let y=0;y<scalaRatios.length;y++){
            result = (scalaRatios[y] * referenceHz )* oct ;
            toFreqList.push(result.toFixed(4));
        }
    }
    toFreqList.splice(toFreqList.length-5, toFreqList.length);
}
