<template>
	<view>
		<cu-header :isBack="true" :bgColor="bgColor">
			<block slot="backText"></block>
			<block slot="content">久币充值</block>
			<block slot="right">
				<navigator hover-class='none' class="padding-right-sm text-lx" :url="'/pages/views/my/money_unreg'" navigateTo>
					<text class="text-lx">充值未到账？</text>
				</navigator>
			</block>
		</cu-header>
		<view>
			<view class="cu-form-group margin-top-sm bg-white padding-top-xl padding-bottom-xl solid-bottom">
				<view class="text-df">支付宝收款账号:<text class="text-df">admin@youxi9.com</text></view>
				<view class="text-df  text-blue" @click="copy()">复制</view>
			</view>
			<view class="padding-left bg-white padding-top-xl padding-bottom">
				<view class="text-df"><text class="text-orange padding-right-sm cuIcon-info"></text class="text-xl">充值须知</view>
				<view class="text-df padding-top-sm">1、务必在备注上填写手机号码</view>
				<view class="text-df padding-top-sm">2、请勿使用花呗支付</view>
			</view>
		</view>
		<view class="text-center no-recharge">支付成功后，通常3分钟内到账，请耐心等待！</view>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				bgColor:"bg-white"
			};
		},
		created() {
			uni.$on('changeOpen',(e)=>{
				this.payOpen = e
			})
		},
		methods: {
			copy() {
				uni.setClipboardData({
				    data: 'admin@youxi9.com',
				    success: function () {
				        console.log('success');
				    }
				});
			}
		}
	}
</script>

<style>
	.no-recharge {
		position: absolute;
		bottom: 2vh;
		left: 0;
		right:0;
	}
</style>
