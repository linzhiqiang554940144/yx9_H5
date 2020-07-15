<template name="chennal">
	<view>
		<cu-custom ></cu-custom>
		<scroll-view scroll-y class="page">
			<view class="flex align-end">
				<view class="title" :class="selectTab == 1 ? 'text-xxl text-bold' :'text-xl'" @click="checkTab(1)">充值服务</view>
				<view class="title" :class="selectTab == 2 ? 'text-xxl text-bold' :'text-xl'" @click="checkTab(2)">账号服务</view>
			</view>
			<view class="page-item" v-show="selectTab == 1">
				<view class="cu-bar justify-left">
					<view class="action border-title">
						<text class="text-xl">渠道充值</text>
						<text class="bg-grey"></text>
					</view>
				</view>
				<view class="recharge">
					<navigator class="text-lg text-item" hover-class='none' :url="'/pages/views/service/channelPay'" navigateTo>
						<image class="cu-avatar lg" src="/static/service/channel.png"></image>渠道加币(完成)
					</navigator>
					<navigator class="text-lg text-item" hover-class='none' :url="'/pages/views/service/playPay'" navigateTo>
						<image class="cu-avatar lg" src="/static/service/play.png"></image>玩家充值
					</navigator>
				</view>
			</view>
			<!-- start 点卡充值 -->
			<view class="page-item" v-show="selectTab == 1">
				<view class="cu-bar justify-left">
					<view class="action border-title">
						<text class="text-xl">点卡充值</text>
						<text class="bg-grey"></text>
					</view>
				</view>
				<view class="recharge">
					<view class="text-lg text-office">
						<navigator hover-class='none' :url="'/pages/views/service/miPay'" navigateTo>
							<image class="cu-avatar lg" src="/static/service/mi.png"></image>米币充值
						</navigator>
					</view>
					<view class="text-lg text-office">
						<navigator hover-class='none' :url="'/pages/views/service/lenovoPay'" navigateTo>
							<image class="cu-avatar lg" src="/static/service/lenovo.png"></image>联想充值
						</navigator>
					</view>
					<view class="text-lg text-office">
						<navigator hover-class='none' :url="'/pages/views/service/qbPay'" navigateTo>
							<image class="cu-avatar lg" src="/static/service/qb.png"></image>Q币充值
						</navigator>
					</view>
					<view class="text-lg text-office">
						<navigator hover-class='none' :url="'/pages/views/service/udPay'" navigateTo>
							<image class="cu-avatar lg" src="/static/service/ud.png"></image>U点充值
						</navigator>
					</view>
					<view class="text-lg text-office">
						<navigator hover-class='none' :url="'/pages/views/service/jkPay'" navigateTo>
							<image class="cu-avatar lg" src="/static/service/jk.png"></image>骏卡充值
						</navigator>
					</view>
					<view class="text-lg text-office">
						<navigator hover-class='none' :url="'/pages/views/service/mzPay'" navigateTo>
							<image class="cu-avatar lg" src="/static/service/meizu.png"></image>魅族充值
						</navigator>
					</view>
					<view class="text-lg text-office">
						<navigator hover-class='none' :url="'/pages/views/service/iosPay'" navigateTo>
							<image class="cu-avatar lg" src="/static/service/appstore.png"></image>IOS充值
						</navigator>
					</view>
					<view class="text-lg text-office">
						<navigator hover-class='none' :url="'/pages/views/service/163Pay'" navigateTo>
							<image class="cu-avatar lg" src="/static/service/netbase.png"></image>网易一卡通
						</navigator>
					</view>
					<view class="text-lg text-office">
						<navigator hover-class='none' :url="'/pages/views/service/360Pay'" navigateTo>
							<image class="cu-avatar lg" src="/static/service/360.png"></image>360币充值
						</navigator>
					</view>
				</view>
			</view>
			<!-- end 点卡充值 -->
			<!-- start 会员充值 -->
			<view class="page-item" v-show="selectTab == 1">
				<view class="cu-bar justify-left">
					<view class="action border-title">
						<text class="text-xl">会员充值</text>
						<text class="bg-grey"></text>
					</view>
				</view>
				<view class="recharge">
					<navigator hover-class='none' class="text-lg text-item" :url="'/pages/views/service/mAiqiyi'" navigateTo>
						<image class="cu-avatar lg" src="/static/service/aiqiyi.png"></image>爱奇艺会员
					</navigator>
					<navigator hover-class='none' class="text-lg text-item" :url="'/pages/views/service/mQm'" navigateTo>
						<image class="cu-avatar lg" src="/static/service/qq-m.png"></image>腾讯QQ会员
					</navigator>
					<navigator hover-class='none' class="text-lg text-item" :url="'/pages/views/service/mQy'" navigateTo>
						<image class="cu-avatar lg" src="/static/service/qq-y.png"></image>腾讯QQ黄钻
					</navigator>
					<navigator hover-class='none' class="text-lg text-item" :url="'/pages/views/service/mYk'" navigateTo>
						<image class="cu-avatar lg" src="/static/service/youku.png"></image>优酷土豆黄金会员
					</navigator>
					<navigator hover-class='none' class="text-lg text-item" :url="'/pages/views/service/mHollywood'" navigateTo>
						<image class="cu-avatar lg" src="/static/service/ten.png"></image>腾讯好莱坞会员
					</navigator>
					<navigator hover-class='none' class="text-lg text-item" :url="'/pages/views/service/mSina'" navigateTo>
						<image class="cu-avatar lg" src="/static/service/weibo.png"></image>新浪微博会员
					</navigator>
				</view>
			</view>
			<!-- end 会员充值 -->
			<view class="page-item">
				<view class="cu-bar justify-left">
					<view class="action border-title">
						<text class="text-xl">账号服务</text>
						<text class="bg-grey"></text>
					</view>
				</view>
				<view class="recharge">
					<navigator hover-class='none' class="text-lg text-item" :url="'/pages/views/service/sougouReg'" navigateTo>
						<image class="cu-avatar lg" src="/static/service/sougou.png"></image>搜狗账号注册
					</navigator>
					<navigator hover-class='none' class="text-lg text-item" :url="'/pages/views/service/ascription'" navigateTo>
						<image class="cu-avatar lg" src="/static/service/account.png"></image>账号归属查询
					</navigator>
				</view>
			</view>
		</scroll-view>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				TabCur: 0,
				scrollLeft: 0,
				selectTab:1,
			};
		},
		methods: {
			checkTab(index) {
				this.selectTab = index
			}
		},
	}
</script>

<style>
	@import "../../../colorui/animation.css";
	
	/* #ifdef  APP-PLUS */
	.page { height: 91vh;}
	/* #endif */
	/* #ifdef  H5 */
	.page { height: 93vh;}
	/* #endif */
	
	
	.title {
		margin:  2vh 0 0 2vh
	}
	.bg-grey {
		width: 8.5vh;
	}
	.page-item {
		background: #FFFFFF;
		margin: 1vh 2vh;
		border-radius: 0.5vh;
	}
	.recharge {
		padding: 0 2vh 1.5vh 2vh;
	}
	.text-item {
		width: 100%;
		display: block;
		margin: 1.5vh 0;
	}
	.text-office {
		width: 50%;
		margin: 1.5vh 0 0 0;
		display: inline-block;
	}
	.cu-avatar {
		margin-right: 1vh;
		background: #FFFFFF;
		background-size: cover;
		background-position: center;
	}
</style>
