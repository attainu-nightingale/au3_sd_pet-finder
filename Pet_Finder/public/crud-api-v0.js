
//this is for deleting the uploaded pets 
$(document).on("click", ".delete", function () {
    var $this = $(this);
    var id = $this.attr("id");
    var public_id = $this.attr("value");
    console.log("id ", id);
    console.log("public_id ", public_id);

  if(confirm("Once you will delete this you will not see this post are you sure?")){
    $.ajax({

        url: '/userprofile/pets/delete/' + id + '/' + public_id,
        type: 'DELETE',
        data: 'JSON',
        success: function (data) {
            $this.parent().parent().parent().remove();
            $(`[id=${id}]`).parent().parent().parent().remove();
            console.log("successsfully deleted");
        }
    })
  }

});

//deleting the request for pet adoption...
$(document).on("click", ".delete-request", function () {
    var $this = $(this);
    var id = $this.attr("id");

    if (confirm("Are you sure for delete this adoption request ?")) {
        $.ajax({

            url: '/userprofile/pets/delete/' + id,
            type: 'DELETE',
            data: 'JSON',
            success: function (data) {
                $this.parent().parent().parent().remove();
                console.log("successsfully deleted");
            }
        });
    }


});




//updating the user info
$(document).ready(function(){
$("#updateInfo").click(function(e){
   
    e.preventDefault(); //prevent from the default behaviour of the browser
     $("div#exampleModal div#userUpdateModalForm").find(".alert").remove();
    var updatedData={
        firstname:$("#firstname").val(),
        lastname:$("#lastname").val(),
        phone:$("#phone").val(),
        email:$("#email").val()
    }
     console.log('update one',updatedData);
    $.ajax({
        url:"/userprofile/update/info",
        type:'PUT',
        data:updatedData,
        dataType:'JSON',
        success:function(data){

            $("div#exampleModal div#userUpdateModalForm").append(`
            <div class="alert alert-success mt-3">Information updated successfully !!</div>
            `);

            location.reload(true);
    
        },
        error:function(data){

            $("div#exampleModal div#userUpdateModalForm").append(`
            <div class="alert alert-warning mt-3">Sorry unable to update your information</div>
            `);
        }

    })


});



});
