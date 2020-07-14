<template>
	<view>
		<cu-header :isBack="true" bgColor="bg-white">
			<block slot="backText"></block>
			<block slot="content">平台通知</block>
			<block slot="right"><view class="padding-right-xl text-lx" @click="read()">全部已读</view></block>
		</cu-header>
		<!-- " -->
		<mescroll-uni ref="mescrollRef" @init="mescrollInit" @down="downCallback" @up="upCallback" :up="upOption" :top="uniTop">
			<view class="cu-chat">
				<view v-for="(val,index) in result" :key="index">
					<view class="text-lx margin-top-xl  text-center">{{val.time}}</view>
					<view class="cu-item">
						<view class="notce-main bg-white padding-xl">
							<view class="text-xl">{{val.title}}</view>
							<view class="text-lx margin-top"><text class="cuIcon-sound text-red text-xxl margin-right-sm"></text>{{val.content}}</view>
						</view>
					</view>
				</view>
			</view>
		</mescroll-uni>
	</view>
</template>

<script>
	import MescrollUni from "../../components/hot-scroll/mescroll-uni.vue"
	
	export default {
		data() {
			return {
				result:[],
				upOption:{
					page: {
						size: 5
					},
					noMoreSize: 5,
					textNoMore:'我是有底线的 >_<'  
				},
				// #ifdef  APP-PLUS
				uniTop:150,
				// #endif
				// #ifdef  H5
				uniTop:100,
				// #endif
				
				
			};
		},
		components:{
			MescrollUni
		},
		methods: {
			mescrollInit(mescroll) {
				this.mescroll = mescroll
			},
			downCallback() {
				this.mescroll.resetUpScroll()
			},
			upCallback() {
				//if (this.mescroll.num > 1) {
					this.initData()
				//}
			},
			initData() {
				let pageNum = this.mescroll.num
				let pageSize = this.mescroll.size
				this.$http.get('/v1/personal/notice',{params:{page:pageNum,pagenum:pageSize}}).then(res => {
					if (pageNum == 1) {
						this.result = []
					}
					let data = res.data.data.data.data
					this.result = this.result.concat(data)
					this.mescroll.endSuccess(data.length)
					// if (data.length == pageSize) {
					// 	this.mescroll.endUpScroll(false)
					// } else {
					// 	this.mescroll.endUpScroll(true)
					// }
				}).catch(()=>{
					this.mescroll.endErr();
				})
			},
			read() {
				uni.showLoading({
				    title: '提交中'
				});
				this.$http.post('/v1/personal/notice').then(res => {
					uni.hideLoading();
					uni.showToast({
					    icon: res.data.code == 200 ? 'success' : 'none',
						position: 'center',
					    title: res.data.code == 200 ? '设置成功' : res.data.message,
						duration: 2000
					});
				})
			}
		}
	}
</script>

<style>
	.page {
		height: 100%;
		
	}
	.notce-main {
		width:100%;
	}
</style>
