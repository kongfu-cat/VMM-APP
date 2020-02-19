<template>
  <q-page>
    <div class="q-pa-md backup-wrapper">
      <q-input
        v-model="jsonData"
        filled
        type="textarea"
        disable
      />
    </div>
    <q-btn
      @click="handleClipboardClick"
      color="primary"
      style="width:60%;margin:10px 20%;"
    >
      复制到剪切板
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
    this.loadData()
  },
  methods: {
    handleClipboardClick () {
      if (!cordova.plugins.clipboard.copy(this.jsonData)) {
        navigator.notification.alert(
          '复制成功',  // message
          null,         // callback
          '提示',            // title
          '确认'                  // buttonName
        );
      }
    },
    loadData () {
      const showSuccess = (res) => {
        console.log("loadData.showSuccess.data: ", res)
        this.jsonData = res.data
      }
      doReadFile('vmm_data.json', showSuccess);
    }
  }
}
</script>

<style lang="sass" scoped>
.backup-wrapper
  width: 100%;
  height: 80%;
</style>
