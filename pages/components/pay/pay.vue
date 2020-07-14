<template>
	<view >
		<view class="cu-modal" :class="open?'show':''">
			<view class="cu-dialog">
				<view class="cu-bar bg-white justify-end">
					<view class="content">支付密码</view>
					<view class="action" @tap="hideModal">
						<text class="cuIcon-close text-red"></text>
					</view>
				</view>
				<view class="padding-sm">
					<input class="uni-input" placeholder="请输入支付密码" v-model="paypwd" password=true @confirm="onSubmit"/>
				</view>
				<view class="cu-bar bg-white justify-between">
					<view class="text-red margin-left-sm">{{err}}</view>
					<view class="text-blue margin-right-sm">忘记密码</view>
				</view>
			</view>
		</view>
		<view class="cu-modal success radius" :class="over?'show':''">
			<view class="cu-dialog over">
				<view><text class="lg text-gray cuIcon-roundcheck"></text>充值成功</view>
			</view>
		</view>
		<ourLoading active text="支付中..." v-show="loadModal" />
	</view>
</template>

<script>
	import ourLoading from '../our-loading/our-loading.vue'
	
	export default {
		data() {
			return {
				loadModal:false,
				over:false,
				paypwd:''
			};
		},
		name: 'pay',
		components:{
			ourLoading 
		},
		props: {
			open: {
				type: Boolean,
				default: false
			},
			err:{
				type: String,
				default:''
			}
		},
		created() {
			uni.$on('payBack',(e) => {
				this.resultData(e)
			})
		},
		onUnload() {
			uni.$off('payBack')
		},
		methods: {
			hideModal(e) {
				uni.$emit("changeOpen",false)
			},
			onSubmit() {
				if (this.paypwd.length > 0) {
					this.loadModal = true
					uni.$emit("sendPwd",this.paypwd)
					uni.$emit("changeOpen",false)
					uni.hideKeyboard()
				}
			},
			onClose() {
				this.over = true
				this.loadModal = false
				let that = this
				setTimeout(function () {
					that.over = false
				}, 3000);
			},
			resultData(e) {
				uni.$emit("changeOpen",true)
				this.loadModal = false
				if (e) {
					this.hideModal()
					this.onClose()
				}
			}
		}
	}
</script>

<style>
	.cu-dialog {
		background-color: #fff;
	}
	.uni-input {
		height: 5vh;
		background-color: #f8f8f8;
	}
	.cu-bar {
		min-height: 6vh;
	}
	.over {
		background-color:transparent;
		color:#FFFFFF;
		font-size: 2.3vh;
	}
	.success {
		width: 40%;
		height: 5%;
		margin: 0 auto;
		top: 50%;
	}
</style>
