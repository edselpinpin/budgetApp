
// budget contrloller module
var budgetgetController = (function () {

  var Expense = function(id, description, value) {
     this.id = id;
     this.description = description;
     this.value = value;
     this.percentage = -1
  
  }

  
  Expense.prototype.calculatePercentage = function(totalIncome){
    console.log(totalIncome);
    if (totalIncome > 0) {
       this.percentage =  Math.round((this.value / totalIncome) * 100);
     } else {
         this.percentage = -1;
     }
    // return this.percentage;
  };

  Expense.prototype.getPercentage = function() {
      return this.percentage;
  }


  var Income = function(id, description, value) {
    this.id = id;
    this.description = description;
    this.value = value;
    this.percentage = -1
 
 }





 // code below loops to the arry the sums up the value 
 // short version for for loop 
 var calculateTotal = function(type) {
     var sum = 0;
      data.allItems[type].forEach(function(curr){
         sum = sum + curr.value;
      });
      // code bellow populatea properties exp and inc on totals on data
      data.totals[type] = sum;
 }

  var data = {
       allItems: {
         allExpense: [],
                 exp:[],
                 inc:[],
      
       },
       totals: {
             exp: 0,
             inc: 0,
       },
       budget: 0,
       percentage: -1,
  };
  return {
    addItem: function(type,des,val) {
         var newItem, ID;
       // ID will be the last id + 1 
       
      if (data.allItems[type].length > 0) {
       ID = data.allItems[type][data.allItems[type].length - 1].id + 1;
      }
      else {
         ID = 0;
      }
       // check if income or expense 
        if (type === 'exp') {
          newItem = new Expense(ID, des,val);
        } if (type === 'inc') {
          newItem = new Income(ID, des, val);
        }  
        // populate the array
        data.allItems[type].push(newItem);
        return newItem;
    },
    // method 
    deleteItem: function(type, id) {
      var ids, index;
      // id = 6
      // code the get the index of the ID using the new arRY 
      ids = data.allItems[type].map(function(current){
            return current.id;
      });

      index = ids.indexOf(id);

         if (index !== -1) {
           data.allItems[type].splice(index, 1);
         }
    },    

    calculateBudget: function() {
       // calculate  total income and expense 
       calculateTotal('exp');
       calculateTotal('inc');

       // Calculate  the budget: income - expense 
       data.budget = data.totals.inc - data.totals.exp;
       // calculate the percentage of the income we spent 
       data.percentage = Math.round((data.totals.exp / data.totals.inc) * 100);     
       //  
    },

    calculatePercentages: function(){
         data.allItems.exp.forEach(function(curr){
           curr.calculatePercentage(data.totals.inc);
         });
    },

    getPercentages: function(){
      var allPerc = data.allItems.exp.map(function(curr){
         return curr.getPercentage();
      });
      return allPerc;
    },
    getBudget: function(){
         return {
              budget: data.budget,
              totalInc: data.totals.inc,
              totalExp: data.totals.exp,
              percentage: data.percentage,

         }      

    },
    
    testing: function() {
      console.log(data);
     }  
 

 };

 
 
    
})();



