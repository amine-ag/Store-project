const client = require('./db_connection');
const format = require('pg-format')

let obj = {

    /**
     * Admin : retrieving the list of all orders and their respective items
     */
    selectAllOrders: () => {

        let query = `select o.order_id, o.dateoforder, mt.item_id, mt.item_name, oi.quantity 
                        from menu_items mt,orders o, order_item oi 
                        where mt.item_id = oi.item_id and o.order_id = oi.order_id`;

        return new Promise((resolve, reject) => {
            client.query(query)
                .then((res) => {
                    resolve(res.rows);
                })
                .catch((err) => {
                    reject(err.stack);
                });
        });

    },

    /**
     * Admin / cashier : list all menu items
     * Outputs : array of all the items
     */
    selectAllMenu: () => {
        return new Promise((resolve, reject) => {
            client.query('SELECT * from menu_items')
                .then(results => {
                    resolve(results.rows);
                }).catch(error => {
                    reject(error.stack);
                })
        })
    },

    
    /**
     * Admin : removes one or more menu items
     * Inputs: [ids...]
     * Outputs:number of menu items removed 
     */
    setMenuItemsStatus: (ids) => {

        let queryarray = [];

        for (let i = 2; i <= ids.length; i++) {
            queryarray.push('$' + i);
        }

        return new Promise((resolve, reject) => {

            let query = `update menu_items set item_status = $1 where 
                item_id in (` + queryarray.join() + `)`;
            client
                .query(query, ids)
                .then(results => {
                    resolve(results.rowCount);
                })
                .catch(err => {
                    reject(err.stack);
                })

        })
    },


    /**
     * admin adds an item to the menu
     * Inputs : [item_name , item_price]
     * Output : number of items inserted
     */
    addToMenu : (menu_item) =>{
        return new Promise((resolve,reject) => {
            client.query('insert into menu_items(item_name, item_price) values($1,$2)',menu_item)
            .then(res => {
                resolve(res.rowCount);
            })
            .catch(err =>{
                reject(err.stack);
            });
        })
    },


    /**
     * adds new order record 
     * Outputs : Promise of the order_id
     */
    addOrderId: () => {
        console.log('hello ana');
        let query = 'insert into orders(dateoforder) values(NOW()) returning order_id';

        return new Promise((resolve, reject) => {
            
            client.query(query).then((res) => {
                //console.log('new order id : ', res.rows[0]);
                resolve(res.rows[0].order_id);

            }).catch((err) => {
                //console.log(err.stack);
                reject(err);
            
            })

        })
    },

    /**
     * adds new order item(s) 
     * Inputs: [{item_id, item_name, quantity},...]
     * Outputs: number of order_items added
     */
    addNewOrderItems: (items) => {

        //calls the addOrderID to get the order_id to use it in adding the order items
        obj.addOrderId().then(res => {
                
                let values = [];

                for (let i = 0; i < items.length; i++) {
                    values.push([res , items[i].i_id , items[i].i_quantity]);
                }

                let query = format('insert into order_item(order_id, item_id, quantity) values %L ', values);

                client.query(query).then(results => {
                    console.log('rows inserted : ', results.rowCount);
                })

            }).catch(err => {
                console.log('last error => ', err); 
            })

    }
 
}

module.exports = obj;
