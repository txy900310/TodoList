<template>
  <section v-if="$route.name === 'Lists'" style="width: 100%; height: 100%" @touchstart.capture="touchStartY" @touchend.capture="touchEndY">
      <el-container>
        <el-header class="add-list" style="padding: 0;" v-show="addAble" @click.native="addList">
          <ul class="menu">
            <li class="menu-item">
              <div class="item-style">
                <input id="list_input" style="font-size: 2rem;width: 60%" v-model="newList" @keyup.enter="addList">
                <div class="list-num">0</div>
              </div>
            </li>
          </ul>
        </el-header>
        <el-main style="padding: 0">
          <ul class="menu">
            <li
              class="menu-item"
              v-for="(item,index) in lists"
              :key="index"
              :data-type="0"
              @click="enterItem(item)"
            >
            <div class="item-style" @touchstart.capture="touchStartX"
              @touchend.capture="touchEndX" :data-index="index">
              <div>{{item.name}}</div>
              <div class="list-num">{{item.todos.length}}</div>
            </div>
            <div class="delete" @click="deleteList" v-if="showDel[index]" :data-index="index">删除</div>
            </li>
          </ul>
        </el-main>
      </el-container>
  </section>
  <section style="width: 100%; height: 100%" v-else>
    <router-view/>
  </section>
</template>

<script>
export default {
  name: 'Lists',
  data () {
    return {
      lists: [],
      startX: 0,
      endX: 0,
      startY: 0,
      endY: 0,
      newList: '',
      addAble: false,
      showDel: {}
    }
  },
  mounted () {
    console.log(this.$route)
    this.lists = JSON.parse(localStorage['lists'])
  },
  methods: {
    touchStartX (e) {
      this.startX = e.touches[0].clientX
    },
    touchStartY (e) {
      this.startY = e.touches[0].clientY
    },
    touchEndY (e) {
      // 记录结束位置
      this.endY = e.changedTouches[0].clientY
      // 下滑
      if (this.startY - this.endY < -30) {
        this.showAddList()
      }
      if (this.startY - this.endY > 10) {
        this.addAble = false
      }
      this.startY = 0
      this.endY = 0
    },
    touchEndX (e) {
      let parentElement = e.currentTarget.parentElement
      let index = e.currentTarget.dataset.index
      // 记录结束位置
      this.endX = e.changedTouches[0].clientX
      // 左滑
      if (parentElement.dataset.type === '0' && this.startX - this.endX > 30) {
        this.showDel = {}
        this.showDel[index] = true
        this.restSlide()
        parentElement.dataset.type = 1
      }
      // 右滑
      if (parentElement.dataset.type === '1' && this.startX - this.endX < -30) {
        this.showDel = {}
        this.showDel[index] = false
        this.restSlide()
        parentElement.dataset.type = 0
      }
      this.startX = 0
      this.endX = 0
      this.$forceUpdate()
    },
    restSlide () {
      let listItems = document.querySelectorAll('.menu-item')
      // 复位
      for (let i = 0; i < listItems.length; i++) {
        listItems[i].dataset.type = 0
      }
    },
    showAddList () {
      this.addAble = true
    },
    queryList (name) {
      return new Promise((resolve, reject) => {
        for (let i = 0; i < this.lists.length; i++) {
          if (this.lists[i].name === name) {
            reject(Error('重复的名称'))
          }
        }
        resolve()
      })
    },
    addList (e) {
      if (e.type === 'click') {
        let sp = document.getElementById('list_input')
        if (sp.contains(event.target)) {
          return
        }
      }
      this.queryList(this.newList)
        .then(() => {
          let len = this.lists.length
          this.lists.unshift({
            id: len,
            name: this.newList,
            todos: []
          })
          localStorage['lists'] = JSON.stringify(this.lists)
          this.newList = ''
          this.addAble = false
        })
        .catch(() => {
          this.$notify({
            title: '',
            message: '请输入不重复的名称',
            type: 'warning'
          })
        })
    },
    deleteList (e) {
      let index = e.currentTarget.dataset.index
      this.restSlide()
      this.lists.splice(index, 1)
      for (let i = 0; i < this.lists.length; i++) {
        this.lists[i].id = this.lists.length - 1 - i
      }
      localStorage['lists'] = JSON.stringify(this.lists)
    },
    enterItem (item) {
      this.$router.push('/lists/' + item.id)
    }
  }
}
</script>

<style scoped>
</style>
