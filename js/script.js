//Get Player List
function getPlayers(){

    var page_num = $('#currentpage').val();

    $.ajax({
        url: "ajax.php",
        type: "GET",
        dataType: "json",
        data: {page: page_num, action:"getusers"},
        beforeSend: function(){
            $('#overlay').fadeIn();
        }, 
        success: function(rows){
            console.log(rows);
           
            var playerlist = '';
            if(rows.players){ //json players
                $.each(rows.players, function(index, player){
                    playerlist += getPlayerRow(player);
                })
                $("#userstable tbody").html(playerlist);
                let totalPlayers = rows.count; //json count
                let totalpages = Math.ceil(parseInt(totalPlayers)/4);
                const currentpage = $('#currentpage').val();
                pagination(totalpages, currentpage);
                $('#overlay').fadeOut();
            }
           
        },

        error: function(){
            console.log("Ooop!! Somethig went wrong!!");
        },

    });
}

//Get Player Row
function getPlayerRow(player){
    var playerRow = '';
    const userPhoto = player.photo ? player.photo : 'default.png';
    if(player){
        playerRow = `<tr>
        <td class="align-middle"><img src="uploads/${userPhoto}" class="img-thumbnail rounded float-left"></td>
        <td class="align-middle">${player.pname}</td>
        <td class="align-middle">${player.email}</td>
        <td class="align-middle">${player.phone}</td>
        <td class="align-middle">
        <a href="#" class="btn btn-success mr-3 profile" data-toggle="modal" data-target="#userViewModal" title="Prfile" data-id="${player.id}"><i class="fa fa-address-card-o" aria-hidden="true"></i></a>
        <a href="#" class="btn btn-warning mr-3 edituser" data-toggle="modal" data-target="#userModal" title="Edit" data-id="${player.id}"><i class="fa fa-pencil-square-o fa-lg"></i></a>
        <a href="#" class="btn btn-danger deleteuser" data-userid="14" title="Delete" data-id="${player.id}"><i class="fa fa-trash-o fa-lg"></i></a>
        </td>
        </tr>`;
    }

    return playerRow;
}

//Get pagination
function pagination(totalpages, currentpage){
    
    var pagelist='';
    
    if(totalpages>1){
        currentpage= parseInt(currentpage);
        pagelist += `<ul class="pagination justify-content-center">`;

        const prevClass = currentpage == 1 ? 'disabled' : '';
        pagelist += `<li class="page-item ${prevClass}"><a class="page-link" href="#" data-page="${currentpage - 1}" >Previous</a></li>`;

        for(let p=1; p<=totalpages; p++){
            const activeClass = currentpage == p ? 'active' : '';
            pagelist += `<li class="page-item ${activeClass}"><a class="page-link" href="#" data-page="${p}" >${p}</a></li>`;
            }

        const nextClass = currentpage == totalpages ? 'disabled' : '';    
        pagelist += `<li class="page-item ${nextClass}"><a class="page-link" href="#" data-page="${currentpage + 1}" >Next</a></li>`;

        pagelist += `</ul>`;
    }

    $('#pagination').html(pagelist);
}


