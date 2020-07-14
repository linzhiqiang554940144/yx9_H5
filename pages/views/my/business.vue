<template>
	<view>
		<cu-header :isBack="true" bgColor="bg-white">
			<block slot="backText"></block>
			<block slot="content">我的商务币</block>
			<block slot="right">
				<navigator hover-class='none' class="padding-right-xl text-lx" :url="'/pages/views/my/bill?type=business'" navigateTo>
					<text class="text-lx">明细</text>
				</navigator>
			</block>
		</cu-header>
		<view>
			<view class="main bg-white text-center">
				<view class="content">
					<view class="text-lg">商务币余额</view>
					<view class="text-sl">{{money}}</view>
				</view>
			</view>
		</view>
		<view class="text-center no-reg">暂不支持线上充值、提现，若有需要请联系客服。</view>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				money:"0"
			};
		},
		created() {
			this.initData()
		},
		methods: {
			initData() {
				this.$http.get(process.env.USER_API + '/v1/personal/user/info').then(res => {
					if (res.data.code != 200) {
						uni.showToast({
						    icon: 'none',
							position: 'bottom',
						    title: res.data.message
						});
						return
					}
					this.money = this.formatMoney(res.data.data.data.shangwubi)
				})
				.catch(err => {
					//console.log(err);
				});
			}
		}
	}
</script>

<style>
	.main {
		height: 21vh;
		display: flex;
		align-items: center;
		justify-content: center;
	}
	.no-reg {
		position: absolute;
		bottom: 2vh;
		left: 0;
		right:0;
	}
</style>
