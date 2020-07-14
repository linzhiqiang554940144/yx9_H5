<template name="chennal">
	<view>
		<cu-custom></cu-custom>
		<scroll-view scroll-x class="bg-white nav text-center">
			<view class="cu-item text-lg text-bold" :class="index==tabCur?'text-blue cur':''" v-for="(item,index) in tab" :key="index" @click="tabSelect" :data-id="index">
				{{tab[index]}}
			</view>
		</scroll-view>
		<scroll-view scroll-y class="page">
			<view class="uni-scroll-view">
					<view class="cu-list menu-avatar shadow" v-for="(val,index) in platform" :key="index">
						<view class="item flex-wrap" @click="checkPlatform(val)">
						<view class="item-list cu-form-group">
							<view class="flex">
								<image class="cu-avatar lg round margin-right-sm" :src="getUrl(val.picon)"></image>
								<view class="content">
									<view class="text-grey">{{val.platform}}</view>
								</view>
							</view>
							<view>
								<text class="lg text-green cuIcon-check" v-show="pid == val.id"></text>
							</view>
						</view>
					</view>
				</view>
			</view>
			<view class="cu-tabbar-height"></view>
		</scroll-view>
		<view class="button padding"><button class="cu-btn block line-green margin-tb-sm lg" :disabled="pid != '' ? false : true" @click="application()">{{tabCur == 0 ? '申请' : '提交绑定' }}</button></view>
		<view class="cu-modal" :class="open ? 'show' : ''">
			<view class="cu-dialog" catchtap>
				<view class="cu-bar bg-white justify-end">
					<view class="action" @tap="hideModal">
						<text class="cuIcon-close text-red"></text>
					</view>
				</view>
				<view class="padding-sm">
					<view class="text-lg">你已拥有了此渠道</view>
					<view class="text-lg padding-top-sm">是否继续绑定新的渠道号？</view>
				</view>
				<view class="cu-bar bg-white">
					<view class="action margin-0 flex-sub text-lg text-green solid-left" @click="hideModal">取消</view>
					<view class="action margin-0 flex-sub text-lg solid-left" @click="showAppleModal">继续绑定</view>
				</view>
			</view>
		</view>
		<view class="cu-modal bottom-modal" :class="bindOpen ? 'show' : ''">
			<view class="cu-dialog">
				<view class="cu-bar bg-white">
					<view class="action text-green" @click="apply">确定</view>
					<view class="action text-blue" @click="hideAppleModal">取消</view>
				</view>
				<view class="margin-sm">
					<view class="cu-form-group">
						<view>{{name}}渠道号</view>
						<view><input class="uni-input" cursor-spacing="0" v-model="channel.title" maxlength="20" placeholder="输入你的渠道号" /></view>
					</view>
					<view class="cu-form-group">
						<view>{{name}}渠道账号</view>
						<view><input class="uni-input" cursor-spacing="0" v-model="channel.account" maxlength="20" placeholder="输入你的渠道账号" /></view>
					</view>
					<view class="cu-form-group">
						<view>{{name}}登录密码</view>
						<view><input class="uni-input" cursor-spacing="0" type="password" maxlength="20" v-model="channel.pwd" placeholder="输入你的登录密码" /></view>
					</view>
					<view class="cu-form-group margin-bottom-xl">
						<view>{{name}}支付密码</view>
						<view><input class="uni-input" cursor-spacing="0" type="password" maxlength="20" v-model="channel.paypwd" placeholder="输入你的支付密码" /></view>
					</view>
				</view>
			</view>
		</view>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				tabCur: 0,
				scrollLeft: 0,
				tab:['申请新渠道','绑定渠道'],
				platform:[],
				pid:"",
				name:"",
				open:false,
				bindOpen:false,
				channel:{
				  pid: "",
				  title: "",
				  account: "",
				  pwd: "",
				  paypwd: ""
				}
			};
		},
		created() {
			this.getPlatform()
		},
		methods: {
			tabSelect(e) {
				this.pid = ""
				this.tabCur = e.currentTarget.dataset.id;
				this.scrollLeft = (e.currentTarget.dataset.id - 1) * 60
			},
			showModal() {
				this.open = true
			},
			hideModal() {
				this.open = false
			},
			showAppleModal() {
				this.hideModal()
				this.bindOpen = true
			},
			hideAppleModal() {
				this.bindOpen = false
			},
			getPlatform() {
				this.$http.get('/v1/front/all/channel').then(res => {
					this.platform = res.data.data.data
				})
			},
			getUrl(e) {
				return process.env.CDN + '/' + e;
			},
			checkPlatform(e) {
				this.pid = e.id
				this.name = e.platform
			},
			application() {
				if (this.tabCur == 0) {
					uni.showLoading({
					    title: '申请中'
					});
					this.$http.post('/v1/front/apply/channel',{pid: this.pid }).then(res => {
						uni.hideLoading();
						uni.showToast({
						    icon: 'none',
							position: 'center',
						    title: res.data.message
						});
						return;
					})
				} else {
					this.$http.get('/v1/front/channel/check',{params:{pid: this.pid }}).then(res => {
						if (res.data.code != 200 && res.data.code != 37040) {
							uni.showToast({
							    icon: 'none',
								position: 'center',
							    title: res.data.message
							});
							return;
						}
						if (	this.pid == "cf8ab6358c84255e6cf2c507b9a049d3" ||
								this.pid == "96e9deea17311aa83f673cf60c42995f" ||
								this.pid == "c9dcd2e4f39acc7649cf77da95a8df53" ||
								this.pid == "3faba5f1ab0cfad89eacacacaa1de9b6"
							) {
						  this.$http.post("/front/bind/channel", {
						    pid: this.pid
						  }).then(res => {
								uni.showToast({
								    icon: 'none',
									position: 'center',
								    title: res.data.message
								});
								return
						  });
						}
						if (res.data.code == 37040) {
							this.open = true
							return
						}
						this.showAppleModal()
					})
				}
			},
			apply() {
				if (this.channel.title == "" || this.channel.account == "" || this.channel.pay == "" || this.channel.paypwd ==  "") {
					uni.showToast({
					    icon: 'none',
						position: 'center',
					    title: "请填写相应参数后提交"
					});
					return
				}
				if (this.pid ==  "") {
					uni.showToast({
					    icon: 'none',
						position: 'center',
					    title: "请选择渠道"
					});
					return
				}
				this.channel.pid = this.pid
				this.hideAppleModal()
				uni.showLoading({
				    title: '绑定中'
				});
				this.$http.post("/v1/front/bind/channel", this.channel).then(res => {
					uni.hideLoading();
					if (res.data.code == 200) {
					  uni.showToast({
							icon: 'success',
							position: 'center',
							title: "绑定成功"
					  });
					} else {
					  uni.showToast({
						icon: 'none',
						position: 'center',
						title: res.data.message
					  });
					}
				  }
				);
			}
		},
	}
</script>

<style>
	@import "../../../colorui/animation.css";
	
	.page {
		height: 75vh;
	}
	.cu-list {
		background: #fff;
		margin: 15rpx;
	}
	.item .item-list {
		position: relative;
		display: -webkit-box;
		margin: 12rpx 5rpx;
		background: #fff;
	}
	.item .cu-btn {
		position: absolute;
		right:0;
	}
	.item .chennal-text {
		background: #bfbcbc;
		color: #353535;
		padding:10rpx;
		position: absolute;
		bottom: 0;
	}
	.item-list .content {
		color: #353535;
		font-size: 30rpx;
		margin:auto 10rpx;
	}
	.button {
		position: absolute;
		width: 100%;
		bottom: 6vh;
		background: #fff;
	}
	.cuIcon-check {
		font-size: 50rpx;
	}
	.button .cu-btn {
		width:100%;
	}
</style>
