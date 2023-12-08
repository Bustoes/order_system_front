new Vue({
    el:"#app",
    data(){
        return {
            is_sysorders_table_visiable : false,
            is_myorders_table_visiable : false,
            sysorders_table_data : [],
            myorders_table_data: [],
            radio:'',
            order_data:{order_id:' '}
        }
    },
    methods:{
        close_alltable(){
            this.is_sysorders_table_visiable = false,
            this.is_myorders_table_visiable = false
        },
        show_sysorders(){
            this.close_alltable();
            this.is_sysorders_table_visiable = true;
            axios.get("http://127.0.0.1:4523/m1/3485186-0-default/delivery/order")
            .then(response =>{
                if(response.data.code===1000){
                const data = response.data.data;
                console.log(data);
                this.sysorders_table_data = data.map(order => {
                    const dateObject = new Date(order.deliver_time);
                    const formattedDate = dateObject.toLocaleString();
                    return {
                        order_id : order.order_id,
                        deliver_time: formattedDate,
                        destination: order.destination,
                    };
                });
            }
                else if(response.data.code===5000){
                    this.$message({message :"出错了",type:"error"})
                    console.error(error);
                    // 处理错误
                }
            })
            .catch(error => {
                this.$message({message :"出错了",type:"error"})
                console.error(error);
                // 处理错误
                });
        },



        getCurrentRow(val) {
            this.order_data = val;
        },

        accept_order(){
            console.log(this.order_data);
            const order_id = this.order_data.order_id;
            console.log(order_id);
            axios.post("http://127.0.0.1:4523/m1/3485186-0-default/delivery/order/{order_id}")
            .then(response =>{
            if(response.data.code===1000){
                const data = response.data.msg;
                console.log(data);
                this.$message({message:"成功接单",type:"success"})
            }
            else if(response.data.code===5000){
                console.log(error)
                this.$message({message :"出错了",type:"error"})
            }
            })
            .catch(error=>{
                console.log(error)
                this.$message({message :"出错了",type:"error"})
            })
        },

        show_myorders(){
            this.close_alltable();
            this.is_myorders_table_visiable = true;
            axios.get("http://127.0.0.1:4523/m1/3485186-0-default/delivery/myorder")
            .then(response => {
            if(response.data.code===1000){                
                const myorder_data = response.data.data;
                console.log(myorder_data);
                this.myorders_table_data = myorder_data.map(order =>{
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
                        deliver_id:order.deliver_id,
                        deliver_time:formattedDate,
                        order_price:order.order_price,
                        order_comment:order.order_comment,
                        order_id:order.order_id,
                        status:statusMapping[order.status],
                        destination:order.destination
                    }
                })
            }
            else if(response.data.code===5000){
                console.log(error);
                this.$message({message :"出错了",type:"error"})
            }
            })
            .catch(error =>{
                console.log(error);
                this.$message({message :"出错了",type:"error"})
            })
        },
        commit_delivery(row){
            const order_id = row.order_id;
            console.log(order_id);
            axios.post("http://127.0.0.1:4523/m1/3485186-0-default/delivery/delivery/{order_id}")
            .then(response =>{
                if(response.data.code===1000){
                const data = response.data.msg;
                console.log(data);
                this.$message({message:"成功送达",type:"success"})
                }
                else if(response.data.code===5000){
                    console.log(error)
                    this.$message({message :"出错了",type:"error"})
                }
            })
            .catch(error=>{
                console.log(error)
                this.$message({message :"出错了",type:"error"})
            })
        }
    }
})