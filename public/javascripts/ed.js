window.onload = function(){
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
                default:
                    break;
            }
        }
    }); 
});

$("form").submit(function(){
    var p1 = $("#pword").val(), p2 = $("#pwordbis").val(),id=$(this).data('id');
    if (p1 && p2 && p1 === p2) {
        $.ajax({
        url:'/users/'+id+'/edit?'+$(this).serialize(),
        type:'POST',
        dataType:'html',
        success:function(data){
            if (data.substr(0,6) !== 'ERREUR') {
            $('.successful').html('Infos edited successfully.');
            } else {
            $('.successful').html('Error.');
            }
        }
        });
    } else {
        return false;
    }
});

};

