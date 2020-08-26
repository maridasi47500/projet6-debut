window.onload = function(){
$("form").submit(function(){
$.ajax({
url:"/new_user?"+$(this).serialize(),
type:'POST',
dataType:'html',
success:function(data){
    $('.successful').html('Registration successful. You can <a href="/signin">sign in</a>');
}
});
});
};
