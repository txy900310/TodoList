<template>
  <section style="width: 100%; height: 100%" v-if="$route.name === 'MainMenu'" @touchstart.capture="touchStartY" @touchmove.capture="touchMoveY" @touchend.capture="touchEndY">
      <el-container>
        <el-header id="ROM" v-show="b_header">
          <span>R O M</span>
        </el-header>
        <el-main style="padding: 0;">
          <ul class="menu">
            <li class="menu-item" v-for="item in list" :key="item.text" data-type="0" @click="enterItem(item)">
              <div class="item-style">
                <div>{{item.text}}</div>
                <div class="list-num" v-if="item.countable">{{item.num}}</div>
              </div>
            </li>
          </ul>
        </el-main>
      </el-container>
  </section>
  <section v-else>
    <router-view/>
  </section>
</template>

<script>
export default {
  name: 'MainMenu',
  data () {
    return {
      list: [
        {
          text: 'My Lists',
          countable: true,
          num: 0
        },
        {
          text: 'Themes',
          countable: false,
          num: 0
        },
        {
          text: 'Tips & Tricks',
          countable: false,
          num: 0
        },
        {
          text: 'Follow the Team',
          countable: false,
          num: 0
        },
        {
          text: 'Settings',
          countable: false,
          num: 0
        }
      ],
      b_header: false,
      startY: 0
    }
  },
  mounted () {
    this.getLists()
    console.log(this.$router)
  },
  methods: {
    touchStartY (e) {
      document.getElementById('ROM').style.height = '0.5rem'
      document.getElementById('ROM').style.fontSize = '0.5rem'
      this.startY = e.touches[0].clientY
      this.b_header = true
    },
    touchMoveY (e) {
      if (e.changedTouches[0].clientY - this.startY > 50) {
        document.getElementById('ROM').style.height = '1rem'
        document.getElementById('ROM').style.fontSize = '1rem'
      }
      if (e.changedTouches[0].clientY - this.startY > 100) {
        document.getElementById('ROM').style.height = '2rem'
        document.getElementById('ROM').style.fontSize = '2rem'
      }
      if (e.changedTouches[0].clientY - this.startY > 150) {
        document.getElementById('ROM').style.height = '3rem'
        document.getElementById('ROM').style.fontSize = '3rem'
      }
      if (e.changedTouches[0].clientY - this.startY > 200) {
        document.getElementById('ROM').style.height = '4rem'
        document.getElementById('ROM').style.fontSize = '4rem'
      }
    },
    touchEndY (e) {
      this.b_header = false
    },
    getLists () {
      let lists = []
      if (!localStorage['lists']) {
        localStorage.setItem('lists', JSON.stringify(lists))
      } else {
        lists = JSON.parse(localStorage['lists'])
      }
      this.list[0].num = lists.length
    },
    enterItem (item) {
      if (item.text === 'My Lists') {
        this.$router.push('/lists')
      }
    }
  }
}
</script>

<style scoped>

</style>
