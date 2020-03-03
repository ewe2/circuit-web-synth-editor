var output;

WebMidi.enable(function (err) {
    var status = document.querySelector('#status');

    if (err) {
        console.log("WebMidi could not be enabled.", err);
        alert(STATUS_NOT_COMPATIBLE);

        status.innerHTML = STATUS_NOT_COMPATIBLE;
        status.classList.add('text-danger');
        return;
    } else {
        console.log("WebMidi enabled!");
    }

    for (var i = 0; i < WebMidi.outputs.length; i++) {
        console.log('Output', WebMidi.outputs[i].name, WebMidi.outputs[i]);

        if (WebMidi.outputs[i].name.indexOf('Circuit') > -1) {
            output = WebMidi.outputs[i];
            break;
        }
    }

    if (output) {
        status.innerHTML = STATUS_CONNECTED;
        status.classList.add('text-info');
    } else {
        status.innerHTML = STATUS_NOT_CONNECTED;
        status.classList.add('text-warning');
    }

    // Play the welcome note
    output.playNote("C3", 1, {duration: "+2000"});
    output.stopNote("C3", 1, {duration: "+2000"});

    // In case of requesting patch data
    var input;
    for (var i = 0; i < WebMidi.inputs.length; i++) {
        console.log('Input', WebMidi.inputs[i].name, WebMidi.outputs[i]);

        if (WebMidi.inputs[i].name.indexOf('Circuit') > -1) {
            input = WebMidi.inputs[i];
            break;
        }
    }
    input.addListener('sysex', "all", function (event) {
        parseCircuitPatch(event.data);
    });

    input.addListener('controlchange', "all", function(event) {
        controllerChange(event.channel, event.controller.number, event.value)
    });

}, sysex=true);

resetValues();

$(function () {
  $('[data-toggle="tooltip"]').tooltip()
})
