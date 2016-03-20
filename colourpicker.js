$(document).ready(function() {
    
    /***************************COLOUR PICKER EXPERIMENT******************/
        var currentHex = '#FFF';

        $('.colour-picker').bind('change', function() {
            currentHex = $(this).val();
            $(this).attr('id', currentHex);
            console.log("change");
        });
    
});