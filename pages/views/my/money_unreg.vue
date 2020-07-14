<template>
	<view>
		<cu-header :isBack="true" bgColor="bg-white">
			<block slot="backText"></block>
			<block slot="content">手动补单</block>
		</cu-header>
		<view>
			<view class="padding text-center">
				<view>本操作只用于扫码生成的订单，若你是通过转账生成的订单，请联系客服。</view>
			</view>
			<view class="bg-white">
				<view class="margin-top-sm cu-form-group ">
					<input type="text" v-model="order" focus placeholder="请输入订单号"></input>
					<button class="cu-btn text-blue" @click="apply()">提交</button>
				</view>
				<view class="cu-form-group">
					<view class="text-sm">提交成功后，通常3分钟内到账，若长时间未到账，请联系客服.</view>
				</view>
				<view class="padding-left padding-top-xl padding-bottom">
					<view class="text-df"><text class="text-orange padding-right-sm cuIcon-info"></text class="text-xl">操作步骤</view>
					<view class="text-df padding-top-sm">1、打开支付宝，选择 我的 - 账单</view>
					<view class="text-df padding-top-sm">2、点开充值久币的订单</view>
					<view class="text-df padding-top-sm">3、将此订单号输入到上方输入框内</view>
				</view>
			</view>
		</view>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				order:""
			};
		},
		created() {
			
		},
		methods: {
			apply() {
				if (this.order == "") {
					uni.showToast({
					    icon: 'none',
						position: 'center',
					    title: "请输入订单号"
					});
					return;
				}
				uni.showLoading({
				    title: '补单中'
				})
				this.$http.post('/v1/recharge/coin',{no: this.order }).then(res => {
					uni.hideLoading();
					uni.showToast({
					    icon: res.data.code == 200 ? 'success' : 'none',
						position: 'center',
					    title: res.data.code == 200 ? '补单成功' : res.data.message
					});
					return;
				})
			}
		}
	}
</script>

<style>
</style>
