<template>
	<view>
		<cu-header :isBack="true">
			<block slot="content">搜狗账号注册</block>
		</cu-header>
		<view class="cu-form-group">
			<view class="title">选择游戏</view>
			<picker @change="platformChange" :value="platform">
				<view class="picker">
					{{platform}}
				</view>
			</picker>
		</view>
		<view class="cu-form-group margin-top">
			<view class="title">游戏账号</view>
			<input class="uni-input" placeholder="请输入注册游戏账号" />
		</view>
		<view class="cu-form-group">
			<view class="title">设置密码</view>
			<input class="uni-input" type="password" placeholder="请输入密码" />
		</view>
		<view class="cu-bar bg-white tabbar border shop">
			<view class="bg-red submit" @click="toPay()">立即注册</view>
		</view>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				platform:'请选择游戏',
				mid:'100',
			};
		},
		created() {
			
		},
		methods: {
			platformChange(e) {
				this.platform = e.detail.value
			},
			toPay() {
				
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
