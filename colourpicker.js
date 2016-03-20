$(document).ready(function() {
    
    /***************************COLOUR PICKER EXPERIMENT******************/
        var currentHex = '#FFF';

        $('#colour-picker').bind('change', function() {
            currentHex = $(this).val();
            $('#picker > .colours').attr('id', currentHex);
            console.log("change");
        });
    
});