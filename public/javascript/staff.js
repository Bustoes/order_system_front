import axiosObj from "../../component/interceptor.js";
new Vue({
    el: '#app',
    data: {
        newDish: { name: '', price: '', image: '', type: '' },
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
            axiosObj.get('http://localhost:9900/staff/menu')
                .then(response => {
                    if (response.data.code === 1000) {
                        this.menu = response.data.data;
                    } else {
                        this.$message.error(response.data.msg)
                    }
                })
                .catch(error => {
                    alert('Failed to fetch menu data: ' + error.message);
                });
        },
        addDish: function () {
            // Validate the new dish data before sending the request
            if (!this.newDish.name || !this.newDish.price || !this.newDish.type || !this.newDish.image) {
                alert('请将表单填写完整');
                return;
            }

            // Make a POST request to insert the new dish
            axiosObj.post('http://localhost:9900/staff/menu/insert', {
                meal_name: this.newDish.name,
                meal_price: this.newDish.price,
                type: this.newDish.type,
                image_path: this.newDish.image
            })
                .then(response => {
                    if (response.data.code === 1000) {
                        // If the request is successful, add the new dish to the menu
                        this.fetchMenu()
                        // Clear the form fields
                        this.newDish = { name: '', price: '', image: '', type: '' };
                        this.$message.success("添加成功")
                    } else {
                        this.$message.error(response.data.msg)
                    }
                })
                .catch(error => {
                    alert('Failed to add dish: ' + error.message);
                });
        },
        deleteDish: function (index) {
            const dishIdToDelete = this.menu[index].meal_id;

            // 发送请求以删除菜品
            axiosObj.post('http://localhost:9900/staff/menu/delete', {meal_id: dishIdToDelete})
                .then(response => {
                    if (response.data.code === 1000) {
                        // 如果请求成功，从菜单中移除被删除的菜品
                        this.$message.success("删除成功")
                        this.fetchMenu()
                    } else {
                        this.$message.error(response.data.msg)
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
            axiosObj.post('http://localhost:9900/staff/menu/update', {
                meal_id: dishToEdit.meal_id,
                new_price: parseFloat(newPrice)
            })
                .then(response => {
                    if (response.data.code === 1000) {
                        // 如果请求成功，更新本地的菜单价格
                        this.menu[index].meal_price = parseFloat(newPrice);
                        this.$message.success("更改成功")
                    } else {
                        this.$message.error(response.data.msg)
                    }
                })
                .catch(error => {
                    alert('编辑菜品价格失败: ' + error.message);
                });
        },
        fetchSales: function () {
            axiosObj.get('http://localhost:9900/staff/sale')
                .then(response => {
                    if (response.data.code === 1000) {
                        console.log(response.data.data)
                        this.sales = response.data.data;
                    } else {
                        this.$message.error(response.data.msg)
                    }
                })
                .catch(error => {
                    alert('Failed to fetch sales data: ' + error.message);
                });

        },
        fetchOrders: function () {
            axiosObj.get('http://localhost:9900/staff/order')
                .then(response => {
                    if (response.data.code === 1000) {
                        // 筛选出 status 值为 1 的订单
                        this.orders = response.data.data;
                    } else {
                        this.$message.error(response.data.msg)
                    }
                })
                .catch(error => {
                    alert('Failed to fetch orders data: ' + error.message);
                });
        },
        acceptOrder: function (orderId) {
            axiosObj.post('http://localhost:9900/staff/accept', {
                order_id: orderId
            })
                .then(response => {
                    if (response.data.code === 1000) {
                        
                        alert('订单接受成功');

                        // 如果需要更新订单状态，可以调用 fetchOrders 方法刷新订单列表
                        this.fetchOrders();
                    } else {
                        this.$message.error(response.data.msg)
                    }
                })
                .catch(error => {
                    alert('Failed to accept order: ' + error.message);
                });
        },
      

    }
});
