<template>
	<view>
		<cu-header :isBack="true">
			<block slot="backText"></block>
			<block slot="content">魅族充值</block>
		</cu-header>
		<view class="cu-form-group">
			<view class="title">充值面额</view>
			<view class="n-picker margin-right-sm" @click="openMid()">
				{{mid}}
				<text class="lg text-gray cuIcon-right"></text>
			</view>
		</view>
		<view class="cu-form-group">
			<view class="title">购买数量</view>
			<view class="title flex buy-num">
				<text class="lg num text-gray cuIcon-move" @click="handNum(-1)"></text>
				<input type="number" disabled class="text uni-input" v-model="num" placeholder="0" />
				<text class="lg num text-gray cuIcon-add" @click="handNum(1)"></text>
			</view>
		</view>
		<view class="cu-form-group">
			<view class="title">充值账号</view>
			<input class="uni-input" placeholder="请输入充值账号" />
		</view>
		<view class="cu-form-group">
			<view class="title">账号密码</view>
			<input class="uni-input" type="password" placeholder="请输入账号密码" />
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
			<view class="title">充值折扣</view>
			<view class="title text-red">9.7折</view>
		</view>
		<view class="cu-form-group margin-top text-red">
			备注：最小充值数量为2
		</view>
		<view class="cu-bar bg-white tabbar border shop">
			<view class="money align-center justify-start flex margin-left">实付金额:<view class="red">0</view></view>
			<view class="bg-red submit" @click="toPay()">立即支付</view>
		</view>
		<view class="cu-modal bottom-modal" :class="midOpen?'show':''" @tap="hideModal">
			<view class="cu-dialog" @tap.stop="">
				<view class="cu-bar bg-white">
					<view class="action text-blue" @tap="hideModal">取消</view>
					<view class="action text-green" @tap="hideModal">确定</view>
				</view>
				<view class="grid col-3 padding-sm">
					<view v-for="(item,index) in checkbox" class="padding-xs" :key="index">
						<button class="cu-btn orange lg block" :class="item.checked?'bg-orange':'line-orange'" @tap="chooseCheckbox"
						 :data-value="item.value"> {{item.name}}
							<view class="cu-tag sm round" :class="item.checked?'bg-white text-orange':'bg-orange'" v-if="item.hot">HOT</view>
						</button>
					</view>
				</view>
			</view>
		</view>
		<pay :open="payOpen"></pay>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				mid:'100',
				num:2,
				payOpen:false,
				midOpen:false,
				checkbox: [{
					value: 0,
					name: '10元',
					checked: false,
					hot: false,
				}, {
					value: 1,
					name: '20元',
					checked: true,
					hot: false,
				}, {
					value: 2,
					name: '30元',
					checked: true,
					hot: true,
				}, {
					value: 3,
					name: '60元',
					checked: false,
					hot: true,
				}, {
					value: 4,
					name: '80元',
					checked: false,
					hot: false,
				}, {
					value: 5,
					name: '100元',
					checked: false,
					hot: false,
				}]
			};
		},
		created() {
			uni.$on('changeOpen',(e)=>{
				this.payOpen = e
			})
		},
		methods: {
			openMid() {
				this.midOpen = true
			},
			hideModal() {
				this.midOpen = false
			},
			toPay() {
				this.payOpen = true
			},
			chooseCheckbox(e) {
				let items = this.checkbox;
				let values = e.currentTarget.dataset.value;
				for (let i = 0, lenI = items.length; i < lenI; ++i) {
					if (items[i].value == values) {
						items[i].checked = !items[i].checked;
						break
					}
				}
			},
			handNum(e) {
				if (e < 0 && this.num <= 2) {
					return
				}
				this.num += e
			}
		}
	}
</script>

<style>
	@import "../../../colorui/animation.css";
	
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
	.check {
		font-size: 2.5vh;
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
	.n-picker {
		font-size: 2vh;
	}
	.cu-form-group {
		position: relative;
	}
	.buy-num {
		width: 13vh;
		align-items: center;
	}
	.buy-num .uni-input {
		width: 2vh;
		text-align: center;
		padding-right: 0;
	}
	.num {
		background: #f8f8f8;
		font-size: 3vh;
		width: 4vh;
		text-align: center;
		height: 4vh;
		line-height: 4vh;
	}
</style>
