// YOUR CODE HERE:



var app = {
  
  server: 'https://api.parse.com/1/classes/chatterbox',

  init: function() {
    var self = this;

    $('.username').on('click', function(event) {
      var username = event.currentTarget.innerHTML;
      self.addFriend(username);
    });

    $('#send .submit').on('submit', self.handleSubmit);
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

    $.ajax({
      type: "GET",
      url: this.server,
      data: 'order=-createdAt',
      success: function(data){
        console.log('data', data.results);
        var results = data.results;

        for( var i in results ) {
          var result = results[i];
          this.addMessage(result);
        }
      }.bind(this)
    });
  },

  addMessage: function(message) {
    var userName = '<span class="username">' + message.username + '</span>';
    var div = "<div>" + userName + ': ' + message.text + "</div>";

    console.log(div);
    $('#chats').append(div);
  },

  clearMessages: function() {
    $('#chats').remove();
  },

  addRoom: function(roomName) {
    var div = "<div>" + roomName + "</div>";
    $('#roomSelect').append(div);
  },

  addFriend: function(username) {
    console.log(username);
  },

  handleSubmit: function() {
    // grab data from text box
    // clear text box
    // use this.send to upload message to server
  }

};