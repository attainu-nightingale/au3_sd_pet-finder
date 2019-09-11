   //  for animation of profile...
   $(".jumbotron-fluid").hover(function () {
    $(".profile-tab").slideDown("slow");

}, function () {
    $(".profile-tab").slideUp("slow");
})

// for taking user to the top of the page;
$(document).ready(function () {
    $("#goToTop").click(function () {
        $('html, body').animate({
            scrollTop: $("#wrapper-container").offset().top
        }, 1500);
    });

    $("#goToUploads").click(function () {
        $('html, body').animate({
            scrollTop: $("#Uploads").offset().top
        }, 1500);
    });

    //showing the current section of the user
    $(window).scroll(function () {

        var liked = $('#Liked').offset().top - window.scrollY;
        var upload = $('#Uploads').offset().top - window.scrollY;
       // console.log(liked);
        if (liked < 0) {
            $("#currentSection").attr("class", "alert mt-5 fixed-top text-center alert-info").html("Liked Pets");
        }
        if (liked > 0 && upload <= 0) {
            $("#currentSection").attr("class", "alert mt-5 fixed-top text-center alert-info").html("Uploaded Pets");
        }
        if (liked > 0 && upload > 0) {
            $("#currentSection").attr("class", "").html();
        }

    });
    $("#wrapper-container").scroll(function () {
        console.log("val", (x += 1));
    });


    $("#goToLiked").click(function () {
        $('html, body').animate({
            scrollTop: $("#Liked").offset().top
        }, 1500);
    });
});   