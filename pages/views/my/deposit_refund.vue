<template>
	<view class="bg-main">
		<cu-header :isBack="true" :bgColor="bgColor">
			<block slot="backText"></block>
			<block slot="content">押金退还</block>
		</cu-header>
		<view>
			<view class="bg-white padding-left-sm padding-top-xl padding-bottom-xl margin-top-xs">
				<view class="content flex">
					<view class="text-lg">当前押金 4000</view>
					<text class="bg-gray padding-xs margin-left-sm round text-sm">6级</text>
				</view>
			</view>
			<view class="bg-white padding-sm padding-top-xs padding-bottom-xs">
				<view class="content flex">
					<view class="text-lg">选择你的目标等级</view>
				</view>
				<view class="cu-list grid margin-top">
					<view @click="checkItem(index)" class="cu-item" :class="index > 5 ? 'bg-gray':''" v-for="(item,index) in 7" :key="index" >
						<view :class="thisIndex == index ? 'text-blue':''">{{index}}</view><view v-show="thisIndex == index" class="lg text-blue cuIcon-playfill"></view>
					</view>
				</view>
			</view>
			<view class="padding-sm flex justify-between bg-white">
				<view class="title">将退还押金</view>
				<view class="title">0</view>
			</view>
			<view class="padding-sm flex justify-end bg-white">
				<view class="title">当前久币余额 1500.68</view>
			</view>
			<view class="padding">
				<button class="cu-btn block bg-blue margin-tb-sm lg" disabled type="">提交</button>
				<button class="cu-btn block line-blue margin-tb-sm lg" disabled>提交</button>
			</view>
		</view>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				bgColor:"bg-white",
				thisIndex:-1
			};
		},
		created() {
			uni.$on('changeOpen',(e)=>{
				this.payOpen = e
			})
		},
		methods: {
			checkItem(e) {
				this.thisIndex = e
			}
		}
	}
</script>

<style>
	.cu-item {
		width:14%;
		border : 0.1vh solid rgba(0, 0, 0, .1);
		margin-right: 0.1vh;
	}
	.cuIcon-playfill {
		transform:rotate(270deg);
		-ms-transform:rotate(270deg);
		-moz-transform:rotate(270deg);
		-webkit-transform:rotate(270deg);
		-o-transform:rotate(270deg);
		position: absolute!important;
		top: 4.2vh;
		font-size: 1.5vh!important;
	}
	.bg-main {
		background: #ffffff;
		width: 100%;
		height: 100%;
		position: absolute;
	}
</style>
