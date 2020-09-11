## 1. v-if && v-else && v-else-if

- ***v-if***：判断绑定的值若为true，则加载对应dom元素并展示dom元素的内容
- ***v-else***：else和if是成对出现或者只出现v-if，当if的值为false时，则展示else对应dom的值
- ***v-else-if***：（2.1.0 新增）

```html
<body>
    <div id='app'>
        <div v-if='isLogin'>已登录</div>
        <div v-else>请登录</div>
    </div>
    <script>
        var vm = new Vue({
            el: '#app',
            data: {
                isLogin: false,
                // 如果View层需要多if-else时，可以在data中定义多个像isLogin的变量来控制; 也可以多个v-else-if
              	// isPass: false
            }
        })
    </script>
</body>

// v-else-if
<div v-if="type === 'A'">
  A
</div>
<div v-else-if="type === 'B'">
  B
</div>
<div v-else-if="type === 'C'">
  C
</div>
<div v-else>
  Not A/B/C
</div>
```

## 2. v-show

- ***v-show***：功能和`v-if`一样（备注：`v-show`不和`v-else`搭配）属性值为true就展示；区别是当属性值为false时，`v-if`对应的dom元素就不加载了，减轻服务器的压力；而`v-show` 还是会加载dom元素，但是会调整dom元素的css属性`display: none`，使得dom元素在网页不可见。

- ***总结点***：v-if和v-show都是用来控制元素的渲染。v-if判断是否加载，可以减轻服务器的压力，在需要时加载,但有更高的切换开销;v-show调整DOM元素的CSS的dispaly属性，可以使客户端操作更加流畅，但有更高的初始渲染开销。如果需要非常频繁地切换，则使用 v-show 较好；如果在运行时条件很少改变，则使用 v-if 较好。

  

## 3. v-for

- ***v-for***：`v-for`需要循环展示哪个标签元素就把`v-for`挂在哪个元素上。
- ***v-for***：注意`v-for`最好带上`key`属性
- ***v-for***：可以遍历数组、数组对象、对象、数字
- **不推荐**同时使用 `v-if` 和 `v-for`；当 `v-if` 与 `v-for` 一起使用时，`v-for` 具有比 `v-if` 更高的优先级

```html
  <body>
    <div id="app">
      <ul>
        <!-- v-for可以用of或者in遍历 -->
        <li v-for="item of itemsSort">{{ item }}--{{items}}</li>
      </ul>
      <ul>
        <li v-for="student in studentsResults">
          {{ student.name }} -- {{ student.age }}
        </li>
      </ul>
      <ul>
        <!-- 参数顺序分别是：value key index， 后两者是可选的-->
        <li v-for="(per, key, index)  in person">
          {{ index }} : {{ key }} : {{ per }}
        </li>
      </ul>
    </div>
    <script>
      var vm = new Vue({
        el: "#app",
        data() {
          return {
            items: [1, 6, 3, 42, 28, 7, 9, 8],
            students: [
              { name: "a", age: 10 },
              { name: "b", age: 5 },
              { name: "c", age: 30 },
              { name: "d", age: 2 },
            ],
            person: {
              name: "xiaomei",
              age: 18,
              habby: "game",
            },
          };
        },
        computed: {
          // 计算属性中的函数可以是箭头函数，箭头函数第一个参数接受vm实例
          studentsResults: (vm) => vm.students.sort(myStudentSort),
          itemsSort: function () {
             return this.items.sort(myItermSort);
          },
        },
      });

      function myStudentSort(a, b) {
        return a.age - b.age;
      }

      function myItermSort(a, b) {
        return a - b;
      }
    </script>
  </body>
```

## 4. v-text & v-html

