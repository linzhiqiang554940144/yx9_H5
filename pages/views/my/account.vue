<template>
  <view>
    <cu-header :isBack="true" :bgColor="bgColor">
      <block slot="backText"></block>
      <block slot="content">提现账号</block>
      <block slot="right">
        <text class="text-lx margin-right-sm" @click="addAccount(true)">添加账号</text>
      </block>
    </cu-header>
    <view class="margin-top">
      <uni-swipe-action>
        <uni-swipe-action-item
          :options="options"
          @click="onClick"
          @change="change"
          v-for="(item,index) in fromList"
        >
          <view class="response">
            <view class="padding-sm bg-white solid-bottom">
              <view class="flex justify-between">
                <text class="text-lg">{{item.type==1?'支付宝':item.type==3?'银行卡':'微信'}}</text>
                <text
                  @click="click_default(item.id)"
                  v-if="item.type != 1"
                  class="text-df text-blue"
                  :class="item.default==1?'text-gray':''"
                >{{item.default==1?'默认提现账号':'设为默认'}}</text>
              </view>
              <view class="flex justify-between margin-top-sm">
                <text class="text-lg text-bold">{{item.card_no}}</text>
                <view>
                  <view class="text-xl">
                    <text
                      @click="openEdit(item.id,item.card_no,item.bankname,item.type)"
                      class="cuIcon-edit"
                    ></text>
                  </view>
                </view>
              </view>
            </view>
          </view>
        </uni-swipe-action-item>
        <!-- <uni-swipe-action-item :options="options" @click="onClick" @change="change">
					<view class="response">
						<view class="padding-sm bg-white solid-bottom">
							<view class="flex justify-between">
								<text class="text-lg">招商银行</text>
								<text class="text-df text-blue">设为默认</text>
							</view>
							<view class="flex justify-between margin-top-sm">
								<text class="text-lg text-bold">6447534562448962</text>
								<view>
									<view class="text-xl">
										<text class="cuIcon-edit"></text>
									</view>
								</view>
							</view>
						</view>
					</view>
        </uni-swipe-action-item>-->
      </uni-swipe-action>
    </view>
    <view class="cu-modal" :class="delOpen ? 'show':''">
      <view class="cu-dialog">
        <view class="padding-xl">是否删除此提现账号？</view>
        <view class="cu-bar bg-white justify-end">
          <view class="action">
            <button class="cu-btn line-green text-green" @click="cancelOpen(false)">取消</button>
            <button class="cu-btn bg-green margin-left" @click="deleteList">确定</button>
          </view>
        </view>
      </view>
    </view>
    <!-- 添加账号 -->
    <view class="cu-modal bottom-modal" :class="add ?'show':''">
      <view class="cu-dialog">
        <view class="cu-bar bg-white solid-bottom" :class="yhkBtn == 1?'mglg':''">
          <view class="padding-left-xl text-blue" @click="cancelOpen(false)">取消</view>
          <view
            @click="submit(1)"
            v-if="zfbBtn"
            class="padding-right-xl"
            :class="zfbNumber.length>5?'text-blue':'text-grey'"
          >完成</view>
          <view
            @click="add_yhk"
            v-if="yhkBtn"
            class="padding-right-xl"
            :class="yhkIndex != -1?'text-blue':'text-grey'"
          >{{yhkBtn==1?'下一步':'添加'}}</view>
        </view>
        <view v-if="!zfbBtn&&yhkBtn == 0">
          <view class="cu-form-group" @click="click_zfb">
            <view>支付宝</view>
          </view>
          <view class="cu-form-group" @click="click_yhk">
            <view>银行卡</view>
          </view>
        </view>
        <view v-if="zfbBtn">
          <view style="padding: 30px;" class="cu-form-group">
            <input class="uni-input" v-model="zfbNumber" placeholder="请输入支付宝账号" />
          </view>
        </view>
        <view v-if="yhkBtn==1">
          <view
            @click="click_choice(index)"
            v-for="(item,index) in yhkList"
            class="cu-form-group"
          >
            <view class>{{item.value}}</view>
            <text v-if="yhkIndex == index" class="lg text-gray" :class="'cuIcon-check'"></text>
          </view>
        </view>
        <view v-if="yhkBtn==2">
          <view style="padding: 30px;" class="cu-form-group">
            <text>{{yhkList[yhkIndex].value}}</text>
            <input class="uni-input" v-model="yhkNumber" placeholder="请输入银行卡账号" />
          </view>
        </view>
      </view>
    </view>
    <!-- 修改提现账号支付宝 -->
    <view class="cu-modal bottom-modal" :class="edit ?'show':''">
      <view class="cu-dialog">
        <view class="cu-bar bg-white solid-bottom">
          <view class="padding-left-xl text-blue" @click="cancelOpen(false)">取消</view>
          <view class="text-bold">输入支付宝账号</view>
          <view @click="submitEdit" class="padding-right-xl text-blue">完成</view>
        </view>
        <view style="padding: 30px;" class="cu-form-group">
          <input class="uni-input" v-model="zfbNumber_edit" placeholder="请输入支付宝账号" />
        </view>
      </view>
    </view>
    <!-- 修改提现账号银行卡 -->
    <view class="cu-modal bottom-modal" :class="edit_yhk ?'show':''">
      <view class="cu-dialog">
        <view class="cu-bar bg-white solid-bottom" :class="edit_yhkBtn==0?' margin-top-lg':''">
          <view class="padding-left-xl text-blue" @click="cancelOpen(false)">取消</view>
          <view class="text-bold">输入银行卡账号</view>
          <view
            @click="click_edit_yhk"
            class="padding-right-xl text-blue"
          >{{edit_yhkBtn==0?'下一步':'修改'}}</view>
        </view>
        <view class="cu-form-group">
          <view style="width: 100%;" class="cu-form-group">
            <view v-if="edit_yhkBtn==0" style=" width: 100%;">
              <view
                @click.native="click_choice(index)"
                v-for="(item,index) in yhkList"
                class="cu-form-group"
                style=" width: 100%;"
              >
                <view class>{{item.value}}</view>
                <text v-if="yhkIndex == index" class="lg text-gray" :class="'cuIcon-check'"></text>
              </view>
            </view>
            <view v-else style="    width: 100%;">
              <text style="float: left;" v-if="yhkIndex != -1">{{yhkList[yhkIndex].value}}</text>
              <input class="uni-input" v-model="yhkNumber_edit" placeholder="请输入银行卡账号" />
            </view>
          </view>
        </view>
      </view>
    </view>
    <view class="text-center notice text-red">提示:左滑可以删除选型</view>
  </view>
