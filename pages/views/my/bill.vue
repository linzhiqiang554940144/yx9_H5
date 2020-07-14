<template>
	<view>
		<view v-show="!searchBool">
			<cu-header :isBack="true">
				<block slot="backText"></block>
				<block slot="content">账单明细</block>
				<block slot="right"><text class="lg text-gray padding-right-xl cuIcon-search" @click="search(true)"></text></block>
			</cu-header>
			<view class="platform flex">
				<view class="platform-item" @click="orderOpen()">
					<text class="text-df text-cut" :class="order == '订单类型' ? 'text-black' : 'text-green'">{{order}}</text>
					<text :class="orderKey ? 'cuIcon-fold' : 'cuIcon-unfold'"></text>
				</view>
				<view class="platform-item" @click="statusOpen()">
					<text class="text-df" :class="status == '订单状态' ? 'text-black' : 'text-green'">{{status}}</text>
					<text :class="statusKey ? 'cuIcon-fold' : 'cuIcon-unfold'"></text>
				</view>
				<view class="platform-item" @click="moneyOpen()">
					<text class="text-df" :class="money == '收支' ? 'text-black' : 'text-green'">{{money}}</text>
					<text :class="typeKey ? 'cuIcon-fold' : 'cuIcon-unfold'"></text>
				</view>
				<view class="platform-item text-xl" @click="viewTime">
					<text class="text-df">筛选</text>
					<text class="cuIcon-filter"></text>
				</view>
				<view class="popup solid-bottom" v-show="orderKey">
					<view class="bg-white margin-top padding-left">
						<text class="text-xl text-bold">全部</text>
					</view>
					<view class="bg-white padding-left-xl grid col-4">
						<text class="text-df all-txt" @click="allForCheck('全部')">全部</text>
					</view>
					<view class="bg-white padding-left">
						<text class="text-xl text-bold">平台</text>
					</view>
					<view class="bg-white padding-left-xl grid col-4">
						<view class="text-df text-cut" v-for="val in picker" @click="platForCheck(val)">{{val.platform}}</view>
					</view>
					<view class="bg-white padding-left">
						<text class="text-xl text-bold">点卡</text>
					</view>
					<view class="bg-white padding-left-xl grid col-4">
						<view class="text-df text-cut" v-for="val in card" @click="midForCheck(val)">{{val.name}}</view>
					</view>
				</view>
				<view class="popup solid-bottom" v-show="statusKey">
					<view class="cell" v-for="val in pickerStatus"  @click="statusForCheck(val)">{{val.name}}</view>
				</view>
				<view class="popup solid-bottom" v-show="typeKey">
					<view class="cell" v-for="val in pickerType" @click="typeForCheck(val)">{{val.name}}</view>
				</view>
			</view>
			<mescroll-uni ref="mescrollRef" @init="mescrollInit" @down="downCallback" @up="upCallback" :up="upOption" :top="magTop">
				<view class="order-list solid-bottom" v-for="val in result">
					<view class="flex align-center justify-between">
						<view>
							<text class="text-xl margin-right-sm text-bold">{{val.contents}}</text>
							<text class="text-sm padding-xs solid margin-right-sm">{{val.payway == 1 ? '久币'  : '商务币'}}</text>
							<!-- <text class="text-sm padding-xs solid text-orange line-orange">{{val.typeId == 1 ? '收入' : '支出'}}</text> -->
							<text class="text-sm padding-xs solid bg-blue" v-if="val.card" @click="viewCamille(val.card)">查看卡密</text>
						</view>
						<view><text class="text-lg" :class="val.typeId == 1 ? 'text-green' : 'text-red'">{{val.typeId == 1 ? '+' : '-'}}{{formatMoney(val.money)}}</text></view>
					</view>
					<view class="flex align-center justify-end margin-top-sm">
						<text  :class="val.status == 2 ? 'text-gray' : 'text-red'">{{val.status == 1 ? '处理中' : (val.status == 2 ? '处理成功' : (val.status == 3 ? '处理失败' : '订单异常，联系客服'))}}</text>
					</view>
					<view class="margin-top-sm">
						<view class="flex align-center padding-xs justify-between">
							<text>订单号</text>
							<text @click="copyOrder(val.order)">{{val.order}}</text>
						</view>
						<view class="flex align-center padding-xs justify-between padding-top-sm" v-if="val.account && val.account != null">
							<text >充值账号</text>
							<text >{{val.account}}</text>
						</view>
						<view class="flex align-center padding-xs justify-between padding-top-sm">
							<text >充值面额</text>
							<text >{{handMid(val)}}</text>
						</view>
						<view class="flex align-center padding-xs justify-between padding-bottom-sm">
							<text>创建时间</text>
							<text>{{val.create_time}}</text>
						</view>
					</view>
				</view>
			</mescroll-uni>
		</view>
		<view v-show="searchBool" class="bg-white search">
			<view class="main">
				<cu-header :isMore="true">
					<block slot="tap">
						<scroll-view scroll-x class="nav text-center solid-bottom">
							<view class="cu-item text-lg text-bold" :class="index==tabCur?'text-blue cur':''" v-for="(item,index) in tab" :key="index" @tap="tabSelect" :data-id="index">
								{{tab[index]}}
							</view>
						</scroll-view>
					</block>
				</cu-header>
				<view class="cu-bar">
					<view class="search-form radius">
						<text class="cuIcon-search"></text>
						<input @focus="inputFocus" @blur="inputBlur" @confirm="searchGame()" v-model="searchVal" :adjust-position="false" type="text" :placeholder="tabCur == 0 ? '输入账号' : '输入订单号'"
						 confirm-type="search"></input>
					</view>
					<view class="action" @click="search(false)">
						<text class="cuIcon-close"></text>
						<text>取消</text>
					</view>
				</view>
				<scroll-view scroll-y class="page">
					<view class="order-list solid-bottom" v-for="val in searchResult">
						<view class="flex align-center justify-between">
							<view>
								<text class="text-xl margin-right-sm text-bold">{{val.contents}}</text>
								<text class="text-sm padding-xs solid margin-right-sm">{{val.payway == 1 ? '久币'  : '商务币'}}</text>
								<text class="text-sm padding-xs solid bg-blue" v-if="val.card" @click="viewCamille(val.card)">查看卡密</text>
							</view>
							<view><text class="text-lg" :class="val.typeId == 1 ? 'text-green' : 'text-red'">{{val.typeId == 1 ? '+' : '-'}}{{formatMoney(val.money)}}</text></view>
						</view>
						<view class="flex align-center justify-end margin-top-sm">
							<text  :class="val.status == 2 ? 'text-gray' : 'text-red'">{{val.status == 1 ? '处理中' : (val.status == 2 ? '处理成功' : (val.status == 3 ? '处理失败' : '订单异常，联系客服'))}}</text>
						</view>
						<view class="margin-top-sm">
							<view class="flex align-center padding-xs justify-between">
								<text>订单号</text>
								<text @click="copyOrder(val.order)">{{val.order}}</text>
							</view>
							<view class="flex align-center padding-xs justify-between padding-top-sm" v-if="val.account && val.account != null">
								<text >充值账号</text>
								<text >{{val.account}}</text>
							</view>
							<view class="flex align-center padding-xs justify-between padding-top-sm">
								<text >充值面额</text>
								<text >{{handMid(val)}}</text>
							</view>
							<view class="flex align-center padding-xs justify-between padding-bottom-sm">
								<text>创建时间</text>
								<text>{{val.create_time}}</text>
							</view>
						</view>
					</view>
				</scroll-view>
				<!-- <view class="order-list padding-bottom-xl">
					<view class="text-lg text-bold">搜索历史</view>
					<view class="text-df padding-top padding-bottom">1002202</view>
				</view> -->
			</view>
		</view>
		<view class="cu-modal" :class="viewOpen ? 'show' : ''">
			<view class="cu-dialog">
				<view class="margin-sm">
					<view class="cu-form-group" v-for="val in cardList">
						<view>卡号:{{val.card}}</view>
						<view>卡密:{{val.pwd}}</view>
						<view class="text-blue" @click="copy(val)">复制</view>
					</view>
				</view>
				<view class="cu-bar bg-white justify-center">
					<view class="action text-blue" @click="hideView">取消</view>
				</view>
			</view>
		</view>
		<view class="cu-modal drawer-modal justify-end time-top" :class="timeOpen?'show':''" @click="hideTime">
			<view class="cu-dialog basis-lg" @tap.stop="" :style="[{top:customBar+'px',height:'calc(100vh - ' + customBar + 'px)'}]">
				<view class="cu-list menu text-left">
					<view class="cu-item">
						<text class="text-lg text-bold">筛选</text>
					</view>
					<view class="margin-sm">
						<text class="text-df">币种选择</text>
					</view>
					<view class="text-center flex justify-around justify-center">
						<text class="solid line-gray padding-top-xs padding-bottom-xs padding-left padding-right" :class="selectMoney == 0 ? 'bg-orange text-white' : ''" @click="moneyCheck(0)">全部</text>
						<text class="solid line-gray padding-top-xs padding-bottom-xs padding-left padding-right" :class="selectMoney == 1 ? 'bg-orange text-white' : ''" @click="moneyCheck(1)">久币</text>
						<text class="solid line-gray padding-top-xs padding-bottom-xs padding-left padding-right" :class="selectMoney == 2 ? 'bg-orange text-white' : ''" @click="moneyCheck(2)">商务币</text>
					</view>
					<view class="margin-sm">
						<text class="text-df">充值时间</text>
					</view>
					<view class="text-center flex justify-around justify-center">
						<picker mode="date" :value="param.start"  @change="startChange">
							<view class="picker bg-white padding-top-xs padding-bottom-xs round padding-left padding-right">
								{{param.start == '' ? '开始时间' : param.start}}
							</view>
						</picker>
						<picker mode="date" :value="param.end"  @change="endChange">
							<view class="picker bg-white padding-top-xs padding-bottom-xs round padding-left padding-right">
								{{param.end == '' ? '结束时间' : param.end}}
							</view>
						</picker>
					</view>
					<view class="search-apply flex justify-end">
						<button class="bg-orange text-white text-df margin-right-sm" @click="reset()">重置</button>
						<button class="bg-blue text-white text-df" @click="apply()">确定</button>
					</view>
				</view>
			</view>
		</view>
	</view>