- ***v-text***：`v-text`和`{{ message }}`的取值功能是一样的，但是`v-text`会比差值取值更友好；因为当页面加载慢时`{{ message }}`查差值方法取不到`message`的值时，会直接在页面展示`{{ message }}`，这种方式很不友好；而`v-text`遇到网页加载慢时会不展示dom标签的内容，直到后续获取到`message`的值时才会在绑定的dom标签上展示出来。
- ***v-html***：当`message`包含标签时`message="<div>hello</div>"`则 ` {{ message }}`差值取值会原样输出，v-html会解析`message`中的dom元素。

```html
<span>{{message}}</span> ———— <span v-text="message"></span>  // v-text更友好
<span>{{message}}</span> ———— <span v-html="message"></span>  // 尽量避免使用v-html 因为v-html会解析dom元素，所以可能会受到xss攻击
```

## 5. v-on

- ***v-on***：绑定dom事件

```html
  <body>
    <div id="app">
      比赛得分： {{grade}}
      <!-- v-on上绑定click点击事件，事件函数时methods中定义的add -->
      <button v-on:click="add">加分</button> 
      <!-- @是v-on的简写 -->
      <button @click="sub">减分</button>
      <!-- v-on上绑定按下键盘keyup事件，当按下键盘enter键时 触发methods中定义的onEnter函数 v-model用于绑定数据源 -->
      <input type="text" v-on:keyup.enter="onEnter" v-model="counter">
    </div>
    <script>
      var vm = new Vue({
        el: "#app",
        data: {
          grade: 0,
          counter: 1,
        },
        // method对象的函数不能定义为箭头函数，因为箭头函数的作用域不指向vm实例而是指向methods对象本身
        methods: {
          add: function(){
              this.grade++;
          },
          sub: function(){
              this.grade--;
          },
          onEnter: function(){
              this.grade += parseInt(this.counter);
          }
        },
      });
    </script>
  </body>
```

## 6. v-model //todo 待完善

- ***v-model***：在表单控件或者组件上创建双向绑定数据源；（**注意 : 只能运用到表单元素中**）

  - 随表单控件类型不同而不同，为不同的输入元素使用不同的 property 并抛出不同的事件

    ```js
    1. text 和 textarea 元素使用 value property 和 input 事件；
    2. checkbox 和 radio 使用 checked property 和 change 事件；
    3. select 字段将 value 作为 prop 并将 change 作为事件。
    ```

  - 负责监听用户的输入事件以更新数据；会忽略所有表单元素的 `value`、`checked`、`selected` attribute 的初始值而总是将 Vue 实例的数据作为数据来源，我们应该通过 JavaScript 在组件的 `data` 选项中`v-model`声明的数据源的初始值。

```html
// input
<input v-model="message" placeholder="edit me">
<p>Message is: {{ message }}</p>

// checkbox
<input type="checkbox" id="checkbox" v-model="checked">
<label for="checkbox">{{ checked }}</label>
```

- ***修饰符***：
  - ***.lazy***：`<input v-model.lazy="msg">`  不会实时更新改变而是在change时（也就是鼠标失去文本框焦点时）才更新而非input时更新
  - ***.number***：`<input v-model.number="age" type="number">`自动将用户的输入值转为数值类型
  - ***.trim***：`<input v-model.trim="msg">`自动过滤用户输入的首尾空白字符

## 7. v-bind

- ***v-bind***：给元素绑定属性值

```html
<!-- 绑定一个 attribute -->
<img v-bind:src="imageSrc">
data: {
	imageSrc: 'http:xxxxx'
}
<!-- 缩写 -->
<img :src="imageSrc">
```

- ***v-bind绑定style内联样式***

```html
// 方式1： style直接定义对象对象的属性值从data中获取
<body>
  <div id="app">
    <div v-bind:style="{ color: color, fontSize: isFont ? '150%' : ''}">
      hello
    </div>
  </div>
  <script>
    var vm = new Vue({
      el: "#app",
      data() {
        return {
          color: "#eee",
          isFont: true,
        };
      },
    });
  </script>
</body>


// 方式2： style直接等于对象
<div v-bind:style="styleObject">
  data: {
        styleObject: {
          color: 'red',
    			fontSize: '13px'
        }
  }


// 方式3：style数组接受多个对象
<div v-bind:style="[styleObject1, styleObject2]">
  data: {
        styleObject1: {
          color: 'red',
    			fontSize: '13px'
        },
        styleObject2: {
          color: 'red',
          fontSize: '13px'
        }
  }


```



