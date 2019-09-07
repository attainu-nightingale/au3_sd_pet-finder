$(document).ready(function(){
  $(document).on("click","#updatePetData",function(e){ 
      e.preventDefault();
    var data={
        name:$("#name").val(),
        age:$("#age").val(),
        vaccinated:$("input[name=vaccinated]:checked").val(),
        trained:$("input[name=trained]:checked").val(),
        category:$("input[name=category]:checked").val(),
        breeds:$("#breeds").val(),
        location:$("#location").val(),
        color:$("#color").val(),
        email:$("#email").val(),
        phone:$("#phone").val(),
        description:$("#description").text()
    }

    $.ajax({

       url:"/pets/update/"+$("#updatePetData").attr("pet_id"),
       type:'PUT',
       data:data,
       dataType:'JSON',
       success:function(data){
           console.log("success");
           window.location.replace("/userprofile/"+data);
       },
       error:function(error){
            
        console.log(error);
       }

    })

});


})


$(document).on("click",".pet-pics",function(){
var id=$(this).val();
var pub_id=$(this).attr('pub_id');
console.log("id is ",id);
$("#petsModalUpload").find("form").attr("action","/userprofile/pets/pic/update/"+id+"/"+pub_id);
console.log("action is ",$("#petsModalUpload").find("form").attr("action"));


});