<<<<<<< HEAD
$(document).on("click",".like-click",function(){
  var $this = $(this);
  var id=$(this).val();
  var like=
  {
  likes: $(this).parent().find('.likes').text()
  }
  console.log("like is ",like.likes);
  console.log(id);

  var val=$(this).parent().find('.likes').attr("value");
  console.log("val is", val);

  $.ajax({
    url:"/alldogs/like/"+id+"/",
    type:"post",
    data:like,
    dataType:"JSON",
    success:function(data){
      console.log(data);
      if(data=="login"){
        window.location.replace('/login');
      }
      else{
      $this.parent().find('.likes').text(parseInt(like.likes)+parseInt(data.likes));
      if(data.likes>0)
      $this.find("i").css("color",`red`);
      else{
        $this.find("i").css("color",`white`);
        console.log($(`button[liked=${id}]`).parent().html());
        $(`button[disliked=${id}]`).parent().parent().parent().remove();
        
      }
    }
  },
    error:function(error){
      alert("please login first");
      console.log("eroor");
    }

});   

});


=======
$(document).on("click",".like-click",function(){
  var $this = $(this);
  var id=$(this).val();
  var like=
  {
  likes: $(this).parent().find('.likes').text()
  }
  console.log("like is ",like.likes);
  console.log(id);

  var val=$(this).parent().find('.likes').attr("value");
  console.log("val is", val);

  $.ajax({
    url:"/alldogs/like/"+id+"/"+val,
    type:"post",
    data:like,
    dataType:"JSON",
    success:function(data){
      $this.parent().find('.likes').text(parseInt(like.likes)+parseInt(data.likes));
      if(data.likes>0)
      $this.find("i").css("color",`red`);
      else{
        $this.find("i").css("color",`white`);
        console.log($(`button[liked=${id}]`).parent().html());
        $(`button[disliked=${id}]`).parent().parent().parent().remove();
        
    }
  }

});   

});


>>>>>>> 8f565edf4a55bcbfa4eb3c8f0f2f6e502c5f08f5
