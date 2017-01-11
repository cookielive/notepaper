<template>
  <section class="wrap" v-bind:style="formatProps" v-on:mousedown="e_createPanel" v-on:mousemove="e_changePanel" v-on:mouseup="e_savePanel" v-on:mouseleave="e_cancelPanel">
    <div class="panel" v-bind:id="index" v-on:click.stop="e_activePanel(e,index)" v-for="(panel,index) in panels" v-bind:style="{left:panel.x+'px',top:panel.y+'px',width:panel.width+'px',height:panel.height+'px',zIndex:panel.z}">
      <div class="panel-header" v-on:mousedown.stop="e_downPanel($event,index)" v-on:mousemove.stop="e_movePanel($event,index)" v-on:mouseup.stop="e_upPanel($event,index)" v-on:mouseout.stop="e_upPanel($event,index)">
        <span class="panel-header-title">{{panel.title}}</span>
        <button class="panel-header-close" v-on:mousedown.stop v-on:click.stop="e_closePanel($event,index)">×</button>
      </div>
      <textarea class="panel-text" v-model="panel.text" v-on:mousedown.stop v-on:mouseup.stop></textarea>

      <div class="drag-top" v-on:mousedown.stop="e_dragDown($event,index)" v-on:mousemove.stop="e_dragPanel($event,index,'t')" v-on:mouseup.stop="e_dragUp($event,index)" v-on:mouseleave.stop="e_dragUp($event,index)"></div>
      <!-- <div class="drag-right" v-on:mousedown="e_dragDown($event,index)" v-on:mousemove="e_dragPanel($event,index,'r')" v-on:mouseup.stop="e_dragUp($event,index)" v-on:mouseleave.stop="e_dragUp($event,index)"></div>
      <div class="drag-bottom" v-on:mousedown.stop="e_dragDown($event,index)" v-on:mousemove.stop="e_dragPanel($event,index,'b')" v-on:mouseup.stop="e_dragUp($event,index)" v-on:mouseleave.stop="e_dragUp($event,index)"></div> -->
      <div class="drag-left" v-on:mousedown.stop="e_dragDown($event,index)" v-on:mousemove.stop="e_dragPanel($event,index,'l')" v-on:mouseup.stop="e_dragUp($event,index)" v-on:mouseleave.stop="e_dragUp($event,index)"></div>
      <!-- <div class="drag-tr"></div>
      <div class="drag-rb"></div>
      <div class="drag-bl"></div>
      <div class="drag-lt"></div> -->
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
          console.log('创建panel');
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
            title:'测试标题',
            text:'测试内容',
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
            console.log('改变panel');
            if( ((x - panel.x) > -5) && ((y - panel.y) > -5) ){
              setTimeout(function(){
                panel.width = x - panel.x;
                panel.height = y - panel.y;
              },20);
            }else{
              this.master.mousedown = false;
              this.panels.splice(this.master.activeIndex,1);
              console.log('从点击处向右下方向拖拽生成panel');
            }
          }
        }
      },
      e_savePanel(e){
        if(e.button == 0){
          if(this.master.mousedown){
            let panel = document.getElementById(this.master.activeIndex);
            if((panel.offsetWidth > 80) && (panel.offsetHeight > 80)){
              console.log('保存变动');
              this.master.mousedown = false;
            }else{
              console.log('太小了取消创建');
              this.master.mousedown = false;
              this.panels.splice(this.master.activeIndex,1);
            }
          }
        }
      },
      e_cancelPanel(e){
        if(e.button == 0){
          if(this.master.mousedown){
            console.log('取消创建');
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
          console.log('拖动');
          let panel = this.panels[index];
          setTimeout(function(){
            panel.x = e.pageX - panel.differX;
            panel.y = e.pageY - panel.differY;
          },1);

        }
      },
      e_closePanel(e,index){
        console.log('删除panel');
        this.panels.splice(index,1);
      },
      // panel放大缩小
      e_dragDown(e,index){
        this.panels[index].dragdown = true;
        this.panels[index].differX = e.pageX - this.panels[index].x;
        this.panels[index].differY = e.pageY - this.panels[index].y;
      },
      e_dragPanel(e,index,direction){

        let panel = this.panels[index];
        let self = this;
        if(panel.dragdown){
          switch (direction) {
            case 't':
              setTimeout(function(){
                panel.height += panel.y - (e.pageY - panel.differY);
                panel.y = e.pageY - panel.differY;
              },1);
              break;
            // case 'r':
            //   setTimeout(function(){
            //      panel.width = e.pageX - panel.x;
            //      console.log(panel.width);
            //   },1);
            //   break;
            // case 'b':
            //   setTimeout(function(){
            //     panel.height += (e.pageY - panel.differY - panel.y);
            //   },1);
            //   break;
            case 'l':
              setTimeout(function(){
                panel.width += panel.x - (e.pageX - panel.differX);
                panel.x = e.pageX - panel.differX;
              },1);
              break;

            default:

          }
        }
      },
      e_dragUp(e,index){
        this.panels[index].dragdown = false;
      },
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
    width: 80%;
    height:24px;
    margin: 0 auto;
    overflow: hidden;
    text-overflow:ellipsis;
    white-space: nowrap;
    font-size: 12px;
    line-height: 24px;
    text-align: center;
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
  }
  .panel .panel-text{
    background-color: #f5f5f5;
    width: 100%;
    height: 100%;
    margin-top: -30px;
    padding-top: 30px;
    overflow: hidden;
    -moz-user-select:none;
    -webkit-user-select:none;
    user-select:none;
  }
  .drag-top,.drag-right,.drag-bottom,.drag-left,.drag-tr,.drag-rb,.drag-bl,.drag-lt{
    position: absolute;
    border:5px solid transparent;
  }
  .panel .drag-top{
    width:90%;
    height:0;
    top: 0;
    left:5%;
    cursor: n-resize;
    margin-top: -5px;
  }
  .panel>.drag-right{
    width:0;
    height:90%;
    top: 5%;
    right:0;
    cursor: e-resize;
  }
  .panel>.drag-bottom{
    width:90%;
    height:0;
    bottom: 0;
    left:5%;
    cursor: s-resize;
  }
  .panel>.drag-left{
    width:0;
    height:90%;
    top: 5%;
    left:0;
    cursor: w-resize;
  }

</style>
