<template>
  <section class="wrap" v-bind:style="formatProps" v-on:mousedown="e_createPanel" v-on:mousemove="e_changePanel" v-on:mouseup="e_savePanel" v-on:mouseleave="e_cancelPanel">
    <div class="panel" v-bind:id="index" v-on:click.stop="e_activePanel(e,index)" v-for="(panel,index) in panels" v-bind:style="{left:panel.x+'px',top:panel.y+'px',width:panel.width+'px',height:panel.height+'px',zIndex:panel.z}">
      <div class="panel-header" v-on:mousedown.stop="e_downPanel($event,index)" v-on:mousemove.stop="e_movePanel($event,index)" v-on:mouseup="e_upPanel($event,index)" v-on:mouseout.stop="e_upPanel($event,index)">
        <input class="panel-header-title" v-model="panel.title" />
        <button class="panel-header-close" v-on:mousedown.stop v-on:click.stop="e_closePanel($event,index)">×</button>
      </div>
      <textarea class="panel-text" v-model="panel.text" v-on:mousedown.stop></textarea>

      <div class="drag-rb" v-on:mousedown.stop="e_dragDown($event,index)" v-on:mousemove.stop></div>
    </div>
  </section>
</template>

<script>
  export default {
    props:['masterStyle'],
    data(){
      return {
        master:{
          x:0,
          y:0,
          mousedown:false,
          activeIndex:0,
          panel_z:1
        },
        panels:[]
      }
    },
    methods:{
      // master的四个鼠标事件回调
      e_createPanel(e){
        // 设置鼠标左键按下
        if(e.button == 0){
          this.master.mousedown = true;
          // 获取鼠标相对master坐标
          let x = e.pageX - this.master.x;
          let y = e.pageY - this.master.y;
          // 设置panel对象
          let panel = {
            x:x,
            y:y,
            differX:0,
            differY:0,
            height:0,
            width:0,
            mousedown:false,
            dragdown:false,
            title:'便签',
            text:'',
            z:this.master.panel_z++
          };
          this.panels.push(panel);
          this.master.activeIndex = this.panels.length - 1;
        }
      },
      e_changePanel(e){
        if(e.button == 0){
          if(this.master.mousedown){
            let x = e.pageX - this.master.x;
            let y = e.pageY - this.master.y;
            let panel = this.panels[this.master.activeIndex];
            if( ((x - panel.x) > -5) && ((y - panel.y) > -5) ){
              setTimeout(function(){
                panel.width = x - panel.x;
                panel.height = y - panel.y;
              },20);
            }else{
              this.master.mousedown = false;
              this.panels.splice(this.master.activeIndex,1);
            }
          }
        }
      },
      e_savePanel(e){
        if(e.button == 0){
          if(this.master.mousedown){
            let panel = document.getElementById(this.master.activeIndex);
            if((panel.offsetWidth > 80) && (panel.offsetHeight > 80)){
              this.master.mousedown = false;
            }else{
              this.master.mousedown = false;
              this.panels.splice(this.master.activeIndex,1);
            }
          }
        }
      },
      e_cancelPanel(e){
        if(e.button == 0){
          if(this.master.mousedown){
            this.master.mousedown = false;
            this.panels.splice(this.master.activeIndex,1);
          }
        }
      },
      // panel的鼠标事件回调
      e_activePanel(e,index){
          this.panels[index].z = this.master.panel_z++;
      },
      e_downPanel(e,index){
        if(!this.panels[index].mousedown){
          this.panels[index].z = this.master.panel_z++;
          this.panels[index].mousedown = true;
          // 获取鼠标相对master坐标
          let x = e.pageX - this.master.x;
          let y = e.pageY - this.master.y;
          // 获取鼠标相对于panel的坐标
          this.panels[index].differX = x - this.panels[index].x;
          this.panels[index].differY = y - this.panels[index].y;
        }

      },
      e_upPanel(e,index){
        if(this.panels[index].mousedown){
          this.panels[index].mousedown = false;
        }
      },
      e_movePanel(e,index){
        if(this.panels[index].mousedown){
          let panel = this.panels[index];
          setTimeout(function(){
            panel.x = e.pageX - panel.differX;
            panel.y = e.pageY - panel.differY;
          },1);

        }
      },
      e_closePanel(e,index){
        this.panels.splice(index,1);
      },
      // panel放大缩小
      e_dragDown(e,index){
        this.master.mousedown = true;
        this.master.activeIndex = index;
      },
      // 取消默认事件
      e_preventDefault(e){
        e.preventDefault()
      },
    },
    computed:{
       formatProps(){
        return eval('(' + this.masterStyle + ')')
      }
    },
    // hooks
    mounted(){
      this.master.y = this.$el.getBoundingClientRect().top;
      this.master.x = this.$el.getBoundingClientRect().left;
    },
  }
</script>

<style>
  *{
    margin: 0;
    padding: 0;
    box-sizing: border-box;
  }
  .wrap{
    border: 1px solid #000;
    position: relative;
    overflow: hidden;
    -moz-user-select:none;
      -webkit-user-select:none;
      user-select:none;
  }
  .panel{
    position: absolute;
    overflow: hidden;
    cursor: move;
    transition: all 0s;
    border: 1px solid rgba(202,225,255,1);
    box-shadow: 5px 5px 12px rgba(202,225,255,.7);
    border-radius: 8px;
  }
  .panel .panel-header{
    background-color: #CAE1FF;
    width:100%;
    height:24px;
    text-align: center;
    position: relative;
    overflow: hidden;
  }
  .panel .panel-header .panel-header-title{
    display: block;
    max-width: 80%;
    height:24px;
    margin: 0 auto;
    overflow: hidden;
    text-overflow:ellipsis;
    white-space: nowrap;
    font-size: 12px;
    line-height: 24px;
    text-align: center;
    background: transparent;
    border:none;
    outline:none;
    color: rgba(0,0,0,.8);
  }
  .panel .panel-header .panel-header-close{
    width:10%;
    height:90%;
    position: absolute;
    top: 5%;
    right: 0;
    font-size: 12px;
    text-align: center;
    cursor: pointer;
    background: rgba(143,191,255,.8);
    border: none;
    border-radius: 50%;
    color:#fff;
  }
  .panel .panel-text{
    background-color: #f5f5f5;
    width: 100%;
    height: 100%;
    margin-top: -24px;
    padding-top: 24px;
    overflow: hidden;
    -moz-user-select:none;
    -webkit-user-select:none;
    user-select:none;
    border: none;
    outline:none;
  }
  .drag-rb{
    position: absolute;
    width:10%;
    height:10%;
    right:-5%;
    bottom:-5%;
    cursor: se-resize;
  }
</style>
