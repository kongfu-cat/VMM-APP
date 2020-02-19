<template>
  <q-page>
    <div class="top-sidebar">
      <div class="search-form">
        <q-form
          @submit="onSubmit"
          @reset="onReset"
          class="q-gutter-md"
        >
          <!-- 司机姓名 -->
          <q-select
            filled
            use-input
            fill-input
            v-model="name"
            hide-selected
            hide-dropdown-icon
            :options="customerOptions"
            label="司机姓名"
            @filter="filterFnName"
            @blur="handleSelectNameBlur"
            ref="selectName"
            virtual-scroll-horizontal
            behavior="menu"
          >
            <template v-slot:no-option>
              <q-item>
                <q-item-section class="text-grey">
                  没有匹配结果
                </q-item-section>
              </q-item>
            </template>
          </q-select>
          <!-- 手机号 -->
          <q-select
            filled
            use-input
            fill-input
            v-model="phoneNumber"
            hide-selected
            hide-dropdown-icon
            :options="phoneOptions"
            label="手机号"
            ref="selectPhone"
            @blur="handleSelectPhoneBlur"
            @filter="filterFnPhone"
            behavior="menu"
          >
            <template v-slot:no-option>
              <q-item>
                <q-item-section class="text-grey">
                  没有匹配结果
                </q-item-section>
              </q-item>
            </template>
          </q-select>
          <!-- 车牌号 -->
          <q-select
            filled
            use-input
            fill-input
            v-model="plateNumber"
            hide-selected
            hide-dropdown-icon
            :options="plateOptions"
            label="车牌号"
            ref="selectPlate"
            @blur="handleSelectPlateBlur"
            @filter="filterFnPlate"
            behavior="menu"
            :rules="[ val => val && val.length > 0 || '请输入或选择车牌号']"
          >
            <template v-slot:no-option>
              <q-item>
                <q-item-section class="text-grey">
                  没有匹配结果
                </q-item-section>
              </q-item>
            </template>
            <template v-slot:after>
              <q-btn
                round
                dense
                flat
                icon="camera_alt"
                @click="handleCameraClick"
              />
            </template>
          </q-select>
          <!-- 时间选择 -->
          <q-input
            filled
            v-model="date"
            label="维修日期"
            mask="date"
            :rules="['date']"
          >
            <template v-slot:append>
              <q-icon
                name="event"
                class="cursor-pointer"
              >
                <q-popup-proxy
                  ref="qDateProxy"
                  transition-show="scale"
                  transition-hide="scale"
                >
                  <q-date
                    v-model="date"
                    today-btn
                    @input="() => $refs.qDateProxy.hide()"
                  />
                </q-popup-proxy>
              </q-icon>
            </template>
          </q-input>
          <!-- 确认按钮 -->
          <div style="overflow: hidden;">
            <q-btn
              label="保存"
              type="submit"
              color="primary"
              style="float:left;margin-left:20%"
            >
            </q-btn>
            <q-btn
              label="清空"
              type="reset"
              color="red"
              flat
              class="q-ml-sm"
              style="float:right;margin-right:20%;"
            />
          </div>
        </q-form>
      </div>
    </div>
  </q-page>
</template>

<script>
import { doWriteFile, doReadFile } from "src/utils/fs"
import { getPictureConfirm } from "src/utils/camera"
import { getLicensePlate } from "src/utils/baidu"
export default {
  name: 'PageRecord',
  data () {
    return {
      model: null,
      // 查询字典
      customerDict: [],
      phoneDict: [],
      plateDict: [],
      customerOptions: [],
      phoneOptions: [],
      plateOptions: [],
      // 表单
      name: null,
      date: null,
      plateNumber: null,
      phoneNumber: null,

      dataSource: []
    }
  },
  mounted () {
    this.loadData()
  },
  methods: {
    handleCameraClick () {
      getPictureConfirm().then(data => {
        getLicensePlate(data).then(res => {
          this.plateNumber = res
        }).catch(err => {
          navigator.notification.alert(
            "错误" + err.toString(),  // message
            null,         // callback
            '提示',            // title
            '确认'                  // buttonName
          );
        })
      })
    },
    loadData () {
      const showSuccess = (res) => {
        console.log("loadData.showSuccess.data: ", res)
        const tmp = JSON.parse(res.data)
        if (tmp instanceof Array) {
          this.dataSource = tmp

          this.customerDict = []
          this.phoneDict = []
          this.plateDict = []

          this.dataSource.forEach(item => {
            this.customerDict.push(item.name)
            this.phoneDict.push(item.phoneNumber)
            this.plateDict.push(item.plateNumber)
          })
        }
      }
      doReadFile('vmm_data.json', showSuccess);
    },
    saveData (text) {
      const showSuccess = () => {
        console.log("saveData.showSuccess: ")
        navigator.notification.alert(
          '保存成功',  // message
          () => {
            this.onReset()
          },         // callback
          '提示',            // title
          '确认'                  // buttonName
        );

        this.loadData()
      }
      doWriteFile('vmm_data.json', text, showSuccess);
    },
    filterFnName (val, update, abort) {
      update(() => {
        console.log('filterFnName: ', val)
        const needle = val.toLowerCase()
        this.customerOptions = this.customerDict.filter(v => v.toLowerCase().indexOf(needle) > -1)
      })
    },
    filterFnPhone (val, update, abort) {
      update(() => {
        const needle = val.toLowerCase()
        this.phoneOptions = this.phoneDict.filter(v => v.toLowerCase().indexOf(needle) > -1)
      })
    },
    filterFnPlate (val, update, abort) {
      update(() => {
        const needle = val.toLowerCase()
        this.plateOptions = this.plateDict.filter(v => v.toLowerCase().indexOf(needle) > -1)
      })
    },
    handleSelectNameBlur () {
      this.name = this.$refs['selectName'].inputValue
    },
    handleSelectPhoneBlur () {
      this.phoneNumber = this.$refs['selectPhone'].inputValue
    },
    handleSelectPlateBlur () {
      this.plateNumber = this.$refs['selectPlate'].inputValue
    },
    onSubmit () {
      const formData = {
        name: this.name,
        date: this.date,
        phoneNumber: this.phoneNumber,
        plateNumber: this.plateNumber
      }
      this.dataSource.push(formData)
      this.saveData(JSON.stringify(this.dataSource))
    },
    onReset () {
      this.name = null
      this.date = null
      this.plateNumber = null
      this.phoneNumber = null
    }
  }
}
</script>

<style lang="sass" scoped>
.top-sidebar
  margin-top: 30px
  margin-bottom: 10px

.search-form
  padding: 0 20px;
</style>