</template>

<script>
	//import MescrollUni from "../../components/mescroll-uni/mescroll-uni.vue"
	import MescrollUni from "../../components/hot-scroll/mescroll-uni.vue"
	
	export default {
		data() {
			return {
				customBar: this.CustomBar,
				index:-1,
				// #ifdef  APP-PLUS
				magTop:230,
				// #endif
				// #ifdef  H5
				magTop:150,
				// #endif
				tabCur:0,
				scrollLeft:0,
				viewOpen:false,
				tab:['账号搜索','订单号搜索'],
				orderKey:false,
				statusKey:false,
				typeKey:false,
				order:"订单类型",
				status:"订单状态",
				money:"收支",
				picker: [],
				card:[],
				pickerStatus:[{
				  id: "",
				  name: "全部"
				},
				{
				  id: 1,
				  name: "处理中"
				},
				{
				  id: 2,
				  name: "处理成功"
				},
				{
				  id: 3,
				  name: "处理失败"
				},
				{
				  id: 4,
				  name: "订单异常"
				}],
				pickerType:[{
				  id: "",
				  name: "全部"
				},
				{
				  id: 1,
				  name: "收入"
				},
				{
				  id: 2,
				  name: "支出"
				}],
				searchBool:false,
				inputBottom:0,
				result:[],
				searchResult:[],
				upOption:{
					page: {
						size: 5
					},
					noMoreSize: 5,
					textNoMore:'我是有底线的 >_<'  
				},
				cardList:[],
				param:{
					pid:"",
					pcid:"",
					page:1,
					pagesize:10,
					status:"",
					payway:"",
					typeId:"",
					start:"",
					end:"",
					account:"",
					order:""
				},
				searchVal:"",
				timeOpen:false,
				selectMoney:0
			};
		},
		components:{
			MescrollUni
		},
		onLoad(option) {
			if (typeof(option.type) != "undefined" && option.type == "business") {
				this.param.payway = 2
				this.selectMoney = 2
			}
		},
		created() {
			this.initBefore()
		},
		methods: {
			initBefore() {
				// let id = this.$route.params.id;
				// this.$get("/v1/personal/user/info").then(res => {
				//   this.userInfo = res.data.data
				//   if(this.userInfo.shangwu_rabc == 1){
				//     // this.option.splice(2,1)
				//     this.personalType = false;
				//   }
				// });
				// if (id == "jb") {
				//   this.payway = 1;
				//   this.orderClick();
				// } else if (id == "swb") {
				//   this.payway = 2;
				//   this.orderClick();
				// }
				
				// 点卡列表
				this.$http.get("/v1/front/point/card/list").then(res => {
				    if (res.data.code == 200) {
				      this.card = res.data.data.data
					  //console.log( this.card)
				      //if (this.card.length > 0) {
				        // this.card.sort((a, b) => {
				        //   return a.name.length - b.name.length;
				        // });
				      //}
				    }
				  }
				);
				// 平台列表
				this.$http.get("/v1/front/data/my/platform").then(res => {
				    if (res.data.code == 200) {
							this.picker = res.data.data.data
						}
				    }
				);
			},
			allForCheck(e) {
				this.orderOpen()
				this.param.pid = ""
				this.param.pcid = ""
				this.order = e
				this.mescroll.resetUpScroll()
			},
			platForCheck(e) {
				this.orderOpen()
				this.param.pid = e.id
				this.param.pcid = ""
				this.order = e.platform
				this.mescroll.resetUpScroll()
			},
			midForCheck(e) {
				this.orderOpen()
				this.param.pcid = e.pcid
				this.param.pid = ""
				this.order = e.name
				this.mescroll.resetUpScroll()
			},
			statusForCheck(e) {
				this.statusOpen()
				this.param.status = e.id
				this.status = e.name
				this.mescroll.resetUpScroll()
			},
			typeForCheck(e) {
				this.moneyOpen()
				this.param.typeId = e.id
				this.money = e.name
				this.mescroll.resetUpScroll()
			},
			mescrollInit(mescroll) {
				this.mescroll = mescroll
			},
			downCallback() {
				this.mescroll.resetUpScroll()
			},
			upCallback() {
				this.initData()
			},
			initData() {
				let paramArr = this.param
				paramArr.page = this.mescroll.num
				paramArr.pagesize = this.mescroll.size
				this.$http.get('/v1/front/user/money/details',{params:paramArr}).then(res => {
					if (paramArr.page == 1) {
						this.result = []
					}
					let data = res.data.data.data.data
					this.mescroll.endSuccess(data.length)
					this.result = this.result.concat(data)
				})
				.catch(err => {
					this.mescroll.endErr();
				});
			},
			handMid(e) {
				if (e.contents.indexOf("退款") != -1) {
				  return "-";
				} else if (e.contents.indexOf("退还") != -1) {
				  return "-";
				} else if (e.contents.indexOf("提现") !== -1) {
				  return "-";
				} else if (e.typeId == "支出" && e.num > 1) {
				  return e.num + "X" + parseFloat(Number(e.mid).toFixed(3));
				} else if (e.pcid !== null) {
				  return e.mid + "x" + e.num;
				} else if (e.mid[e.mid.length - 1] == 0) {
				  return parseFloat(Number(e.mid).toFixed(3));
				} else {
				  return e.mid;
				}
			},
			tabSelect(e) {
				this.tabCur = e.currentTarget.dataset.id;
				this.scrollLeft = (e.currentTarget.dataset.id - 1) * 60
			},
			orderOpen(e) {
				this.orderKey = this.orderKey ? false : true
				this.statusKey = this.typeKey = this.gameKey = false
			},
			statusOpen(e) {
				this.statusKey = this.statusKey ? false : true
				this.orderKey = this.typeKey = this.gameKey = false
			},
			moneyOpen(e) {
				this.typeKey = this.typeKey ? false : true
				this.orderKey = this.statusKey = this.gameKey = false
			},
			search(e) {
				this.searchBool = e
			},
			inputFocus(e) {
				this.inputBottom = e.detail.height
			},
			inputBlur(e) {
				this.inputBottom = 0
			},
			hideView() {
				this.viewOpen = false
			},
			viewCamille(e) {
				this.cardList = e
				this.viewOpen = true
			},
			hideTime() {
				this.timeOpen = false
			},
			viewTime() {
				this.timeOpen = true
			},
			copy(e) {
				uni.setClipboardData({
				    data: e.card  + ',' + e.pwd,
				    success: function () {
				    }
				})
			},
			copyOrder(e) {
				uni.setClipboardData({
				    data: e,
				    success: function () {
				    }
				})
			},
			searchGame() {
				if (this.searchVal == "") {
					return
				}
				let paramArr = {
					page:1,
					pagesize:1000,
					account:"",
					order:""
				}
				if (this.tabCur == 0) {
					paramArr.account = this.searchVal
					paramArr.order = ""
				} else {
					paramArr.account = ""
					paramArr.order = this.searchVal
				}
				this.$http.get('/v1/front/user/money/details',{params:paramArr}).then(res => {
					this.searchResult = res.data.data.data.data
				})
				.catch(err => {
					this.mescroll.endErr();
				});
			},
			openTimeSelect() {
				
			},
			startChange(e) {
				this.param.start = e.detail.value
			},
			endChange(e) {
				this.param.end = e.detail.value
			},
			moneyCheck(e) {
				this.selectMoney = e
				if (e == 0) {
					e = ""
				}
				this.param.payway = e
			},
			reset() {
				this.param.start = ""
				this.param.end = ""
				this.selectMoney = 0
				this.param.payway = ""
			},
			apply() {
				this.hideTime()
				this.mescroll.resetUpScroll()
			}
		}
	}
</script>

<style lang="less">
	.cuIcon-search {
		font-size: 2.2vh;
	}
	.search {
		background: #FFFFFF;
		width: 100%;
		height: 100%;
		position: absolute;
		top: 0;
		left: 0;
		right: 0;
		bottom: 0;
		.main {
			position: relative;
		}
	}
	.fold {
		height: 5vh;
		line-height: 5vh;
	}
	.order-list {
		background: #FFFFFF;
		padding:2vh 2vh 0 2vh;
	}
	.platform {
		height: 70rpx;
		line-height: 70rpx;
		background: #fff;
		font-size: 30rpx;
		position: relative;
		.platform-item {
			height: 50rpx;
			line-height: 50rpx;
			margin: auto 3%;
			width: 25%;
			text-align: center;
			justify-content: space-around;
			display: flex;
			.cuIcon-filter {
				position: absolute;
				right: 30rpx;
			}
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
	.time-top {
		z-index: 9999;
	}
	.search-apply {
		position: absolute;
		bottom: 50rpx;
		right: 50rpx;
	}
</style>
