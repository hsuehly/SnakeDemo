//  先定义类

// 定义食物类
class Food {
  // 定义一个属性表示食物所对应的元素
  element: HTMLElement;

  constructor() {
    this.element = document.getElementById("food")!;

  }
  // 定义一个获取x轴坐标的方法
  get X() {
    return this.element.offsetLeft;
  }
  // 定义一个获取y轴坐标的方法
  get Y() {
    return this.element.offsetTop;
  }
  // 修改食物的坐标值
  change() {
    // 生成随机数
    // 食物的位置最小是0 最大是界面宽度减去食物宽度 等于290
    // 食物的位置必须是10的倍数

    let left: number = Math.round(Math.random() * 29) * 10;
    let top: number = Math.round(Math.random() * 29) * 10;
    this.element.style.left = left + "px";
    this.element.style.top = top + "px";

  }
}

// const foot = new Food();
// console.log(foot.X,foot.Y)
// setInterval(()=>{
//   foot.change()

// },10)

// 记分牌

class Scorepanel {

  score: number;
  level: number;
  scoreEle: HTMLElement;
  levelEle: HTMLElement;
  // 设置变量限制等级
  maxLevel: number;
  // 设置变量表示多少分升级
  upScore: number;




  constructor(maxLevel: number = 10, upScore: number = 10) {
    this.score = 0;
    this.level = 0;

    this.maxLevel = maxLevel;
    this.upScore = upScore;




    this.scoreEle = document.getElementById("score")!;
    this.levelEle = document.getElementById("level")!;


  }
  // 设置加分的方法
  addScore() {
    this.score++;
    this.scoreEle.innerHTML = this.score + "";
    if (this.score % this.upScore === 0) {
      this.levelUp()

    }



  }
  // 等级提升的方法

  levelUp() {


    if (this.level < this.maxLevel) {
      this.level++;
      this.levelEle.innerHTML = this.level + "";

    }



  }
}

//  


// 蛇的类

class Snake {
  // 蛇
  element: HTMLElement;
  head: HTMLElement;
  // 蛇的身体
  bodies: HTMLCollection; // HTMLCollection 是一个集合会实时刷新

  constructor() {
    this.element = document.getElementById("snake")!;

    this.head = document.querySelector("#snake > div") as HTMLElement;

    this.bodies = this.element.getElementsByTagName("div");


  }
  // 获取x轴坐标
  get X() {
    return this.head.offsetLeft;

  }
  // 获取y轴坐标
  get Y() {
    return this.head.offsetTop;
  }
  // 设置蛇头的坐标
  set X(value: number) {
    // 如果新值和旧值相同则直接返回不修改
    if(this.X===value){
      return;

    }
    // X的值合法范围0-299 之间
    if(value<0 || value>299) {
      // 进入判断说明蛇撞墙了，抛出异常
      throw new Error("蛇撞墙了")

    }
     // 修改x时，是在修改水平坐标，蛇在向右移动，蛇在向左移动是，不能掉头，反之亦然
     if(this.bodies[1] && (this.bodies[1] as HTMLElement).offsetLeft === value){
      // console.log("发生掉头")
      //如果发生掉头，让蛇向反方向局续移动
      if(value>this.X){
        //如果新值的value大于旧值的value 则说明蛇在向右走，此时发生掉头，应该使蛇继续向左走
        value = this.X - 10;

      }else {
        //向左走
        value = this.X + 10;
      }
    }
    //移动身体
    this.moveBody()
    this.head.style.left = value + "px";
    this.checkHeadBody();

  }
  set Y(value: number) {
    if(this.Y===value){
      return;

    }
    if(value<0 || value>299) {

      throw new Error("蛇撞墙了")

    }
     // 修改Y时，是在修改垂直坐标，蛇在上下移动，蛇在向上移动是，不能向下掉头，反之亦然
     if(this.bodies[1] && (this.bodies[1] as HTMLElement).offsetTop === value){
      // console.log("发生掉头")
      //如果发生掉头，让蛇向反方向局续移动
      if(value>this.Y){
        //如果新值的value大于旧值的value 则说明蛇在向下走，此时发生掉头，应该使蛇继续向上走
        value = this.Y - 10;

      }else {
        //向左走
        value = this.Y + 10;
      }
    }
   
    //移动身体
    this.moveBody()
    this.head.style.top = value + "px";
    // 见车有没有撞到自己
    this.checkHeadBody();


  }
  // 设置蛇增加身体的方法

