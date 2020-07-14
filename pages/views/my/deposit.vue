<template>
	<view>
		<cu-header :isBack="true" :bgColor="bgColor">
			<block slot="backText"></block>
			<block slot="content">我的押金</block>
			<block slot="right">
				<navigator hover-class='none' class="padding-right-xl text-lx" :url="'/pages/views/my/deposit_bill'" navigateTo>
					<text class="text-lx">明细</text>
				</navigator>
			</block>
		</cu-header>
		<view>
			<view class="main bg-white text-center">
				<view class="content">
					<view class="text-lg">当前押金</view>
					<view class="text-sl">{{money}}</view>
					<button class="cu-btn round">{{level}}级</button>
				</view>
			</view>
			<navigator hover-class='none' class="margin-top-sm cu-form-group" :url="'/pages/views/my/deposit_payment'" navigateTo>
				<view class="title">缴纳</view>
				<text class="lg text-gray cuIcon-right"></text>
			</navigator>
			<navigator hover-class='none' class="cu-form-group" :url="'/pages/views/my/deposit_refund'" navigateTo>
				<view class="title">退还</view>
				<text class="lg text-gray cuIcon-right"></text>
			</navigator>
			
		</view>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				money:"0",
				level:""
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
					this.money = this.formatMoney(res.data.data.data.dongjie)
					this.level = res.data.data.data.level_id
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
</style>