</template>

<script>
import uniSwipeAction from "../../components/uni-swipe-action/uni-swipe-action.vue";
import uniSwipeActionItem from "../../components/uni-swipe-action-item/uni-swipe-action-item.vue";

export default {
  data() {
    return {
      bgColor: "bg-white",
      options: [
        {
          text: "删除",
          style: {
            backgroundColor: "#dd524d"
          }
        }
      ],
      edit_yhk: false,
      yhkIndex: -1,
      zfbBtn: false,
      yhkBtn: 0,
      delOpen: false,
      add: false,
      edit: false,
      zfbNumber: "",
      yhkNumber: "",
      zfbNumber_edit: "",
      id_edit: "",
      userInfo: [],
      fromList: [],
      delIndex: -1,
      edit_yhkBtn: 0,
      yhkNumber_edit: "",
      yhkList: [
        {
          label: "国家开发银行",
          value: "国家开发银行"
        },
        {
          label: "中国进出口银行",
          value: "中国进出口银行"
        },
        {
          label: "中国农业发展银行",
          value: "中国农业发展银行"
        },
        {
          label: "中国工商银行",
          value: "中国工商银行"
        },
        {
          label: "中国建设银行",
          value: "中国建设银行"
        },
        {
          label: "中国农业银行",
          value: "中国农业银行"
        },
        {
          label: "中国光大银行",
          value: "中国光大银行"
        },
        {
          label: "中国民生银行",
          value: "中国民生银行"
        },
        {
          label: "中信银行",
          value: "中信银行"
        },
        {
          label: "兴业银行",
          value: "兴业银行"
        },
        {
          label: "华夏银行",
          value: "华夏银行"
        },
        {
          label: "广发银行",
          value: "广发银行"
        },
        {
          label: "上海浦东发展银行",
          value: "上海浦东发展银行"
        },
        {
          label: "恒丰银行",
          value: "恒丰银行"
        },
        {
          label: "浙商银行",
          value: "浙商银行"
        },
        {
          label: "渤海银行",
          value: "渤海银行"
        },
        {
          label: "中国邮政储蓄银行",
          value: "中国邮政储蓄银行"
        },
        {
          label: "城市商业银行",
          value: "城市商业银行"
        },
        {
          label: "北京银行",
          value: "北京银行"
        },
        {
          label: "天津银行",
          value: "天津银行"
        },
        {
          label: "河北银行",
          value: "河北银行"
        },
        {
          label: "沧州银行",
          value: "沧州银行"
        },
        {
          label: "唐山市商业银行",
          value: "唐山市商业银行"
        },
        {
          label: "承德银行",
          value: "承德银行"
        },
        {
          label: "张家口市商业银行",
          value: "张家口市商业银行"
        },
        {
          label: "秦皇岛银行",
          value: "秦皇岛银行"
        },
        {
          label: "邢台银行",
          value: "邢台银行"
        },
        {
          label: "廊坊银行",
          value: "廊坊银行"
        },
        {
          label: "保定银行",
          value: "保定银行"
        },
        {
          label: "邯郸银行",
          value: "邯郸银行"
        },
        {
          label: "衡水银行",
          value: "衡水银行"
        },
        {
          label: "晋商银行",
          value: "晋商银行"
        },
        {
          label: "大同市商业银行",
          value: "大同市商业银行"
        },
        {
          label: "长治银行",
          value: "长治银行"
        },
        {
          label: "其他",
          value: "其他"
        }
      ]
    };
  },
  components: {
    uniSwipeAction,
    uniSwipeActionItem
  },
  created() {
    uni.$on("changeOpen", e => {
      this.payOpen = e;
    });
    this.$http
      .get(process.env.USER_API + "/v1/personal/user/info")
      .then(res => {
        this.userInfo = res.data.data.data;
        this.initData();
      });
  },
  methods: {
    onClick(e) {
      console.log(
        "当前点击的是第" + e.index + "个按钮，点击内容是" + e.content.text
      );
      this.delIndex = e.index;
      this.delOpen = true;
    },
    click_edit_yhk() {
      this.edit_yhkBtn = 1;
    },
    click_choice(index) {
      this.yhkIndex = index;
    },
    click_default(id) {
      this.$http
        .post("/v1/personal/editUserDefaultTakeAccount", {
          user_id: this.userInfo.user_id,
          id: id
        })
        .then(res => {
          // this.init()
          uni.showToast({
            icon: "none",
            position: "center",
            title: res.data.message
          });
          if (res.data.code == 200) {
            this.initData();
          }
        });
    },
    deleteList() {
      this.$http
        .delete(
          "/v1/personal/delUserTakeAccount?user_id=" +
            this.userInfo.user_id +
            "&id=" +
            this.fromList[this.delIndex].id
        )
        .then(res => {
          if (res.data.code == 200) {
            this.delOpen = false;
            this.deleteId = -1;
            this.initData();
          }
        });
    },
    initData() {
      this.$http
        .get("/v1/personal/userTakeAccount?user_id=" + this.userInfo.user_id)
        .then(res => {
          this.fromList = res.data.data.data;
        });
    },
    openEdit(id, card, bank_name, type) {
      this.id_edit = id;
      if (type == 3) {
		this.edit_yhkBtn = 0;
		this.yhkIndex = -1;
        this.edit_yhk = true;
        this.yhkNumber_edit = card;
        this.bank_name = bank_name;
      } else {
        this.edit = true;
        this.zfbNumber_edit = card;
      }
      console.log(bank_name, "bank");
    },
    submitEdit() {
      this.$http
        .post("/v1/personal/editUserTakeAccount", {
          id: this.id_edit,
          user_id: this.userInfo.user_id,
          card_no: this.zfbNumber_edit,
          bank_name: this.bank_name
        })
        .then(res => {
          if (res.data.code == 200) {
            this.initData();
            this.edit = false;
          } else {
            uni.showToast({
              icon: "none",
              position: "center",
              title: res.data.message
            });
          }
        });
    },
    add_yhk() {
      if (this.yhkBtn == 1) {
        return (this.yhkBtn = 2);
      } else if (this.yhkBtn == 2) {
        this.submit(2);
        return;
      }
    },
    reset() {
      this.yhkIndex = -1;
      this.add = false;
      this.yhkNumber = "";
      this.zfbNumber = "";
      this.zfbNumber_edit = "";
    },
    submit(id) {
      if (id == 1 && this.zfbNumber.length < 5) return;
      let data = {
        user_id: this.userInfo.user_id,
        card_no: id == 1 ? this.zfbNumber : this.yhkNumber,
        type: id == 1 ? "1" : "3"
      };
      if (id == 2) {
        data.bank_name = this.yhkList[this.yhkIndex].value;
      }
      this.$http.post("/v1/personal/addUserTakeAccount", data).then(res => {
        if (res.data.code == 200) {
          this.initData();
          this.reset();
        } else {
          uni.showToast({
            icon: "none",
            position: "center",
            title: res.data.message
          });
        }
        this.add = false;
      });
    },
    click_zfb() {
      this.zfbBtn = true;
    },
    click_yhk() {
      this.yhkBtn = 1;
    },
    change(open) {
      console.log("当前开启状态：" + open);
    },
    cancelOpen(e) {
      this.delOpen = false;
      this.add = false;
      this.edit = false;
      this.edit_yhk = false;
    },
    addAccount(e) {
      this.zfbBtn = false;
      this.yhkBtn = 0;
      this.add = e;
    }
  }
};
</script>

<style lang="less" scoped>
.notice {
  position: absolute;
  bottom: 2vh;
  left: 0;
  right: 0;
}

.input_br {
  border: 1px solid #eee;
  padding: 20rpx;
}
.mglg{
	margin-top: 60rpx;
}
</style>