  addBody() {
    this.element.insertAdjacentElement("beforeend", document.createElement('div'));

  }

  // 蛇移动身体的方法
  moveBody() {
    // 将后边身体设置为前边身体的位置
    /*
    让第四节等于第三节位置
    第三节等于第二节位置
    第二节等于第一节位置

    */
   // 遍历所有的身体 
   for(let i=this.bodies.length-1;i>0;i--){
     //获取前边身体的位置
     let X = (this.bodies[i-1] as HTMLElement).offsetLeft;
     let Y = (this.bodies[i-1] as HTMLElement).offsetTop;


     //将这个值设置到当前身体
     (this.bodies[i] as HTMLElement).style.left = X + "px";
     (this.bodies[i] as HTMLElement).style.top = Y + "px";




   }

  }
  //检查蛇头是否撞到身体的方法
  checkHeadBody() {
    //获取所有的身体，检查其是否和蛇头的坐标发生重叠
    for(let i=1;i<this.bodies.length;i++){
      let bd = this.bodies[i] as HTMLElement;

      if(this.X === bd.offsetLeft && this.Y===bd.offsetTop){
        //进入判断说明蛇头撞到了身体，游戏结束
        throw new Error("撞到自己了")

      }
    }

  }

}


// 游戏控制器 
class GmaeControl {

  snake: Snake;
  food: Food;
  Scorepanel: Scorepanel;
  // 创建一个属性来保存按键的值
  direction: String;
  // 创建一个属性设置游戏是否结束
  isLive: Boolean

  constructor() {
    this.direction = "";
    this.isLive=true;
    this.snake = new Snake();
    this.food = new Food();
    this.Scorepanel = new Scorepanel(10,10);


    // 将初始化方法挂在constructor 下
    this.init();


  }
  // 游戏的初始化方法， 调用后游戏开始

  init() {
    // 绑定按键按下的事件
    document.addEventListener("keydown",this.keydownHandler.bind(this));
    this.run();
    
  }
  keydownHandler(event:KeyboardEvent ) {

    // console.log(this)
      this.direction = event.key;
    // console.log(event.key)
    

  }
  // 创建一个控制蛇移动的方法

  run() {
    /* 根据方向（this.dirction） 来使蛇的位置改变
        向上 top减少
        上下top增加
        向左 left减少
        向右left增加
    */
   let X=this.snake.X;
   let Y=this.snake.Y;
    // 根据按键的方向来修改元素的位置
   switch(this.direction){
     case "ArrowUp":
       Y-=10;
     break
     case "ArrowDown":
       Y+=10;
      break
     case "ArrowLeft":
       X-=10;
      break
     case "ArrowRight":
       X+=10;
      break

   }
  //  检查蛇是否吃到了食物
  this.checkEat(X,Y);
   try {
    this.snake.X=X;
    this.snake.Y=Y;
   } catch (error:any) {
    //  进入到异常
    window.alert(error.message+'GameOver!');
    this.isLive=false;
     
   }
   
   this.isLive && setTimeout(this.run.bind(this),300-(this.Scorepanel.level-1)*30)
  }
  // 检查蛇是否迟到了食物
  checkEat(X: number,Y:number) {
   if(X===this.food.X && Y===this.food.Y){
     this.food.change();
     this.Scorepanel.addScore();
     this.snake.addBody();

    }

  }


}
const gc = new GmaeControl();