<template>
	<view>
		<game v-if="PageCur=='game'"></game>
		<channel v-if="PageCur=='channel'"></channel>
		<service v-if="PageCur=='service'"></service>
		<my v-if="PageCur=='my'"></my>
		<view class="cu-bar tabbar bg-white shadow foot">
			<view class="action"  @click="NavChange" data-cur="game">
				<view class="cuIcon-cu-image">
					<image v-if="PageCur != 'game'" class="icon-s" src="/static/tabbar/basics.png"></image>
					<image v-if="PageCur == 'game'" class="icon-s" src="/static/tabbar/basics_cur.png"></image>
				</view>
				<view :class="PageCur=='game'?'text-blue':'text-gray'">游戏</view>
			</view>
			<view class="action" @click="NavChange" data-cur="channel">
				<view class="cuIcon-cu-image">
					<image v-if="PageCur != 'channel'" class="icon" src="/static/tabbar/component.png"></image>
					<image v-if="PageCur == 'channel'" class="icon" src="/static/tabbar/component_cur.png"></image>
				</view>
				<view :class="PageCur=='channel'?'text-blue':'text-gray'">渠道</view>
			</view>
			<view class="action" @click="NavChange" data-cur="service">
				<view class="cuIcon-cu-image">
					<image v-if="PageCur == 'service'" class="icon" src="/static/tabbar/plugin_cur.png"></image>
					<image v-if="PageCur != 'service'" class="icon" src="/static/tabbar/plugin.png"></image>
				</view>
				<view :class="PageCur=='service'?'text-blue':'text-gray'">服务</view>
			</view>
			<view class="action" @click="NavChange" data-cur="my">
				<view class="cuIcon-cu-image">
					<image v-if="PageCur == 'my'" class="icon" src="/static/tabbar/about_cur.png"></image>
					<image v-if="PageCur != 'my'" class="icon" src="/static/tabbar/about.png"></image>
				</view>
				<view :class="PageCur=='my'?'text-blue':'text-gray'">我的</view>
			</view>
		</view>
	</view>
</template>

<script>
	export default {
		data() {
		return {
				PageCur: 'game'
			}
		},
		mounted(){
			this.userInfo()
		},
		created() {
			
		},
		methods: {
			NavChange: function(e) {
				this.PageCur = e.currentTarget.dataset.cur
			},
			userInfo() {
				this.$http.get(process.env.USER_API + '/v1/personal/user/info').then(res => {
					if (res.data.code != 200) {
						uni.clearStorageSync()
						uni.reLaunch({
							url: '/pages/views/login/login',
							animationType: 'pop-in',
							    animationDuration: 200
						})
						return
					}
					if(res.data.data.data.status == 2 || res.data.data.data.status == 9 ) {
					    if (res.data.data.data.shangwu_rabc == 1 && res.data.data.data.auth_face == 0) {
								setTimeout(() => {
								  uni.redirectTo({
									  url: '/pages/views/auth/person'
								  });
								}, 1000);
								return;
					    } 
					} else {
						if (res.data.data.data.status == 0 || res.data.data.data.status == 1)
						{
							uni.reLaunch({
								url: '/pages/views/auth/auth',
								animationType: 'pop-in',
								    animationDuration: 200
							})
							return
						}
						uni.clearStorageSync()
						uni.reLaunch({
							url: '/pages/views/login/login',
							animationType: 'pop-in',
							    animationDuration: 200
						})
					}
				})
			}
		}
	}
</script>

<style>
	.icon-s {
		width: 40rpx!important;
		height: 30rpx!important;
	}
	.icon {
		width: 40rpx!important;
		height: 40rpx!important;
	}
</style>
