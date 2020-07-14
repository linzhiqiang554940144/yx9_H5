<template>
  <view>
    <cu-header :isBack="true" :bgColor="bgColor">
      <block slot="backText"></block>
      <block slot="content">修改支付密码</block>
    </cu-header>
    <view>
      <view class="margin-top-sm cu-form-group">
        <view class="title">联系方式</view>
        <text class="text-gray">{{userInfo.user_phone}}</text>
      </view>
      <view class="cu-form-group">
        <view class="title">验证码</view>
        <input class="uni-input" v-model="code" placeholder="请输入验证码" />
        <button @click="getCode" :disabled="disabledBtn" class="cu-btn bg-blue shadow">{{text}}</button>
      </view>
      <view class="cu-form-group">
        <view class="title">支付密码</view>
        <input v-model="newPassword" class="uni-input" placeholder="请输入不少于6位支付密码" />
      </view>
      <view class="cu-form-group">
        <view class="title">确认密码</view>
        <input v-model="oldPassword" class="uni-input" placeholder=" 请再次输入支付密码" />
      </view>

      <view class="padding">
        <button
          @click="submit"
          :disabled="sbmitBtn"
          class="cu-btn block line-blue margin-tb-sm lg"
        >确认修改</button>
        <!-- <button class="cu-btn block line-blue margin-tb-sm lg" disabled>确认修改</button> -->
      </view>
    </view>
  </view>
</template>

<script>
export default {
  data() {
    return {
      bgColor: "bg-white",
      disabledBtn: false,
      text: "验证码",
      timer: null,
      code: "",
      newPassword: "",
      oldPassword: "",
      userInfo: {}
    };
  },
  created() {
    uni.$on("changeOpen", e => {
      this.payOpen = e;
    });
    this.$http
      .get(process.env.USER_API + "/v1/personal/user/info")
      .then(res => {
        this.userInfo = res.data.data.data;
      });
  },
  computed: {
    sbmitBtn() {
      console.log("222");
      if (
        this.code.length == 6 &&
        this.newPassword == this.oldPassword &&
        this.newPassword.length >= 6
      ) {
        console.log("222");
        return false;
      } else {
        return true;
      }
    }
  },
  methods: {
    getCode() {
      if (!this.disabledBtn) {
        this.disabledBtn = true;
        this.text = 60;
        this.timer = setInterval(() => {
          this.text--;
          if (this.text == 0) {
            clearInterval(this.timer);
            this.text = "验证码";
            this.disabledBtn = false;
          }
        }, 1000);
        this.$http
          .get(
            process.env.API +
              "/v1/tel/code?tel=" +
              this.userInfo.user_phone +
              "&type=2"
          )
          .then(res => {
            if (res.data.code == 200) {
              uni.showToast({
                icon: "none",
                position: "center",
                title: res.data.message
              });
            } else {
            }
          });
      }
    },
    submit() {
      this.$http
        .post("/v1/personal/updateUserPayPwd", {
          paypwd: this.userInfo.paypwd,
          new_paypwd: this.oldPassword,
          code: this.code,
          tel: this.userInfo.user_phone
        })
        .then(res => {
          if (res.data.code == 200) {
            this.code = "";
            this.newPassword = "";
            this.oldPassword = "";
          }
          uni.showToast({
            icon: "none",
            position: "center",
            title: res.data.message
          });
        });
    }
  }
};
</script>

<style>
.main {
  height: 21vh;
  display: flex;
  align-items: center;
  justify-content: center;
}
</style>
