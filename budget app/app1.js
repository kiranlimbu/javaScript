var bugetController = (function () {

    // Constructor
    var Income = function (id, description, value) {
        this.id = id;
        this.description = description;
        this.value = value;
    };

    // Constructor
    var Expanses = function (id, description, value) {
        this.id = id;
        this.description = description;
        this.value = value;
    };

    // Data storage structure
    var data = {
        allItems: {
            inc: [],
            exp: []
        },
        totals: {
            inc: 0,
            exp: 0
        },
        budget: 0,
        percentage: -1
    };

    return {
        addItem: function (type, des, val) {
            var ID, newItem;
            // create new ID for each line of input
            if (data.allItems[type].length > 0) {
                ID = data.allItems[type][data.allItems[type].length - 1].id + 1;
            } else {
                ID = 0;
            };

            // separate the data based on inc or exp
            if (type === 'inc') {
                newItem = new Income(ID, des, val);
            } else if (type === 'exp') {
                newItem = new Expanses(ID, des, val);
            }

            // store the data
            data.allItems[type].push(newItem);

            // return the data
            return newItem;
        },

        // for testing purpose
        testing: function () {
            console.log(data);
        }
    };

})();

var UIcontroller = (function () {

    var DOMstring = {
        inputType: '.add__type',
        inputDescription: '.add__description',
        inputValue: '.add__value',
        addBtn: '.add__btn'
    };


    return {
        getInput: function () {
            return {
                type: document.querySelector(DOMstring.inputType).value,
                description: document.querySelector(DOMstring.inputDescription).value,
                value: document.querySelector(DOMstring.inputValue).value
            };
        },

        getDOMstring: function () {
            return DOMstring;
        }
    };

})();

var appController = (function (budgetCtrl, UICtrl) {
    var DOM = UICtrl.getDOMstring();

    var ctrlAddItem = function () {
        var input;

        // 1. get the field input data
        input = UICtrl.getInput();

        // 2. add items to the budget controller
        budgetCtrl.addItem(input.type, input.description, input.value);

        // 3. add the item to UI

        // 4. calculate the budget

        // 5. display budget

        // 6. display percentage

        // 7. display month

        console.log('key pressed!')
    }

    document.querySelector(DOM.addBtn).addEventListener('click', ctrlAddItem);
    document.addEventListener('keypress', function (event) {
        if (event.keyCode === 13 || event.which === 13) {
            ctrlAddItem();
        };
    });

})(bugetController, UIcontroller);