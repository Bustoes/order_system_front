
new Vue({
    el: '#app',
    data: {
        newDish: { id: '', name: '', price: '', image: '', type: '' },
        menu: [],
        sales: [],
        orders: []
    },


    created: function () {
        this.fetchMenu();
        this.fetchSales();
        this.fetchOrders();
    },
    methods: {
        fetchMenu: function () {
            axios.get('http://127.0.0.1:4523/m1/3485186-0-default/staff/menu')
                .then(response => {
                    if (response.data.code === 1000) {
                        this.menu = response.data.data;
                    } else {
                        alert('Failed to fetch menu data: ' + response.data.msg);
                    }
                })
                .catch(error => {
                    alert('Failed to fetch menu data: ' + error.message);
                });
        },
        addDish: function () {
            // Validate the new dish data before sending the request
            if (!this.newDish.id || !this.newDish.name || !this.newDish.price || !this.newDish.type || !this.newDish.image) {
                alert('Please fill in all fields');
                return;
            }

            // Make a POST request to insert the new dish
            axios.post('http://127.0.0.1:4523/m1/3485186-0-default/staff/menu/insert', {
                meal_id: this.newDish.id,
                meal_name: this.newDish.name,
                meal_price: this.newDish.price,
                type: this.newDish.type,
                image_path: this.newDish.image
            })
                .then(response => {
                    if (response.data.code === 1000) {
                        // If the request is successful, add the new dish to the menu
                        this.menu.push({
                            meal_id: this.newDish.id,
                            meal_name: this.newDish.name,
                            meal_price: this.newDish.price,
                            type: this.newDish.type,
                            image_path: this.newDish.image
                        });

                        // Clear the form fields
                        this.newDish = { id: '', name: '', price: '', image: '', type: '' };
                    } else {
                        alert('Failed to add dish: ' + response.data.msg);
                    }
                })
                .catch(error => {
                    alert('Failed to add dish: ' + error.message);
                });
        },
        deleteDish: function (index) {
            const dishIdToDelete = this.menu[index].meal_id;

            // 发送 DELETE 请求以删除菜品
            axios.post('http://127.0.0.1:4523/m1/3485186-0-default/staff/menu/delete', {
                data: {
                    meal_id: dishIdToDelete
                }
            })
                .then(response => {
                    if (response.data.code === 1000) {
                        // 如果请求成功，从菜单中移除被删除的菜品
                        this.menu.splice(index, 1);
                    } else {
                        alert('删除菜品失败: ' + response.data.msg);
                    }
                })
                .catch(error => {
                    alert('删除菜品失败: ' + error.message);
                });
        },
        editDish: function (index) {
            const dishToEdit = { ...this.menu[index] };

            // 弹出输入框，允许用户输入新的价格
            const newPrice = prompt('请输入新的价格', dishToEdit.meal_price);

            // 如果用户点击取消或没有输入新的价格，不进行任何操作
            if (newPrice === null || newPrice.trim() === '') {
                return;
            }

            // 发送 POST 请求以更新菜品价格
            axios.post('http://127.0.0.1:4523/m1/3485186-0-default/staff/menu/update', {
                meal_id: dishToEdit.meal_id,
                new_price: parseFloat(newPrice)
            })
                .then(response => {
                    if (response.data.code === 1000) {
                        // 如果请求成功，更新本地的菜单价格
                        this.menu[index].meal_price = parseFloat(newPrice);
                    } else {
                        alert('编辑菜品价格失败: ' + response.data.msg);
                    }
                })
                .catch(error => {
                    alert('编辑菜品价格失败: ' + error.message);
                });
        },
        fetchSales: function () {
            axios.get('http://127.0.0.1:4523/m1/3485186-0-default/staff/order')
                .then(response => {
                    if (response.data.code === 1000) {
                        this.sales = response.data.data;
                    } else {
                        alert('Failed to fetch sales data: ' + response.data.msg);
                    }
                })
                .catch(error => {
                    alert('Failed to fetch sales data: ' + error.message);
                });

        },
        fetchOrders: function () {
            axios.get('http://127.0.0.1:4523/m1/3485186-0-default/delivery/order')
                .then(response => {
                    if (response.data.code === 1000) {
                        // 筛选出 status 值为 1 的订单
                        this.orders = response.data.data.filter(order => order.status === 1);
                    } else {
                        alert('Failed to fetch orders data: ' + response.data.msg);
                    }
                })
                .catch(error => {
                    alert('Failed to fetch orders data: ' + error.message);
                });
        },
        acceptOrder: function (orderId) {
            axios.post('http://127.0.0.1:4523/m1/3485186-0-default/staff/accept', {
                order_id: orderId
            })
                .then(response => {
                    if (response.data.code === 1000) {
                        
                        alert('订单接受成功');

                        // 如果需要更新订单状态，可以调用 fetchOrders 方法刷新订单列表
                        this.fetchOrders();
                    } else {
                        alert('Failed to accept order: ' + response.data.msg);
                    }
                })
                .catch(error => {
                    alert('Failed to accept order: ' + error.message);
                });
        },
      

    }
});
