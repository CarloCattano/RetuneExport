
var data, cmd, channel, type, note, velocity;

// request MIDI access
if (navigator.requestMIDIAccess) {
    navigator.requestMIDIAccess({
        sysex: false
    }).then(onMIDISuccess, onMIDIFailure);
} else {
    alert("No MIDI support in your browser.");
}

// midi functions
function onMIDISuccess(midiAccess) {
    midi = midiAccess;
    var inputs = midi.inputs.values();
    // loop through all inputs
    for (var input = inputs.next(); input && !input.done; input = inputs.next()) {
        // listen for midi messages
        input.value.onmidimessage = onMIDIMessage;
        // this just lists our inputs in the console
        listInputs(input);
    }
    // listen for connect/disconnect message
    midi.onstatechange = onStateChange;
}

function onMIDIMessage(event) {
    data = event.data,
    cmd = data[0] >> 4,
    channel = data[0] & 0xf,
    type = data[0] & 0xf0, // channel agnostic message type. Thanks, Phil Burk.
    note = data[1],
    velocity = data[2];
    // with pressure and tilt off
    // note off: 128, cmd: 8 
    // note on: 144, cmd: 9
    // pressure / tilt on
    // pressure: 176, cmd 11: 
    // bend: 224, cmd: 14
    switch (type) {
        case 144: // noteOn message 
             noteOn(note, velocity);
             break;
        case 128: // noteOff message 
            noteOff(note, velocity);
            break;
        case 176: //modwheel
            switch(note){
            case 1:
                modWheelMap(note,velocity);
                break;
            case 22:
                synth.voices.modulationFrequency = velocity/127 ;
                break;
            }
    }

   // console.log('data', data, 'cmd', cmd, 'channel', channel);
}
function onStateChange(event) {
    var port = event.port,
        state = port.state,
        name = port.name,
        type = port.type;
    if (type == "input") console.log("name", name, "port", port, "state", state);
}

function listInputs(inputs) {
    var input = inputs.value;
    console.log("Input port : [ type:'" + input.type + "' id: '" + input.id +
        "' manufacturer: '" + input.manufacturer + "' name: '" + input.name +
        "' version: '" + input.version + "']");
}

function noteOn(midiNote, velocity) {
    synth.triggerAttack(notesList[note],"+0.002");
    //player(midiNote, velocity);
    //synth.triggerAttack(notesList[midiNote],"+0.01");
    //console.log(midiNote, velocity + " Notelist " + notesList[midiNote]);
}

function noteOff(midiNote, velocity) {
    synth.triggerRelease(notesList[note],"+0.002");
    //synth.triggerRelease(notesList[midiNote],"+0.01");
    //player(midiNote, velocity);
}


function onMIDIFailure(e) {
    console.log("No access to MIDI devices or your browser doesn't support WebMIDI API. Please use WebMIDIAPIShim " + e);
}


// utility functions
function randomRange(min, max) {
    return Math.random() * (max + min) + min;
}

function rangeMap(x, a1, a2, b1, b2) {
    return ((x - a1) / (a2 - a1)) * (b2 - b1) + b1;
}

function modWheelMap(n,v){
    filter.frequency.linearRampTo(rangeMap(v,0,127,60,2000),0.003);
}
