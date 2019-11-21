
window.onload = function() {
    //http://stackoverflow.com/questions/7425502/how-to-return-integer-from-url-hash-using-javascript
    var level = window.location.hash.match(/\d+/) || 1;
    world.init(level-1, "canvas", "hud", "tip");
    document.getElementById("reset").onclick = function() {
        world.resetLevel();
    }
    document.getElementById("skip").onclick = function() {
        world.victory();
    }
    document.getElementById("mute").onclick = function() {
        var music = document.getElementById("music");
        if(music.paused) {
            music.play();
            document.getElementById("mute").innerHTML = "<i class='fa fa-volume-up'></i>";
        }
        else {
            music.pause();
            document.getElementById("mute").innerHTML = "<i class='fa fa-volume-off'></i>&nbsp;&nbsp;";
        }
    }

}

addthis.layers({
    'theme' : 'transparent',
    'share' : {
      'position' : 'left',
      'numPreferredServices' : 5
    },  
    'whatsnext' : {},  
    'recommended' : {} 
  });