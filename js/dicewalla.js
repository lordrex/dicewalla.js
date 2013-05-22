/* Copyright Lord Rex 2012-2013 */
var colorSchemes = [{name:'white', pips:'#000000', face:'#fafdfb'},
{name:'red', pips:'#ffffff', face:'#990000'},
{name:'green', pips:'#ffffff', face:'#009900'}
];

var $diceId = 0;

function Die() {
  this.id = $diceId++;
console.log("creating die", this.id);
  this.score = 0;
  this.selected = false;
  this.pclr = 0;
  this.rotation = (Math.random()-.5)*(Math.PI / 180) * 20;
  this.needsRedraw = false;
}

Die.prototype = {
  roll: function() {
    this.score = Math.floor((Math.random()*6)+1);
    this.selected = false;
  },

  compareTo: function(other) {
    return other.score - this.score;
  },

  pipColor: function() {
    return colorSchemes[this.pclr].pips;
  },
  
  faceColor: function() {
    return colorSchemes[this.pclr].face;
  },
  
  setSelected: function(value) {
    if(value != this.selected) {
      this.needsRedraw = true;
    }
    this.selected = value;
  },

  nextColor: function() {
    this.pclr = (this.pclr + 1) % colorSchemes.length;
    this.needsRedraw = true;
  }
};

