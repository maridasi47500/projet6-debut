$(function(){
$('#co').click(function(){
    $.ajax({
        url:"/logout",
        type:"POST",
        dataType:"html",
        success:function(data){
            switch (data) {
                case 'tentative_deconnexion_reussie':
                    window.location.reload();
                    break;
                case 'tentative_connexion':
                    window.location = '/signin';
                    break;
            }
        }
    }); 
});

$("form").submit(function(){
    $.ajax({
    url:'/new_place?'+$(this).serialize(),
    type:'POST',
    dataType:'html',
    success:function(data){
        if (data && data.substr(0,6) !== 'erreur') {
        $('.successful').html('Thanks. Your place is awaiting validation.');
        } else {
        $('.successful').html('Error.');
        }
    }
    });
});

});

