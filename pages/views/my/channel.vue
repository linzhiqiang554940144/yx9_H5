<template>
	<view>
		<cu-header :isBack="true" bgColor="bg-white">
			<block slot="backText"></block>
			<block slot="content">我的渠道</block>
		</cu-header>
		<view class="margin-top"></view>
		<view class="order-list solid-bottom" v-for="item in channels" :key="item.id">
			<view class="flex align-center justify-between">
				<view>
					<view class="cu-avatar sm" style="background-image:url(https://ossweb-img.qq.com/images/lol/web201310/skin/big10001.jpg);"></view>
					<text class="text-lg margin-left-sm text-bold">{{item.platform }}</text>
				</view>
				<view><text class="text-df">{{item.from == 1?(item.status == 2 ?'申请成功':(item.status == 1?'申请中':'申请失败')):item.status == 2 ?'绑定成功':(item.status == 1?'绑定中':'绑定失败')}}</text></view>
			</view>
			<view class="margin-top-sm bg-gray">
				<view class="flex align-center padding-xs justify-between padding-top-sm">
					<text>渠道账号</text>
					<text>{{item.account}}</text>
				</view>
				<view class="flex align-center padding-xs justify-between"  v-show="item.cardshow">
					<text>登录密码</text>
					<text>{{item.showpwd == 1?(item.pwd?item.pwd:'*******'):'*******'}}</text>
				</view>
				<view class="flex align-center padding-xs justify-between padding-bottom-sm"  v-show="item.cardshow">
					<text>支付密码</text>
					<text>{{item.showpwd == 1?(item.paypwd?item.paypwd:'*******'):'*******'}}</text>
				</view>
			</view>
			<view class="margin-top-sm flex  justify-between"  v-show="item.cardshow">
				<view class="text-gray">{{item.create_time}}</view>
				<view class="text-xxl">
					<text class="cuIcon-attention" @tap="showModal(item,$event)" data-target="pwdshow"></text>
					<text class="cuIcon-write margin-left-sm" @tap="showModal(item,$event)" data-target="editchannel"></text>
				</view>
			</view>
			<view class="text-center fold" @click="isShow(item)">
				<span v-if="item.cardshow">
					<text class="cuIcon-fold"></text>
				</span>
				<span v-else>
					<text class="cuIcon-unfold"></text>
				</span>
			</view>
		</view>

		<view class="cu-modal" :class="modalName=='pwdshow'?'show':''">
			<view class="cu-dialog">
				<view class="cu-bar bg-white justify-end">
					<view class="content">输入支付密码</view>
					<view class="action" @tap="hideModal">
						<text class="cuIcon-close text-red"></text>
					</view>
				</view>
				<view class="padding-xl">
					<input type="password" style="background-color: #FFFFFF;height: 50px;" name="paypwd"  v-model="paypwd"></input>
				</view>
				<view class="cu-bar bg-white justify-end">
					<view class="action">
						<button class="cu-btn line-green text-green" @tap="hideModal">取消</button>
						<button class="cu-btn bg-green margin-left" @tap="confirm">确定</button>
		
					</view>
				</view>
			</view>
		</view>
		<view class="cu-modal" :class="modalName=='editchannel'?'show':''">
			<view class="cu-dialog">
				<view class="cu-bar bg-white justify-end">
					<view class="content">编辑渠道信息</view>
					<view class="action" @tap="hideModal">
						<text class="cuIcon-close text-red"></text>
					</view>
				</view>
				<view class="cu-form-group">
					<view class="title">渠道号</view>
					<text>{{channel.account}}</text>
				</view>
				<view class="cu-form-group">
					<view class="title">渠道登录密码</view>
					<input placeholder=""  type="text" name=""  v-model="channel.pwd"></input>
				</view>
				<view class="cu-form-group">
					<view class="title">渠道支付密码</view>
					<input placeholder="" type="text" name=""  v-model="channel.paypwd"></input>
				</view>
				<view class="cu-bar bg-white justify-end">
					<view class="action">
						<button class="cu-btn line-green text-green" @tap="hideModal">取消</button>
						<button class="cu-btn bg-green margin-left" @tap="confirm">确定</button>
		
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
				channels:'',
				paypwd:'',
				channel:'',
				modalName: null,
				type:1,
			};
		},
		created() {
			this.initData()
			console.log(this.showpwd)
		},
		methods: {
			initData() {
				this.$http.get(process.env.API + '/v1/front/my/channel').then(res => {
					if (res.data.code != 200) {
						uni.showToast({
						    icon: 'none',
							position: 'bottom',
						    title: res.data.message
						});
						return
					}
					this.channels = res.data.data.data
					console.log(this.channels)
				})
				.catch(err => {
					//console.log(err);
				});
			},
			isShow(item){
				if(!item.cardshow){
					this.$set(item,'cardshow',false)
				}
				item.cardshow = !item.cardshow
			},
	
			getChannelPwd(paypwd,channel){
				this.$http.get(process.env.API + '/v1/front/channel/info?channelid='+this.channel.id+'&paypwd='+paypwd).then(res => {
					if (res.data.code != 200) {
						this.paypwd = ''
						uni.showToast({
						    icon: 'none',
							position: 'bottom',
						    title: res.data.message
						});
						return
					}
					this.paypwd = paypwd
					if(this.type == 1){
						if(!channel.paypwd){
							this.$set(channel,'paypwd',res.data.data.data.paypwd?res.data.data.data.paypwd:'-')
						}
						if(!channel.pwd){
							this.$set(channel,'pwd',res.data.data.data.pwd?res.data.data.data.pwd:'-')
						}
						if(!channel.showpwd){
							this.$set(channel,'showpwd','1')
						}
						
					}else{
						this.type = 2;
						this.modalName = "editchannel";
					}
				})
				.catch(err => {
					//console.log(err);
				});
			},
			editChannelInfo(){
				if(this.channel.pwd === undefined || this.channel.paypwd === undefined){
					uni.showToast({
					    icon: 'none',
						position: 'bottom',
					    title: '请输入渠道登录密码和支付密码'
					});
					return
				}
				let data = {
					id:this.channel.id,
					chpwd:this.channel.pwd,
					chpaypwd:this.channel.paypwd,
					paypwd:this.paypwd
				}
				this.$http.post(process.env.API + '/v1/front/channel/pwd/modif',data).then(res => {
					if (res.data.code != 200) {
						this.paypwd = ''
						uni.showToast({
						    icon: 'none',
							position: 'bottom',
						    title: res.data.message
						});
						return
					}
					uni.showToast({
					    icon: 'success',
						position: 'bottom',
					    title: res.data.message
					});
				
				})
				.catch(err => {
					//console.log(err);
				});
			},
			showModal(item,e) {
				this.channel = item;
				this.type = e.currentTarget.dataset.target == 'editchannel'?2:1;
				
				if(this.paypwd == ''){
					if(this.type==2){
						this.type = 3
					}
					this.modalName = "pwdshow";
					return;
				}
				
				
				if(this.type == 1){
					if(this.channel.showpwd == 1){
						this.channel.showpwd = 0
						return
					}
					this.getChannelPwd(this.paypwd,this.channel)
				}else{
					this.modalName = "editchannel";
				}
				
				
				
			},
			hideModal() {
				this.modalName = null
			},
			confirm(){
				if(this.type == 1 || this.type == 3){
					this.getChannelPwd(this.paypwd,this.channel)
				}else{
					this.editChannelInfo()
				}
				this.hideModal()
			},
		}
	}

</script>

<style lang="less">
	.order-list {
		background: #FFFFFF;
		padding:2vh 2vh 0 2vh;
	}
	.cu-form-group .title {
		min-width: calc(4em + 15px);
	}
</style>
