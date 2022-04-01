<template>
  <section id="tinymce-editor"></section>
</template>

<script>
import './tinymce'
import './themes/silver/theme.min';
import './langs/zh_CN'
import './plugins/preview/plugin.min'

export default {
  data() {
    return {
      content: this.parentContent
    }
  },
  props: {
    parentContent: {
      type: String,
      default: '',
    }
  },
  mounted() {
    console.log("组件得到调用");
    tinymce.init({
      selector: '#tinymce-editor',
      branding: false,
      width: '85%',
      height: 350,
      language: 'zh_CN',
      plugins: 'preview',
      menubar: false,
      setup: (editor) => {
        editor.on('init', (e) => {
          editor.setContent(this.content);
        });
      },
      // 监听 input 和 change 事件
      init_instance_callback: (editor) => {
        editor.on('input', (e) => {
          this.$emit('input', e.target.innerHTML);
        });
        editor.on('change', (e) => {
          this.$emit('input', e.level.content);
        });
      }
    });
  }
}
</script>

<style>
@import url('./skins/ui/oxide/skin.min.css');
</style>
