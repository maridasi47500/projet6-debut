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
                    case 'tentative_connexion':
                        window.location = '/signin';
                }
            }
        }); 
    });
    $('#searchplace').submit(function(){
	    let form=$(this);
	    let liste=$('.places-list');
        $.ajax({
            url:"/searchplace?"+form.serialize(),
            type:"POST",
            dataType:"html",
            success:function(data){
		    let places=data!=="erreur" ? JSON.parse(data) : null;
		    let listeendroits="";
                if (places&& places.length > 0) {
			for (var i=0;i<places.length;i++){
				let place = places[i];
				console.log(place);
		      listeendroits+=`<div class="place">
                    <a href="/places/${place._id}">
                    <p>${place.name}</p>
                    <p>${place.city}, ${place.country}</p>
		    <p>${place.nbcom} comments - ${place.nbrec} recommendations</p>
                    </a>
                </div>`;
			};
			liste.html(listeendroits);


                }
            }
        }); 
    });
};
