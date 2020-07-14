<template>
	<view>
		<view class="cu-custom" :style="[{height:CustomBar + 'px'}]">
			<view class="cu-bar fixed" :style="style" :class="[bgImage!=''?'none-bg text-white bg-img':'',bgColor]">
				<view class="action" @tap="BackPage" v-if="isBack">
					<text class="cuIcon-back"></text>
					<slot name="backText"></slot>
				</view>
				<view v-show="!isMore">
					<view class="content" :style="[{top:StatusBar + 'px'}]">
						<slot name="content"></slot>
					</view>
					<slot name="right"></slot>
				</view>
				<view v-show="isMore" class="tab-view">
					<view class="tap" :style="[{top:StatusBar + 'px'}]">
						<slot name="tap"></slot>
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
				StatusBar: this.StatusBar,
				CustomBar: this.CustomBar+40
			};
		},
		name: 'cu-custom',
		computed: {
			style() {
				var StatusBar= this.StatusBar;
				var CustomBar= this.CustomBar;
				var bgImage = this.bgImage;
				var style = `height:${CustomBar}px;padding-top:${StatusBar}px;`;
				if (this.bgImage) {
					style = `${style}background-image:url(${bgImage});`;
				}
				return style
			}
		},
		props: {
			bgColor: {
				type: String,
				default: ''
			},
			isBack: {
				type: [Boolean, String],
				default: false
			},
			isMore: {
				type: Boolean,
				default: false
			},
			bgImage: {
				type: String,
				default: ''
			},
		},
		methods: {
			BackPage() {
				uni.navigateBack({
					delta: 1
				});
			}
		}
	}
</script>

<style>
	.cu-bar .cuIcon-back {
	    padding-top: 0.3vh;
	}
	.cu-bar .action:first-child>uni-text[class*="cuIcon-"] {
	    margin-right: 0.3vh;
	}
	.tab-view {
		width: 100%;
	}
	.tap {
		text-align: center;
	}
</style>