$(document).ready(function(){

    //get records

    getPlayers();

    //add/edit user modal
    $(document).on("submit", "#addform", function(event){
        event.preventDefault();
        var alertmsg = ($('#userid').val()>0) ? "Player has been updated succesfully" : "A new player has benn added succesfully!" ;
        $.ajax({
            url:"ajax.php",
            type: "POST",
            dataType: "json",
            data: new FormData(this),
            processData: false,
            contentType: false,
            beforeSend: function() {
                $('#overlay').fadeIn();
            },
            success: function(response) {
                console.log(response);
                if(response){
                    $("#userModal").modal("hide");
                    $("#addform")[0].reset();
                    $(".message").html(alertmsg).fadeIn().delay(3000).fadeOut();
                    getPlayers();
                    $('#overlay').fadeOut();
                    
                }
            },
            error: function(){
                console.log("Ooops!! Something went wrong!!")
            },
        });
    });

    //pagination action buttons
    $(document).on("click", "ul.pagination li a", function(e){
        e.preventDefault();
        var page_num = $(this).data("page"); //data-page
        //alert("Page num"+pagenum);
        $('#currentpage').val(page_num);
        getPlayers();
        //$(this).parent().siblings().removeClass("active");
        //$(this).parent().addClass("active");
    });

    //Reset form when click on New Add button
    $(document).on("click", "#addnewbutton",  function(){
        $("#addform")[0].reset();
        $("#userid").val("");
    });


    //get user id to edit data
    $(document).on("click", "a.edituser", function(e){
        e.preventDefault();
        var id = $(this).data("id") //data id
        //alert(id);
        $.ajax({
            url: "ajax.php",
            type: "GET",
            dataType: "json",
            data: {id: id, action:"getuser"},
            beforeSend: function(){
                $('#overlay').fadeIn();
            }, 
            success: function(player){
                
                //console.log(player);
                if(player){
                    $('#username').val(player.pname);
                    $('#email').val(player.email);
                    $('#phone').val(player.phone);  
                    $('#userid').val(player.id);   
                }
                    
                    $('#overlay').fadeOut();       
            },
    
            error: function(){
                console.log("Ooop!! Somethig went wrong!!");
            },
    
        });

    });


     //show data by id
     $(document).on("click", "a.profile", function(e){
        e.preventDefault();
        var id = $(this).data("id") //data id
        //alert(id);
        $.ajax({
            url: "ajax.php",
            type: "GET",
            dataType: "json",
            data: {id: id, action:"getuser"},
            success: function(player){
                
                //console.log(player);
                if(player){
                    //console.log(player)
                    const userPhoto = player.photo ? player.photo : 'default.png';
                    const profileCard =`<div class="row">
                    <div class="col-sm-6 col-md-4">
                        <img src="uploads/${userPhoto}" class="rounded responsive" />
                    </div>
                    <div class="col-sm-6 col-md-8">
                        <h4 class="text-primary">${player.pname}</h4>
                        <p class="text-secondary">
                        <i class="fa fa-envelope-o" aria-hidden="true"></i> ${player.email}
                        <br />
                        <i class="fa fa-phone" aria-hidden="true"></i> ${player.phone}
                        </p>
                    </div>
                </div>`;
                
                $("#userViewModal .container").html(profileCard);
                
                }
                    
                      
            },
    
            error: function(){
                console.log("Ooop!! Somethig went wrong!!");
            },
    
        });

    });

     //get user id to delete data
     $(document).on("click", "a.deleteuser", function(e){
        e.preventDefault();
        var id = $(this).data("id") //data id
        //alert(id);

        if(confirm("Are you sure want delete this record?")){
            var alertmsg = "Player has been deleted successfully!"
            $.ajax({
                url: "ajax.php",
                type: "GET",
                dataType: "json",
                data: {id: id, action:"deleteuser"},
                beforeSend: function(){
                    $('#overlay').fadeIn();
                }, 
                success: function(response){
                   if(response.delete == 1){
                    $(".message").html(alertmsg).fadeIn().delay(3000).fadeOut();
                    getPlayers();
                   }                
                    $('#overlay').fadeOut();     
                },
        
                error: function(){
                    console.log("Ooop!! Somethig went wrong!!");
                },
        
            });
    
        }
       
    });

    //get search results
    //$("#searchinput",).on("keyup", function(e) 
    $(document).on("keyup", "#searchinput", function() {
        var searchText = $("#searchinput").val();
       // console.log(searchText);
       if(searchText.length > 1){
            $.ajax({
                url: "ajax.php",
                type: "GET",
                dataType: "json",
                data: {searchQuery: searchText, action:"search"},
                beforeSend: function(){
                    //$('#overlay').fadeIn();
                }, 
                success: function(players){
                    
                    //console.log(player);
                    if(players){
                        console.log(players);
                        var playerlist = '';
                        $.each(players, function(index, player){
                        playerlist += getPlayerRow(player);
                        });
                        $("#userstable tbody").html(playerlist);
                        $("#pagination").hide();
                       
                    
                    }
                        
                },
        
                error: function(){
                    console.log("Ooop!! Somethig went wrong!!");
                },
        
            });
       }else{
        getPlayers();
        $("#pagination").show();
        //$('#overlay').fadeOut();
       }
      

    });

});