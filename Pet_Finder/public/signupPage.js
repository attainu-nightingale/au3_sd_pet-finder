    var error_fname = false;
    var error_sname = false;
    var error_email = false;
    var error_uname = false;
    var error_password = false;

    function check_firstname() {
      var pattern = /^[a-zA-Z]*$/;
      var fname = $("#firstname").val()
      if (pattern.test(fname) && fname !== '') {
         $("#fname_error_message").hide();
      } else {
         $("#fname_error_message").html("Should contain only Characters");
         $("#fname_error_message").show();
         error_fname=true
      }
   }
$('#firstname').on('keyup', check_firstname);

function check_lastname() {
   var pattern = /^[a-zA-Z]*$/;
   var lname = $("#lastname").val()
   if (pattern.test(lname) && lname !== '') {
      $("#lname_error_message").hide();
   } else {
      $("#lname_error_message").html("Should contain only Characters");
      $("#lname_error_message").show();
      error_sname = true
   }
}
$('#lastname').on('keyup', check_lastname);

function check_email() {
   var pattern = /^([\w-\.]+@([\w-]+\.)+[\w-]{2,4})?$/;
   var email = $("#email").val()
   if (pattern.test(email) && email !== '') {
      $("#email_error_message").hide();
   } else {
      $("#email_error_message").html("Invalid email");
      $("#email_error_message").show();
      error_email = true
   }
}
$('#email').on('keyup', check_email);

function check_username() {
   var pattern = /^([^W]*)$/;
   var uname = $("#username").val()
   if (pattern.test(uname) && uname !== '') {
      $("#uname_error_message").hide();
   } else {
      $("#uname_error_message").html("Shoulnot contain spaces");
      $("#uname_error_message").show();
      error_uname = true
   }
}
$('#username').on('keyup', check_username);

function check_password() {
 var password_length = $("#password").val().length;
  if (password_length < 8) {
   $("#password_error_message").html("Atleast 8 Characters");
   $("#password_error_message").show();
   error_password = true
} else {
   $("#password_error_message").hide();
 }
 }
$('#password').on('keyup', check_password);