<template>
  <section v-if="$route.name === 'SingleList'" style="width: 100%; height: 100%" @touchstart.capture="touchStartY" @touchend.capture="touchEndY">
      <el-container>
        <el-header class="add-todo" style="padding: 0;" v-show="addAble" @click.native="addTodo">
          <ul class="menu">
            <li class="menu-item">
              <div class="item-style">
                <input id="todo_input" style="font-size: 2rem;width: 60%" v-model="newTodo" @keyup.enter="addTodo">
              </div>
            </li>
          </ul>
        </el-header>
        <el-main style="padding: 0">
          <ul class="menu">
            <li
              class="menu-item"
              v-for="(item,index) in todos"
              :key="index"
              :data-type="0"
              @click="enterItem(item)"
            >
            <div class="item-style" @touchstart.capture="touchStartX"
              @touchend.capture="touchEndX" :data-index="index">
              <div>{{item.text}}</div>
            </div>
            <div class="delete" @click="deleteTodo" v-if="showDel[index]" :data-index="index">删除</div>
            </li>
          </ul>
        </el-main>
      </el-container>
  </section>
</template>

<script>
export default {
  name: 'SingleList',
  data () {
    return {
      todos: [],
      startX: 0,
      endX: 0,
      startY: 0,
      endY: 0,
      newTodo: '',
      addAble: false,
      showDel: {}
    }
  },
  created () {
    console.log(this.$route.params.id)
    let lists = JSON.parse(localStorage['lists'])
    let index = lists.length - Number(this.$route.params.id) - 1
    this.todos = lists[index].todos
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
        this.addAble = true
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
      console.log(this.startX - this.endX)
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
    addTodo (e) {
      if (e.type === 'click') {
        let sp = document.getElementById('list_input')
        if (sp.contains(event.target)) {
          return
        }
      }
      let len = this.todos.length
      this.todos.unshift({
        id: len,
        text: this.newTodo,
        finished: false
      })
      let lists = JSON.parse(localStorage['lists'])
      let index = lists.length - Number(this.$route.params.id) - 1
      lists[index].todos = this.todos
      localStorage['lists'] = JSON.stringify(lists)
      this.newTodo = ''
      this.addAble = false
    },
    deleteTodo (e) {
      let index = e.currentTarget.dataset.index
      this.restSlide()
      this.todos.splice(index, 1)
      for (let i = 0; i < this.todos.length; i++) {
        this.todos[i].id = this.todos.length - 1 - i
      }
      let lists = JSON.parse(localStorage['lists'])
      let num = lists.length - Number(this.$route.params.id) - 1
      lists[num].todos = this.todos
      localStorage['lists'] = JSON.stringify(lists)
    },
    enterItem (item) {
      if (item.finished) {
        item.finished = false
      } else {
        item.finished = true
      }
    }
  }
}
</script>

<style scoped>

</style>
