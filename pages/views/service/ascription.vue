<template>
	<view>
		<cu-header :isBack="true">
			<block slot="content">账号归属查询</block>
		</cu-header>
		<view class="cu-form-group">
			<view class="title">游戏平台</view>
			<picker @change="platformChange" :value="platform" :range="platformList" :range-key="'platform'">
				<view class="picker">
					{{platform}}
				</view>
			</picker>
		</view>
		<view class="cu-form-group">
			<view class="title">渠道号</view>
			<picker @change="channelTitleChange" :value="channelTitle" :range="channelTitleList" :range-key="'title'">
				<view class="picker">
					{{channelTitle}}
				</view>
			</picker>
		</view>
		<view class="cu-form-group" v-show="gameChangeShow" >
			<view class="title">选择游戏</view>
			<picker @change="gameChange" :value="game"  :range="gameList" :range-key="'name'">
				<view class="picker">
					{{game}}
				</view>
			</picker>
		</view>
		<view class="cu-form-group margin-top" v-if="accountTypeShow">
			<view class="uni-title">账号类型</view>
			<radio-group @change="radioChange">
			<label class="radio"><radio value="0" name='type' checked="true"/>玩家ID</label>
			<label class="radio" style="margin-left: 10px;"><radio value="1" name='type'/>玩家账号</label>
			</radio-group>
		</view>
		<view class="cu-form-group margin-top" v-show="accountInputShow">
			<view class="title">{{accountName}}</view>
			<input class="uni-input"  placeholder="请输入账号ID" v-model="account" />
		</view>
		<view class="cu-bar bg-white tabbar border shop">
			<view class="bg-red submit" @click="querySubmit()">查询</view>
		</view>
		
		<view class="cu-load load-modal" v-if="loadModal">
			<!-- <view class="cuIcon-emojifill text-orange"></view> -->
			<image src="/static/logo.png" mode="aspectFit"></image>
			<view class="gray-text">加载中...</view>
		</view>
		
		
	</view>
</template>

<script>
	export default {
		data() {
			return {
				platform:'请选择平台',
				pid:'',
				platformList:[],
				channelTitle:'请选择渠道号',
				cid:'',
				channelTitleList:[],
				gameChangeShow:true,
				game:'请选择游戏',
				channelNo:'',
				gameList:[],
				account:'',
				accountName:'账号ID',
				accountInputShow:true,
				accountType:0,
				accountTypeShow:false,
				loadModal:false
			};
		},
		created() {
			this.getPlatformList()
		},
		methods: {
			platformChange(e) {
				this.platform = this.platformList[e.detail.value].platform
				this.pid = this.platformList[e.detail.value].pid
				this.gameChangeShow = this.pid == "112d4c08823748d5129ead3cfa37e41e"?false:true
				this.accountTypeShow = this.pid == "1112f5e8a9eda387a8448261a9b05180"?true:false
				this.getChannelTitleList();
				
				//清除渠道号游戏列表
				this.channelTitle = "请选择渠道号"
				this.gameList = []
				this.channelTitleList = []
				this.game = "请选择游戏"
				this.account = ""
				
				//更改accountName
				if(this.pid == '96e9deea17311aa83f673cf60c42995f'){
					this.accountName = '账号ID'
					return
				}
				if(this.pid == '1112f5e8a9eda387a8448261a9b05180'){
					this.accountName = '玩家ID'
					return
				}
				if(this.pid == '112d4c08823748d5129ead3cfa37e41e'){
					this.accountName = '游戏账号'
				}else{
					this.accountName = '账号'
				}
				
			},
			channelTitleChange(e) {
				console.log()
				this.channelTitle = this.channelTitleList[e.detail.value].title
				this.cid = this.channelTitleList[e.detail.value].cid
				if(this.pid == '112d4c08823748d5129ead3cfa37e41e'){
					this.channelNo = this.channelTitleList[e.detail.value].title
					return
				}
				this.getGameList();
			},
			gameChange(e) {
				this.game = this.gameList[e.detail.value].name
				this.channelNo = this.gameList[e.detail.value].channel_no
			},
			getPlatformList() {
				this.$http.get(process.env.API + '/v1/account/platform').then(res => {
					if (res.data.code != 200) {
						uni.showToast({
							icon: 'none',
							position: 'bottom',
							title: res.data.message
						});
						return
					}
					this.platformList = res.data.data.data
					console.log(this.platformList)
				})
				.catch(err => {
					//console.log(err);
				});
			},
			getChannelTitleList(){
				this.$http.get(process.env.API + '/v1/account/channle?pid='+this.pid).then(res => {
					if (res.data.code != 200) {
						uni.showToast({
							icon: 'none',
							position: 'bottom',
							title: res.data.message
						});
						return
					}
					this.channelTitleList = res.data.data.data
					console.log(this.channelTitleList)
				})
				.catch(err => {
					//console.log(err);
				});
			},
			
			getGameList(){
				this.$http.get(process.env.API + '/v1/account/game?pid='+this.pid+'&cid='+this.cid).then(res => {
					if (res.data.code != 200) {
						uni.showToast({
							icon: 'none',
							position: 'bottom',
							title: res.data.message
						});
						return
					}
					this.gameList = res.data.data.data
					console.log(this.gameList)
				})
				.catch(err => {
					//console.log(err);
				});
			},
			 radioChange: function(evt) {
				 console.log(evt.target.value)
				 this.accountName = evt.target.value == 0?'玩家ID':'玩家账号'
				 this.accountType = evt.target.value
			},
			
			querySubmit(){
				if(this.pid == ''){
					uni.showToast({
						icon: 'none',
						position: 'bottom',
						title: '请选择平台'
					});
					return
				}
				if(this.game == '请选择游戏' && this.pid != '112d4c08823748d5129ead3cfa37e41e'){
					uni.showToast({
						icon: 'none',
						position: 'bottom',
						title: '请选择游戏'
					});
					return
				}
				if(this.account == ''){
					uni.showToast({
						icon: 'none',
						position: 'bottom',
						title: '请输入账号'
					});
					return
				}
				let data = {
					'pid' : this.pid,
					'game_name' : this.game,
					'channel_no' : this.channelNo,
					'account' : this.account,
				}
				if(this.pid == '1112f5e8a9eda387a8448261a9b05180'){
					data.type = this.accountType
				}
				this.loadModal = true;
				this.$http.post(process.env.API + '/v1/account/check',data).then(res => {
					if (res.data.code != 200) {
						uni.showToast({
							icon: 'none',
							position: 'bottom',
							title: res.data.message
						});
						this.loadModal = false;
						return
					}
					uni.showToast({
						icon: 'success',
						position: 'bottom',
						title: res.data.message
					});
					this.loadModal = false;
				})
				.catch(err => {
					//console.log(err);
					this.loadModal = false;
				});
				
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
