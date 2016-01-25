// YOUR CODE HERE:



var app = {
  
  server: 'https://api.parse.com/1/classes/chatterbox',

  init: function() {

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
      url: this.server
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
  }

};