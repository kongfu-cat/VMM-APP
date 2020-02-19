<template>
  <q-page>
    <div
      class="top-sidebar"
      v-if="topToggleFlag"
      transition-show="slide-down"
      transition-hide="slide-up"
    >
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
            @filter="filterFnPlate"
            behavior="menu"
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
              label="查询"
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
    <div>
      <q-btn
        class="top-toggle-btn"
        @click="handleToggleTopbar"
      >
        <q-icon :name="toggleIcon"></q-icon>
      </q-btn>
    </div>

    <q-table
      title="搜索结果"
      dense
      :data="tableData"
      :columns="columns"
      row-key="name"
      class="result-table"
      no-data-label="没有数据"
      no-results-label="没有匹配的数据"
    />
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
      topToggleFlag: false,
      toggleIcon: 'arrow_drop_down',
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

      dataSource: [],
      columns: [
        {
          name: 'name',
          required: true,
          label: '姓名',
          align: 'left',
          field: row => row.name,
          format: val => `${val}`
        },
        { name: 'plateNumber', align: 'center', label: '车牌', field: 'plateNumber' },
        { name: 'phoneNumber', label: '手机号', field: 'phoneNumber' },
        { name: 'date', label: '日期', field: 'date' },
      ],
      tableData: []
    }
  },
  mounted () {
    this.loadData()
  },
  methods: {
    handleToggleTopbar () {
      this.topToggleFlag = !this.topToggleFlag
      this.toggleIcon = this.topToggleFlag ? 'arrow_drop_up' : 'arrow_drop_down'
    },
    handleCameraClick () {
      getPictureConfirm().then(data => {
        getLicensePlate(data).then(res => {
          this.plateNumber = res
        })
      })
    },
    searchRecord (data) {
      const result = this.dataSource.filter(item => {
        let res = true
        if (data.name) {
          if (item.name.toLowerCase().indexOf(data.name.toLowerCase()) == -1) {
            res = false
          }
        }
        if (data.date) {
          if (item.date.toLowerCase().indexOf(data.date.toLowerCase()) == -1) {
            res = false
          }
        }
        if (data.plateNumber) {
          if (item.plateNumber.toLowerCase().indexOf(data.plateNumber.toLowerCase()) == -1) {
            res = false
          }
        }
        if (data.phoneNumber) {
          if (item.phoneNumber.toLowerCase().indexOf(data.phoneNumber.toLowerCase()) == -1) {
            res = false
          }
        }
        return res
      })
      this.tableData = result || []
    },
    loadData () {
      const showSuccess = (res) => {
        console.log("loadData.showSuccess.data: ", res)
        const tmp = JSON.parse(res.data)
        if (tmp instanceof Array) {
          this.dataSource = tmp
          this.tableData = tmp

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
    onSubmit () {
      const formData = {
        name: this.name,
        date: this.date,
        phoneNumber: this.phoneNumber,
        plateNumber: this.plateNumber
      }
      this.searchRecord(formData)
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

.top-toggle-btn
  width: 100%
  height: 30px
  background-color: #26a69a
  color: #fff
  border-radius: 0;

.result-table
  border-radius: 0;
</style>
