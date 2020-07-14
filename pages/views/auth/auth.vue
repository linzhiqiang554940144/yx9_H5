<template>
	<view>
		<cu-header :isBack="true" bgColor="bg-white">
			<block slot="content">认证</block>
		</cu-header>
		<view>
			<navigator hover-class='none' :url="'/pages/views/auth/persion'" navigateTo>
				<view>
					<image  class="item" src="../../../static/persion.png"></image>
				</view>
			</navigator>
			<view @click="checkBuiness">
				<image  class="item" src="../../../static/business.png"></image>
			</view>
		</view>
	</view>
</template>

<script>
	
	export default {
		data() {
			return {
				
			}
		},
		methods: {
			checkBuiness() {
				uni.showToast({
				    icon: 'none',
				 	position: 'center',
				    title: '手机端不支持企业认证，请移步到电脑端'
				});
			}
		}
	}
</script>

<style>
	/* #ifdef  APP-PLUS */
		.item {
			width: 100%;
			height: 650rpx;
		}
	/* #endif */
	/* #ifdef  H5 */
		.item {
			width: 100%;
			height: 600rpx;
		}
	/* #endif */
	
</style>
