$(window).on('load', function(){

   var app = {

    user: window.location.search.slice(10),
    
    server: 'https://api.parse.com/1/classes/chatterbox',

    init: function() {
      var self = this;

      $('.username').on('click', function(event) {
        var username = event.currentTarget.innerHTML;
        self.addFriend(username);
      });

      $('#submit').on('click', function(e) {
        self.handleSubmit();
      });

      $('.text').on('focus', function(){
        self.setKeyBinding();
      });
    
      $('.text').on('focusout', function(){
        self.clearKeyBinding;
      });
    },

    setKeyBinding: function() {
      var self = this;
      $('.text').on('keydown', function(event) {
        if (event.keyCode === 13) {
          
          self.handleSubmit();
        };
      });
    },

    clearKeyBinding: function() {
      $('.text').unbind('keydown');
    },

    send: function(message) {
      
      $.ajax({
        type: "POST",
        url: this.server,
        data: JSON.stringify(message),
        dataType: 'json'
      });
    },

    fetch: function() {
      this.clearMessages();

      $.ajax({
        type: "GET",
        url: this.server,
        data: 'order=-createdAt',
        success: function(data){
          // 
          var results = data.results;

          for(var i = 0; i < results.length; i++) {
            var result = results[i];
            var text = this._escapeString(result.text);
            var username = this._escapeString(result.username);
            // 
            var resultObj = {
              text: text,
              username: username
            };
            
            this.addMessage(resultObj);
          }
        }.bind(this)
      });
    },

    addMessage: function(message) {
      var userName = '<span class="username">' + message.username + '</span>';
      var div = "<div>" + userName + ': ' + message.text + "</div>";

      // 
      $('#chats').append(div);
    },

    clearMessages: function() {
      $('#chats').children().remove();
    },

    addRoom: function(roomName) {
      var div = "<div>" + roomName + "</div>";
      $('#roomSelect').append(div);
    },

    addFriend: function(username) {
      
    },

    handleSubmit: function() {
      // grab data from text box
      var $text = $('.text').val();
      
      // clear text box
      $('.text').val('');
      // use this.send to upload message to server
      this.send({
        username: this.user,
        text: $text,
        room: ""
      });
    },

    _escapeString: function(str) {
      return str === undefined ? "" : str.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/"/g, '&quot;'); 
    }
  };

  app.init();


  (function fetchLoop() {
    app.fetch();
    setTimeout(fetchLoop, 8000);
  })();
});