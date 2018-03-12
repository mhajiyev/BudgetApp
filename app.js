var budgetController = (function (){
	/*
	var x = 23;
	var add = function (a){
		return x+a;
	}

	return {
		publicTest: function (b){
			return add(b);
		}
	}*/
	var Expense = function(ID,description,value){
		this.ID = ID;
		this.description = description;
		this.value = value;
	};

	var Income = function(ID,description,value){
		this.ID = ID;
		this.description = description;
		this.value = value;
	};

	var data = {
	     allItems: {
	     	exp: [],
	     	inc: []
	     },
	     totals: {
	     	exp: 0,
	     	inc: 0
	     }
	};

	return {
		addItem: function(type, des, val){
			var newItem, ID;

			ID = 0;

 			if (type === 'exp'){
			 newItem new Expense(ID, des, val);
			}
			else if (type ==='inc'){
			 newItem new Income(ID, des, val);
			} 
			data.allItems[type].push(newItem);
			return newItem;
		}
	}

})();



var UIController = (function() {
    var DOMstrings = {
 		inputType: '.add__type',
 		inputDescriptions: '.add__description',
 		inputValue: '.add__value',
 		inputButton: '.add__btn'
    };

	return {
		getinput: function(){
			return {
            type: document.querySelector(DOMstrings.inputType).value, //Will be either inc or exp
			description:  document.querySelector(DOMstrings.inputDescriptions).value,
		    value:document.querySelector(DOMstrings.inputValue).value
			};
		},
		getDOMstrings: function() {
			return DOMstrings;
		}
	};
})();


var controller = (function (budgetCtrl,UICtrl){
   
   // var z = budgetCtrl.add(3);
  /*var z = budgetCtrl.publicTest(5);
   return {anotherPublic: function (){
   	console.log(z);
   }}*/
   var setupEventListeners = function(){
   var DOM = UICtrl.getDOMstrings();
   document.querySelector(DOM.inputButton).addEventListener('click',ctrlAddItem);

   document.addEventListener('keypress',function(event){
          //console.log(event);
          if (event.keyCode === 13 || event.which === 13){
               ctrlAddItem();
          }
   });
   };
   
   var ctrlAddItem = function (){

   	 // 1. Get the field input data
   	 //  2. Add the item to the budget contoller
   	 // 3. Add the item to UI
   	 // 4. Calculate budget , Display the budget on the UI
   	 var input = UICtrl.getinput();
   	 console.log(input);
   };

   return {
   	init: function (){
   		console.log('Application has started.');
   		setupEventListeners();
   	}
   };

})(budgetController,UIController);

controller.init();











