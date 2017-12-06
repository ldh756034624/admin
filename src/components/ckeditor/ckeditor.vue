<template>
  <div class="app-container">
    <textarea id="editor" rows="10" cols="80"></textarea>
  </div>
</template>

<script>
  import CKEDITOR from "CKEDITOR"

  export default {
    name: 'ckeditor',
    props: {
      data: {
        type: String,
        default: null
      }
    },
    data() {
      return {
        realData: this.data
      }
    },
    mounted() {
      this._init()
    },
    methods: {
      _init() {
        this.$nextTick(() => {
          if (!this.editor) { // 防止重复实例化
            this.editor = CKEDITOR.replace("editor", {height: "300px", width: "100%", toolbar: "Full"})
          }
          if (this.data || this.data != 0) {    // 初始化数据
            this.editor.setData(this.data)
          }
        })
      },
      // 向外传值
      getData() {
        this.realData = this.editor.getData()
        this.$emit('getData', this.realData)
      },
      clearData() {
        if (this.editor) {
          this.editor.setData('')
        }
      },
      setData() {
        this.$nextTick(() => {
          this.editor.setData(this.data)
        })
      }
    }
  }
</script>
