import Request from '@/utils/luch-request/index.js'
//import Request from 'luch-request'

const http = new Request()
http.setConfig((config) => {
  config.baseURL = process.env.API
  return config
})


http.interceptors.request.use((config) => { /* 请求之前拦截器。可以使用async await 做异步操作 */
	config.header = {
	 'Content-Type':'application/x-www-form-urlencoded;charset=UTF-8',
	 // #ifdef  APP-PLUS
	 'Environment':'1',
	 // #endif
	}
	try {
		let token = uni.getStorageSync('token')
		if (token) {
			config.header['X9-Token'] = token
		}
	  } catch (e) {
		  console.log(e)
	  }
	  return config
	}, (config) => {
		console.log(config)
	  return Promise.reject(config)
	})

// 必须使用异步函数，注意
http.interceptors.response.use(async (response) => { /* 请求之后拦截器。可以使用async await 做异步操作  */
	if (response.data.code == 11010 || response.data.code == 11005) {
		uni.clearStorageSync();
		uni.reLaunch({
		    url: '/pages/views/login/login',
			
		});
	}

 //  if (response.data.code !== 200) { // 服务端返回的状态码不等于200，则reject()
	
 //    return Promise.reject(response)
 //  }
  return response
}, (response) => { // 请求错误做点什么。可以使用async await 做异步操作
  console.log(response)
  return Promise.reject(response)
})

export {
  http
}