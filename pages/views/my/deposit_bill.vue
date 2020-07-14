<template>
	<view>
		<cu-header :isBack="true">
			<block slot="backText"></block>
			<block slot="content">押金明细</block>
		</cu-header>
		<view class="platform flex justify-between">
			<view class="platform-item" @click="orderOpen()">
				<text class="text-df">{{order}}</text>
				<text :class="orderKey ? 'cuIcon-fold' : 'cuIcon-unfold'"></text>
			</view>
			<view class="flex margin-right">
				<text class="cuIcon-time margin-right-sm"></text>
				<picker mode="date" :value="startTime" fields="second" @change="dateChangeStart">
					<view class="picker">
						{{startTime}}
					</view>
				</picker>
				<text class="margin-left-sm margin-right-sm">-</text>
				<picker mode="date" :value="endTime" fields="second" @change="dateChangeEnd">
					<view class="picker">
						{{endTime}}
					</view>
				</picker>
				<text class="lg text-gray padding-left-xl cuIcon-search"></text>
			</view>
			<view class="popup solid-bottom" v-show="orderKey">
				<view class="cell" v-for="val in picker">{{val}}</view>
			</view>
		</view>
		<view class="margin-top"></view>
		<view class="order-list solid-bottom">
			<view class="flex align-center justify-between">
				<view>
					<text class="text-xl margin-right-sm text-bold">押金退还</text>
					<text class="text-sm padding-xs solid margin-right-sm">4级</text>
				</view>
				<view><text class="text-lg">+3000</text></view>
			</view>
			<view class="flex align-center justify-between margin-top-sm">
				<text class="bg-gray padding-xs">2020-05-21 14:44:50</text>
				<text class="text-red">处理失败</text>
			</view>
		</view>
		<view class="order-list solid-bottom">
			<view class="flex align-center justify-between">
				<view>
					<text class="text-xl margin-right-sm text-bold">押金退还</text>
					<text class="text-sm padding-xs solid margin-right-sm">4级</text>
				</view>
				<view><text class="text-lg">+3000</text></view>
			</view>
			<view class="flex align-center justify-between margin-top-sm">
				<text class="bg-gray padding-xs">2020-05-21 14:44:50</text>
				<text class="text-red">处理失败</text>
			</view>
		</view>
		<view class="order-list solid-bottom">
			<view class="flex align-center justify-between">
				<view>
					<text class="text-xl margin-right-sm text-bold">押金退还</text>
					<text class="text-sm padding-xs solid margin-right-sm">4级</text>
				</view>
				<view><text class="text-lg">+3000</text></view>
			</view>
			<view class="flex align-center justify-between margin-top-sm">
				<text class="bg-gray padding-xs">2020-05-21 14:44:50</text>
				<text class="text-red">处理失败</text>
			</view>
		</view>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				orderKey:false,
				order:"订单类型",
				picker: ['全部', '缴纳押金', '押金退还','押金扣除'],
				searchBool:false,
				inputBottom:0,
				startTime: '开始时间',
				endTime:'结束时间',
			};
		},
		created() {
			
		},
		methods: {
			orderOpen(e) {
				this.orderKey = this.orderKey ? false : true
			},
			dateChangeStart(e) {
				this.startTime = e.detail.value
			},
			dateChangeEnd(e) {
				this.endTime = e.detail.value
			}
		}
	}
</script>

<style lang="less">
	.fold {
		height: 5vh;
		line-height: 5vh;
	}
	.order-list {
		background: #FFFFFF;
		padding:2vh;
	}
	.platform {
		height: 5vh;
		line-height: 5vh;
		background: #fff;
		font-size: 1.7vh;
		position: relative;
		.platform-item {
			height: 3.3vh;
			line-height: 3.3vh;
			margin: auto 3%;
			width: 25%;
			text-align: center;
			justify-content: space-around;
			display: flex;
		}
	}
	.popup {
		position: absolute;
		top: 5vh;
		z-index: 999;
		width: 100%;
		.cell {
			height: 5vh;
			line-height: 5vh;
			background-color: #fff;
			padding:0 2vh;
			font-size: 1.8vh;
			align-items: center;
			cursor: pointer;
			-webkit-transition: all .3s ease;
			transition: all .3s ease;
			border-top: 0.1vh solid #e5e5e5;
		}
	}
</style>
