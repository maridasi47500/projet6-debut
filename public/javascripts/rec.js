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
            }
        }
    }); 
});
//commenter

$("#comment").submit(function(){
    $.ajax({
    url:'/comment?'+$(this).serialize(),
    type:'POST',
    dataType:'html',
    success:function(data){
	console.log(data);
        if (data && data.substr(0,6) !== 'erreur') {
        $('.successful').html('Place commented successfully.');
         }
    }
    });
});

//recommender

$("#recommend").submit(function(){
    $.ajax({
    url:'/recommend?'+$(this).serialize(),
    type:'POST',
    dataType:'html',
    success:function(data){
	console.log(data);
        if (data && data.substr(0,6) !== 'erreur') {
        $('.successful-recommend').html('Place recommended successfully.');
        }
    }
    });
});
$("[data-userrecommend], [data-usercomment]").each(function(){
    var div = $(this),rec=div.data('userrecommend'),com=div.data('usercomment'), userid=(rec||com);
    $.ajax({
    url:'/usersinfo/'+userid,
    type:'GET',
    dataType:'html',
    success:function(data){
	console.log(data);
        if (rec) {
            div.append(data);
        } else if (com) {
            div.append(" par "+data);
        }
    }
    });
});

};