- ***v-bind绑定class样式***

  - 方式1： 字符串形式，通过从data中获取数据源，数据源绑定到style中的class属性
  - 方式2：直接使用对象形式

  ```html
  // 在为class使用v-bind绑定对象的时候,对象的属性是类型,
  // 由于对象的属性可带可不带引号,写法自己决定, 属性的值是一个标识符
  使用方式: 
  <p :class="{thin: true, italic: true, active: false}"></p>
  ```

  

  - 方式3：计算属性形式
  - 方式4：数组写法

  ```html
  // 直接传递一个数组, 数组里面的类名要写字符串, 注意:这里的class需要使用v-bind做数据绑定
  使用方式：
  <p :class="['thin', 'italic']"></p>
  ```

  - 方式5：数组中嵌套对象

  ```html
  // 数组中推荐使用这种方式
  使用方式：
  <p :class="['thin', 'italic',{'active':flag}]"></p> // 这里的flag在data中定义, 是一个布尔值
  ```

  - 方式6：数组中使用三目运算符

  ```html
  // data中定义一个布尔值类型的flag,在数组中用三元表示来显示这个flag
  使用方式：
  <p :class="['thin', 'italic', flag ? 'active':'noactive']"></p>
  ```

  

```html
  <body>
    <div id="app">
      <img v-bind:src="url" />
      <div class="classA">0.静态绑定class属性值</div>
      <!-- <div :class="classA">v-bind上绑定除对象和数组之外的属性值只能从data中获取，不能像静态class一样直接获取到classA</div> -->
      <div :class="className">1.绑定class属性值</div>
      <!-- [className]动态属性 -->
      <div :class="[className]">xxxxxx</div>
      <div :class="{classB: isRed}">2.绑定class对象</div>
      <div :class="classComputed">3.计算属性绑定class属性值</div>
      <div :class="classObjectComputed">4.计算属性绑定class中的对象</div>
      <div :class="['classA', 'classB']">5.绑定静态数组</div>
      <div :class="[isRed ? 'classA' : '', isFont ? 'classB' : '']">6.三目表达式动态控制样式</div>
    </div>

    <style>
      .classA {
        color: red;
      }
      .classB {
        font-size: 150%;
      }
    </style>
    <script>
      var vm = new Vue({
        el: "#app",
        data() {
          return {
            url: "",
            className: "classA",
            isRed: true,
            isFont: true,
          };
        },
        computed: {
          classComputed: (vm) => {
            return vm.className;
          },
          classObjectComputed: (vm) => {
            return {
                classA: vm.isRed,
                classB: vm.isFont
            }
          },
        },
      });
    </script>
  </body>
```



## 8. v-pre & v-cloak & v-once

- ***v-pre***：原样输出（比如：{{message}} 直接输出 {{message}} ）

- ***v-cloak***：渲染编译完成后才显示
- ***v-once***：只渲染元素和组件**一次**。随后的重新渲染，元素/组件及其所有的子节点将被视为静态内容并跳过。这可以用于优化更新性能

```html
// v-pre: 原样输出{{message}}
<div v-pre>
  {{message}}
</div>

// v-cloak: 被v-cloak修饰的标签或者组件在所有的编译渲染完成之后才会显示
<div v-cloak>
  {{message}}
</div>

// v-once: 只第一次渲染，后面message数据变了，被v-once修饰的元素的数据还是不变
<div v-once>
  {{message}}
</div>
```



## 9. Vue.directive自定义指令





