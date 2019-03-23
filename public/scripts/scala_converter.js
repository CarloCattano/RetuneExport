var scalaRatios = [];
var toFreqList = [];
var toCentslist = [];

const refHz = 220.0;      //  reference pitch
const scl_file = "../scala_files/turko-arabic_rast_on_c.scl";   //  scala_file

let counter = 0;

fetch(scl_file)
  .then(response => response.text())
  .then(text => console.log(text))