// UI Conntroler Module
var UIController = function() {
    // some code later 

    var DOMstring = {
         inputType: '.add__type',
         inputDescription: '.add__description',
         inputValue: '.add__value',
         inputBtn: '.add__btn',
         incomeContainer: '.income__list',
         expenseContainer: '.expenses__list',
         budgetLabel:  '.budget__value',
         incomeLabel: '.budget__income--value',
         expenseLabel: '.budget__expenses--value',
         percentageLabel: '.budget__expenses--percentage',
         container: '.container',
         expensesPercLabel: '.item__percentage',
        dateLabel: '.budget__title--month'

    };

    var formatNumber = function(num, type) {
      var numSplit, int, dec, type;
      /*
          + or - before number
          exactly 2 decimal points
          comma separating the thousands

          2310.4567 -> + 2,310.46
          2000 -> + 2,000.00
          */

      num = Math.abs(num);
      num = num.toFixed(2);

      numSplit = num.split('.');

      int = numSplit[0];
      if (int.length > 3) {
          int = int.substr(0, int.length - 3) + ',' + int.substr(int.length - 3, 3); //input 23510, output 23,510
      }

      dec = numSplit[1];

      return (type === 'exp' ? '-' : '+') + ' ' + int + '.' + dec;

   };

   var nodeListForEach = function(list, callback) {
    for (var i = 0; i < list.length; i++) {
        callback(list[i], i);
    }
   };

    // private function 
    return {
        getInput: function() {
          return {   
            type: document.querySelector(DOMstring.inputType).value,
            description: document.querySelector(DOMstring.inputDescription).value,
            value: parseFloat(document.querySelector(DOMstring.inputValue).value),
          };
        },

       addLisItem: function(obj, type) {
          // Create HTML string with placeholder text    
           var html,newHTML, element;
           if (type === 'inc'){
           element = DOMstring.incomeContainer;  
           
           html = '<div class="item clearfix" id="inc-%id%"><div class="item__description">%description%</div><div class="right clearfix"><div class="item__value">%value%</div><div class="item__delete"><button class="item__delete--btn"><i class="ion-ios-close-outline"></i></button></div></div></div>';
           
          } else if (type === 'exp') {
           element = DOMstring.expenseContainer;  
           html ='<div class="item clearfix" id="exp-%id%"><div class="item__description">%description%</div><div class="right clearfix"><div class="item__value">%value%</div><div class="item__percentage">21%</div><div class="item__delete"><button class="item__delete--btn"><i class="ion-ios-close-outline"></i></button></div></div></div>';
           }

          // Replace the placeholder test with some actual date=a
           newHTML = html.replace('id%',obj.id);
           newHTML = newHTML.replace('%description%',obj.description);
           newHTML = newHTML.replace('%value%', formatNumber(obj.value,type));


          // insert the HTML in the DOM
           document.querySelector(element).insertAdjacentHTML('beforeend', newHTML);          

       },

       deleteListItem: function(selectorID) {
         // DOM manipulation, remove the ID passed in the selector ID 
         // javascript can not directly remove child, it has to find th
         // the parent first then use removechild function to delete the element 
                   var el;
          el = document.getElementById(selectorID);
          el.parentNode.removeChild(el);
   
       },
       clearFields: function() {
            var fields;
            // queryselectorAll will return a list 
            fields = document.querySelectorAll(DOMstring.inputDescription + ',' + DOMstring.inputValue);
            // bellow code will convert it to an array, call will trick Array prototype by passing values from fields which is not a true array. 
            // this is a work around/ trick.  Other option siince there are only 2 fields is to use querySelector 
            var fieldsArr = Array.prototype.slice.call(fields);   

            fieldsArr.forEach(function(current,index,aray){
              current.value = "";
            });
            fieldsArr[0].focus();
       },
       displayBudget: function(obj) {
             var type;
               obj.budget > 0 ? type = 'inc' : type = 'exp';
        
             document.querySelector(DOMstring.budgetLabel).textContent = formatNumber(obj.budget, type);
             document.querySelector(DOMstring.incomeLabel).textContent = formatNumber(obj.totalInc, 'inc');
             document.querySelector(DOMstring.expenseLabel).textContent = formatNumber(obj.totalExp, 'exp');
               
             if (obj.percentage > 0) {
              document.querySelector(DOMstring.percentageLabel).textContent = obj.percentage + '%';
             } else {
              document.querySelector(DOMstring.percentageLabel).textContent =  '---';    
             }

       },

       displayPercentages: function(percentages) {
            
        var fields = document.querySelectorAll(DOMstring.expensesPercLabel);
        
        nodeListForEach(fields, function(current, index) {
            
            if (percentages[index] > 0) {
                current.textContent = percentages[index] + '%';
            } else {
                current.textContent = '---';
            }
        });



        
       },
       
       displayDate:  function(){
         var now, year, month;
         now = new Date();

         year = now.getFullYear();
         month = now.getMonth();
         months = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
         document.querySelector(DOMstring.dateLabel).textContent = months[month] + ' ' +  year;
       },


       changedType: function() {
            
        var fields = document.querySelectorAll(
            DOMstring.inputType + ',' +
            DOMstring.inputDescription + ',' +
            DOMstring.inputValue);
        
        nodeListForEach(fields, function(cur) {
          cur.classList.toggle('red-focus'); 
        });
         
          document.querySelector(DOMstring.inputBtn).classList.toggle('red');
      
    },
    
        getDOMStrings: function () {
            return DOMstring;
        },
    };  // end private function 


}();






