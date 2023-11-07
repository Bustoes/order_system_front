import axiosObj from "../../component/interceptor.js";

new Vue({
    el: "#app",
    data: function() {
        return {
            user_name: "",
            identity: "",
            account: "",
            password: "",
            options: [{
                value: 1,
                label: "顾客"
            }, {
                value: 2,
                label: "餐厅员工"
            }, {
                value: 3,
                label: "送餐员"
            }]
        }
    },
    methods: {
        u_register() {
            const _this = this
            axiosObj({
                method: "post",
                url: "/register",
                data: {
                    user_name: _this.user_name,
                    identity: _this.identity,
                    account: _this.account,
                    password: _this.password
                }
            }).then(function(result) {
                if (result.data.code === 1000) {
                    _this.$message.success("注册成功")
                    window.location.assign("/login")
                } else {
                    _this.$message.error(result.data.msg)
                }
            }).catch(function(err) {
            })
        },
        login() {
            window.location.replace("/login")
        }
    }
})