

window.onload = function() {
  
    var context = Tone.context;
    
    var analyser = context.createAnalyser();

    var canvas = document.getElementById("myCanvas");

    var ctx = canvas.getContext("2d");

    synth.connect(analyser); //
    analyser.connect(context.destination); //

    analyser.fftSize = 512;

    var bufferLength = analyser.frequencyBinCount;
    var dataArray = new Uint8Array(bufferLength);

    var WIDTH = canvas.width;
    var HEIGHT = canvas.height;
    var barWidth = (WIDTH / bufferLength) * 2.5;
    var barHeight;
    var x = 0;

    function renderFrame() {
      requestAnimationFrame(renderFrame);
      x = 0;

      analyser.getByteFrequencyData(dataArray);

      ctx.fillStyle = "#000";
      ctx.fillRect(0, 0, WIDTH, HEIGHT);
      
      for (var i = 0; i < bufferLength; i++) {
        barHeight = dataArray[i];
        
        var r = barHeight + (25 * (i/bufferLength));
        var g = WIDTH * (i/bufferLength);
        var b = 50;

        ctx.fillStyle = "rgb(" + r + "," + g + "," + b + ")";

        ctx.fillRect(x, HEIGHT - barHeight, barWidth, barHeight);

        x += barWidth + 1;
      }
    }
    renderFrame();
  };
console.log("visualizer loaded");
  /*
var context = Tone.context;
var analyser = context.createAnalyser();
var WIDTH = 400;
var HEIGHT = 400;

var gainNode = context.createGain();

var canvas = document.getElementById('myCanvas');
var myCanvas = canvas.getContext("2d");
synth.connect(analyser);


analyser.fftSize = 2048;
var bufferLength = analyser.frequencyBinCount; //an unsigned long value half that of the FFT size. This generally equates to the number of data values you will have to play with for the visualization
var dataArray = new Uint8Array(bufferLength);

rewer.connect(gainNode);
gainNode.connect(analyser);

analyser.getByteTimeDomainData(dataArray); 


myCanvas.clearRect(0, 0, WIDTH, HEIGHT);

function draw() {
  drawVisual = requestAnimationFrame(draw);
  analyser.getByteTimeDomainData(dataArray);
  
  myCanvas.fillStyle = 'rgb(200, 200, 200)';
  myCanvas.fillRect(0, 0, WIDTH, HEIGHT);
  myCanvas.lineWidth = 2;
      myCanvas.strokeStyle = 'rgb(0, 0, 0)';

      myCanvas.beginPath();
  var sliceWidth = WIDTH * 1.0 / bufferLength;
      var x = 0;
  
  for(var i = 0; i < bufferLength; i++) {
   
        var v = dataArray[i] / 128.0;
        var y = v * HEIGHT/2;

        if(i === 0) {
          myCanvas.moveTo(x, y);
        } else {
          myCanvas.lineTo(x, y);
        }

        x += sliceWidth;
      };
  
  myCanvas.lineTo(canvas.width, canvas.height);
      myCanvas.stroke();
    };

draw();
*/