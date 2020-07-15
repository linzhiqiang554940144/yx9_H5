<template>
  <view>
    <cu-header :isBack="true">
      <block slot="backText">返回</block>
      <block slot="content">玩家充值</block>
    </cu-header>
    <view class="cu-form-group">
      <view class="title">游戏平台</view>
      <picker @change="platformChange" :value="platform.platform" :range="platformArr">
        <view class="picker">{{platform.platform}}</view>
      </picker>
    </view>
    <view class="cu-form-group">
      <view class="title">渠道号</view>
      <picker
        mode="selector"
        @change="chennalChange"
        :range="channel.channelArr"
        :range-key="'account'"
      >
        <view class="picker">{{channel.channelArr[channel.index].account}}</view>
      </picker>
    </view>
    <view class="cu-form-group" v-if="platform.platform!=='Lx'">
      <view class="title">游戏</view>
      <text @click="showGamePop">{{gameName}}</text>
      <!-- <picker mode="selector" @change="gameChange" :range="gameList.game" :range-key="'name'">
        <view class="picker">{{gameList.game[gameList.index].name}}</view>
      </picker>-->
    </view>
    <view class="cu-form-group">
      <view class="title">{{platform.platform=='当乐'?'充值乐号':'充值账号'}}</view>
      <text @click="showNumPop">{{cz_number}}</text>
    </view>
    <view class="cu-form-group" v-if="platform.platform=='百度'">
      <view class="title">账号类型</view>
      <text>{{numberData.bdType=='1'?'百度账号':numberData.bdType=='2'?'多酷账号':numberData.bdType=='3'?'玩家ID':'请先输入账号'}}</text>
    </view>
    <view class="cu-form-group" v-if="platform.platform=='Lx'">
      <view class="title">账号类型</view>
      <view>
        <radio-group @change="radioChange">
          <label class="radio">
            <radio value="0" checked="true" style="transform:scale(0.7)" />玩家ID
          </label>
          <label class="radio">
            <radio value="1" style="transform:scale(0.7)" />玩家账号
          </label>
        </radio-group>
      </view>
    </view>
    <view class="cu-form-group">
      <view class="title">充值金额</view>
      <input class="uni-input" v-model="wmoney" placeholder="请输入充值金额" />
    </view>
    <view class="cu-form-group margin-top">
      <view class="title">久币支付(余额:{{formatMoney(userInfo.user_money)}})</view>
      <view class="title">
        <checkbox class="round" :class="payType == 0 ? 'checked' : ''" @click="playCheck(0)"></checkbox>
      </view>
    </view>
    <view class="cu-form-group" v-if="businessPay">
      <view class="title">商务币支付(余额:{{formatMoney(userInfo.shangwubi)}})</view>
      <view class="title">
        <checkbox class="round" :class="payType == 1 ? 'checked' : ''" @click="playCheck(1)"></checkbox>
      </view>
    </view>
    <view class="cu-form-group margin-top">
      <view class="title">平台折扣</view>
      <view class="title text-red">{{formatMoney(ptzk)}}折</view>
    </view>
    <view class="cu-form-group" v-if="this.platform.platform!=='Lx'">
      <view class="title">游戏折扣</view>
      <view class="title text-red">
        {{numberData.rate?numberData.rate:'0'}}折
        <text v-if="numberData.rate">({{numberData.recharge==1?'首充':'续充'}})</text>
      </view>
    </view>
    <view class="cu-bar bg-white tabbar border shop">
      <view class="money align-center justify-start flex margin-left">
        实付金额:
        <view class="red">{{money}}</view>
      </view>
      <view class="bg-red submit" @click="toPay()">立即支付</view>
    </view>
    <pay :open="payOpen" :err="errTxt"></pay>
    <!-- 选择游戏搜索 -->
    <view class="cu-modal bottom-modal" :class="gamePop?'show':''">
      <view class="cu-dialog">
        <view class="cu-bar bg-white">
          <!-- <view class="action text-green">确定</view> -->
          <view class="action text-blue" @tap="gamePop=false">取消</view>
        </view>
        <view class="title">
          <view class="input-box">
            <input class="input_sousuo" v-model="gameList.searchName" placeholder="请输入游戏名" />
            <icon
              v-if="gameList.searchName"
              @click="gameList.searchName = '';change_filter_game();"
              class="iconab"
              type="clear"
              size="16"
            />
          </view>
          <button class="btn" type="primary" @click="change_filter_game">搜索</button>
        </view>
        <view>
          <scroll-view scroll-y="true" class="scroll-Y">
            <view
              class="scroll-view-item"
              v-for="(item,index) in gameList.filter_game"
              @click="click_gameList(item,index)"
              :key="index"
            >
              {{item.name}}
              <text>({{item.from==1?'安卓':item.from==2?'IOS':'H5'}})</text>
            </view>
          </scroll-view>
        </view>
      </view>
    </view>
    <!-- 验证账号pop -->
    <view class="cu-modal" :class="numberPop?'show':''">
      <view class="cu-dialog">
        <view class="cu-bar bg-white justify-end">
          <view class="content">请输入充值账号</view>
          <view class="action" @tap="hideModal">
            <text class="cuIcon-close text-red"></text>
          </view>
        </view>
        <view class="padding-xl">
          <input class="uni-input" v-model="number" placeholder="请输入充值账号" />
        </view>
        <view class="cu-bar bg-white justify-end">
          <view class="action">
            <button class="cu-btn line-green text-green" @tap="hideModal">取消</button>
            <button class="cu-btn bg-green margin-left" @tap="yz_number">确定</button>
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
      userInfo: {},
      use: false,
      number: "", //验证玩家充值账号
      cz_number: "请输入充值账号", //玩家充值账号
      numberPop: false,
      gameName: "请选择游戏",
      gamePop: false,
      platform: { platform: "请选择游戏平台" },
      payOpen: false,
      businessPay: false, //商务币
      platformArr: [],
      errTxt: "",
      gameList: {
        game: [{ name: "" }],
        filter_game: [{ name: "" }],
        index: 0,
        searchName: ""
      },
      channel: {
        channelArr: [{ account: "请选择渠道号", cid: "", title: "" }],
        index: 0
      },
      ptzk: 0,
      yxzk: 0,
      resultP: [],
      payType: 0,
      pid: "",
      cid: "",
      gid: "",
      wmoney: "",
      numberData: {
        firRate: "",
        lastRate: "",
        recharge: "",
        rate: "",
        bdType: "",
        lxType: "0"
      }
    };
  },
  computed: {
    money() {
      let ptZk = this.ptzk / 10;
      let zk = 0;
      zk = this.numberData.rate;
      zk = Number(zk).toFixed(3);
      zk = parseFloat(zk) / 10;
      if (
        this.platform.platform == "57k" ||
        this.platform.platform == "当乐" ||
        this.platform.platform == "坚果" ||
        this.platform.platform == "夜神" ||
        this.platform.platform == "木蚂蚁"
      ) {
        return Math.ceil(this.wmoney * zk) * ptZk;
      } else if (this.platform.platform == "Lx") {
        // console.log("联想");
        return this.wmoney * ptZk;
      } else if (this.platform.platform == "乐8") {
        // console.log("乐8", zk);
        return this.wmoney * zk;
      } else {
        // let zk =
        //   this.shouxus == "(首充)" ? this.firRate / 10 : this.lastRate / 10;
        return this.wmoney * ptZk * zk;
        // console.log('else')a
      }
    }
  },
  created() {
    this.getUserInfo().then(res => {
      if (res.code == 200) {
        this.userInfo = res.data.data;
        if (
          typeof this.userInfo.shangwu_rabc != "undefined" &&
          this.userInfo.shangwu_rabc > 1
        ) {
          this.businessPay = true;
        }
      }
    });
    this.initData();
    this.initPlatform();
  },
  onLoad() {
    uni.$on("changeOpen", e => {
      this.payOpen = e;
    });
    uni.$on("sendPwd", e => {
      this.applyTo(e);
    });
  },
  onUnload() {
    uni.$off("changeOpen");
    uni.$off("sendPwd");
  },
  methods: {
    initData() {
      this.$http.get("/v1/check/recharge/status/qdcz").then(res => {
        if (res.data.code == 200) {
          this.use = res.data.data.status;
          if (!this.use) {
            uni.showToast({
              icon: "none",
              position: "center",
              title: "充值已被关闭"
            });
          }
        } else {
          uni.showToast({
            icon: "none",
            position: "center",
            title: res.data.message
          });
          this.use = false;
          return;
        }
      });
    },
    showGamePop() {
      this.gamePop = true;
    },
    radioChange(e) {
      this.numberData.lxType = e;
    },
    change_filter_game() {
      this.gameList.filter_game = this.gameList.game.filter(item => {
        if (item.name.indexOf(this.gameList.searchName) > -1) {
          return item;
        }
      });
    },
    // 点击游戏
    click_gameList(item, index) {
      let form = item.from == 1 ? "安卓" : item.from == 2 ? "IOS" : "H5";
      this.gameName = `${item.name}(${form})`;
      this.gameList.index = index;
      if (this.gameList.filter_game[this.gameList.index].id) {
        this.gid = this.gameList.filter_game[this.gameList.index].id;
      }
      this.gamePop = false;
    },
    //   平台变化
    platformChange(e) {
      // this.platform = e.detail.value
      this.pid = this.resultP[e.detail.value].pid;
      this.platform = this.resultP[e.detail.value];
      this.change_paytype();
      this.$http.get("/v1/recharge/channel/platform/" + this.pid).then(res => {
        this.channel.channelArr = res.data.data.data;
        this.channel.channelArr.unshift({
          account: "请选择渠道",
          cid: "",
          title: ""
        });
        this.reset("pt");
      });
    },
    reset(name) {
      if (name == "pt") {
        this.channel.index = 0;
      } else if (name == "all") {
        this.platform = { platform: "请选择游戏平台" };
        this.ptzk = "";
        this.numberData.rate = "";
        this.number='';
      }
      this.gameList.searchName = "";
      this.gameList.index = 0;
      this.gameName = "请选择游戏";
      this.numberData.rate = "";
      this.numberData.recharge = "";
      this.wmoney = "";
      this.payType = 0;
      this.cz_number = "请输入充值账号";
    },
    // 渠道变化
    chennalChange(e) {
      this.channel.index = e.detail.value;
      this.cid = this.channel.channelArr[this.channel.index].cid;
      //   console.log(
      //     this.channel.channelArr[this.channel.index],
      //     "this.channel.channelArr[this.channel.index]"
      //   );
      if (this.channel.index > 0) {
        this.$http.get("/v1/recharge/game?pid=" + this.pid).then(res => {
          if (res.data.data.data.length > 0) {
            this.gameList.game = res.data.data.data;
            this.gameList.filter_game = res.data.data.data;
            this.reset();
            // this.gameList.game.unshift({
            //   name: "请选择游戏"
            // });
          }
        });
      }
    },
    showNumPop() {
      this.numberPop = true;
    },
    yz_number() {
      this.numberPop = false;
      if (this.platform.platform == "Lx") {
        this.cz_number = this.number;
        return;
      }
      uni.showLoading({
        title: "请稍后"
      });
      this.$http
        .post("/v1/recharge/player/type", {
          pid: this.pid,
          cid: this.cid,
          gfid: this.gid,
          username: this.number
        })
        .then(res => {
          uni.hideLoading();
          if (res.data.code == 200) {
            this.cz_number = this.number;
            if (res.data.data.rateType == 1) {
              this.numberData.rate = res.data.data.rate;
            } else {
              this.numberData.rate = res.data.data.rate;
            }
            this.numberData.recharge = res.data.data.rateType;
            if (res.data.data.rateEditNotice == "true") {
              uni.showToast({
                icon: "none",
                position: "center",
                title: "游戏折扣已同步更新，请注意！",
                duration: 3000
              });
            }
            if (res.data.data.accountNumber.length) {
              if (res.data.data.accountNumber.length == 1) {
                if (res.data.data.accountNumber[0].accountType == "1") {
                  this.numberData.bdType = "1";
                } else if (res.data.data.accountNumber[0].accountType == "2") {
                  this.numberData.bdType = "2";
                } else {
                  this.numberData.bdType = "3";
                }
              }
            }
          } else {
            uni.showToast({
              icon: "none",
              position: "center",
              title: res.data.message,
              duration: 3000
            });
          }
        });
    },
    hideModal() {
      this.numberPop = false;
    },
    change_paytype() {
      if (!this.platform.pid) return;
      // lx折扣特殊
      if (this.platform.platform == "Lx") {
        this.lxBtn = false;
        this.$http.get("/v1/recharge/lenovo/voucher?pcid=66").then(res => {
          this.lxZkitem = res.data.data.data;
          if (this.payType == 0) {
            this.ptzk = this.lxZkitem.userDisRate
              ? this.lxZkitem.userDisRate
              : this.lxZkitem.starDisRate
              ? this.lxZkitem.starDisRate
              : this.lxZkitem.disRate;
          } else {
            this.ptzk = this.lxZkitem.userRate
              ? this.lxZkitem.userRate
              : this.lxZkitem.starRate
              ? this.lxZkitem.starRate
              : this.lxZkitem.rate;
          }
          return;
        });
      }
      if (this.payType == 0) {
        this.ptzk = this.platform.userDisRate
          ? this.platform.userDisRate
          : this.platform.starDisRate
          ? this.platform.starDisRate
          : this.platform.disRate;
      } else {
        this.ptzk = this.platform.userRate
          ? this.platform.userRate
          : this.platform.starRate
          ? this.platform.starRate
          : this.platform.rate;
      }
    },
    initPlatform() {
      this.$http.get("/v1/recharge/channel/platform?type=2&pos=2").then(res => {
        if (res.data.code == 200) {
          this.resultP = res.data.data.data;
          for (let i = 0; i < this.resultP.length; i++) {
            this.platformArr.push(this.resultP[i].platform);
          }
        }
      });
    },
    playCheck(e) {
      this.payType = e;
      this.change_paytype();
    },
    toPay() {
      if (this.use) {
        if (
          typeof this.platform.pid == "undefined" ||
          this.platform.pid == ""
        ) {
          uni.showToast({
            icon: "none",
            position: "center",
            title: "请先选择游戏平台"
          });
          return;
        }
        if (typeof this.cid == "undefined" || this.cid == "") {
          uni.showToast({
            icon: "none",
            position: "center",
            title: "请先选择渠道号"
          });
          return;
        }
        if (
          typeof this.cz_number == "undefined" ||
          this.cz_number == "请输入充值账号"
        ) {
          uni.showToast({
            icon: "none",
            position: "center",
            title: "请输入充值账号"
          });
          return;
        }
        if (
          (typeof this.gameName == "undefined" ||
            this.gameName == "请选择游戏") &&
          this.platform.platform !== "Lx"
        ) {
          uni.showToast({
            icon: "none",
            position: "center",
            title: "请先选择游戏"
          });
          return;
        }
        if (this.wmoney == "") {
          uni.showToast({
            icon: "none",
            position: "center",
            title: "金额不能为空"
          });
          return;
        }
        this.errTxt = "";
        this.payOpen = true;
      }
    },
    lxSubmit(e) {
      let params = {
        num: this.wmoney,
        paypwd: e,
        username: this.cz_number,
        payway: this.payType + 1,
        mid: "1",
        recharge: "2",
        type: this.numberData.lxType,
        cid: this.cid
      };
      this.$http.post("/v1/recharge/lenovo/voucher", params).then(res => {
        if (res.data.code == 200) {
          uni.$emit("payBack", true);
          this.reset("all");
        } else {
          uni.$emit("payBack", false);
          this.errTxt = res.data.message;
        }
      });
    },
    applyTo(e) {
      if (this.platform.platform == "Lx") {
        this.lxSubmit(e);
        return;
      }
      let params = {
        pid: this.pid,
        cid: this.cid,
        gfid: this.gid,
        paypwd: e,
        username: this.cz_number,
        money: this.wmoney,
        recharge: this.numberData.recharge,
        payway: this.payType + 1,
        type: this.platform.platform == "百度" ? this.numberData.bdType : "2"
      };
      // if (this.platform.pid == "e37395fdab41836fbadc68ad865d5825") {
      //   params.coin_type = this.leType + 1;
      // }
      this.$http.post("/v1/recharge/player", params).then(res => {
        if (res.data.code == 200) {
          uni.$emit("payBack", true);
          this.reset("all");
        } else {
          uni.$emit("payBack", false);
          this.errTxt = res.data.message;
        }
      });
    }
  }
};
</script>

<style lang='less' scoped>
.cu-modal.bottom-modal .cu-dialog {
  height: 800rpx;
  .title {
    display: flex;
    padding: 10px;
    justify-content: space-around;
    align-items: center;
    .btn {
      height: 50rpx;
      width: 120rpx;
      line-height: 50rpx;
      font-size: 14px;
    }
  }
  .input-box {
    position: relative;
    .iconab {
      position: absolute;
      right: 5rpx;
      top: 15rpx;
    }
    .input_sousuo {
      background-color: #fff;
      border-radius: 5px;
      height: 30px;
      width: 500rpx;
      &::-webkit-input-placeholder {
        font-size: 10px;
      }
    }
  }
  .scroll-Y {
    height: 650rpx;
    .scroll-view-item {
      margin-bottom: 20rpx;
    }
  }
}
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
.money {
  width: 60%;
}
.submit {
  width: 40%;
}
.content .title {
  height: 6vh;
  line-height: 6vh;
  margin: 0 1vh;
}
</style>
