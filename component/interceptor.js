// 创建一个新的axios对象
export const axiosObj = axios.create({
    baseURL: "http://localhost:9900",
    timeout: 30000
})

// request拦截器
axiosObj.interceptors.request.use(function(config) {
    let token = JSON.parse(localStorage.getItem("token") || "{}");
    console.log("request interceptor");
    config.headers["token"] = token;    // 设置请求头
    return config;
}, function(error) {
    console.log("request error in interceptor :" + error)
    return Promise.reject(error)
})

// response拦截器
axiosObj.interceptors.response.use(function(response) {
    let res = response.data;
    console.log("response interceptor");

    if (typeof res === "string") {
        res = res ? JSON.parse(res) : res
    }

    if (res.code === 2001) {
        window.location.replace("/login")
    }

    return response
}, function(error) {
    console.log("request error in interceptor :" + error)
    return Promise.reject(error)
})