//* global app controller 
var controller = function (budgetCtrl, UICtrl) {

  var setEventListers = function (){
      var DOM = UICtrl.getDOMStrings();
  
      document.querySelector(DOM.inputBtn).addEventListener('click', cltrAddItem);
      document.addEventListener('keypress', function(event){
      // do something only when 13 
      if (event.keyCode === 13 || event.which === 13) {
            cltrAddItem();
            
      }
     });
  
  document.querySelector(DOM.container).addEventListener('click', ctrlDeleteItem);
  document.querySelector(DOM.inputType).addEventListener('change', UICtrl.changedType);   

};

var updateBudget = function() {
     // 1. Calculate the budget 
      budgetCtrl.calculateBudget();

     // 2. Return the budget 
     var budget = budgetCtrl.getBudget();
     // 3. Display the budget on the UI
     UICtrl.displayBudget(budget);

  };


var cltrAddItem = function() {
     // 1. Get the user input data 
     var input,newItem;
     input = UICtrl.getInput();

     if (input.description !== "" && !isNaN(input.value)){
   
          // 2. Add that data to th budget controller (data structure)
          var newItem = budgetCtrl.addItem(input.type, input.description, input.value);
          
          // 3. Add the item the UI
          UICtrl.addLisItem(newItem,input.type);
          // 4. clear fields 
          UICtrl.clearFields();
      
          // 5 Calculate and update the budget 
          updateBudget();
          // 6. update and display perecentage 
          updatePercentages();
     }
    
 };

 var updatePercentages = function() {
        
      // 1. Calculate percentages
      budgetCtrl.calculatePercentages();
      
      // 2. Read percentages from the budget controller
      var percentages = budgetCtrl.getPercentages();
        console.log('Percentage');
        console.log(percentages[0]);

      
      // 3. Update the UI with the new percentages
      UICtrl.displayPercentages(percentages);
};

 var ctrlDeleteItem = function (event){
  var itemID, splitID, type, ID;
     
        itemID = event.target.parentNode.parentNode.parentNode.parentNode.id;
      //console.log(event.target.parentNode.parentNode.parentNode.parentNode);
        console.log(itemID);
        
        
        if (itemID) {
          
          //splitID = itemID.split('-');
          splitID = itemID.split('-%');
          type = splitID[0];
          ID = parseInt(splitID[1]);
         
         
          //1. delete the item from the data structure 
          budgetCtrl.deleteItem(type,ID);

          // 2. Delete the item from the UI
          UICtrl.deleteListItem(itemID);

          //3. Update and show the result in the UI
          updateBudget();
          // 4. Update percentage 
          updatePercentages();
        }
        
 };
 

 return {
  init: function() {
      UICtrl.displayDate();
      UICtrl.displayBudget({
          budget: 0,
          totalInc: 0,
          totalExp: 0,
          percentage: -1
      });
      setEventListers();
  }
};

  
}(budgetgetController,UIController);

// main program
controller.init();
