getSocket = function(){
    var socket = io.connect("http://dev007.texturallc.net:3001");
    socket.on('slidechanged', function (data) {
      Reveal.slide(data.indexh, data.indexv, data.indexf);
    });
    return socket;
};
