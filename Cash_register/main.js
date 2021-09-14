// Interface Module -------------------------------------------------------------------------------------------
var uiCtrl = (function() {

    var getInput = {
        itemVal: document.getElementById('display-item'),
        itemInfo: document.getElementById('display-info'),
        totalVal: document.getElementById('display-total'),
        totalInfo: document.getElementById('display-total-info'),
        regHis: document.querySelector('.regInfoContainer span:last-child'),
        spanRegHis: document.querySelector('.regInfoContainer span'),

        // get height
        regHistHeight: document.querySelector('.regInfoContainer').clientHeight,
        // font size
        regHistFont: window.getComputedStyle(document.querySelector('.reg-history span')).fontSize
    };
    
    return {
        // buttons object
        calcButton: [
            {
                name: "1",
                type: "number"
            },{
                name: "2",
                type: "number"
            },{
                name: "3",
                type: "number"
            },{
                name: "4",
                type: "number"
            },{
                name: "5",
                type: "number"
            },{
                name: "6",
                type: "number"
            },{
                name: "7",
                type: "number"
            },{
                name: "8",
                type: "number"
            },{
                name: "9",
                type: "number"
            },{
                name: "0",
                type: "number"
            },{
                name: ".",
                type: "number"
            },{
                name: "x",
                formula: "*",
                type: "operator"
            },{
                name: "-",
                formula: "-",
                type: "operator"
            },{
                name: "+",
                formula: "+",
                type: "operator"
            },{
                name: "Total",
                type: "equation"
            },{
                name: "CASH",
                type: "equation"
            },{
                name: "CARD",
                type: "equation"
            },{
                name: "Clear",
                type: "key"
            }
        ],

        // display clicked numbers
        displayClkNum: function(dataVault, inputType) {
            var curNum, allOpArr;
            var arrLength = dataVault.allOp.length;
            // check, is number entered
            (dataVault.singleOp.length < 1) ? curNum = '0' : curNum = dataVault.singleOp.join('');

            // generate subtotal without modifying actual data structure
            // update subtotal in top display without calling total function
            if (arrLength >= 2 && inputType == "operator" && dataVault.allOp[arrLength-1] != "*") {
                allOpArr = dataVault.allOp.join('');
                dataVault.subtotal = eval(allOpArr).toFixed(2);
            }
            // top display
            if (inputType == "operator" && dataVault.allOp[arrLength-1] != "*") {
                // Use top display for subtotal if the total is 0 
                if (dataVault.total == 0) {
                    getInput.totalInfo.innerText = "SUBTOTAL";
                    getInput.totalVal.innerText = dataVault.subtotal;
                }
            }
            // bottom display
            getInput.itemInfo.innerText = "ITEM";
            getInput.itemVal.innerText = curNum;
            
        },

        displaySum: function(dataVault) {
            // Top display
            if (dataVault.total > 0) {
                getInput.totalInfo.innerText = "Total";
                getInput.totalVal.innerText = dataVault.total;
            }
            // bottom display
            if (dataVault.subtotal > 0 && dataVault.change == 0) {
                getInput.itemInfo.innerText = "SUBTOTAL"; // else, display this
                getInput.itemVal.innerText = dataVault.subtotal; // else, display this
            } else {
                // if calcChange function has been run, display this
                (dataVault.change <= 0) ? getInput.itemInfo.innerText = "CHANGE" : getInput.itemInfo.innerText = "Amount Due" ;
                getInput.itemVal.innerText = dataVault.change;
            }
        },

        // switch between number display and sum display
        displaySwitch: function(inputType, dataVault) {

            if (inputType == "equation") {
                this.displaySum(dataVault);
            } else {
                this.displayClkNum(dataVault, inputType);
            }
        },

        // push each transaction entry into Array
        regHistEntry: function(operatorName, num, vault) {
            var bottomDisplayVal = getInput.itemVal.innerText; // grab last displayed amount
            
            if (num == 0 && vault.change == 0) {
                // if total is calculated and the cashReceived is exact
                if (vault.firstTime <= 2) {
                    num = vault.total;
                } else if (vault.firstTime > 2) {
                    // if total is calculated and change is calculated
                    num = bottomDisplayVal;
                }
            }
            
            console.log(bottomDisplayVal);
            // push it to Array (DOM manipulation)
            if (operatorName === "Total") {
                vault.regHist.push(`<span>---------------<br></span>`);
                vault.regHist.push(`<span>Sub Total&nbsp;.....&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;${vault.subtotal}<br></span>`);
                vault.regHist.push(`<span>Tax&nbsp;.....&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;${(vault.total - vault.subtotal).toFixed(2)}<br></span>`);
                vault.regHist.push(`<span>Total&nbsp;.....&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;${vault.total}<br></span>`);

            } else if (operatorName === "CASH") {
            
                vault.regHist.push(`<span>Cash&nbsp;.....&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;${num}<br></span>`);
                if (vault.change <= 0) {
                    vault.regHist.push(`<span>Change&nbsp;.....&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;${vault.change*-1}<br></span>`);
                } else if (vault.change > 0) {
                    vault.regHist.push(`<span>Amount Due&nbsp;.....&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;${vault.change}<br></span>`);
                }

            } else if (operatorName === "CARD") {
                vault.regHist.push(`<span>Card&nbsp;.....&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;${num}<br></span>`);
            } else if (operatorName === "x") { 
                vault.regHist.push(`<span>Qty&nbsp;.....&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;${num + operatorName}<br></span>`);
            } else {
                // if none is true push it as individual item
                vault.regHist.push(`<span>Item&nbsp;.....&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;${num + operatorName}<br></span>`);
            }   
        },
        // Pull data from array and display on the register history container
        displayRegHist: function(vault, curType) {
            var curLength = vault.regHist.length;
            var span = getInput.spanRegHis;
            var height = getInput.regHistHeight;
            var fontsize = parseInt(getInput.regHistFont);
            var index = 0;
            
            if (curLength > 0 && (curType == "operator" || curType == "equation")) {
                // i = last array length
                for (let i=vault.regArrLength; i<curLength; i++) {
                    getInput.regHis.innerHTML += vault.regHist[i]; // display array info
                    
                    // Remove top item if reg hist container is full
                    if ((curLength*fontsize) >= (height - 40)) {
                        span.removeChild(span.childNodes[index]);
                        index++;
                    }
                }
            }
            // update last array length
            vault.regArrLength = curLength;
        }
    }

})();

