/**********************GLOBAL VARIABLES*********************/
var curColour = "#000000";
var curThickness = 5;
var curFrame = 1;
var curLJoin = 'round';
var images = new Array();
var undoindex = 0;
var undoArr = new Array();
var redoArr = new Array();
var selectArray = new Array();
var tool = 'brush'; //Default tool
var mouse = {x: 0, y: 0};
var start_mouse = {x: 0, y:0};
var last_mouse = {x: 0, y: 0};
var points = [];
var valid = false; // when set to false, the canvas will redraw everything
var shapes = []; // the collection of things to be drawn
var dragging = false; // Keep track of when we are dragging
var resizing = false;
var selection = []; // the current selected object. In the future we could turn this into an array for multiple selection

window.blockMenuHeaderScroll = false;
if(window.addEventListener) {
	window.addEventListener('load', function () {

		/********************** INITIALISE CANVAS AND CONTEXT *********************/
		var canvas = new CanvasState(document.getElementById('canvas1'));
  		var context = canvas.getContext('2d');
  		canvas.dragoffy = 0;
  		canvas.dragoffx = 0;
		var stylePaddingLeft, stylePaddingTop, styleBorderLeft, styleBorderTop;
    	if (document.defaultView && document.defaultView.getComputedStyle) {
	      	canvas.stylePaddingLeft = parseInt(document.defaultView.getComputedStyle(canvas, null)['paddingLeft'], 10) || 0;
	      	canvas.stylePaddingTop = parseInt(document.defaultView.getComputedStyle(canvas, null)['paddingTop'], 10) || 0;
	      	canvas.styleBorderLeft = parseInt(document.defaultView.getComputedStyle(canvas, null)['borderLeftWidth'], 10) || 0;
	      	canvas.styleBorderTop = parseInt(document.defaultView.getComputedStyle(canvas, null)['borderTopWidth'], 10) || 0;
    	}

    	var html = document.body.parentNode;
    	canvas.htmlTop = html.offsetTop;
    	canvas.htmlLeft = html.offsetLeft;
    	
		canvas.addEventListener('selectstart', function(e) {
      		e.preventDefault();
      		return false;
    	}, false);
		
		canvas.addEventListener('mousemove', function(e){
	      mouse.x = typeof e.offsetX !== 'undefined' ? e.offsetX : e.layerX;
	      mouse.y = typeof e.offsetY !== 'undefined' ? e.offsetY : e.layerY;
	      if(dragging){
	      	selection.push({x: (mouse.x - canvas.dragoffx), y: (mouse.y - canvas.dragoffy)});
        	valid = false;
          }
          if (resizing){
        	mouseMoveSelected(e,selection);
      	  }
		}, false);

    	canvas.addEventListener('touchmove', function(e){
    		mouse.x = e.touches[0].pageX - $('#canvas').offset().left;
    		mouse.y = e.touches[0].pageY - $('#canvas').offset().top;
      
      		if(dragging){
        	selection.push(x: (mouse.x - e.touches[0].pageX), y: (mouse.y - e.touches[0].pageY));
        	valid = false;
      		}

    	}, false);


    	canvas.addEventListener('mousedown', function(e){
      		context.lineWidth = curThickness;
      		context.lineJoin = 'round';
      		context.lineCap = 'round';
      		context.strokeStyle = curColour;
      		context.fillstyle =curColour;

      		$("#thickmenu").addClass("hide");

      		mouse.x = typeof e.offsetX !== 'undefine' ? e.offsetX : e.layerX;
      		mouse.y = typeof e.offsetY !== 'undefined' ? e.offsetY : e.layerY;
    
      		start_mouse.x = mouse.x;
      		start_mouse.y = mouse.y;

      		points.push({x:mouse.x, y:mouse.y});

      		if(tool == 'line'){
        		canvas.addEventListener('mousemove', Line.draw(), false );
        		addShape(new Line(start_mouse.x, start_mouse.y, mouse.x,mouse.y));
      		}

      		else if(tool == 'rect') {
        		canvas.addEventListener('mousemove', Rectangle.draw(), false );
        		addShape(new Rectangle(start_mouse.x, start_mouse.y, mouse.x,mouse.y))
      		}

      		else if(tool == 'brush'){
        		onBrush();
        		canvas.addEventListener('mousemove', FreeForm.draw(), false );
        		addShape(new FreeForm(start_mouse.x, start_mouse.y, mouse.x,mouse.y))
      		}

      		else if(tool == 'pencil'){
        		onPencil();
        		canvas.addEventListener('mousemove', FreeForm.draw(), false );
        		myState.addShape(new FreeForm(start_mouse.x, start_mouse.y, mouse.x,mouse.y))
      		}

      		else if(tool == 'select'){
        		canvas.addEventListener('mousemove', onSel, false);
      		}

      		else if(tool == 'choose'){
        		console.log("choose");
        		canvas.addEventListener('mousemove', onChoose, false);
      		}

      		else if(tool == 'erase'){
        		canvas.addEventListener('mousemove', onErase, false);
      		}

      		else if(tool == 'circle'){
        		canvas.addEventListener('mousemove', Circle.draw(), false );
        		addShape(new Circle(start_mouse.x, start_mouse.y, mouse.x,mouse.y))
      		}

      		else if(tool == 'oval'){
        		canvas.addEventListener('mousemove', Oval.draw(), false );
        		addShape(new Oval(start_mouse.x, start_mouse.y, mouse.x,mouse.y))
      		}

     		else if (tool == 'square'){
        		canvas.addEventListener('mousemove', Square.draw(), false );
        		addShape(new Square(start_mouse.x, start_mouse.y, mouse.x,mouse.y))
      		}

      		else if( tool == 'cline'){
       			canvas.addEventListener('mousemove', CLine.draw(), false );
       			addShape(new CLine(start_mouse.x, start_mouse.y, mouse.x,mouse.y))
     		 }

      		else if (tool == 'triangle'){
        		canvas.addEventListener('mousemove', Triangle.draw(), false );
        		addShape(new Triangle(start_mouse.x, start_mouse.y, mouse.x,mouse.y))
      		}

      		else if (tool == 'diam'){
        		canvas.addEventListener('mousemove', Diamond.draw(), false );
        		addShape(new Diamond(start_mouse.x, start_mouse.y, mouse.x,mouse.y))
      		}

      		else if (tool == 'heart'){
        		canvas.addEventListener('mousemove', Heart.draw(), false );
       			 addShape(new Heart(start_mouse.x, start_mouse.y, mouse.x,mouse.y))
      		}

      		else if (tool == 'text'){
       			canvas.addEventListener('mousemove', Texts.draw(), false );
       			addShape(new Texts(start_mouse.x, start_mouse.y, mouse.x,mouse.y))
      		}

    	}, false);

    canvas.addEventListener('mouseup', function(e){
      dragging = false;
      resizing = false;
      mouseUpSelected(e);
      uPush();
      last_mouse.x = mouse.x;
      last_mouse.y = mouse.y;
      console.log("push");
      canvas.removeEventListener('mousemove', Texts.draw, false);
      canvas.removeEventListener('mousemove', Rectangle.draw, false);
      canvas.removeEventListener('mousemove', Square.draw, false);
      canvas.removeEventListener('mousemove', onBrush, false);
      canvas.removeEventListener('mousemove', onErase,false);
      canvas.removeEventListener('mousemove', Circle.draw, false);
      canvas.removeEventListener('mousemove', Oval.draw, false);
      canvas.removeEventListener('mousemove', Heart.draw, false);
      canvas.removeEventListener('mousemove', Line.draw, false);
      canvas.removeEventListener('mousemove', CLine.draw, false);
      canvas.removeEventListener('mousemove', Triangle.draw, false);
      canvas.removeEventListener('mousemove', Diamond.draw,false);
      canvas.removeEventListener('mousemove', onPencil, false);
      canvas.removeEventListener('mousemove', onSel, false);
      canvas.removeEventListener('mousemove', onChoose, false);
      
      if(tool == 'select'){
          context.setLineDash([]);
          context.lineWidth = curThickness;
        }

        if (tool == 'text'){

          var lines = textarea.value.split('\n');
          var processed_lines= [];

          for (var i = 0; i< lines.length; i++){
            var chars = lines[i].length;

          for(var j; j< chars; j++){
            var text_node = document.createTextNode(lines[i][j]);
            temp_txt_context.appendChild(text_node);

            temp_txt_context.style.position = 'absolute';
            temp_txt_context.style.visibility = 'hidden';
            temp_txt_context.style.display = 'block';

            var width = temp_txt_context.offsetWidth;
            var height = temp_txt_context.offsetHeight;

            temp_txt_context.style.position = '';
            temp_txt_context.style.visibility = '';
            temp_txt_context.style.display = 'none';

            if (width > parseInt(textarea.style.width)) {
                       break;
                  }
              }
           
              processed_lines.push(temp_txt_context.textContent);
                temp_txt_context.innerHTML = '';
          }
       
          var ta_comp_style = getComputedStyle(textarea);
          var fs = ta_comp_style.getPropertyValue('font-size');
          var ff = ta_comp_style.getPropertyValue('font-family');
        
          context.font = fs + ' ' + ff;
          context.textBaseline = 'top';
         
          for (var n = 0; n < processed_lines.length; n++) {
              var processed_line = processed_lines[n];
               
              context.fillText(processed_line,  parseInt(textarea.style.left), parseInt(textarea.style.top) + n*parseInt(fs) );
          }
          
          context.drawImage(canvas, 0, 0);

          context.clearRect(0, 0, canvas.width, canvas.height);
       
          textarea.style.display = 'none';
          textarea.value = '';

        }
        context.drawImage(canvas,0,0);
        
        points = [];
        frameDraw();

    }, false);

    canvas.addEventListener("touchstart", function(e){
      blockMenuHeaderScroll = true;
      context.lineWidth = curThickness;
      curLJoin = 'round';
      context.lineJoin = curLJoin;
      context.lineCap = curLJoin;
      context.strokeStyle = curColour;
      context.fillstyle =curColour;
      
      $("#thickmenu").addClass("hide");

      mouse.x = e.touches[0].pageX - $('#canvas').offset().left;
      mouse.y = e.touches[0].pageY - $('#canvas').offset().top;
    
        start_mouse.x = mouse.x;
        start_mouse.y = mouse.y;

        points.push({x:mouse.x, y:mouse.y});

        if(tool == 'line'){
        		canvas.addEventListener('mousemove', Line.draw(), false );
        		addShape(new Line(start_mouse.x, start_mouse.y, mouse.x,mouse.y));
      		}

      		else if(tool == 'rect') {
        		canvas.addEventListener('mousemove', Rectangle.draw(), false );
        		addShape(new Rectangle(start_mouse.x, start_mouse.y, mouse.x,mouse.y))
      		}

      		else if(tool == 'brush'){
        		onBrush();
        		canvas.addEventListener('mousemove', FreeForm.draw(), false );
        		addShape(new FreeForm(start_mouse.x, start_mouse.y, mouse.x,mouse.y))
      		}

      		else if(tool == 'pencil'){
        		onPencil();
        		canvas.addEventListener('mousemove', FreeForm.draw(), false );
        		myState.addShape(new FreeForm(start_mouse.x, start_mouse.y, mouse.x,mouse.y))
      		}

      		else if(tool == 'select'){
        		canvas.addEventListener('mousemove', onSel, false);
      		}

      		else if(tool == 'choose'){
        		console.log("choose");
        		canvas.addEventListener('mousemove', onChoose, false);
      		}

      		else if(tool == 'erase'){
        		canvas.addEventListener('mousemove', onErase, false);
      		}

      		else if(tool == 'circle'){
        		canvas.addEventListener('mousemove', Circle.draw(), false );
        		addShape(new Circle(start_mouse.x, start_mouse.y, mouse.x,mouse.y))
      		}

      		else if(tool == 'oval'){
        		canvas.addEventListener('mousemove', Oval.draw(), false );
        		addShape(new Oval(start_mouse.x, start_mouse.y, mouse.x,mouse.y))
      		}

     		else if (tool == 'square'){
        		canvas.addEventListener('mousemove', Square.draw(), false );
        		addShape(new Square(start_mouse.x, start_mouse.y, mouse.x,mouse.y))
      		}

      		else if( tool == 'cline'){
       			canvas.addEventListener('mousemove', CLine.draw(), false );
       			addShape(new CLine(start_mouse.x, start_mouse.y, mouse.x,mouse.y))
     		 }

      		else if (tool == 'triangle'){
        		canvas.addEventListener('mousemove', Triangle.draw(), false );
        		addShape(new Triangle(start_mouse.x, start_mouse.y, mouse.x,mouse.y))
      		}

      		else if (tool == 'diam'){
        		canvas.addEventListener('mousemove', Diamond.draw(), false );
        		addShape(new Diamond(start_mouse.x, start_mouse.y, mouse.x,mouse.y))
      		}

      		else if (tool == 'heart'){
        		canvas.addEventListener('mousemove', Heart.draw(), false );
       			 addShape(new Heart(start_mouse.x, start_mouse.y, mouse.x,mouse.y))
      		}

      		else if (tool == 'text'){
       			canvas.addEventListener('mousemove', Texts.draw(), false );
       			addShape(new Texts(start_mouse.x, start_mouse.y, mouse.x,mouse.y))
      		}

    	}, false);

      canvas.addEventListener('touchend', function(e){
      	blockMenuHeaderScroll = false;
      	uPush();
      	last_mouse.x = mouse.x;
      	last_mouse.y = mouse.y;
      	console.log("push");
      	canvas.removeEventListener('touchmove', Line.draw, false);
      	canvas.removeEventListener('touchmove', Triangle.draw, false);
      	canvas.removeEventListener('touchmove', Rectangle.draw, false);
      	canvas.removeEventListener('touchmove', onBrush, false);
      	canvas.removeEventListener('touchmove', onErase,false);
      	canvas.removeEventListener('touchmove', Square.draw, false);
      	canvas.removeEventListener('touchmove', Heart.draw, false);
      	canvas.removeEventListener('touchmove', Oval.draw, false);
      	canvas.removeEventListener('touchmove', CLine.draw, false);
      	canvas.removeEventListener('touchmove', Diamond.draw, false);
      	canvas.removeEventListener('touchmove', Circle.draw, false);
      	canvas.removeEventListener('touchmove', Texts.draw, false);
      	canvas.removeEventListener('touchmove', onPencil, false);
      	canvas.removeEventListener('touchmove', onSel, false);
      	canvas.removeEventListener('touchmove', onChoose, false);
      
      	if(tool == 'select'){
          context.setLineDash([]);
          context.lineWidth = curThickness;
        }

        if (tool == 'text'){

        var lines = textarea.value.split('\n');
        var processed_lines= [];

        for (var i = 0; i< lines.length; i++){
          var chars = lines[i].length;

          for(var j; j< chars; j++){
            var text_node = document.createTextNode(lines[i][j]);
            temp_txt_context.appendChild(text_node);

            temp_txt_context.style.position = 'absolute';
            temp_txt_context.style.visibility = 'hidden';
            temp_txt_context.style.display = 'block';

            var width = temp_txt_context.offsetWidth;
            var height = temp_txt_context.offsetHeight;

            temp_txt_context.style.position = '';
            temp_txt_context.style.visibility = '';
            temp_txt_context.style.display = 'none';

            if (width > parseInt(textarea.style.width)) {
                       break;
                  }
              }
           
              processed_lines.push(temp_txt_context.textContent);
                temp_txt_context.innerHTML = '';
          }
       
          var ta_comp_style = getComputedStyle(textarea);
          var fs = ta_comp_style.getPropertyValue('font-size');
          var ff = ta_comp_style.getPropertyValue('font-family');
        
          context.font = fs + ' ' + ff;
          context.textBaseline = 'top';
         
          for (var n = 0; n < processed_lines.length; n++) {
              var processed_line = processed_lines[n];
               
              context.fillText(processed_line,  parseInt(textarea.style.left), parseInt(textarea.style.top) + n*parseInt(fs) );
          }
          
          context.drawImage(canvas, 0, 0);

          context.clearRect(0, 0, canvas.width, canvas.height);
       
          textarea.style.display = 'none';
          textarea.value = '';

        }

        context.drawImage(canvas,0,0);
        points = [];
        frameDraw();

    }, false);


    
    canvas.addEventListener('dbclick', function(e){
      mouse.x = typeof e.offsetX !== 'undefine' ? e.offsetX : e.layerX;
      mouse.y = typeof e.offsetY !== 'undefined' ? e.offsetY : e.layerY;
    
      start_mouse.x = mouse.x;
      start_mouse.y = mouse.y;

      points.push({x:mouse.x, y:mouse.y});

      var l = shapes.length;
      var tmpSelected = false;
      for (var i = l - 1; i >= 0; i--) {
      	for (var j = selection.length - 1; j>>=0; j--){
        	var mySel = shapes[i];
       		 if (shapes[i].contains(selection[j]) && tmpSelected === false) {
          		if (selection === mySel) {
            		if (shapes[i].touchedAtHandles(mouse.x, mouse.y)) {
              			mouseDownSelected(e, mySel);
              			resizing = true;
            		} 
           			else {
              			canvas.dragoffx = mouse.x - mySel.x;
              			canvas.dragoffy = mouse.y - mySel.y;
              			dragging = true;
            		}
          		}
          		selection = mySel;
          		canvas.selected = true;
          		valid = false;
          		tmpSelected = true;
       		 } 
        	else {
        		mySel.selected = false;
          		valid = false;
        	}
      	}
      }
      if (tmpSelected === false) {
      	 	selection = [];
      }
    }, false);


  	mouseDownSelected = function(e, shape) {
    	mouse.x = typeof e.offsetX !== 'undefine' ? e.offsetX : e.layerX;
      	mouse.y = typeof e.offsetY !== 'undefined' ? e.offsetY : e.layerY;
      	start_mouse.x = mouse.x;
      	start_mouse.y = mouse.y;
      	
    	var self = shape;

    	// if there isn't a rect yet
    	if (self.w === undefined) {
      		self.x = mouse.y;
      		self.y = mouse.x;
      		canvas.dragBR = true;
    	}
    	// 4 cases:
    	// 1. top left
    	else if (checkCloseEnough(mouse.x, self.x, self.closeEnough) && checkCloseEnough(mouse.y, self.y, self.closeEnough)) {
      		canvas.dragTL = true;
      		e.target.style.cursor='nw-resize';
    	}
    	// 2. top right
    	else if (checkCloseEnough(mouse.x, self.x + self.w, self.closeEnough) && checkCloseEnough(mouse.y, self.y, self.closeEnough)) {
      		canvas.dragTR = true;
      		e.target.style.cursor='ne-resize';
    	}
    	// 3. bottom left
    	else if (checkCloseEnough(mouse.x, self.x, self.closeEnough) && checkCloseEnough(mouse.y, self.y + self.h, self.closeEnough)) {
      		canvas.dragBL = true;
      		e.target.style.cursor='sw-resize';
    	}
    	// 4. bottom right
    	else if (checkCloseEnough(mouse.x, self.x + self.w, self.closeEnough) && checkCloseEnough(mouse.y, self.y + self.h, self.closeEnough)) {
      		canvas.dragBR = true;
      		e.target.style.cursor='se-resize';
    	}
    	// (5.) none of them
    	else {
      		// handle not resizing
    	}
    	valid = false; // something is resizing so we need to redraw
  	};
  	
  	mouseUpSelected = function(e) {
    	canvas.dragTL = canvas.dragTR = canvas.dragBL = canvas.dragBR = false;
  	};
  	
  	mouseMoveSelected = function(e, shape) {
    	mouse.x = typeof e.offsetX !== 'undefine' ? e.offsetX : e.layerX;
      	mouse.y = typeof e.offsetY !== 'undefined' ? e.offsetY : e.layerY;
      	start_mouse.x = mouse.x;
      	start_mouse.y = mouse.y;

    	if (canvas.dragTL) {
      		e.target.style.cursor='nw-resize';
      		// switch to top right handle
      		if (((shape.x + shape.w) - mouse.x) < 0) {
        		canvas.dragTL = false;
        		canvas.dragTR = true;
      		}
      		// switch to top bottom left
      		if (((shape.y + shape.h) - mouse.y) < 0) {
        		canvas.dragTL = false;
        		canvas.dragBL = true;
      		}
      		shape.w += shape.x - mouse.x;
      		shape.h += shape.y - mouse.y;
      		shape.x = mouse.x;
      		shape.y = mouse.y;
    	} 
    	else if (canvas.dragTR) {
      		e.target.style.cursor='ne-resize';
      		// switch to top left handle
      		if ((shape.x - mouse.x) > 0) {
        	canvas.dragTR = false;
        	canvas.dragTL = true;
      	}
      	// switch to bottom right handle
      	if (((shape.y + shape.h) - mouse.x) < 0) {
        	canvas.dragTR = false;
        	canvas.dragBR = true;
      	}
      	shape.w = Math.abs(shape.x - mouse.x);
      	shape.h += shape.y - mouse.y;
      	shape.y = mouse.y;
    	} 
    	else if (canvas.dragBL) {
      		e.target.style.cursor='sw-resize';
      		// switch to bottom right handle
      		if (((shape.x + shape.w) - mouse.x) < 0) {
        		canvas.dragBL = false;
        		canvas.dragBR = true;
      		}
      		// switch to top left handle
      		if ((shape.y - mouse.y) > 0) {
        		canvas.dragBL = false;
        		canvas.dragTL = true;
      		}
      		shape.w += shape.x - mouse.x;
      		shape.h = Math.abs(shape.y - mouse.x);
     	 	shape.x = mouse.x;
    	} 
    	else if (canvas.dragBR) {
      		e.target.style.cursor='se-resize';
      		// switch to bottom left handle
      		if ((shape.x - mouse.x) > 0) {
        		canvas.dragBR = false;
        		canvas.dragBL = true;
      		}
      		// switch to top right handle
      		if ((shape.y - mouse.y) > 0) {
        		canvas.dragBR = false;
       			 canvas.dragTR = true;
      		}
      		shape.w = Math.abs(shape.x - mouse.x);
      		shape.h = Math.abs(shape.y - mouse.y);
    	}

    	valid = false; // something is resizing so we need to redraw
  	};
  	
  	canvas.selectionColor = '#000000';
    canvas.selectionWidth = 0.5;
    canvas.interval = 30;
    setInterval(function() {
    	draw();
    }, canvas.interval);

	var draw = function() {
		if (!valid) {
    		clear();//might bug out
			var l = shapes.length;
    		for (var i = 0; i < l; i++) {
      			var shape = shapes[i];
      			if (selection !== shape) {
        			if (shape.x > canvas.width || shape.y > canvas.height || shape.x + shape.w < 0 || shape.y + shape.h < 0) 
          				continue;
        			shapes[i].draw();
      			}
   		 	}

   
    		if (selection !== []) {
      			selection.draw();
    		}

   			 if (selection !== []) {
      			context.strokeStyle = canvas.selectionColor;
      			context.lineWidth = canvas.selectionWidth;
      			var mySel = selection;
      			context.strokeRect(mySel.x, mySel.y, mySel.w, mySel.h);
    		}
    		valid = true;
 		 }
	};


	var addShape = function(shape) {
  		shapes.push(shape);
  		valid = false;
	};

	var clear = function() {
  		context.clearRect(0, 0, this.width, this.height);
	};


    /***********SHAPE CONSTRUCTOR***********/
    function Shape(name, sx, sy, ex, ey, fill){
    	this.name = name;
    	this.sx = sx || 0;
		this.sy = sy || 0;
		this.ex = ex || 0;
		this.ey = ey || 0;
		this.fill = fill || 'none';
		this.selected = false;
		this.closeEnough = 8; 
		this.frame = curFrame;           
		this.stroke = curColour;
		this.lw = curThickness;
		this.lj = curLJoin;
		this.colour = curColour;
      
    }

    Shape.prototype.toString=  function(){
      console.log('Shape at' + 'Start x:' + this.sx + ' Start y:' + this.sy + ' End x:' + this.ex + ' End y:' + this.ey );
    };

    /********************** STRAIGHT LINE FUNCTION *********************/

    function Line(name,sx, sy, ex, ey, fill){
      Shape.call(this, name, sx, sy, ex, ey, fill);
      this.x = Math.min(this.ex, this.sx);
      this.y = Math.min(this.ey, this.sy);
      this.w = Math.abs(this.ex - this.sx);
      this.h = Math.abs(this.ey - this.sy);
           
    }

    Line.prototype = subclassOf(Shape);

    Line.prototype.draw = function(){
      context.fillstyle = this.fill;
      context.beginPath();
      context.moveTo(this.sx, this.sy);
      context.lineTo(this.ex, this.ey);
      context.stroke();
      context.closePath();

      if (this.selected === true) {
        this.drawHandles(context);
      }
    };

    Line.prototype.toString=  function(){
      console.log('Line' + Shape.prototype.toString.call(this));
    };

    /********************** TRIANGLE FUNCTION *********************/
    function Triangle(name, sx, sy, ex, ey, fill){
      Shape.call(this, name, sx, sy, ex, ey, fill);
      this.x = Math.min(this.ex, this.sx);
      this.y = Math.min(this.ey, this.sy);
      this.w = Math.abs(this.ex - this.sx);
      this.h = Math.abs(this.ey - this.sy); 
    }

    Triangle.prototype = subclassOf(Shape);

    Triangle.prototype.draw = function(){     
      context.fillstyle = this.fill;
      context.beginPath();
      context.moveTo(this.x, this.y);
      context.lineTo(this.x + this.w / 2, this.y + this.h);
      context.lineTo(this.x - this.w / 2, this.y + this.h);
      context.lineTo(this.x, this.y);
      context.stroke();
      context.closePath();

      if (this.selected === true) {
        this.drawHandles(context);
      }
    };

    Triangle.prototype.toString=  function(){
      console.log('Triangle' + Shape.prototype.toString.call(this));
    };


    /********************** DIAMOND FUNCTION *********************/
    function Diamond(sx, sy, ex, ey, fill){
      Shape.call(this, sx, sy, ex, ey, fill);
      this.x = Math.min(this.ex, this.sx);
      this.y = Math.min(this.ey, this.sy);
      this.w = Math.abs(this.ex - this.sx);
      this.h = Math.abs(this.ey - this.sy); 
    }

    Diamond.prototype = subclassOf(Shape);

    Diamond.prototype.draw = function(context){
      context.fillstyle = this.fill;
      context.beginPath();
      context.moveTo(this.x, this.y);
      context.lineTo(this.x + this.w / 2, this.y + this.h);
      context.lineTo(this.x, this.y + this.h + this.w);
      context.lineTo(this.x- this.w /2, this.y + this.h);
      context.lineTo(this.x, this.y);
      context.stroke();
      context.closePath();

      if (this.selected === true) {
        this.drawHandles(context);
      }

    };

    Diamond.prototype.toString=  function(){
      console.log('Diamond' + Shape.prototype.toString.call(this));
    };


    /********************** HEART FUNCTION *********************/
    function Heart(sx, sy, ex, ey, fill){
      Shape.call(this, sx, sy, ex, ey, fill);
      this.x = Math.min(this.ex, this.sx);
      this.y = Math.min(this.ey, this.sy);
      this.w = Math.abs(this.ex - this.sx);
      this.h = Math.abs(this.ey - this.sy); 
    }

    Heart.prototype = subclassOf(Shape);

    Heart.prototype.draw = function(context){
      context.fillstyle = this.fill;
      context.beginPath();
      context.moveTo(75,40);
               
      context.bezierCurveTo(75,37,70,25,50,25);
      context.bezierCurveTo(20,25,20,62.5,20,62.5);
        
      context.bezierCurveTo(20,80,40,102,75,120);
      context.bezierCurveTo(110,102,130,80,130,62.5);
            
      context.bezierCurveTo(130,62.5,130,25,100,25);
      context.bezierCurveTo(85,25,75,37,75,40);

      context.stroke();
      context.closePath();

      if (this.selected === true) {
        this.drawHandles(context);
      }

    };

    Heart.prototype.toString=  function(){
      console.log('Heart' + Shape.prototype.toString.call(this));
    };


    /********************** RECTANGLE FUNCTION *********************/
    function Rectangle(sx, sy, ex, ey, fill){
      Shape.call(this, sx, sy, ex, ey, fill);
      this.x = Math.min(this.ex, this.sx);
      this.y = Math.min(this.ey, this.sy);
      this.w = Math.abs(this.ex - this.sx);
      this.h = Math.abs(this.ey - this.sy); 
    }

    Rectangle.prototype = subclassOf(Shape);

    Rectangle.prototype.draw = function(context){
      context.fillstyle = this.fill;
      context.strokeRect(this.x, this.y, this.w, this.h);

      if (this.selected === true){
        this.drawhandles(context);
      }
    };

    Rectangle.prototype.toString=  function(){
      console.log('Rectangle' + Shape.prototype.toString.call(this));
    };


    /********************** SQUARE FUNCTION *********************/
    function Square(sx, sy, ex, ey, fill){
      Shape.call(this, sx, sy, ex, ey, fill);
      this.x = Math.min(this.ex, this.sx);
      this.y = Math.min(this.ey, this.sy);
      this.w = Math.abs(this.ex - this.sx);
      this.h = Math.abs(this.ey - this.sy); 
    }

    Square.prototype = subclassOf(Shape);

    Square.prototype.draw = function(context){
      context.fillstyle = this.fill;
      context.strokeRect(this.x, this.y, this.w, this.h);

      if (this.selected === true) {
        this.drawHandles(context);
      }
    };

    Square.prototype.toString=  function(){
      console.log( 'Square' + Shape.prototype.toString.call(this));
    };


    /********************** CIRCLE FUNCTION *********************/
    function Circle(sx, sy, ex, ey, fill){
      Shape.call(this, sx, sy, ex, ey, fill);
      this.x = (this.ex + this.sx) / 2;
      this.y = (this.ey + this.sy) / 2;
      this.radius = Math.max(Math.abs(this.ex - this.sx), Math.abs(this.ey - this.sy)) / 2;      
    }

    Circle.prototype = subclassOf(Shape);

    Circle.prototype.draw = function(context){
      context.fillstyle = this.fill;
      context.beginPath();
      context.arc(this.x, this.y, this.radius,0, Math.PI*2, false);
      context.stroke();
      context.closePath();

      if (this.selected === true) {
        this.drawHandles(context);
      }
    };

    Circle.prototype.toString=  function(){
      console.log( 'Circle ' + Shape.prototype.toString.call(this));
    };


    /********************** OVAL FUNCTION *********************/
    function Oval(sx, sy, ex, ey, fill){
      Shape.call(this, sx, sy, ex, ey, fill);
      this.x = Math.min(this.ex, this.sx);
      this.y = Math.min(this.ey, this.sy);
      this.w = Math.abs(this.ex - this.sx);
      this.h = Math.abs(this.ey - this.sy);    
    }

    Oval.prototype = subclassOf(Shape);

    Oval.prototype.draw = function(context){
      context.fillstyle = this.fill;
      var kappa = .5522848;
      ox = (w / 2) * kappa, // control point offset horizontal
      oy = (h / 2) * kappa, // control point offset vertical
      xe = x + w,           // x-end
      ye = y + h,           // y-end
      xm = x + w / 2,       // x-middle
      ym = y + h / 2;       // y-middle

      context.beginPath();
      context.moveTo(this.x, ym);
      context.bezierCurveTo(this.x, ym - oy, xm - ox, this.y, xm, this.y);
      context.bezierCurveTo(xm + ox, this.y, xe, ym - oy, xe, ym);
      context.bezierCurveTo(xe, ym + oy, xm + ox, ye, xm, ye);
      context.bezierCurveTo(xm - ox, ye, this.x, ym + oy, this.x, ym);
      context.closePath();
      context.stroke();

      if (this.selected === true) {
        this.drawHandles(context);
      }
    };

    Oval.prototype.toString=  function(){
      console.log( 'Circle ' + Shape.prototype.toString.call(this));
    };



/********************** TEXT FUNCTION *********************/
    function Texts(sx, sy, ex, ey, fill){
      Shape.call(this, sx, sy, ex, ey, fill);
      this.x = Math.min(this.ex, this.sx);
      this.y = Math.min(this.ey, this.sy);
      this.w = Math.abs(this.ex - this.sx);
      this.h = Math.abs(this.ey - this.sy);    
    }

    Texts.prototype = subclassOf(Shape);

    Texts.prototype.draw = function(context){
      context.fillstyle = this.fill;
      context.style.left = this.x + 'px';
      context.style.top = this.y + 'px';
      context.style.width = this.w + 'px';
      context.style.height = this.h + 'px';
      context.style.display = 'block';

      if (this.selected === true) {
        this.drawHandles(context);
      }

    };

    Texts.prototype.toString=  function(){
      console.log( 'Text ' + Shape.prototype.toString.call(this));
    };


    

    /********************** CURVED LINE FUNCTION *********************/
     function CLine(sx, sy, ex, ey, fill, points){
      Shape.call(this, sx, sy, ex, ey, fill);
      this.points = points;
      max = Math.max.apply(Math,points.map(function(o){return o.y}))    ;
      min = 
      this.w = this.points[max].x - this.points[min].x;
      this.h = this.points[max].y - this.point[min].y;
    }

    CLine.prototype = subclass(Shape);

    CLine.prototype.draw = function(context) {
      if(this.points.length <5){
        var b = this.points[0];
        context.beginPath();
        context.arc(b.x, b.y, context.lineWidth / 2, 0, Math.PI * 2, !0 );
        context.fill();
        context.closePath();
        return;
      }

      context.beginPath();
      context.moveTo(this.points[0].x, this.points[0].y);

      for(var i = 1; i< this.points.length - 2; i++){
        var xc = (this.points[i].x + this.points[i+1].x)/2;
        var yc = (this.points[i].y + this.points[i+1].y)/2;
        context.quadraticCurveTo(this.points[i].x, this.points[i].y, xc, yc);
      }

      context.quadraticCurveTo(this.points[i].x, this.points[i].y, this.points[i+1].x, this.points[i+1].y);
      context.stroke();
      context.closePath();

      if (this.selected === true) {
        this.drawHandles(context);
      }
    };

    CLine.prototype.toString=  function(){
      console.log( 'Curved Line ' + Shape.prototype.toString.call(this));
    };



    /********************** FREEFORM FUNCTION *********************/
    
    function FreeForm(sx, sy, ex, ey, fill, points){
      Shape.call(this, sx, sy, ex, ey, fill);
      this.points = points;
      var xmax = points.indexOf(points.find(function(o){return o.x == (Math.max.apply(Math,points.map(function(o){return o.x})))}));
      var xmin = points.indexOf(points.find(function(o){return o.x == (Math.min.apply(Math,points.map(function(o){return o.x})))}));
      var ymax = points.indexOf(points.find(function(o){return o.y == (Math.max.apply(Math,points.map(function(o){return o.y})))}));
      var ymin = points.indexOf(points.find(function(o){return o.y == (Math.min.apply(Math,points.map(function(o){return o.y})))}));
      this.w = this.points[xmax].x - this.points[xmin].x;
      this.h = this.points[max].y - this.point[min].y;
    }

    FreeForm.prototype = subclass(Shape);

    FreeForm.prototype.draw = function(context){
      context.lineWidth = this.lw;
      context.lineJoin = this.lj;

      if(this.points.length <3){
        var b = this.points[0];
        context.beginPath();
        context.arc(b.x, b.y, context.lineWidth / 2, 0, Math.PI * 2, !0 );
        context.fill();
        context.closePath();
        return;
      }

      context.beginPath();
      context.moveTo(this.points[0].x, this.points[0].y);

      for( var i = 1; i < this.points.length - 2; i++){
        var c = (this.points[i].x + this.points[i+1].x) / 2;
        var d = (this.points[i].y + this.points[i+1].y) / 2;
        context.quadraticCurveTo(this.points[i].x, this.points[i].y,c,d);
      }

      context.quadraticCurveTo( this.points[i].x, this.points[i].y, this.points[i+1].x, this.points[i+1].y);
      context.stroke();

      if (this.selected === true) {
        this.drawHandles(context);
      }

    };

    FreeForm.prototype.toString=  function(){
      console.log( 'FreeForm ' + Shape.prototype.toString.call(this));
    };

  
    /***********SHAPE HANDLES***********/
    Shape.prototype.drawhandles = function(context){
      drawBorder(this.x, this.y, this.closeEnough, context);
      drawBorder(this.x + this.w, this.y, this.closeEnough, context);
      drawBorder(this.x, this.y + this.h, this. closeEnough, context);
      drawBorder(this.x + this.w, this.y + this.h, this.closeEnough, context);
    };

    //Determine if point fall within shape
    Shape.prototype.contains = function(mx, my){
      if (this.touchedHandles(mx, my) === true){
        return true;
      }
      var xBool = false;
      var yBool = false;
       if (this.w >= 0) {
          xBool = (this.x <= mx) && (this.x + this.w >= mx);
        } else {
          xBool = (this.x >= mx) && (this.x + this.w <= mx);
        }
       if (this.h >= 0) {
          yBool = (this.y <= my) && (this.y + this.h >= my);
       } else {
          yBool = (this.y >= my) && (this.y + this.h <= my);
       }
       return (xBool && yBool);
    };


    //Determine if point is inside handles
    Shape.prototype.touchedHandles = function(mx,my){
      //top left
      if(checkCloseEnough(mx, this.x, this.closeEnough) && checkCloseEnough(my, this.y, this.closeEnough)){
        return true;
      }
      //top right
        else if (checkCloseEnough(mx, this.x + this.w, this.closeEnough) && checkCloseEnough(my, this.y, this.closeEnough)) {
          return true;
        }
        //bottom left
        else if (checkCloseEnough(mx, this.x, this.closeEnough) && checkCloseEnough(my, this.y + this.h, this.closeEnough)) {
          return true;
        }
        //bottom right
        else if (checkCloseEnough(mx, this.x + this.w, this.closeEnough) && checkCloseEnough(my, this.y + this.h, this.closeEnough)) {
           return true;
        }
    };

		
		$("#thickmenu").addClass("hide");


  // Draws a white rectangle with a black border around it
drawRectWithBorder = function(x, y, sideLength, context) {
  context.save();
  context.fillStyle = "#000000";
  context.fillRect(x - (sideLength / 2), y - (sideLength / 2), sideLength, sideLength);
  context.fillStyle = "#FFFFFF";
  context.fillRect(x - ((sideLength - 1) / 2), y - ((sideLength - 1) / 2), sideLength - 1, sideLength - 1);
  context.restore();
};

// checks if two points are close enough to each other depending on the closeEnough param
function checkCloseEnough(p1, p2, closeEnough) {
  return Math.abs(p1 - p2) < closeEnough;
}

/********************** INITIALISE TEXT CANVAS AND CONTEXT *********************/

  		var textarea = document.createElement('textarea');
  		textarea.id = 'text_tool';
  		container.appendChild(textarea);

  		var temp_txt_context = document.createElement('div');
  		temp_txt_context.style.display = 'none';
  		container.appendChild(temp_txt_context);

  		textarea.addEventListener('mouseup', function(e){
			canvas.removeEventListener('mousemove', draw,false);
  		},false);
	
    var onBrush = function(){
      curThickness = 5;
      curLJoin = 'round';
      context.lineWidth = curThickness;
      context.lineJoin = curLJoin;
    }

    var onPencil = function(){
      curThickness = 1;
      curLJoin = 'square';
      context.lineWidth = curThickness;
      context.lineJoin = curLJoin;
    }

    /********************** ERASE FUNCTION *********************/
    var onErase = function(e){
      var points = [];

      curColour = 'white';  
      context.strokeStyle = curColour;
      context.fillstyle =curColour;
    
     points.push({x:mouse.x, y:mouse.y});

      if(points.length <3){
        var b = points[0];
        context.beginPath();
        context.arc(b.x, b.y, context.lineWidth / 2, 0, Math.PI * 2, !0 );
        context.fill();
        context.closePath();
        return;
      }

      //context.clearRect(0,0, canvas.width, canvas.height);

      context.beginPath();
      context.moveTo(points[0].x, points[0].y);

      for( var i = 1; i < points.length - 2; i++){
        var c = (points[i].x + points[i+1].x) / 2;
        var d = (points[i].y + points[i+1].y) / 2;
        context.quadraticCurveTo(points[i].x, points[i].y,c,d);
      }

     context.quadraticCurveTo( points[i].x, points[i].y, points[i+1].x, points[i+1].y);
     context.stroke();
    };
			
		/**********************INITIALISE DEFAULT TOOL - BRUSH *********************/
 	 	$('#tools div').on('click', function(){
 	 		tool = $(this).attr('id');
 	 		console.log("Tool selected: " + tool);
 		})

 		$('#shapes div').on('click', function(){
  			tool = $(this).attr('id');
  			console.log("Shape selected: " + tool);
 		})

		/***********************SELECTING A COLOUR*************************/
 		var clr = $("#colour");
 		clr.mouseover(function(e){
 			var colourTiles = $(".colours");
 			for( var i = 0; i< colourTiles.length; i++){
 				colourTiles[i].addEventListener('click', function(e){
 					curColour = this.id; 				
 				});
 			}
 		});

 	
		/***********************SELECTING LINE WEIGHT *************************/
		var thickness = document.getElementById("thickness");
		thickness.addEventListener("click", function(e) {
			$("#thickmenu").removeClass("hide");
			var thickTiles = $(".thick");
			for(var i = 0; i<thickTiles.length; i++){
				thickTiles[i].addEventListener('click', function(e) {
					curThickness = parseInt(this.id);
					context.lineWidth = curThickness;

				});
			}
		});
	

		/*********************** UNDO ARRAY FUNCTION*************************/
		function uPush(){
			undoArr.push(canvas.toDataURL());
			undoindex++;
		}


 		/*********************** UNDO FUNCTION*************************/
		$(document).keydown(function (event) {
		    if (event.ctrlKey && event.keyCode == 90) {
		        undo1();
		    }
		});

		var undo = document.getElementById("undo");
		undo.addEventListener("click", undo1);

		 function undo1 (e){
		 	if (undoindex > 0){		
		 		undoindex--;
		 		console.log("undo: " + undoindex);
		 		var undo_img = new Image();
		 		undo_img.src = undoArr[undoindex];
		 		context.clearRect(0,0,canvas.width, canvas.height);
		 		context.drawImage(undo_img,0,0);
		 		frameDraw(); 
		 		console.log("undo");
		 	}
		}


	 /*********************** REDO FUNCTION*************************/

		$(document).keydown(function (event) {
		    if (event.ctrlKey && event.keyCode == 89) {
		        redo1();
		    }
		});

		var redo = document.getElementById("redo");
		redo.addEventListener("click", redo1);

		function redo1(e){
			if (undoindex < undoArr.length){	
				undoindex++;
		 		console.log("redo: " + undoindex);
	 			var undo_img = new Image();
	 			undo_img.src = undoArr[undoindex];
	 			context.drawImage(undo_img,0,0);
	 			frameDraw();	
	 			console.log("redo");
			}
		}


   		/*********************** SELECT FUNCTION*************************/
   		var x, y, width, height, stx, sty = 0;
   		var onSel = function(){
		  	if (blockMenuHeaderScroll)
	    	{
	        	e.preventDefault();
	    	}
			context.lineWidth = 1;
   			context.setLineDash([6]);
			context.clearRect(0,0, canvas.width, canvas.height);

			x = Math.min(mouse.x, start_mouse.x);
			y = Math.min(mouse.y, start_mouse.y);
			width = Math.abs(mouse.x - start_mouse.x);
			height = Math.abs(mouse.y - start_mouse.y);

			context.strokeRect(x,y, width, height);
			stx = mouse.x;
			sty = mouse.y;
			tool = 'choose';
   		};
   		var onChoose = function(){
   			if (blockMenuHeaderScroll)
	    	{
	        	e.preventDefault();
	    	}
			context.clearRect(0,0, canvas.width, canvas.height);
    		context.fillStyle = 'white';
    		context.strokeStyle = 'white';
			context.setLineDash([0]);
			context.fillRect(x,y, width, height);
			context.strokeRect(x,y, width, height);
			diffx = mouse.x - stx;
			diffy = mouse.y - sty;
			context.drawImage(canvas, x, y, width, height, x+diffx, y+diffy, width, height);
			context.strokeRect(x+diffx, y+diffy, width, height);
    		context.strokeStyle = 'black';
   		};

   		/*********************** PAINT FILL FUNCTION*************************/



		
 		/********************** FRAME SELECT *********************/
		
 		var frame_select = "frmimg"+curFrame;
  		$("#img div").on('click', function(){
  			frame_select = $(this).attr('id');
  			console.log("frame selected: "+frame_select);
 		})


		/*************************DRAW FRAME***********************/
		var cnvs1 = document.getElementById("canvas1");
		function frameDraw() {
			var frame = new Image();
			frame = cnvs1.toDataURL("image/png");

			if ((curFrame == 1) && (images.length == 0)){
				images.push(frame);
			}

			else if( curFrame == images.length){
				images[curFrame-1] = frame;
			}

			else if (curFrame > images.length){
				images.push(frame);
			}
			console.log("Length of frame array: " + images.length);
		
			var val = "frmimg"+curFrame;
			var frameimg = document.getElementById(val);
			frameimg.src = frame;	
		};


		/*************************NEW FRAME************************/
		var addFrame = document.getElementById("addframe");
		addFrame.addEventListener("click", function(e){
			context.clearRect(0,0, canvas.width, canvas.height);
			context.clearRect(0,0,canvas.width, canvas.height);

			var frame = new Image();
			frame = cnvs1.toDataURL("image/png");	

			var img = document.createElement("img");
			img.className = "frame";
			img.setAttribute("id", "frmimg"+(curFrame+1));
			$("#frmimg"+curFrame).after(img);
			reset1();
			curFrame++;
			frameDraw();
		});

		function reset1(){
			undoArr = [];
			undoindex= 0;
		}


		/*************************COPY FRAME************************/
		var copyFrame = document.getElementById("copyframe");
		copyFrame.addEventListener("click", function(e){
			context.clearRect(0,0, canvas.width, canvas.height);
			context.clearRect(0,0,canvas.width, canvas.height);

			var cimg = new Image();
			cimg.src = images[images.length -1];
			context.drawImage(cimg,0,0);
			frameDraw();

			var frame = new Image();
			frame = cnvs1.toDataURL("image/png");

			var img = document.createElement("img");
			img.className = "frame";
			img.setAttribute("id", "frmimg" + (curFrame+1));
			$("#frmimg"+curFrame).after(img);
			reset1();
			curFrame++;
			frameDraw();

		});


		/*************************DELETE FRAME************************/
		var delFrame = document.getElementById("delframe");
		delFrame.addEventListener("click", function(e){
			if(curFrame > 1){
				context.clearRect(0,0, canvas.width, canvas.height);
				context.clearRect(0,0,canvas.width, canvas.height);

				$("#frmimg"+curFrame).remove();
				images.pop();
				curFrame--;

				var curImg = new Image();
				curImg.src = images[images.length-1];
				context.drawImage(curImg,0,0);
				reset1();
			}		

		});


		/***********************PLAY ANIMATION*********************/
		var play = document.getElementById("play");
		var j = 0;
		var id;
		play.addEventListener("click", function(e){
			var time = parseInt(document.getElementById('frms').value);
			var sec = 60/time;
			var msec = sec*1000;
			for(var i=0; i<images.length; i++){
				var playScreen = document.createElement("img");
				playScreen.setAttribute("id", "playDiv");
				playScreen.src = images[i];
				$("#canvas").prepend(playScreen);
				$("#playDiv").delay(msec*(i+1)).fadeIn(msec-100).fadeOut(100);
				console.log("Frame played:" + i);
			}
			$("#playDiv").remove();
		});

	

}, false); }