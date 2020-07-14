<template>
	<view>
		<cu-header :isBack="true" bgColor="bg-white">
			<block slot="backText"></block>
			<block slot="content">我的久币</block>
			<block slot="right">
				<navigator hover-class='none' class="padding-right-xl text-lx" :url="'/pages/views/my/bill'" navigateTo>
					<text class="text-lx">明细</text>
				</navigator>
			</block>
		</cu-header>
		<view>
			<view class="main bg-white text-center">
				<view class="content">
					<view class="text-lg">久币余额</view>
					<view class="text-sl">{{money}}</view>
				</view>
			</view>
			<navigator hover-class='none' class="margin-top-sm cu-form-group" :url="'/pages/views/my/money_reg'" navigateTo>
				<view class="title">充值</view>
				<text class="lg text-gray cuIcon-right"></text>
			</navigator>
			<navigator hover-class='none' class="cu-form-group" :url="'/pages/views/my/money_withdraw'" navigateTo>
				<view class="title">提现</view>
				<text class="lg text-gray cuIcon-right"></text>
			</navigator>
			
		</view>
		<navigator hover-class='none' :url="'/pages/views/my/money_unreg'" navigateTo>
			<view class="text-center no-recharge">充值未到账?</view>
		</navigator>
		
	</view>
</template>

<script>
	export default {
		data() {
			return {
				money:""
			};
		},
		created() {
			uni.$on('changeOpen',(e)=>{
				this.payOpen = e
			})
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
					this.money = this.formatMoney(res.data.data.data.user_money)
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
	.no-recharge {
		position: absolute;
		bottom: 2vh;
		left: 0;
		right:0;
	}
</style>
