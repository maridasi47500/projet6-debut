window.onload = function(){
$("form").submit(function(){
$.ajax({
url:"/new_connection?"+$(this).serialize(),
type:'POST',
dataType:'html',
success:function(data){
if(data !== 'notok'){
    window.location='/';
} else {
    $('.successful').html('Problème lors de votre authentification. Réessayez.');
};
}
});
});
};
