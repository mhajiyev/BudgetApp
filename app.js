var budgetController = (function (){
	
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
			var last = data.allItems[type].length - 1;
			
			if (data.allItems[type].length > 0)
			ID = data.allItems[type][last].id + 1;  // Creating unique id for each item
			else ID = 0;  // for the first item

			//defining type of the items
 			if (type === 'exp'){
			 newItem = new Expense(ID, des, val);
			}
			else if (type ==='inc'){
			 newItem = new Income(ID, des, val);
			} 
			data.allItems[type].push(newItem);
			return newItem;
		}
	};

})();



var UIController = (function() {
    var DOMstrings = {
 		inputType: '.add__type',
 		inputDescription: '.add__description',
 		inputValue: '.add__value',
 		inputButton: '.add__btn',
 		incomeContainer:'.income__list',
 		expensesContainer: '.expenses__list'
    };

	return {
		getinput: function(){
			return {
            type: document.querySelector(DOMstrings.inputType).value, //Will be either inc or exp
			description:  document.querySelector(DOMstrings.inputDescription).value,
		    value: parseFloat(document.querySelector(DOMstrings.inputValue).value)
			};
		},
		getDOMstrings: function() {
			return DOMstrings;
		},
		addListItem: function (obj,type){
			var htmlCode, newHtml, element;
			//create HTML string with placeholder text
			if (type === 'inc'){
			element = DOMstrings.incomeContainer;
	         htmlCode = '<div class="item clearfix" id="income-%id%"><div class="item__description">%description%</div><div class="right clearfix"><div class="item__value">%value%</div><div class="item__delete"><button class="item__delete--btn"><i class="ion-ios-close-outline"></i></button></div></div></div>';
			}
			else if (type === 'exp'){
			 element = DOMstrings.expensesContainer;
             htmlCode = '<div class="item clearfix" id="expense-%id%"><div class="item__description">%description%</div><div class="right clearfix"><div class="item__value">%value%</div><div class="item__percentage">21%</div><div class="item__delete"><button class="item__delete--btn"><i class="ion-ios-close-outline"></i></button></div></div></div>';
			}
			// Replacing the placeholder text with some actual data
			newHtml = htmlCode.replace('%id%',obj.id);
			newHtml = newHtml.replace('%description%',obj.description);
			newHtml = newHtml.replace('%value%',obj.value);
			//Insert the HTML into DOM
			document.querySelector(element).insertAdjacentHTML('beforeend',newHtml);
		},
		clearFields: function(){ // clearing input fields
			var fields = document.querySelectorAll(DOMstrings.inputDescription + ', ' + DOMstrings.inputValue);
			var fieldsArr = Array.prototype.slice.call(fields);  // converting the list into an array

			fieldsArr.forEach(function(cur,index,arr){
				cur.value = "";
			});
			fieldsArr[0].focus(); // return the cursor to descriptioon field
			
		}
	};
})();


var controller = (function (budgetCtrl,UICtrl){
   
   var setupEventListeners = function(){

   		var DOM = UICtrl.getDOMstrings();

   		document.querySelector(DOM.inputButton).addEventListener('click',ctrlAddItem);

   		document.addEventListener('keypress',function(e){
          //console.log(event);
          if (e.keyCode === 13 || e.which === 13){
               ctrlAddItem();
          }
   		});
   };
   
   var updateBudget = function() {

   };

   var ctrlAddItem = function (){
   	 var input, newItem;
   	 // 1. Get the field input data
   	  input = UICtrl.getinput();

   	  if (input.description !== "" && !isNaN(input.value && (input.value > 0)){

   	  //  2. Add the item to the budget contoller
   	  newItem = budgetCtrl.addItem(input.type, input.description, input.value);
   	 // 3. Add the item to UI
   	 UICtrl.addListItem(newItem, input.type);

   	 UICtrl.clearFields(); // Clearing input fields
   	 // 4. Calculate budget , Display the budget on the UI
   	 
   	 //5.Calculate and update budget
   	 	updateBudget();
   	  }

   };

   return {
   	init: function (){  //public initialization function
   		console.log('Application has started.');
   		setupEventListeners();
   	}
   };

})(budgetController,UIController);

controller.init();











