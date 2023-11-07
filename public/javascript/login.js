import axiosObj from "../../component/interceptor.js";

new Vue({
    el: "#app",
    data: function() {
        return {
            account: "",
            password: ""
        }
    },
    methods: {
        login() {
            const _this = this
            axiosObj({
                method: "post",
                url: "/login",
                data: {
                    account: _this.account,
                    password: _this.password
                }
            }).then(function(result) {
                if (result.data.code === 1000) {
                    _this.$message.success("登陆成功")
                    localStorage.setItem("token", JSON.stringify(result.data.data.token))
                    console.log(result.data.data.token)
                    setTimeout(function() {
                        // 在三秒后执行页面跳转
                        window.location.assign("/user/demo")
                    }, 1000);
                } else {
                    _this.$message.error(result.data.msg)
                }
            }).catch(function(err) {

            })
        },
        u_register() {
            window.location.replace('/register')
        }
    }
})