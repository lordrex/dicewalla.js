/* Copyright Lord Rex 2012-2013 */
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
  rollDice($( "#diceCount" ).val() );
  generateDice();

  // Event: When the slider input changes
  $( "#slider" ).bind( "change", function(event, ui) {
  		$( "#diceCount" ).val( $("#slider").val() );
  		$( "#sliderCount" ).html( $("#slider").val() );
  });
  
  // Event: When the dice button is clicked
  $("#dw-rolldice").click( function() { 
    $( "#dw-table" ).effect( "shake", { times:4, distance:8 }, 50 );
    rollDice($( "#diceCount" ).val() );
    generateDice(); 
  });
  
  // Event: When the viewport changes
  $(window).resize(function() {
    if (diceValues.length > 0) {
      generateDice(); 
    }
  });
  
  
  //////////////////////////////////////////////////////
  // drawDice: Make one die and add it to the screen  //
  //////////////////////////////////////////////////////
  function drawDice(diceBox,pipCount) {
  
    //Class to represent dice
    function die(diceBox,pipCount) {
      this.pipColor =  "#222222";
      this.pipCount = pipCount;
      this.diceSize = function(){ return diceBox * .7; }
      this.diceMargin = function() { return diceBox * .15; }
      this.pipSize = function() { return this.diceSize() / 10; }
    }
  
    //Data - The dice
    var $dice = new die(diceBox,pipCount);
    
    // Behaviors
    var $canvas = $('<canvas>Your browser does not support HTML5 Canvas</canvas>');
    $canvas.attr('width',diceBox).attr('height',diceBox);
    $('#dw-table').append($canvas);
    $context = $('#dw-table canvas:last-child')[0].getContext('2d');
    
  	//Draw the basic dice shape and shadow
  	if($context != null) {
  	  //alert($dice.diceSize());
    	var radian = (Math.PI / 180) * 20;
    	$context.translate($dice.diceMargin(),$dice.diceMargin());
    	$context.rotate((Math.random()-.5)*radian);
    	$context.fillStyle = "#fafdfb";
    	$context.strokeStyle = "#444444"; 
    	$context.lineJoin = "round"; 
    	$context.shadowColor = "#443333"; 
    	$context.save();
    	$context.shadowOffsetX = 1;
    	$context.shadowOffsetY = 1;
    	$context.shadowBlur = 6; 
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
  } //end of drawDice function

  //////////////////////////////////////////////////////
  // rollDice: Takes a number of dice to roll         //
  //           and updates anarray of their values    //
  //////////////////////////////////////////////////////
  function rollDice(diceCount) {
    diceValues.length = 0;
    for (var n = 0; n < diceCount; n++) {
      diceValues.push(Math.floor((Math.random()*6)+1));
    }
    diceValues.sort(function(a,b){return b-a});
  }

  //////////////////////////////////////////////////////
  // generateDice: Loops through the dice value array //
  //               and sends command to draw each die //
  //////////////////////////////////////////////////////
  function generateDice() {
    $('#dw-table').empty();
    var dieSize = checkViewport();
    for (var n = 0; n < diceValues.length; n++) {
  	  drawDice(dieSize, diceValues[n]);
    }
  }

  // Checks the viewport and sets the size of the dice.
  function checkViewport() {
    diceBox = ($(window).width() - 40)/10;
    return diceBox;
  }


});