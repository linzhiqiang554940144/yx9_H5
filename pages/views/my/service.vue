<template>
  <view>
    <cu-header :isBack="true" :bgColor="bgColor">
      <block slot="backText"></block>
      <block slot="content">客服</block>
    </cu-header>
    <view class="margin-top-sm">
      <view class="cu-form-group bg-white">
        <view class="text-lg">专属客服：<text>{{zsList.length>0?zsList[0].nick_name:'暂无'}}</text></view>
        <button v-if="zsList[0]" class="cu-btn bg-olive shadow">咨询</button>
        <!-- <web-view  src="https://uniapp.dcloud.io/static/web-view.html"></web-view> -->
      </view>
      <view class="cu-form-group bg-white margin-top-sm">
        <view class="text-lg text-bold">常见问题</view>
      </view>
      <view class="cu-form-group bg-white">
        <view class="text-lg">如何充值</view>
        <text class="cuIcon-right text-xl"></text>
      </view>
      <view class="cu-form-group bg-white">
        <view class="text-lg">充值不到账,如何解决</view>
        <text class="cuIcon-right text-xl"></text>
      </view>
      <view class="bg-white padding-bottom-xl">
        <view class="cu-form-group margin-top-sm">
          <view class="text-lg text-bold">QQ客服</view>
        </view>
        <view class="cu-form-group">
          <view class="text-xl">运营</view>
        </view>
        <view class="grid col-3 padding-left-xl padding-right-xl">
          <view class="text-lg kefuItem"  v-for="(item,index) in yunyin" :key="index" @click="telme(item.qq)">
            <img class="imglog" src="https://ossweb-img.qq.com/images/lol/web201310/skin/big10001.jpg" alt=""><text>{{item.name}}</text>
          </view>
        </view>
        <view class="cu-form-group">
          <view class="text-xl">结算</view>
        </view>
        <view class="grid col-3 padding-left-xl padding-right-xl">
          <view class="text-lg kefuItem"  v-for="(item,index) in jiesuan" :key="index" @click="telme(item.qq)">
            <img class="imglog" src="https://ossweb-img.qq.com/images/lol/web201310/skin/big10001.jpg" alt=""><text>{{item.name}}</text>
          </view>
        </view>
        <view class="cu-form-group">
          <view class="text-xl">客服</view>
        </view>
        <view class="grid col-3 padding-left-xl padding-right-xl">
          <view class="text-lg kefuItem"  v-for="(item,index) in kefu" :key="index" @click="telme(item.qq)">
            <img class="imglog" src="https://ossweb-img.qq.com/images/lol/web201310/skin/big10001.jpg" alt=""><text>{{item.name}}</text>
          </view>
        </view>
        <view class="cu-form-group">
          <view class="text-xl">投诉</view>
        </view>
        <view class="grid col-3 padding-left-xl padding-right-xl">
          <view class="text-lg kefuItem"  v-for="(item,index) in tousu" :key="index" @click="telme(item.qq)">
            <img class="imglog" src="https://ossweb-img.qq.com/images/lol/web201310/skin/big10001.jpg" alt=""><text>{{item.name}}</text>
          </view>
        </view>
        <view class="cu-form-group">
          <view class="text-xl">商务咨询</view>
        </view>
        <view class="grid col-3 padding-left-xl padding-right-xl" style=" border-bottom: 1px solid #eee;padding-bottom: 20rpx;">
          <view class="text-lg kefuItem"  v-for="(item,index) in zixun" :key="index" @click="telme(item.qq)" >
            <img class="imglog" src="https://ossweb-img.qq.com/images/lol/web201310/skin/big10001.jpg" alt=""><text>{{item.name}}</text>
          </view>
        </view>
        <view class="jinji"><text>紧急联系：15720922132</text></view>
      </view>
    </view>
  </view>
</template>

<script>
export default {
  data() {
    return {
      bgColor: "bg-white",
      zsList: [],
      yunyin:[],
      jiesuan:[],
      kefu:[],
      tousu:[],
      zixun:[],
    };
  },
  created() {
    uni.$on("changeOpen", e => {
      this.payOpen = e;
    });
    this.exclusive();
    this.advisory();
  },
  methods: {
    exclusive() {
      this.$http.get("/v1/exclusive").then(res => {
        if (res.data.code == 200) {
          this.zsList = res.data.data.data;
          console.log(this.zsList,'sz')
        }
      });
    },
    telme(qq){
      console.log(qq)
      // #ifdef H5
      // window.location.href = 'www.baidu.com'
      // #endif
      // #ifdef APP-PLUS
      plus.runtime.openURL('mqq://im/chat?chat_type=wpa&uin=' + qq+ '&version=1&src_type=web ');
      // #endif
    },
    advisory() {
      this.$http.get("/v1/advisory").then(res => {
        this.list = res.data.data.data;
        this.yunyin = [];
        this.jiesuan = [];
        this.kefu = [];
        this.tousu = [];
        this.zixun = [];
        if (this.list.length > 0) {
          for (let index in this.list) {
            if (this.list[index].work == "运营") {
              this.yunyin.push(this.list[index]);
            } else if (this.list[index].work == "结算") {
              this.jiesuan.push(this.list[index]);
            } else if (this.list[index].work == "客服") {
              this.kefu.push(this.list[index]);
            } else if (this.list[index].work == "投诉") {
              this.tousu.push(this.list[index]);
            } else if (this.list[index].work == "商务咨询") {
              this.zixun.push(this.list[index]);
            }
          }
        }
        console.log(this.kefu,'222')
      });
    },
  }
};
</script>

<style lang="less" scoped>
.main {
  height: 21vh;
  display: flex;
  align-items: center;
  justify-content: center;
}
.imglog{
  width: 50rpx;
  height: 50rpx;
  margin-right: 5rpx;
}
.kefuItem{
  display: flex;
  align-items: center;
}
.jinji{
  font-weight: bold;
  padding: 30rpx;
  height: 50rpx;
}
</style>
