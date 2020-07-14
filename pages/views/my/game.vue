<template>
	<view>
		<view class="cu-bar fixed">
			<cu-header :isBack="true" bgColor="bg-white">
				<block slot="backText"></block>
				<block slot="content">我的游戏</block>
			</cu-header>
			<view class="platform flex top">
				<view class="platform-item" @click="platformOpen()">
					<text :class="pickerIndex == -1 ? 'text-black' : 'text-green'">{{pickerIndex == -1 ? platform : picker[pickerIndex].platform}}</text>
					<text :class="platformKey ? 'cuIcon-fold' : 'cuIcon-unfold'"></text>
				</view>
				<view class="platform-item" @click="sysOpen()">
					<text :class="sysIndex == -1 ? 'text-black' : 'text-green'">{{sysIndex == -1 ? sys : pickerSys[sysIndex].name}}</text>
					<text :class="sysKey ? 'cuIcon-fold' : 'cuIcon-unfold'"></text>
				</view>
				<view class="platform-item" @click="levelOpen()">
					<text :class="levelIndex ==  '' ? 'text-black' : 'text-green'">{{levelIndex ==  "" ? level : (levelIndex != "全部" ? (levelIndex + "级") : levelIndex)}}</text>
					<text :class="levelKey ? 'cuIcon-fold' : 'cuIcon-unfold'"></text>
				</view>
				<view class="platform-item" @click="gameOpen()">
					<text :class="gameIndex == -1 ? 'text-black' : 'text-green'">{{gameIndex == -1 ? game :  pickerGame[gameIndex].type}}</text>
					<text :class="gameKey ? 'cuIcon-fold' : 'cuIcon-unfold'"></text>
				</view>
				<view class="popup" v-show="platformKey">
					<view class="cell cu-form-group" v-for="(val,index) in picker" @click="pickerCheck(index)">
						<view class="title">{{val.platform}}</view>
						<text class="lg text-green cuIcon-check" v-show="index == pickerIndex"></text>
					</view>
				</view>
				<view class="popup" v-show="sysKey">
					<view class="cell cu-form-group" v-for="(val,index) in pickerSys" @click="sysCheck(index)">
						<view class="title">{{val.name}}</view>
						<text class="lg text-green cuIcon-check" v-show="index == sysIndex"></text>
					</view>
				</view>
				<view class="popup" v-show="levelKey">
					<view class="cell cu-form-group" v-for="val in pickerLevel" @click="levelCheck(val)">
						<view class="title">{{val != '全部' ? (val + '级') : val}}</view>
						<text class="lg text-green cuIcon-check" v-show="val == levelIndex"></text>
					</view>
				</view>
				<view class="popup" v-show="gameKey">
					<view class="cell cu-form-group" v-for="(val,index) in pickerGame" @click="gameCheck(index)">
						<view class="title">{{val.type}}</view>
						<text class="lg text-green cuIcon-check" v-show="val == gameIndex"></text>
					</view>
				</view>
			</view>
		</view>
		<scroll-view scroll-y class="page">
			<view class="cu-bar search bg-white">
				<view class="search-form round">
					<text class="cuIcon-search"></text>
					<input type="text" placeholder="搜索游戏"  confirm-type="search" v-model="name" @confirm="searchGame()"></input>
				</view>
			</view>
			<mescroll-uni ref="mescrollRef" @init="mescrollInit" @down="downCallback" @up="upCallback" :up="upOption" height="100%">
					<view class="cu-list menu-avatar shadow" v-for="(val,index) in result" :key="index">
						<view class="item flex-wrap">
							<view class="item-list">
								<image class="cu-avatar lg" :src="getUrl(val.icon)"></image>
								<view class="content">
									<view class="text-grey">{{val.name}}</view>
									<view class="text-gray text-sm">
										<text class="chennal-text">{{val.platform}}</text>
									</view>
								</view>
								<view class="text-grey rightTxt">
									<text class="text-gray">{{val.status == 1?'打包中':val.status == 2?'成功':'失败'}}</text>
									<text v-if="val.status == 2" class="margin-left-sm margin-right-sm">|</text>
									<text v-if="val.status == 2" class="text-blue" @click="copy(val.url)">复制</text>
									<text v-if="val.status == 3" class="margin-left-sm margin-right-sm">,</text>
									<text v-if="val.status == 3" class="text-blue" @click="repackage(val)">重新打包</text>
								</view>
							</view>
							<view class="item-list">
								<view class="chennal-title">{{val.levelId}}级</view>
								<view class="chennal-title">首{{formatMoney(val.firRate)}}</view>
								<view class="chennal-title">续{{formatMoney(val.lastRate)}}</view>
								<view class="chennal-title">{{val.toRate}}</view>
								<view class="chennal-title" v-if="val.isNew == 1">允许新增</view>
								<view class="chennal-title" v-if="val.isRecharge == 1">允许充值</view>
							</view>
						</view>
					</view>
			</mescroll-uni>
		</scroll-view>
	</view>
