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
    var form = $(this);
        $.ajax({
        url:'/commitplace?'+$(this).serialize(),
        type:'POST',
        dataType:'html',
        success:function(data){
            var d = data.toString();
            if (d && d.substr(0,6) !== 'erreur') {
                
            form.html('Place committed successfully.');
            }
        }
        });
});
$("#drop-all").submit(function(){
    var form = $(this);
        $.ajax({
        url:'/drop_all',
        type:'POST',
        dataType:'html',
        success:function(data){
            if (data=== 'done') {
                
            form.html('Documents destroyed successfully.');
            }
        }
        });
});

var red=$('#red').html();
if (red === "yes"){
    alert("attention vous n'êtes pas administrateur.");window.location = '/';
}
};


