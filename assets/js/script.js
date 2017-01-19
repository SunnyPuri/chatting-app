$(function(){
    var socket = io.connect(); 
    var $messageForm = $('#messageForm');
    var $message = $('#message');
    var $chat = $('#chat');
    var $userForm = $('#userForm');
    var $username = $('#username');
    var $userFormArea = $('#userFormArea');
    var $messageArea = $('#messageArea');
    var $users = $('#users');
    var $logout = $('#logout');

    $messageForm.submit(function(e){
        e.preventDefault();
        socket.emit('send message', $message.val());
        $message.val('');
    });

    socket.on('new message', function(data){
        //$chat.append('<div class="well"><strong>'+data.user+': </strong>'+data.msg+'</div>');
        $chat.append(`<li class="right clearfix"><span class="chat-img pull-right">
                    <div class="profile-me">${data.user[0]}</div>
                    </span>
                        <div class="chat-body clearfix">
                            <div class="header">
                                <small class=" text-muted"><span class="glyphicon glyphicon-time"></span>${data.time}</small>
                                <strong class="pull-right primary-font">${data.user}</strong>
                            </div>
                            <p>
                                ${data.msg}
                            </p>
                        </div>
                    </li>`);
        
        var elem = document.getElementById('chat-panel-body');
        elem.scrollTop = elem.scrollHeight;
    });

    $userForm.submit(function(e){
        e.preventDefault();
        //console.log('submit');
        if($username.val().trim()==''){
            return;
        }
        socket.emit('new user', $username.val(), function(data){
            if(data){
                $userFormArea.hide();
                $messageArea.show();
                $logout.show();

            }
        });
        $username.val('');
        
    });

    socket.on('get users', function(data){
        var html = '';
        for(i=0; i<data.length; i++){
            html +='<li class="list-group-item">'+data[i]+'<span class="online"></span></li>';
        }
        $users.html(html);
    });

    $('#message').keypress(function(e){
      if(e.which == 13){
          
          e.preventDefault();
          if($message.val().trim()==''){
            return;
          }
          socket.emit('send message', $message.val()); 
          //$('#messageForm').submit();
          $message.val('');
          
       }
    });

    //window.scrollTo(0,document.body.scrollHeight);

});