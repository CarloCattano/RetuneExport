

var keyb = [65,87,83,69,68,70,84,71,72,85,74,75,76];
//////////////////////////////////////////////////

var keyAllowed = {};                             
var octOffset = 23;
//////   KEYBOARD LAYOUT

document.addEventListener('keydown', function(e) {
    if (keyAllowed [e.which] === false) return; //Filter repetitions
        keyAllowed [e.which] = false;
	
	if(keyb.includes(e.keyCode)){
		let playednote = keyb.indexOf(e.keyCode);
		/// played note -> notesList query
		synth.triggerAttack(notesList[playednote+octOffset],"+0.01");
	}
	//console.log(e.keyCode);
});

document.addEventListener('keyup', function(e) {
    keyAllowed [e.which] = true;
    
if(keyb.includes(e.keyCode)){
	let playednote = keyb.indexOf(e.keyCode);
    synth.triggerRelease(notesList[playednote+octOffset],"+0.01");
}
    //Octave Up & down Ableton Live Layout YX / ZX	
	if(e.keyCode == 88 && octOffset <= 115){
        octOffset += 12;
	}else if(e.keyCode == 90 && octOffset >= 0){
        octOffset -= 12;
    }
});