</template>

<script>
	import MescrollUni from "../../components/hot-scroll/mescroll-uni.vue"
	
	export default {
		data() {
			return {
				index:-1,
				upOption:{
					noMoreSize: 10,
					textNoMore:'我是有底线的 >_<'  
				},
				upLoading:false,
				page:1,
				pagesize:10,
				platformKey:false,
				sysKey:false,
				levelKey:false,
				gameKey:false,
				platform:"平台选择",
				sys:"系统选择",
				level:"游戏等级",
				game:"游戏类型",
				picker: [],
				pickerSys:[{'id':"",'name':'全部'},{'id':1,'name':'安卓'},{'id':2,'name':'苹果'},{'id':3,'name':'H5'}],
				pickerLevel:['全部','1', '2', '3','4','5','6','7','8','9'],
				pickerGame:[],
				pickerIndex:-1,
				sysIndex:-1,
				levelIndex:"",
				gameIndex:-1,
				pid:"",
				from:"",
				levelId:"",
				name:"",
				type:"",
				result:[]
			};
		},
		created() {
			this.getPlatform()
			this.getGameType()
		},
		components:{
			MescrollUni
		},
		methods: {
			getPlatform() {
				this.$http.get('/v1/front/game/platformlist').then(res => {
					this.picker = [{id: "", platform: "全部"}]
					this.picker = this.picker.concat(res.data.data.data)
				})
			},
			getGameType() {
				this.$http.get('/v1/front/game/type').then(res => {
					this.pickerGame = [{id: "", type: "全部"}]
					this.pickerGame = this.pickerGame.concat(res.data.data.data)
				})
			},
			mescrollInit(mescroll) {
				console.log(mescroll,'333333')
				this.mescroll = mescroll;
			},
			downCallback(mescroll) {
				mescroll.resetUpScroll()
			},
			upCallback(mescroll) {
				this.initData(mescroll)
			},
			initData(mescroll) {
				let pageNum = mescroll.num
				let pageSize = mescroll.size
				this.$http.get('/v1/front/my/game',{params:{
					pid:this.pid,
					from:this.from,
					levelId:this.levelId,
					name:this.name,
					type:this.type,
					page:pageNum,
					pagesize:pageSize,
				}}).then(res => {
					if (res.data.code != 200) {
						uni.showToast({
						    icon: 'none',
							position: 'bottom',
						    title: res.data.message
						});
						return
					}
					let curPageData = res.data.data.data.data
					mescroll.endSuccess(curPageData.length)
					if (pageNum == 1) {
						this.result = []
					}
					this.result = this.result.concat(curPageData)
				})
				.catch(err => {
					mescroll.endErr();
				});
			},
			getUrl(e) {
				return process.env.CDN + '/' + e;
			},
			getStatus(id) {
				
			},
			platformOpen(e) {
				this.platformKey = this.platformKey ? false : true
				this.sysKey = this.levelKey = this.gameKey = false
			},
			sysOpen(e) {
				this.sysKey = this.sysKey ? false : true
				this.platformKey = this.levelKey = this.gameKey = false
			},
			levelOpen(e) {
				this.levelKey = this.levelKey ? false : true
				this.platformKey = this.sysKey = this.gameKey = false
			},
			gameOpen(e) {
				this.gameKey = this.gameKey ? false : true
				this.platformKey = this.sysKey = this.levelKey = false
			},
			searchGame(e) {
				this.mescroll.resetUpScroll()
				this.initData(this.mescroll)
			},
			pickerCheck(e) {
				this.pickerIndex = e
				this.platformOpen()
				this.pid = this.picker[e].id
				this.mescroll.resetUpScroll()
				this.initData(this.mescroll)
			},
			sysCheck(e) {
				this.sysIndex = e
				this.sysOpen()
				this.from = this.pickerSys[e].id
				this.mescroll.resetUpScroll()
				this.initData(this.mescroll)
			},
			levelCheck(e) {
				this.levelIndex = e
				this.levelOpen()
				if (e != "全部") {
					this.levelId = e
				} else {
					this.levelId = ""
				}
				this.mescroll.resetUpScroll()
				this.initData(this.mescroll)
			},
			gameCheck(e) {
				this.gameIndex = e
				this.gameOpen()
				this.type = this.pickerGame[e].type
				if (this.type == "全部") {
					this.type = ""
				}
				this.mescroll.resetUpScroll()
				this.initData(this.mescroll)
			},
			copy(e) {
				uni.setClipboardData({
				    data: e,
				    success: function () {
				        console.log('success');
				    }
				});
			},
			repackage(e) {
				uni.showLoading({
				    title: '申请中'
				});
				this.$http.post("v1/front/my/game/packaging", {
				  cid: e.cid,
				  gfid: e.gfid,
				  pid: e.pid,
				  jid: e.id
				}).then(res => {
					uni.hideLoading();
					if (res.data.code == 200) {
					  uni.showToast({
							icon: 'success',
							position: 'bottom',
							title: res.data.data.msg
					  });
					} else if (res.data.code == 10003) {
						uni.showToast({
							icon: 'none',
							position: 'bottom',
							title: res.data.data.msg
						});
					} else {
						uni.showToast({
							icon: 'none',
							position: 'bottom',
							title: res.data.message
						});
					}
					this.initData(this.mescroll)
				})
			}
		}
	}
