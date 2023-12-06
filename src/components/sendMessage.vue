
<script>
  import UButton from "@/uni_modules/uview-ui/components/u-button/u-button.vue";
  import UPopup from "@/uni_modules/uview-ui/components/u-popup/u-popup.vue";
  export default {
    components: {UPopup, UButton},
    data() {
      return {
        content:""
      }
    },
    props: ['value'],
    emits: ['submit','input'],
    methods:{
      send(){
        this.$emit("submit",this.content)
      },
      close(){
        console.log("关闭消息遮罩")
        this.$emit("input",false)
      }
    }
  }
</script>

<template>
  <view>
    <u-modal :show="value" title="私信" @close="close" @confirm="send" confirmText="发送" ref="uModal" :asyncClose="value" closeOnClickOverlay>
        <u--textarea  v-model="content" placeholder="请输入内容"  count ></u--textarea>
    </u-modal>
  </view>
</template>

<style scoped lang="scss">

</style>