<template>
  <q-layout view="lHh Lpr lFf">
    <q-header>
      <q-toolbar>
        <q-btn
          flat
          dense
          round
          @click="leftDrawerOpen = !leftDrawerOpen"
          icon="menu"
          aria-label="Menu"
        />

        <q-toolbar-title>
          汽车维修备忘记事本
        </q-toolbar-title>
      </q-toolbar>
    </q-header>

    <q-drawer
      v-model="leftDrawerOpen"
      show-if-above
      bordered
      content-class="bg-grey-2"
    >
      <q-list>
        <q-item-label header>菜单</q-item-label>
        <q-item
          clickable
          to="/search"
        >
          <q-item-section avatar>
            <q-icon name="search" />
          </q-item-section>
          <q-item-section>
            <q-item-label>查询</q-item-label>
          </q-item-section>
        </q-item>
        <q-item
          clickable
          to="/record"
        >
          <q-item-section avatar>
            <q-icon name="add" />
          </q-item-section>
          <q-item-section>
            <q-item-label>新增</q-item-label>
          </q-item-section>
        </q-item>
        <q-item
          clickable
          to="/backup"
        >
          <q-item-section avatar>
            <q-icon name="save" />
          </q-item-section>
          <q-item-section>
            <q-item-label>备份</q-item-label>
          </q-item-section>
        </q-item>
        <q-item
          clickable
          to="/restore"
        >
          <q-item-section avatar>
            <q-icon name="restore" />
          </q-item-section>
          <q-item-section>
            <q-item-label>还原</q-item-label>
          </q-item-section>
        </q-item>
      </q-list>
    </q-drawer>

    <q-page-container>
      <router-view />
      <q-btn
        v-show="isSideBtnShow"
        color="primary"
        to="/record"
        round
        icon="add"
        class="side-btn"
      />
    </q-page-container>
  </q-layout>
</template>

<script>
export default {
  name: 'MyLayout',

  data () {
    return {
      leftDrawerOpen: false,
      isSideBtnShow: true
    }
  },
  watch: {
    '$route.path': {
      handler: function (newVal, oldVal) {
        console.log(newVal)
        if (newVal === '/search') {
          this.isSideBtnShow = true
        } else {
          this.isSideBtnShow = false
        }
      }
    }
  }
}
</script>

<style lang="sass" scoped>
.side-btn
  position: absolute
  right: 20px
  bottom: 40px
</style>