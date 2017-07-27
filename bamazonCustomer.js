var inquirer = require('inquirer');
var mysql = require('mysql');

var connection = mysql.createConnection({
    host: "localhost",
    port: 3306,
    user:"root",
    password: "daisy731",
    database: "Bamazon_db"
});

connection.connect(function(err){
    if(err) throw err;
    console.log("connected as id " +
    connection.threadId);
    
    showItems();
})

function showItems(){
 connection.query("SELECT item_id, product_name, price FROM products", function (err, res){
     if(err) throw err;
     
     buyItem();
                  
  })
}

function buyItem(){
    var query = "SELECT item_id, stock_quantity FROM products"; connection.query(query, function(err, res){
        if(err) throw err;
        
        inquirer.prompt([
            {
                type: "input",
                message: "What item would you like to purchase?",
                name: "item",
                validate: function(item){
                    for(var i = 0; i < res.length; i++){
                        if(item == res[i].item_id){
                            return true;
                        }
                    }
                    
                    return "please enter valid item_id";
                }
            },
            
            {
                type: "input",
                message: "How many are being purchase?",
                name: "quantity",
                validate: function(amount){
                    var results = amount % 1;
                        if(amount > 0 && results == 0){
                            return true;
                        }else{
                            return "please enter vaild amount";
                        }
                    }
                }
            
            
        ]).then(function(response){
            var chosenItem = response.item;
            var chosenAmount = response.amount;
            updateProduct(chosenItem, chosenAmount);
        })       
    })        
}


        function updateProduct(item, amount){
            var query1 = "SELECT stock_quantity FROM products WHERE item_id = " + item;
            var query2 = "UPDATE products SET stock_quantity = stock_quantity - " + quantity + " WHERE item_id = " + item;
            connection.query(query1, function(error, response){
                if(error) throw error;
                if(quantity <= response[0].stock_quantity){
                    connection.query(query2,function(err, res){
                        if(err) throw err;
                    })
                    totalCost(item, quantity);
                }else{
                    console.log("We cannot fulfill that order. Not enough stock.");
                }
            })
        }

                function totalCost(item, amount){
                    var totalCost = 0;
                    var query = "SELECT price FROM products WHERE item_id = " + item;
                    connection.query(query, function(err, res){
                        totalCost = res[0].price * quantity;
                        console.log("Price per item: " + res[0].price);
                        console.log("Amount purchased: " + quantity);
                        console.log("Total: " + totalCost);
                    })
                }