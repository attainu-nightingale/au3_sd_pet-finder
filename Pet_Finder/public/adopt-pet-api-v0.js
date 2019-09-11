$(document).on("click",".btn-adopt",function(e){
    e.preventDefault();
var $this=$(this);
var id=$this.attr("value");
console.log("id is ",id);

$.ajax({
  
    url:"/adopt/"+id,
    dataType:"JSON",
    type:"POST",
    success:function(data){

        alert(data);
    },
    error:function(){
        alert("please login first");
       console.log("error");
    }
})
})


$(document).on("click",".btn-accept",function(e){
    e.preventDefault();
var $this=$(this);
var id=$this.attr("value");
var user={
user:$this.attr("user")
}
console.log(user)
console.log("id is ",id);
if(confirm("After click on accept you will not able to cancel the request"))
{
$.ajax({
  
    url:"/adopt/accept/"+id,
    type:"POST",
    data:user,
    dataType:"JSON",
    success:function(data){
        alert(data);
       
    },
    error:function(){
        alert("please login first");
       console.log("error");
    }
})
}
});

$(document).on("click",".delete-request",function(e){
    e.preventDefault();
var $this=$(this);
var id=$this.attr("value");
var user={
user:$this.attr("user"),
email:$("#email").text()
}
console.log(user)
console.log("id is ",id);
if(confirm("Are you sure..."))
{
$.ajax({
  
    url:"/adopt/delete/"+id+'/'+user.user+'/'+user.email,
    type:"delete",
    data:user,
    dataType:"JSON",
    success:function(data){
        alert(data);
        $this.parent().parent().remove();
    },
    error:function(){
        alert("please login first");
       console.log("error");
    }
})
}
});

