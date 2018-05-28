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


	var calculateTotal = function(type){
		var sum = 0;
		data.allItems[type].forEach(function(cur){
			sum += cur.value;
		});
		data.totals[type] = sum;
	};

	var data = {
	     allItems: {
	     	exp: [],
	     	inc: []
	     },
	     totals: {
	     	exp: 0,
	     	inc: 0
	     },
	     budget: 0,
	     percentage: -1
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
		},

		deleteItem: function(type, id){
			var index = -1;
			for (var i=0;i<data.allItems[type].length;i++){
				if (data.allItems[type][i].ID == id) index = i;
			}
			
			//console.log(index);
			if (index !== -1){
				data.allItems[type].splice(index,1);
				//data.budget-=data.allItems[type][index];
			}
		},

		calculateBudget: function(){
			//calculate total income and expense
			calculateTotal('exp');
			calculateTotal('inc');
			//calculate the budget: income- expense
			data.budget = data.totals.inc - data.totals.exp;
			//calculate the percentage of income that we spent
			if (data.totals.inc > 0){
			data.percentage = Math.round((data.totals.exp / data.totals.inc) * 100) ;}
			else {
				data.percentage = -1;
			}
		},

		getBudget: function(){
			return {
				budget: data.budget,
				totalInc: data.totals.inc,
				totalExp: data.totals.exp,
				percentage: data.percentage
			}
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
 		expensesContainer: '.expenses__list',
 		budgetLabel:'.budget__value',
 		incomeLabel:'.budget__income--value',
 		expensesLabel:'.budget__expenses--value',
 		percentageLabel:'.budget__expenses--percentage',
 		container:'.container'
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
	         htmlCode = '<div class="item clearfix" id="inc-%id%"><div class="item__description">%description%</div><div class="right clearfix"><div class="item__value">%value%</div><div class="item__delete"><button class="item__delete--btn"><i class="ion-ios-close-outline"></i></button></div></div></div>';
			}
			else if (type === 'exp'){
			 element = DOMstrings.expensesContainer;
             htmlCode = '<div class="item clearfix" id="exp-%id%"><div class="item__description">%description%</div><div class="right clearfix"><div class="item__value">%value%</div><div class="item__percentage">21%</div><div class="item__delete"><button class="item__delete--btn"><i class="ion-ios-close-outline"></i></button></div></div></div>';
			}
			// Replacing the placeholder text with some actual data
			newHtml = htmlCode.replace('%id%',obj.ID);
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
			
		},

		deleteListItem: function(selectorID){
			var temp = document.getElementById(selectorID);
			temp.parentNode.removeChild(temp);
		},
		displayBudget: function(obj){
			document.querySelector(DOMstrings.budgetLabel).textContent = obj.budget;
			document.querySelector(DOMstrings.incomeLabel).textContent = obj.totalInc;
			document.querySelector(DOMstrings.expensesLabel).textContent = obj.totalExp;
			

			if (obj.percentage > 0){
				document.querySelector(DOMstrings.percentageLabel).textContent = obj.percentage + '%';
			}
			else {
				document.querySelector(DOMstrings.percentageLabel).textContent = '---';
			}
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

   		document.querySelector(DOM.container).addEventListener('click',ctrlDeleteItem);
   };
   
   var updateBudget = function() {
   		budgetCtrl.calculateBudget();  //calculating budget

   		var budget = budgetCtrl.getBudget();

   		UICtrl.displayBudget(budget);  //displaying budget on screen


   };

   var ctrlAddItem = function (){
   	 var input, newItem;
   	 // 1. Get the field input data
   	  input = UICtrl.getinput();

   	  if (input.description !== "" && !isNaN(input.value) && (input.value > 0)){

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


   var ctrlDeleteItem = function(event){
   	var itemID,splitID,type,ID;
   	itemID = event.target.parentNode.parentNode.parentNode.parentNode.id;
   	if (itemID){
   			splitID = itemID.split('-');
   			type = splitID[0];
   			ID = parseInt(splitID[1]);
   			console.log(type);
   			console.log(ID);
   			//delete the item from data structure
   			budgetCtrl.deleteItem(type,ID);
   			//deleting from UI
   			UICtrl.deleteListItem(itemID);
   			//updating/show new budget
   			updateBudget();
   	}
   };

   return {
   	init: function (){  //public initialization function
   		console.log('Application has started.');
   		UICtrl.displayBudget({
   			budget: 0,
   			totalInc: 0,
   			totalExp: 0,
   			percentage: 0
   		});
   		setupEventListeners();
   	}
   };

})(budgetController,UIController);

controller.init();