$("document").ready( function() {
  
  // Global Dice Variables
  var diceValues = new Array();
  var initialDice = 10;
  $( "#diceCount" ).val( initialDice );
  $( "#sliderCount" ).html( initialDice );
  $( "#slider" ).val( initialDice );  

  
  //////////////////////////////////////////////////////
  // EVENT HANDLERS                                   //
  //////////////////////////////////////////////////////
  
  // Event: The initial dice roll when document ready
  updateDice($( "#diceCount" ).val() );
  rollDice();
  drawDice();

  // Event: When the slider input changes
  $( "#slider" ).bind( "change", function(event, ui) {
  		$( "#diceCount" ).val( $("#slider").val() );
  		$( "#sliderCount" ).html( $("#slider").val() );
     updateDice($( "#diceCount" ).val());
  });
  
  // Event: When the dice button is clicked
  $("#dw-rolldice").click( function() { 
    $( "#dw-table" ).effect( "shake", { times:4, distance:8 }, 50 );
    updateDice($( "#diceCount" ).val());
    rollDice();
    drawDice(); 
  });
  
  // Event: When the viewport changes
  $(window).resize(function() {
    if (diceValues.length > 0) {
      drawDice(); 
    }
  });
  
  
  //////////////////////////////////////////////////////
  // drawDie: Make one die and add it to the screen  //
  //////////////////////////////////////////////////////
  function drawDie(diceBox, d, redraw) {
    if(redraw && !d.needsRedraw) {
      return;
    } 
    //Class to represent dice
    function drawabledie(diceBox,d) {
      this.pipColor = d.pipColor();
      this.faceColor = d.faceColor();
      this.pipCount = d.score;
      this.diceSize = function(){ return diceBox * .7; }
      this.diceMargin = function() { return diceBox * .15; }
      this.pipSize = function() { return this.diceSize() / 10; }
      this.rotation = d.rotation;
    }
  
    //Data - The dice
    var $dice = new drawabledie(diceBox,d);
    
    // Behaviors
    var $canvas;
    if(redraw) {
      $canvas = $('#d_' + d.id);
      $canvas[0].width = $canvas[0].width; // force a complete reset/clear
    } else {
    $canvas = $('<canvas>Your browser does not support HTML5 Canvas</canvas>');
    $canvas.attr('width',diceBox).attr('height',diceBox).attr('id', 'd_' + d.id);
    $('#dw-table').append($canvas);
    }
    $context = $canvas[0].getContext('2d');
   console.log("drawing die", $dice, d); 
  	//Draw the basic dice shape and shadow
  	if($context != null) {
    	$context.translate($dice.diceMargin(),$dice.diceMargin());
    	$context.rotate($dice.rotation);
    	$context.fillStyle = $dice.faceColor;
    	$context.strokeStyle = "#444444"; 
    	$context.lineJoin = "round"; 
    	$context.shadowColor = "#443333"; 
        if(d.selected) {
          $context.shadowColor = "#FF0000";
        }
    	$context.save();
    	$context.shadowOffsetX = 1;
    	$context.shadowOffsetY = 1;
    	$context.shadowBlur = 6; 
    	if(d.selected) {
          $context.shadowBlur = 13;
        }
        $context.fillRect(0, 0, $dice.diceSize(), $dice.diceSize());
    	$context.restore();
    	$context.strokeRect(0, 0, $dice.diceSize(), $dice.diceSize());
    	//Draw 1-6 pips
    	if($dice.pipCount == 1) {
    	  drawPip($dice.diceSize()*(.4), $dice.diceSize()*(.4));
      }
    	if($dice.pipCount == 2) {
    	  drawPip($dice.diceSize()*(1/5), $dice.diceSize()*(1/5));
    	  drawPip($dice.diceSize()*(3/5), $dice.diceSize()*(3/5));
      }
    	if($dice.pipCount == 3) {
    	  drawPip($dice.diceSize()*(.15), $dice.diceSize()*(.15));
    	  drawPip($dice.diceSize()*(.40), $dice.diceSize()*(.40));
    	  drawPip($dice.diceSize()*(.65), $dice.diceSize()*(.65));
      }
    	if($dice.pipCount == 4) {
    	  drawPip($dice.diceSize()*(.15), $dice.diceSize()*(.15));
    	  drawPip($dice.diceSize()*(.15), $dice.diceSize()*(.65));
    	  drawPip($dice.diceSize()*(.65), $dice.diceSize()*(.15));
    	  drawPip($dice.diceSize()*(.65), $dice.diceSize()*(.65));
      }
    	if($dice.pipCount == 5) {
    	  drawPip($dice.diceSize()*(.15), $dice.diceSize()*(.15));
    	  drawPip($dice.diceSize()*(.15), $dice.diceSize()*(.65));
    	  drawPip($dice.diceSize()*(.40), $dice.diceSize()*(.40));
    	  drawPip($dice.diceSize()*(.65), $dice.diceSize()*(.15));
    	  drawPip($dice.diceSize()*(.65), $dice.diceSize()*(.65));
      }
    	if($dice.pipCount == 6) {
    	  drawPip($dice.diceSize()*(1/5), $dice.diceSize()*(1/7));
    	  drawPip($dice.diceSize()*(1/5), $dice.diceSize()*(3/7));
    	  drawPip($dice.diceSize()*(1/5), $dice.diceSize()*(5/7));
    	  drawPip($dice.diceSize()*(3/5), $dice.diceSize()*(1/7));
    	  drawPip($dice.diceSize()*(3/5), $dice.diceSize()*(3/7));
    	  drawPip($dice.diceSize()*(3/5), $dice.diceSize()*(5/7));
      }
    }
  	function drawPip(pipX, pipY) {
  		$context.fillStyle = $dice.pipColor;
  		$context.beginPath();
  		$context.arc(pipX+$dice.pipSize(), pipY+$dice.pipSize(), $dice.pipSize(), 0, 2*Math.PI);
  		$context.fill();
  	}
    d.needsRedraw = false;
  } //end of drawDice function

  // updateDice: ensures the dice array has the right count of dice
  function updateDice(diceCount) {
    if(diceCount < diceValues.length) {
      diceValues = diceValues.slice(0, diceCount);
    } else if(diceCount > diceValues.length) {
      var newCount = diceCount - diceValues.length;
      for(var n = 0; n < newCount; n++) {
        diceValues.push(new Die());
      }
    }
    // else length matches, nothing to do
  }

  //////////////////////////////////////////////////////
  // rollDice: Takes a number of dice to roll         //
  //           and updates anarray of their values    //
  //////////////////////////////////////////////////////
  function rollDice(isReroll) {
    diceValues.forEach(function(d){
      if(!isReroll || d.selected) {
        d.roll();
      }
    });
    diceValues.sort(function(a,b){return a.compareTo(b);});
  }

  //////////////////////////////////////////////////////
  // drawDice: Loops through the dice value array //
  //               and sends command to draw each die //
  //////////////////////////////////////////////////////
  function drawDice() {
    $('#dw-table').empty();
    var dieSize = checkViewport();
    for (var n = 0; n < diceValues.length; n++) {
  	  drawDie(dieSize, diceValues[n]);
    }
  }

  function redraw() {
    var dieSize = checkViewport();
    for (var n = 0; n < diceValues.length; n++) {
          drawDie(dieSize, diceValues[n], true);
    }
  }

  // Checks the viewport and sets the size of the dice.
  function checkViewport() {
    diceBox = ($(window).width() - 40)/10;
    return diceBox;
  }

  $('#dw-reroll').click(function() {
    rollDice(true);
    drawDice();
    $('#dw-selections').hide();
  });

  $('#dw-discard').click(function() {
    $('canvas.dw-selected').remove();
    for(var n = 0; n < diceValues.length;) {
      if(diceValues[n].selected) {
        diceValues.splice(n, 1);
      } else {
       n++;
      }
    }
    $( "#slider" ).val( diceValues.length );
    $( "#diceCount" ).val( diceValues.length );
    $( "#sliderCount" ).html( diceValues.length );
    $( "#dw-selections" ).hide();
  });

  // mouse/touch handling
  $('#dw-table').on({
    mousedown: function(evt) {
      mouseDown(this, evt);
    },
    mousemove: function(evt) {
      mouseMove(this, evt);
    },
    mouseup: function(evt) { mouseUp(this, evt);}
  }, 'canvas');

// ensure the mouse state is cleaned up
  $('body').on('mouseup', function(evt){ isDown = false; });

  var isDown = false;
  var selecting = false;
  var start = {};
  var LONG_PRESS_TIME = 700; // ms
  var DRAG_DELTA = 20; // manhattan pixels
  var longPressTimer;

  function getMouse(elmt, evt) {
      var idx = -1;
      if(idmatch = elmt.id.match(/d_(\d+)/)) {
        idx = parseInt(idmatch[1]);
      }
      var mx = evt.pageX;
      var my = evt.pageY;
      return {x: mx, y: my, d: idx};
  }

  function mouseDown(elmt, evt) {
    evt.preventDefault();
    isDown = true;
    selecting = false;
    start = getMouse(elmt, evt);
    longPressTimer = window.setTimeout(checkLongPress, LONG_PRESS_TIME);
  }

  // calculate manhattan distance between points
  function distance(pos1, pos2) {
    return Math.abs(pos1.x - pos2.x) + Math.abs(pos1.y - pos2.y);
  }

  function mouseMove(elmt, evt) {
    evt.preventDefault();
    if(isDown) {
      newPos = getMouse(elmt, evt);
      if(distance(start, newPos) >= DRAG_DELTA) {
        selecting = true;
        clearTimeout(longPressTimer);
        markSelection(start, newPos);
      }
    }
  }

  function mouseUp(elmt, evt) {
    evt.preventDefault();
    isDown = false;
    clearTimeout(longPressTimer);
    if(!selecting) {
      doClick(start);
    }
  }

  function checkLongPress() {
    if(isDown) {
      selecting = true;
      markSelection(start);
    }
  }
 
  function markSelection(pos, pos2) {
      var a = -1;
      var b = -1;
      for(var n = 0; n < diceValues.length; n++) {
        var id = diceValues[n].id;
        if(id == pos.d || (pos2 && id == pos2.d)) {
          if(a == -1) {
            a = n;
          } else {
            b = n;
          }
        }
      }
      if(b == -1) {
        b = a;
      }
    var s = Math.min(a, b);
    var e = Math.max(a, b);
    for(var i = 0; i < diceValues.length; i++) {
      if(i >= s && i <= e) {
      diceValues[i].setSelected(true);
      $('#d_' + diceValues[i].id).addClass('dw-selected');
      } else {
              diceValues[i].setSelected(false);
      $('#d_' + diceValues[i].id).removeClass('dw-selected');
      }
    }
    redraw();
    $('#dw-selections').show();
  }
  
  function doClick(pos) {
    console.log("doClick: ", pos);
    for(var n = 0; n < diceValues.length; n++) {
      if(diceValues[n].id == pos.d) {
        diceValues[n].nextColor();
      }
    }
    redraw();
  }
});
