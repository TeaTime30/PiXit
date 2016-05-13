jQuery(function($){
   $("#first").Watermark("First Name");
   $("#last").Watermark("Last Name");
   $("#email").Watermark("Email");
   $("#pass1").Watermark("Password");
   $("#pass2").Watermark("Please Confirm Your Password");
   $("#email1").Watermark("Email");
   $("#pass3").Watermark("Password");

	$("#pass1").click(function(){
		//console.log("Hello World");
		$('#pass1').attr("type", "password");
	});
	$("#pass2").click(function(){
		//console.log("Hello World");
		$('#pass2').attr("type", "password");
	});
	$("#pass3").click(function(){
		//console.log("Hello World");
		$('#pass3').attr("type", "password");
	});
	var pass = "";
	var passc = "";

	$("#pass1").blur(function(){
		var pass = $('#pass1').val();
		if(pass == "Password"){
			$('#pass1').attr("type", "text");
		}
		else{
			$('#pass1').attr("type", "password");
		}
	});
	
	$("#pass2").blur(function(){
		var passc = $('#pass2').val();
		if(passc == "Please Confirm Your Password"){
			$('#pass2').attr("type", "text");
		}
		else{
			$('#pass2').attr("type", "password");
		}
	});
	$("#pass3").blur(function(){
		var passc = $('#pass3').val();
		if(passc == "Please Confirm Your Password"){
			$('#pass3').attr("type", "text");
		}
		else{
			$('#pass3').attr("type", "password");
		}
	});
/*
	$("#pass2").mouseleave(function(){
		if(pass == passc){
			$('#pass1').val("");
			$('#pass2').val("");
			$('#pass1').attr("type", "text");
			$('#pass2').attr("type", "text");
		}
		else{
			Window.alert("The Passwords you have entered do not match. Please re-enter");
		}
	});

		*/

	//NAVIGATION
	$("#sign").click(function() {
	    $('html,body').animate({
	        scrollTop: $("#signup").offset().top},
	        'slow');
	});

	$("#sin").click(function() {
	    $('html,body').animate({
	        scrollTop: $("#signin").offset().top},
	        'slow');
	});

	$("#sigin").click(function() {
		var email = $('#email1').val();
		var passed = $('#pass3').val();
		if(email == "forOne@capstone.com" && passed == "musketeers"){
			window.location.href = "/home/jill/Documents/PiXit!/PiXit/PiXit.html";
		}
	});

	$("#home").click(function() {
    $('html,body').animate({
        scrollTop: $("body").offset().top},
        'slow');
	});

	$("#samp").click(function() {
    $('html,body').animate({
        scrollTop: $("#break").offset().top},
        'slow');
	});

	$("#abt").click(function() {
    $('html,body').animate({
        scrollTop: $("#about").offset().top},
        'slow');
	});
});

function UseData(){
   $.Watermark.HideAll();
   //Do Stuff
   $.Watermark.ShowAll();
}