</script>

<style lang="less">
	@import "../../../colorui/animation.css";
	/* #ifdef  APP-PLUS */
	.top { top:105rpx;}
	.page {margin-top:220rpx;}
	/* #endif */
	/* #ifdef  H5 */
	.top { top:55rpx;}
	.page {margin-top:150rpx;}
	/* #endif */
	.page {
		height: auto;
	}
	.cu-bar {
		background-color: #f1f1f1;
	}
	.search {
		height: 50rpx;
		line-height: 50rpx;
		.search-form {
			background-color: #ffffff;
			margin:5rpx 15rpx;
		}
	}
	.popup-mask {
		position: absolute;
		background-color: rgba(0,0,0,.5);
		top: 0;
		left: 0;
		width: 100%;
		height: 100%;
		z-index: 99;
	}
	.cu-list {
	    margin: 0.2vh 0;
	}
	.rightTxt {
		position: absolute;
		right: 0;
	}
	.item {
		padding-right: 0.1vh;
		background-color: #ffffff;
		padding: 1vh 2vh;
		.content {
			padding:0 1vh;
			display: grid;
		}
		.item-list {
			position: relative;
			display: -webkit-box;	
			.chennal-title {
				color: #353535;
				padding: 0.3vh 0.5vh;
				margin: 0.5vh 0.2vh;
				border: 0.1vh solid #cacaca;
			}
		}
		.cu-btn {
			position: absolute;
			right: 0;
		}
		.chennal-text {
			background: #bfbcbc;
			color: #353535;
			padding:0.2vh;
			position: absolute;
			bottom: 0;
		}
		.lg {
		    width: 6.5vh;
		    height: 6.5vh;
		    font-size: 2em;
		}
	}
	.platform {
		height: 5vh;
		line-height: 5vh;
		background: #fff;
		font-size: 1.7vh;
		width: 100%;
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
		.platform-icon {
			width:15%;
			font-size: 2.2vh;
			text-align: center;
		}
		.platform-other {
			height: 3.3vh;
			line-height: 3.3vh;
			margin: auto 4%;
			width: 25%;
			justify-content: space-around;
			display: flex;
			border: 0.1vh solid #a7a5a5;
		}
	}
	.popup {
		position: absolute;
		top: 66rpx;
		z-index: 999;
		width: 100%;
		overflow-y: scroll;
		height: 800rpx;
		.cell {
			height: 80rpx;
			line-height: 80rpx;
			background-color: #fff;
			padding:0 40rpx;
			font-size: 30rpx;
			align-items: center;
			cursor: pointer;
			-webkit-transition: all .3s ease;
			transition: all .3s ease;
			border-top: 0.1vh solid #e5e5e5;
		}
	}
	
</style>
