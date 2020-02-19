<template>
  <q-page>
    <div class="q-pa-md">
      <q-input
        v-model="jsonData"
        filled
        type="textarea"
      />

    </div>
    <q-btn
      @click="handleRestoreClick"
      color="primary"
      style="width:60%;margin:10px 20%;"
    >
      恢复
    </q-btn>
  </q-page>
</template>

<script>
import { doWriteFile, doReadFile } from "src/utils/fs"
export default {
  data () {
    return {
      jsonData: []
    }
  },
  mounted () {
  },
  methods: {
    handleRestoreClick () {
      try {
        JSON.parse(this.jsonData)
      } catch (err) {
        console.log("handleRestoreClick JSON err: ", err)
        navigator.notification.alert(
          '数据有误',  // message
          null,         // callback
          '提示',            // title
          '确认'                  // buttonName
        );
        return;
      }
      let onConfirm = (buttonIndex) => {
        switch (buttonIndex) {
          case 1: {
            this.saveData(this.jsonData)
          } break;
          case 2: {
          } break;
          default: break;
        }
      }
      document.addEventListener("deviceready", onDeviceReady, false);
      function onDeviceReady () {
        navigator.notification.confirm(
          '确认恢复？', // message
          onConfirm,            // callback to invoke with index of button pressed
          '确认',           // title
          ['是', '否']     // buttonLabels
        );
      }
    },
    saveData (text) {
      const showSuccess = () => {
        navigator.notification.alert(
          '恢复成功',  // message
          null,         // callback
          '提示',            // title
          '确认'                  // buttonName
        );
      }
      doWriteFile('vmm_data.json', text, showSuccess);
    }
  }
}
</script>

<style lang="sass" scoped>

</style>
