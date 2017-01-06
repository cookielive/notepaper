<template>
  <section class="wrap" v-bind:style="formatProps" v-on:mousedown="e_createPanel" v-on:mousemove="e_changePanel" v-on:mouseup="e_savePanel" v-on:mouseleave="e_cancelPanel">
    <div class="panel" v-bind:id="index" v-on:click.stop="e_activePanel(e,index)" v-for="(panel,index) in panels" v-bind:style="{left:panel.left+'px',top:panel.top+'px',width:panel.width+'px',height:panel.height+'px',zIndex:panel.z}">
      <div class="panel-header" v-on:mousedown.stop="e_downPanel(e,index)" v-on:mousemove.stop="e_movePanel(e,index)" v-on:mouseup.stop="e_upPanel(e,index)" v-on:mouseout.stop="e_upPanel(e,index)">
        <span class="panel-header-title">{{panel.title}}</span>
        <button class="panel-header-close" v-on:mousedown.stop>×</button>
      </div>
      <textarea class="panel-text" v-model="panel.text" v-on:mousedown.stop>
      </textarea>

      <div class="drag-top"></div>
      <div class="drag-right"></div>
      <div class="drag-bottom"></div>
      <div class="drag-left"></div>
      <div class="drag-tr"></div>
      <div class="drag-rb"></div>
      <div class="drag-bl"></div>
      <div class="drag-lt"></div>
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
            left:x,
            top:y,
            height:0,
            width:0,
            mousedown:false,
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
            let panel = document.getElementById(this.master.activeIndex);
            console.log('改变panel');
            if( ((x - panel.offsetLeft) > -5) && ((y - panel.offsetTop) > -5) ){
              setTimeout(function(){
                panel.style.width = x - panel.offsetLeft+'px';
                panel.style.height = y - panel.offsetTop+'px';
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
          this.panels[index].mousedown = true;
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
        }
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
  }
  .panel .panel-header{
    background-color: #CAE1FF;
    width:100%;
    height: 20px;
    text-align: center;
    position: relative;
    overflow: hidden;
  }
  .panel .panel-header .panel-header-title{
    display: block;
    width: 80%;
    height: 20px;
    margin: 0 auto;
    overflow: hidden;
    text-overflow:ellipsis;
    white-space: nowrap;
    font-size: 12px;
    line-height: 20px;
    text-align: center;
  }
  .panel .panel-header .panel-header-close{
    width:10%;
    height:100%;
    position: absolute;
    top: 0;
    right: 0;
    font-size: 12px;
    text-align: center;
    cursor: pointer;
  }
  .panel .panel-text{
    background-color: #f5f5f5;
    width: 100%;
    height: 100%;
    margin-top: -20px;
    padding-top: 20px;
    overflow: hidden;
    -moz-user-select:none;
      -webkit-user-select:none;
      user-select:none;
  }
</style>
