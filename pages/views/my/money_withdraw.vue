<template>
	<view>
		<cu-header :isBack="true" :bgColor="bgColor">
			<block slot="backText"></block>
			<block slot="content">久币提现</block>
		</cu-header>
		<view>
			<view class="cu-form-group margin-top-xs">
				<text class="title">久币余额</text>
				<text class="text">1163.8</text>
			</view>
			<view class="cu-form-group">
				<view class="title">提现金额</view>
				<input class="uni-input" focus placeholder="请输入提现金额" />
			</view>
			<view class="cu-form-group margin-top-xs">
				<text class="text text-lg"><text class="cuIcon-info text-red text-xxl padding-right-sm"></text>选择提现方式</text>
			</view>
			<view class="cu-form-group">
				<view class="title">支付宝</view>
				<view class="title"><checkbox class="round checked" checked="true" value="B"></checkbox></view>
			</view>
			<view class="cu-form-group">
				<view class="title">银行卡</view>
				<view class="title"></view>
			</view>
			<view class="cu-form-group margin-top-xs">
				<view class="title">提现账号</view>
				<picker @change="accountChange" :value="account">
					<view class="picker">
						{{account}}
					</view>
				</picker>
			</view>
		</view>
		
	</view>
</template>

<script>
	export default {
		data() {
			return {
				bgColor:"bg-white",
				account:"请选择提现账号"
			};
		},
		created() {
			uni.$on('changeOpen',(e)=>{
				this.payOpen = e
			})
		},
		methods: {
			accountChange(e) {
				this.account = e.detail.value
			},
		}
	}
</script>

<style>
</style>
