<template name="my">
	<view>
		<view  class="page" >
			<view class="top">
				<view class="user_box flex align-center margin-top">
					<view class="lg cu-avatar round margin-left-sm">
						<text class="cuIcon-people"></text>
					</view>
					<text class="margin-left">{{phone}}</text>
					<text class="margin-left bg-grey text-sm radius level">传奇星</text>
					<text class="margin-left bg-gray text-sm radius level">{{level}}级别</text>
					<navigator hover-class='none' class="text-lg text-item" :url="'/pages/views/my/notice'" navigateTo>
						<view class="text-gray cuIcon-notice"><view class="cu-tag badge"></view></view>
					</navigator>
				</view>
				<view class="user_money">
					<view class="item">
						<view class="money">
							{{money}}
						</view>
						<view class="text">
							<navigator hover-class='none' :url="'/pages/views/my/money'" navigateTo>
								我的久币
							</navigator>
						</view>
					</view>
					<view class="item">
						<view class="money">
							{{businessCurrency}}
						</view>
						<view class="text">
							<navigator hover-class='none' :url="'/pages/views/my/business'" navigateTo>
								我的商务币
							</navigator>
						</view>
					</view>
					<view class="item">
						<view class="money">
							{{deposit}}
						</view>
						<view class="text">
							<navigator hover-class='none' :url="'/pages/views/my/deposit'" navigateTo>
								我的押金
							</navigator>
							
						</view>
					</view>
				</view>
			</view>
			<view class="content">
				<navigator hover-class='none' class="margin-top-sm cu-form-group" :url="'/pages/views/my/game'" navigateTo>
					<view class="title">我的游戏</view>
					<text class="lg text-gray cuIcon-right"></text>
				</navigator>
				<navigator hover-class='none' class="cu-form-group" :url="'/pages/views/my/channel'" navigateTo>
					<view class="title">我的渠道</view>
					<text class="lg text-gray cuIcon-right"></text>
				</navigator>
				<navigator hover-class='none' class="cu-form-group" :url="'/pages/views/my/bill'" navigateTo>
					<view class="title">账单明细</view>
					<text class="lg text-gray cuIcon-right"></text>
				</navigator>
				<navigator hover-class='none' class="cu-form-group" :url="'/pages/views/my/account'" navigateTo>
					<view class="title">提现账号管理</view>
					<text class="lg text-gray cuIcon-right"></text>
				</navigator>
				<navigator hover-class='none' class="cu-form-group" :url="'/pages/views/my/password'" navigateTo>
					<view class="title">修改支付密码</view>
					<text class="lg text-gray cuIcon-right"></text>
				</navigator>
				<navigator hover-class='none' class="cu-form-group" :url="'/pages/views/my/service'" navigateTo>
					<view class="title">客服</view>
					<text class="lg text-gray cuIcon-right"></text>
				</navigator>
			</view>
			<view class="margin-top bg-white">
				<view class="padding-sm text-center" @tap="back">
					<text class="text-bold text-lg">退出登录</text>
				</view>
			</view>
		</view>
	</view>
</template>

<script>
	export default {
		name: "my",
		data() {
			return {
				money:"0",
				businessCurrency:"",
				deposit:"",
				level:0,
				phone:""
			};
		},
		components: {},
		mounted() {
			
		},
		created() {
			this.initData()
		},
		methods: {
			back() {
				uni.clearStorageSync()
				uni.reLaunch({
					url: '../login/login',
					animationType: 'pop-in',
					    animationDuration: 200
				})
			},
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
					this.businessCurrency = this.formatMoney(res.data.data.data.shangwubi)
					this.deposit = this.formatMoney(res.data.data.data.dongjie)
					this.level = res.data.data.data.level_id
					this.phone = res.data.data.data.user_phone
				})
				.catch(err => {
					//console.log(err);
				});
			}
		}
	}
</script>

<style lang="less">
	@import "../../../colorui/animation.css";
	.page {
		height: 100vh;

		.top {
			height: 23vh;
			background-color: #fff;
			padding: 3vh 2vh 0 2vh;
			display: flex;
			flex-direction: column;

			.user_box {
				position: relative;
				.level {
					padding:0.2vh 0.5vh;
				}
				.cuIcon-notice {
					position: absolute;
					top: 0;
					right: 2vh;
					font-size: 2.5vh;
				}
			}

			.user_money {
				flex: 1;
				display: flex;
				justify-content: space-around;
				align-items: center;

				.item {
					width: 24vw;
					height: 7vh;
					display: flex;
					text-align: center;
					justify-content: center;
					flex-direction: column;
					border: 1px solid #E4E4E4;
				}
			}
		}
	}
</style>
