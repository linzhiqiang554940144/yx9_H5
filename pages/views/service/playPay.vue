<template>
	<view>
		<cu-header :isBack="true"><block slot="backText">返回</block><block slot="content">玩家充值</block></cu-header>
		<view class="cu-form-group">
			<view class="title">游戏平台</view>
			<picker @change="platformChange" :value="platform">
				<view class="picker">
					{{platform}}
				</view>
			</picker>
		</view>
		<view class="cu-form-group">
			<view class="title">渠道号</view>
			<picker @change="chennalChange" :value="chennal">
				<view class="picker">
					{{chennal}}
				</view>
			</picker>
		</view>
		<view class="cu-form-group">
			<view class="title">游戏</view>
			<picker @change="gameChange" :value="game">
				<view class="picker">
					{{game}}
				</view>
			</picker>
		</view>
		<view class="cu-form-group">
			<view class="title">充值账号</view>
			<input class="uni-input" placeholder="请输入充值账号" />
		</view>
		<view class="cu-form-group">
			<view class="title">充值金额</view>
			<input class="uni-input" placeholder="请输入充值金额" />
		</view>
		<view class="cu-form-group margin-top">
			<view class="title">久币支付(余额:121515.0)</view>
			<view class="title"><checkbox class="round checked" checked="true" value="B"></checkbox></view>
		</view>
		<view class="cu-form-group">
			<view class="title">商务币支付(余额:)</view>
			<view class="title"></view>
		</view>
		<view class="cu-form-group margin-top">
			<view class="title">平台折扣</view>
			<view class="title text-red">9.7折</view>
		</view>
		<view class="cu-form-group">
			<view class="title">游戏折扣</view>
			<view class="title text-red">9.7折</view>
		</view>
		<view class="cu-bar bg-white tabbar border shop">
			<view class="money align-center justify-start flex margin-left">实付金额:<view class="red">0</view></view>
			<view class="bg-red submit" @click="toPay()">立即支付</view>
		</view>
		<pay :open="payOpen"></pay>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				platform:'请选择游戏平台',
				chennal:'请选择渠道号',
				game:'请选择游戏',
				payOpen:false,
			};
		},
		created() {
			uni.$on('changeOpen',(e)=>{
				this.payOpen = e
			})
		},
		methods: {
			platformChange(e) {
				this.platform = e.detail.value
			},
			chennalChange(e) {
				this.chennal = e.detail.value
			},
			gameChange(e) {
				this.game = e.detail.value
			},
			toPay() {
				this.payOpen = true
			}
		}
	}
</script>

<style>
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
</style>
