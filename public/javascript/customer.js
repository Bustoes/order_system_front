import axiosObj from "../../component/interceptor.js";
new Vue({
    el:"#app",
    data(){
        return {
            is_menu_table_visiable:false,
            is_order_table_visiable:false,
            menu_table_data:[],
            order_table_data:[],
            destination:""
        }
    },
    methods:{
        close_all_table(){
            this.is_menu_table_visiable = false;
            this.is_order_table_visiable = false;
        },
        show_menu(){
            this.close_all_table();
            axios.get("http://127.0.0.1:4523/m1/3485186-0-default/customer/menu")
            .then(response=>{
                const menu_data = response.data.data;
                console.log(menu_data);
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
            })
            .catch(error => {
                alert(error.msg);
                console.error(error);
                // 处理错误
                });

        },
        make_order(){
            const selectedFoods = this.$refs.menu_table.selection;
            const orderData = {
                address: this.destination,
                foods: selectedFoods.map(food => ({
                    meal_name: food.meal_name,
                })),
            };
            console.log(orderData);
            alert("外卖订单已成功提交")
            // 发送订单数据到后端
            // axios.post("http://your-backend-url/create_order", orderData)
            //     .then(response => {
            //         // 处理后端响应
            //         console.log(response.data);
            //     })
            //     .catch(error => {
            //         console.error(error);
            //         // 处理错误
            //     });
        },

        show_myorders() {
            this.close_all_table();
            axios
              .get("http://127.0.0.1:4523/m1/3485186-0-default/customer/order")
              .then((response) => {
                const order_data = response.data.data;
                console.log(order_data);
                this.order_table_data = order_data.map((order) => {
                const meals_name2 = order.menus.map((meal) => meal.meal_name).join(', ');
                const dateObject = new Date(order.deliver_time);
                const formattedDate = dateObject.toLocaleString();
                  return {
                    order_id: order.order_id,
                    status: order.status,
                    deliver_id: order.deliver_id,
                    deliver_time: formattedDate,
                    destination: order.destination,
                    order_price: order.order_price,
                    order_comment: order.comment,
                    meals_name: meals_name2,
                  };
                });
              })
              .catch((error) => {
                alert(error.msg);
                console.error(error);
                // 处理错误
              });
              this.is_order_table_visiable = true;
          },

        delete_order(index, row){
            const selected_order_id = row.order_id;
            axios.delete('http://127.0.0.1:4523/m1/3485186-0-default/customer/order/1')
            .then(response => {
              console.log("Order deleted successfully:", response.data);
            })
            .catch(error => {
              console.error("Error deleting order:", error);
            });
        },
        filterTag(value, row) {
            return row.type === value;
          },
        
    }
})