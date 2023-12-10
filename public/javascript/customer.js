import axiosObj from "../../component/interceptor.js";

new Vue({
    el: "#app",
    data() {
        return {
            is_menu_table_visiable: false,
            is_order_table_visiable: false,
            hasSelection: false,
            menu_table_data: [],
            order_table_data: [],
            destination: ""
        }
    },
    methods: {
        close_all_table() {
            this.is_menu_table_visiable = false;
            this.is_order_table_visiable = false;
        },
        show_menu() {
            this.close_all_table();
            axiosObj.get("http://localhost:9900/customer/menu")
                .then(response => {
                    if (response.data.code === 1000) {
                        const menu_data = response.data.data;
                        console.log(response.data);
                        this.menu_table_data = menu_data.map(menu => {
                            return {
                                meal_id: menu.meal_id,
                                meal_name: menu.meal_name,
                                price: menu.meal_price,
                                imagine: menu.image_path,
                                type: menu.type,
                                sales: menu.sales,
                            };
                        });
                        this.is_menu_table_visiable = true;
                    } else {
                        this.$message.error(response.data.msg)
                    }
                })
                .catch(error => {
                    this.$message.error(error.msg);
                    console.error(error);
                    // 处理错误
                });

        },


        handleSelectionChange(selection) {
            // 判断是否选择了至少一项
            this.hasSelection = selection.length > 0;
        },
        make_order() {
            const selectedFoods = this.$refs.menu_table.selection;
            const orderData = {
                "destination": this.destination,
                "meals": selectedFoods.map(food => {
                    return food.meal_id;
                }),
            };
            console.log(orderData);
            axiosObj.post("http://localhost:9900/customer/order", orderData)
                .then(response => {
                    // 处理后端响应
                    if (response.data.code === 1000) {
                        console.log(response.data);
                        this.$message.success("外卖订单已成功提交")
                        setTimeout(function() {
                            location.reload()
                        }, 1000);
                    } else {
                        this.$message.error(response.data.msg)
                    }
                })
                .catch(error => {
                    console.error(error);
                    // 处理错误
                    this.$message({message: "出错了", type: "error"})
                });
        },

        show_myorders() {
            this.close_all_table();
            axiosObj
                .get("http://localhost:9900/customer/order")
                .then((response) => {
                    if (response.data.code === 1000) {
                        const order_data = response.data.data;
                        console.log(order_data);
                        this.order_table_data = order_data.map((order) => {
                            const meals_name2 = order.menus.map((meal) => meal.meal_name).join(', ');
                            const dateObject = new Date(order.deliver_time);
                            const formattedDate = dateObject.toLocaleString();
                            const statusMapping = {
                                1: "订单已创建(师傅正在炒菜)",
                                2: "菜品已经出餐(正在等待配送)",
                                3: "订单正在配送(外卖小哥取到餐了)",
                                4: "订单已经送达(您还没有评论)",
                                5: "订单已经送达且完成评论"
                                // 添加其他映射项
                            };
                            return {
                                order_id: order.order_id,
                                status: statusMapping[order.status],
                                deliver_id: order.deliver_id,
                                deliver_time: formattedDate,
                                destination: order.destination,
                                order_price: order.order_price,
                                order_comment: order.order_comment,
                                meals_name: meals_name2,
                            };
                        });
                    } else {
                        this.$message.error(response.data.msg)
                    }
                })
                .catch((error) => {
                    this.$message({message: "出错了", type: "error"})
                    console.error(error);
                    // 处理错误
                });
            this.is_order_table_visiable = true;
        },
        delete_order(row) {
            const selected_order_id = row.order_id;
            axiosObj.delete('http://localhost:9900/customer/order/' + selected_order_id)
                .then(response => {
                    if (response.data.code === 1000) {
                        console.log("Order deleted successfully:", response.data);
                        this.$message.success('删除成功');
                    } else {
                        this.$message.error(response.data.msg)
                    }
                })
                .then(() => {
                    this.show_myorders();
                })
                .catch(error => {
                    console.error("Error deleting order:", error);
                    this.$message({message: "删除失败", type: "error"})
                });
        },


        edit_comment(row) {
            this.$prompt('请输入评论', '提示', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
            })
                .then(({value}) => {
                    const comment_data = {
                        "order_comment": value,
                        "order_id": row.order_id
                    };

                    console.log(comment_data);

                    axiosObj.post('http://localhost:9900/customer/order/comment', comment_data)
                        .then(response => {
                            if (response.data.code === 1500 || response.data.code === 1501) {
                                console.log("订单评论成功：", response.data);

                                // 将成功消息移到这里
                                this.$message.success("评论成功");

                                this.show_myorders()
                            } else {
                                this.$message.error(response.data.msg)
                            }
                        })
                        .catch(() => {
                            console.log(row.order_id);
                            this.$message({message: "编辑失败", type: "error"})
                        });
                });
        },


        filterTag(value, row) {
            return row.type === value;
        },

    }
})