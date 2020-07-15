<template>
	<view>
		<cu-header :isBack="true">
			<block slot="content">搜狗账号注册</block>
		</cu-header>
		<view class="cu-form-group">
			<view class="title">选择游戏</view>
			<picker @change="gameChange" :value="game" :range="games" :range-key="'name'">
				<view class="picker">
					{{game}}
				</view>
			</picker>
		</view>
		<view class="cu-form-group margin-top">
			<view class="title">游戏账号</view>
			<input class="uni-input" v-model="username" placeholder="请输入注册账号" />
			<input class="uni-input" v-model="postfix" disabled />
		</view>
		<view class="cu-form-group">
			<view class="title">设置密码</view>
			<input class="uni-input" type="password" v-model="password" placeholder="请输入密码" />
		</view>
		<view class="cu-bar bg-white tabbar border shop">
			<view class="bg-red submit" @click="register()">立即注册</view>
		</view>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				game:'请选择游戏',
				gid:'',
				games:"",
				username:'',
				password:'',
				postfix:'@sougou.com'
				
			};
		},
		created() {
			this.getGames()
		},
		methods: {
			gameChange(e) {
				 this.game = this.games[e.detail.value].name
				 this.gid = this.games[e.detail.value].gid
			},
			register() {
				
				let data = {
					gid:this.gid,
					username:this.username+this.postfix,
					password:this.password,
					name:this.game
				}
				console.log(data)
				this.$http.post(process.env.API + '/v1/recharge/souGou/register',data).then(res => {
					if (res.data.code != 200) {
						uni.showToast({
						    icon: 'none',
							position: 'bottom',
						    title: res.data.message
						});
						return
					}
					uni.showToast({
					    icon: 'success',
						position: 'bottom',
					    title: res.data.message
					});
				
				})
				.catch(err => {
					//console.log(err);
				});
			},
			getGames(){
				this.$http.get(process.env.API + '/v1/recharge/souGou/game').then(res => {
					if (res.data.code != 200) {
						uni.showToast({
						    icon: 'none',
							position: 'bottom',
						    title: res.data.message
						});
						return
					}
					this.games = res.data.data.data
					console.log(this.games)
				})
				.catch(err => {
					//console.log(err);
				});
			}
		}
	}
</script>

<style>
	@import "../../../colorui/animation.css";
	
	.box {
		display: flex;
		align-items: center;
		justify-content: center;
		height: 100px;
	}
	.shop {
		position: absolute;
		bottom: 0;
		width: 100%;
	}
	.check {
		font-size: 2.5vh;
	}
	.money {
		width:60%;
	}
	.submit {
		width:40%;
	}
	.content .title {
		height: 6vh;
		line-height: 6vh;
		margin:0 1vh;
	}
	.n-picker {
		font-size: 2vh;
	}
	.cu-form-group {
		position: relative;
	}
	.buy-num {
		width: 13vh;
		align-items: center;
	}
	.buy-num .uni-input {
		width: 2vh;
		text-align: center;
		padding-right: 0;
	}
	.num {
		background: #f8f8f8;
		font-size: 3vh;
		width: 4vh;
		text-align: center;
		height: 4vh;
		line-height: 4vh;
	}
</style>