// Data Module -------------------------------------------------------------------------------------------
var calcCtrl = (function() {
    // data structure
    var data = {
        regHist: [],
        regArrLength: 0,
        allOp: [],
        singleOp: [],
        subtotal: 0,
        total: 0,
        change: 0,
        firstTime: 1,
        curTotal: function() { // first time returns total then return remaining balance
            if (this.firstTime == 1) {
                this.firstTime++;
                return this.total; // first total value
            } else {
                this.firstTime++;
                return this.change; // second total value
            }
        }
    };

    // calculate total
    calcTotal = function() {
        var curTotal;

        curTotal = eval(data.allOp.join(''));
        // make sure total does not come in negative
        if (curTotal > 0) {
            data.subtotal = curTotal.toFixed(2);
            data.total = (curTotal*1.09).toFixed(2);
        }
    };

    // calculate change
    calcChange = function() {
        var cashReceived = data.singleOp.join('');
        var curTotal = data.curTotal(); // first get total

        // ensure total function has been called
        if (data.total > 0) {
            // cash received is more then 0
            if (cashReceived > 0) {

                if (cashReceived == data.change) {
                    data.change = 0; // this will cause the data structure to reset
                    data.subtotal = 0;
                }
                var difference = curTotal - cashReceived;
                data.change = difference.toFixed(2); // stores the change amount

                // cash received is exact amount
            } else if (cashReceived === "") {
                data.change = 0; // this will cause the data structure to reset
                data.subtotal = 0;
            } else if (cashReceived <= 0) {
                data.change = data.total; // if 0 is entered
            }
        }

    };

    // when card is pressed returns 0
    calcCard = function() {
        if (data.total > 0) {
            data.change = 0; // this will cause the data structure to reset
            data.subtotal = 0;
        }
    };

    // push incoming data into data structure
    return {

            // reset data structure
        dataReset: function() {
            data.allOp = [],
            data.singleOp = [],
            data.subtotal = 0,
            data.total = 0,
            data.change = 0,
            data.firstTime = 1
        },
        
        calculator: function(uiInput, btnClicked, regHistItem) {
            // Variables for button objects
            var curType, curName, curFormula, numClicked;
            // Booleans variables
            var opReady, totalReady, cashReady, cardReady;
            // Backspace Button
            var backspace = document.getElementById('reg-backspace').innerText;
            
            // get entered number. this will be pushed in allOperation data storage
            (data.singleOp.length < 1) ? numClicked = 0 : numClicked = data.singleOp.join('');

            // Register buttons on/off
            if (numClicked != 0) { // if only one set of number is entered
                opReady = true;
                totalReady = false;
                cashReady = false;
                cardReady = false;
            }
            if (data.allOp.length > 1) { // if more then one set of number is entered
                totalReady = true;
            }
            if (data.total != 0) { // if calcTotal function is called
                opReady = false;
                totalReady = false;
                cashReady = true;
                cardReady = true;
            }

            // goes through button object and gets specified properties
            uiInput.forEach(btn => {
                if (btn.name == btnClicked) {
                    curType = btn.type;
                    curName = btn.name;
                    curFormula = btn.formula;
                }
            })

            if (curType == "number") {
                if (curName == ".") {
                    if(!data.singleOp.includes('.')) { // constrain: allow only one period
                        data.singleOp.push(curName);
                    }
                } else {
                    // limit entry to 5 digits
                    if (data.singleOp.length < 5)
                        data.singleOp.push(curName);
                }

            } else if (curType == "operator") {
                if (opReady) {
                    if (curName == "x") {
                        data.allOp.push('+');
                        data.allOp.push(numClicked);
                        data.allOp.push(curFormula);
                    } else {
                        data.allOp.push(curFormula);
                        data.allOp.push(numClicked);
                    }
                    regHistItem(curName, numClicked, data); // push each transaction into reg hist array
                    data.singleOp = [];
                }

            } else if (curType == "equation" && data.change >= 0) {
                if (curName == "Total") {
                    if (totalReady && data.allOp[data.allOp.length-1] != "*") {
                        data.change = 0; // if there is pending data clear it
                        data.subtotal = 0;
                        data.total = 0;
                        firstTime = 1;                   
                        calcTotal();
                        regHistItem(curName, numClicked, data); // push each transaction into reg hist array
                        data.allOp = [];
                    }

                } else if (curName == "CASH") {
                    if (cashReady) {
                        calcChange();
                        regHistItem(curName, numClicked, data); // push each transaction into reg hist array
                        data.singleOp = [];
                    }

                } else if (curName == "CARD") {
                    if (cardReady) {
                        calcCard();
                        regHistItem(curName, numClicked, data); // push each transaction into reg hist array
                    }
                }
                

            } else if (curType == "key") { // there is only one key Button(Clear)
                this.dataReset();
                document.getElementById('display-total').innerText = '0.00';
                opReady = false;
                totalReady = false;
                cashReady = false;
                cardReady = false;

                // backspace / delete button
            } else if (backspace === btnClicked) {
                data.singleOp.pop();
                curType = "key";
            }
                
            return curType;
        },

        // make data accessible
        dataAccess: function() {
            return data;
        }
    }
})();

// Controller Module -------------------------------------------------------------------------------------------
var controller = (function(uiCtrl, calcCtrl) {
    var clickedBtn;
    
    var setupEventListeners = function() {
        var theParent = document.querySelector('.reg-parent');
        // On button clicked perform following task
        theParent.addEventListener('click', (e) => {
            
            clickedBtn = e.target.innerText; // track clicked btn
            addItem();
        });
    };
    
    // Delegate tasks
    var addItem = function() {

        // Get the clicked data
        clickedBtn;

        // Add the item to data structure
        var btnType = calcCtrl.calculator(uiCtrl.calcButton, clickedBtn, uiCtrl.regHistEntry);

        // call data structure
        var storedData = calcCtrl.dataAccess();

        // Add the item to the interface (top and button display)
        uiCtrl.displaySwitch(btnType, storedData);

        // Add item to register History container
        uiCtrl.displayRegHist(storedData, btnType);

        // reset data after each transaction
        if (storedData.change < 0 || (storedData.subtotal == 0 && storedData.total > 0)) {
            calcCtrl.dataReset();
        }
    };

    return {
        init: function() {
            setupEventListeners();
        }
    }

})(uiCtrl, calcCtrl);

controller.init();