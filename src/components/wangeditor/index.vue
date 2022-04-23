<template>
  <div style="border: 1px solid #ccc; margin-top: 10px;">
    <!-- 工具栏 -->
    <Toolbar
      style="border-bottom: 1px solid #ccc"
      :editor="editor"
      :defaultConfig="toolbarConfig"
    />
    <!-- 编辑器 -->
    <Editor
      style="height: 400px; overflow-y: hidden;"
      :defaultConfig="editorConfig"
      v-model="html"
      @onChange="onChange"
      @onCreated="onCreated"
    />
  </div>

</template>

<script>
import {Editor, Toolbar} from '@wangeditor/editor-for-vue'

export default {
  name: 'WangEditor',
  components: {Editor, Toolbar},
  data() {
    return {
      editor: '',
      html: this.parentContent,
      toolbarConfig: {
        toolbarKeys: ["bold", "underline", "italic", "through", "code", "clearStyle", "headerSelect", "header1", "header2", "header3",
          "color", "bgColor", "insertLink", "editLink", "unLink", "viewLink", "blockquote", "emotion", "fontSize", "fontFamily",
          "indent", "delIndent", "justifyLeft", "justifyRight", "justifyCenter", "lineHeight", "redo", "undo", "divider", "codeBlock",
          "bulletedList", "numberedList", "insertTable", "deleteTable", "insertTableRow", "deleteTableRow", "insertTableCol",
          "deleteTableCol", "tableHeader", "tableFullWidth", "uploadImage", "codeSelectLang"],
      },
      editorConfig: {
        placeholder: '请输入内容...',
        // autoFocus: false,
        // 所有的菜单配置，都要在 MENU_CONF 属性下
        MENU_CONF: {},
      }
    }
  },
  props: {
    parentContent: {
      type: String,
      default: '',
    },
  },
  watch: {
    parentContent() {
      this.html = this.parentContent;
    }
  },
  methods: {
    onCreated(editor) {
      this.editor = Object.seal(editor) // 【注意】一定要用 Object.seal() 否则会报错
    },
    onChange(editor) {
      this.$emit('input', editor.getHtml())

    },
  },
  mounted() {
    this.html = this.parentContent;
  },
  beforeDestroy() {
    const editor = this.editor
    if (editor == null) return
    editor.destroy() // 组件销毁时，及时销毁 editor ，重要！！！
  },
}
</script>

<style src="@wangeditor/editor/dist/css/style.css"></style>
