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
              :data-type="item.finished"
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
      if (this.startY - this.endY > 300) {
        this.clearTodo()
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
      if (parentElement.dataset.type === '0' && this.startX - this.endX < -50) {
        parentElement.dataset.type = -1
        this.finishTodo(index)
      }
      this.startX = 0
      this.endX = 0
      this.$forceUpdate()
    },
    restSlide () {
      let listItems = document.querySelectorAll('.menu-item')
      // 复位
      for (let i = 0; i < listItems.length; i++) {
        if (listItems[i].dataset.type >= 0) {
          listItems[i].dataset.type = 0
        }
      }
    },
    finishTodo (index) {
      this.todos[index].finished = -1
      let done = this.todos.splice(index, 1)[0]
      this.todos.push(done)
      this.updateLists()
    },
    clearTodo () {
      let toDel = []
      this.todos.forEach((todo, index) => {
        if (todo.finished === -1) {
          toDel.push(index)
        }
      })
      for (let i = 0; i < this.todos.length; i++) {
        this.todos.splice(toDel[i] - i, 1)
      }
      this.updateLists()
    },
    addTodo (e) {
      if (e.type === 'click') {
        let sp = document.getElementById('todo_input')
        if (sp.contains(event.target)) {
          return
        }
      }
      if (this.newTodo === '') {
        return this.$notify({
          title: '',
          message: '名称不能为空',
          type: 'warning'
        })
      }
      let len = this.todos.length
      this.todos.unshift({
        id: len,
        text: this.newTodo,
        finished: 0
      })
      this.updateLists()
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
      this.updateLists()
    },
    updateLists () {
      let lists = JSON.parse(localStorage['lists'])
      let num = lists.length - Number(this.$route.params.id) - 1
      lists[num].todos = this.todos
      localStorage['lists'] = JSON.stringify(lists)
    }
  }
}
</script>

<style scoped>

</style>
