export default {
	getUserInfo:async function(e) {  
	   let result = await e.$http.get(process.env.USER_API + '/v1/personal/user/info').then(res => {
			return res.data
	   })
	   return result
	}
}