$(window).on('load', function(){

   var app = {

    user: 'anonymous',
    
    server: 'https://api.parse.com/1/classes/chatterbox',

    roomsObj: {},

    friends: [],

    latestPostTime: 0,

    // global container for current room variable
    currentRoom: undefined,

    firstInit: function() {
      var self = this;

      $('#submit').on('click', function(e) {
        self.handleSubmit();
      });

      $('.text').on('focus', function(){
        self.setKeyBinding();
      });
    
      $('.text').on('focusout', function(){
        self.clearKeyBinding();
      });

      $('.roomSelect').on('change', function() {

        // set selected option to global value
        self.currentRoom = event.target.value;
        // console.log(self.currentRoom);
        self.clearMessages();
        self.latestPostTime = 0;
        self._renderRoomList();

        self.fetch();
      });

      $('.home').on('click', function(){
        console.log('home');
        self.currentRoom = undefined;
        self.clearMessages();
        self.latestPostTime = 0;
        self._renderRoomList();
        self.fetch();
      });
    },

    periodicInit: function() {
      $('.username').on('click', function(event) {
        var username = event.currentTarget.innerHTML;
        self.addFriend(username);
      });
    },

    scrollAnimate: function() {
          $('#chats').animate( { scrollTop: $('#chats')[0].scrollHeight }, 1000);
    },

    setKeyBinding: function() {
      var self = this;
      $('.text').on('keydown', function(event) {
        if (event.keyCode === 13) {
          
          self.handleSubmit();
        }
      });
    },

    clearKeyBinding: function() {
      $('.text').unbind('keydown');
    },

    send: function(message) {
      var self = this;
      $.ajax({
        type: "POST",
        url: this.server,
        data: JSON.stringify(message),
        dataType: 'json',
        success: function() {
          self.fetch();
        }
      });
    },

    fetch: function() {
      console.log('fetch')

      $.ajax({
        type: "GET",
        url: this.server,
        data: 'order=-createdAt',
        success: function(data){
          var results = data.results;
          console.log('data', data);

          for(var i = 0; i < results.length; i++) {
            var result = results[i];
            var thisPostTime = Date.parse( this._escapeString( result.createdAt ) );
            
            if (thisPostTime <= this.latestPostTime) break;
            
            var text = this._escapeString(result.text);
            var username = this._escapeString(result.username);  
            // saves room names to global object variable.
            var roomName = this._escapeString( result.roomname );
            // names are saved as keys. number is not important.

            // if we're in a room and the object in this loop is not in our room, don't bother contiuint on this loop iteration


            this.roomsObj[roomName] = 0;
            // console.log(this.roomsObj)
            var resultObj = {
              text: text,
              username: username,
              roomname: roomName
            };

            console.log(this.currentRoom);
            if (this.currentRoom === undefined) {
              // console.log('current room is undefined')
              // in the home room, don't delte anything. just keep appending as usual
              this.addMessage(resultObj);
            } else if(this.currentRoom === resultObj.roomname) {
              // console.log('were in a room')

              // in a room!, clear everything on first run.
              this.addMessage(resultObj);              
            }
          }
        // sets latestTime to newest post currently on page
        this.latestPostTime = Date.parse( this._escapeString(results[0].createdAt) );
        
        this._clearRoomList();

        
        this._renderRoomList();
        app.periodicInit();

        this.scrollAnimate();
        
        }.bind(this)
      });

    },

    _clearRoomList: function() {
      $('.roomSelect').children().remove();
    },

    _renderRoomList: function() {
      // console.log(this.roomsObj);
      // fill room selection with rooms
      var $roomSelect = $('.roomSelect');
      _.each(this.roomsObj, function(val, key) {

        var option = "<option value=" + key + ">" + key + "</option>";
        $roomSelect.append(option);
      });
      var option = "<option value='new'>New room...</option>";
      $roomSelect.prepend(option);
      if (this.currentRoom !== undefined) {
        // set select menu to this room even after chat reset
        $('.roomSelect').val(this.currentRoom);
      }
    },

    addMessage: function(message) {
      var userName = '<span class="username">' + message.username + '</span>';
      
      if (this.friends.includes(message.username)) {
        userName = '<strong>' + userName + '</strong>';
      }
      
      var div = "<div class=" + message.roomname + ">" + userName + ': ' + message.text + "</div>";
      
      $('#chats').append(div);
    },

    clearMessages: function() {
      $('#chats').children().html();
    },

    addRoom: function(roomName) {
      var div = "<div>" + roomName + "</div>";
      $('#roomSelect').append(div);
    },

    addFriend: function(username) {
      this.friends.push(username);      
      this.fetch();
    },

    handleSubmit: function() {
      // grab data from text box
      var $text = $('.text').val();
      
      // reset userID to entered name
      this.user = $('.userID').val();
     
      // clear text box
      $('.text').val('');

      // use this.send to upload message to server

      // console.log('send fires: ', this.user, $text )
      this.send({
        username: this.user,
        text: $text,
        roomname: this.currentRoom
        // createdAt: Date()
      });
    },

    _escapeString: function(str) {
      if (str === undefined || str === null) {
        return '';
      } else {
        return str.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/"/g, '&quot;'); 
      }
    }
  };

  app.firstInit();


  (function fetchLoop() {
    app.fetch();
    setTimeout(fetchLoop, 3000);
  })();
});