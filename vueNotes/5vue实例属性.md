# vue实例属性

## vm.$data

***返回值***：返回包含key-value的对象。

正常情况Vue 实例代理了对其 data 对象 property 的访问，也就是说`vm.books`  相当于` vm.$data.books`

## vm.$props

返回一个包含一组key-value的对象

props选项用于接受父组件传递的属性，$props表示当前组件接收到的 props 对象。

Vue 实例代理了对其 props 对象 property 的访问。也就是说`this.a 等价于 this.$props.a`

```html
<!-- 示例1：选项props的基本使用 -->
<body>
    <div id="app">
        <!-- myCpn自定义组件写成my-cpn  cpnList是子组件props中声明的属性写成cpn-list，接受父组件传递的属性-->
      	<!-- cpn-list是子组件props中定义的属性cpnList，用于接收父组件传递来的list -->
        <my-cpn :cpn-list="list" :cpn-pers-info="persInfo"></my-cpn>
    </div>
    <script>
        Vue.component('myCpn', {
            // 在子组件的模板中使用子组件props中的属性
            template: `<div>
                        <h1>我是子组件myCpn</h1>
                        <h1>接收到的数据：{{cpnList}}</h1>
                        <h1>接收到的数据：{{cpnPersInfo}}</h1>
                    </div>`,
            props: ['cpnList', 'cpnPersInfo']
        });
        var vm = new Vue({
            el: "#app",
            data() {
                return {
                    list: ['数码', '家电', '旅行'],
                    persInfo: {
                        name: 'Bob',
                        age: 20
                    },
                }
            }
        });
    </script>
</body>
```



```html
<!-- 示例2：vm.$props使用 -->
<body>
    <div id="app">
        <cpn :cpn-persons="persons"></cpn>
    </div>

    <template id="cpn">
        <div>{{ getProps() }}</div>
    </template>

    <script>
        var vm = new Vue({
            el: '#app',
            components: {
                cpn: {
                    template: '#cpn',
                    props: ["cpnPersons"],
                    methods: {
                        getProps() {
                          	// 下面两种输出等价，因为Vue 实例代理了对其 props 对象 property 的访问
                            console.log(this.$props.cpnPersons);
                            console.log(this.cpnPersons);
                        }
                    }
                }
            },
            data() {
                return {
                    persons: ['东方不败', '雪千寻', '任我行', '令狐冲', '鸠摩智', '独孤求败']
                }
            }
        })
    </script>
</body>
```

## vm.$el

指向el属性指向的元素

```html
<div id="app">

</div>

<script>
  var vm = new Vue({
    el: '#app',
    data() {
      return {
        persons: ['东方不败', '雪千寻', '任我行', '令狐冲', '鸠摩智', '独孤求败']
      }
    }
  })
</script>



vm.$el											// 指向div
vm.$el.getAttribute('id')		// ”app“
```

## vm.$options

打印出vm的选项

```js
vm.$options  // 输出如下
{
  components:{},
  data: f(),
  el: "#app",
  filters:{},
  render: f anonymous(),
  directives: {}
  
}
```

## vm.$parent

指向vm的父组件实例

## vm.$root

指向当前实例的根组件实例

## vm.$children

返回值是一个包含当前实例的`所有直接子组件`的数组。**需要注意 `$children` 并不保证顺序，也不是响应式的**

## vm.$slots

vm.$slots是一个对象。主要作用是获取到当前实例的插槽上插入的元素

```html
// 示例1：
<div id="app">
  <cpn>我是cpn</cpn>
</div>

<template id="cpn">
  <div>
    // 我是cpn  这句文本被传递到插槽这里展示
    <slot></slot>
    <h1>{{getSlots()}}</h1>
  </div>
</template>

<script>
  var vm = new Vue({
    el: '#app',
    components: {
      cpn: {
        template: '#cpn',
        data() {
          return {
            persons: ['东方不败', '雪千寻', '任我行', '令狐冲', '鸠摩智', '独孤求败']
          }
        },
        methods: {
          getSlots() {
            // 上面是默认插槽，所以我是cpn这句文本本传入到default数组中
            console.log("slots---", this.$slots.default)
          }
        }
      }
    },
  })
</script>
```

每个[具名插槽](https://cn.vuejs.org/v2/guide/components-slots.html#具名插槽)有其相应的 property (例如：`v-slot:foo` 中的内容将会在 `vm.$slots.foo` 中被找到)。`default` property 包括了所有没有被包含在具名插槽中的节点，或 `v-slot:default` 的内容

```html
// 示例1：
<div id="app">
  <cpn>
    <template v-slot:user>
      <p>xxx</p>
    </template>
  </cpn>

</div>

<template id="cpn">
  <div>
    <slot v-bind:cpnperson="persons" name="user"></slot>
    <h1>{{getSlots()}}</h1>
  </div>
</template>

<script>
  var vm = new Vue({
    el: '#app',
    components: {
      cpn: {
        template: '#cpn',
        data() {
          return {
            persons: ['东方不败', '雪千寻', '任我行', '令狐冲', '鸠摩智', '独孤求败'],
            books: ['c++', 'js', 'pyhton', 'c', 'java']
          }
        },
        methods: {
          getSlots() {
            // this.$slots是子组件cpn的实例属性，因为插槽在cpn中设置
            // this.$slots.user的user是v-slot绑定的具名插槽的名字，也就是<slot>组件的name属性；            
            console.log("slots---", this.$slots.user)	 //this.$slots.user.tag 就是p标签
          }
        }
      }
    },
  })
</script>
```



## vm.$refs

***定义***：如果在普通的 DOM 元素上使用，引用指向的就是 DOM 元素；如果用在子组件上，引用就指向组件实例

***作用***：简单说就是给子组件上绑定`ref`，则父组件就可以通过`this.$ref.子组件绑定的ref的值`获取到子组件的实例

***this.$ref结构***：默认是空对象，当在子组件上绑定ref属性时，this.$refs的结构就变成`{ 绑定的ref属性: 对应的子组件 }`

```html

// 示例1：ref访问dom元素
<body>
    <div id="app">
      	// 给p元素绑定ref属性，则父组件vm实例可以通过vm.$ref.pref引用到p元素进而操作p元素
        <p ref="pref" attr="ppp">我是p元素</p>
        <div>
            {{ getElement() }}
        </div>
    </div>
    <script>
        var vm = new Vue({
            el: '#app',
            methods: {
                getElement() {
                    // this.$refs.pref指向p元素
                    // vm.$refs.pref.getAttribute('attr')可以获取到p元素上的attr属性值
                    return this.$refs.pref
                }
            }
        })
    </script>
</body>


```



```html
// 示例2：通过ref访问子组件实例
<div id="app">
  <cpn ref="cpnRef"></cpn>
  <button @click="getcpn">btn</button>
  <p>{{ msg }}</p>
</div>

<script>
  var vm = new Vue({
    el: '#app',
    data() {
      return {
        msg: ''
      }
    },
    components: {
      cpn: {
        template: '<div>我是cpn组件</div>',
        data() {
          return {
            cpnMsg: "我是cpn组件的cpnMsg"
          }
        }
      }
    },
    methods: {
      getcpn() {
        // this.$refs.cpnRef指向cpn组件实例；可以简单调用cpn组件的属性或者方法
        // this.$refs.cpnRef.cpnMsg 获取到cpn子组件的属性值
        this.msg = this.$refs.cpnRef.cpnMsg
      }
    }

  })
</script>
```





## vm.$attrs

vm.$attrs是一个对象，用于接受父组件传递的所有的属性。一般我们接受父组件传递的属性都是在子组件中定义props选项接受父组件传递的值。

<spn style="color:blue"> `$attrs`会包含所有父作用域的绑定 (`class` 和 `style` 除外)，并且可以通过 `v-bind="$attrs"` 传入内部组件 </span>

### 1. 基本使用

```html
// 示例1:

<div id="app">
  <cpn :cpnper="persons" :cpnbook="books"></cpn>
</div>
<template id="cpn">
  <div>{{ getProps() }}</div>
</template>

<script>
  var vm = new Vue({
    el: '#app',
    components: {
      cpn: {
        template: '#cpn',
        methods: {
          getProps() {
            // this.$attrs接受到父组件的cpnper属性和cpnbook属性
            console.log(this.$attrs);
          }
        }
      }
    },
    data() {
      return {
        books: ['c++', 'js', 'pyhton', 'c', 'java'],
        persons: ['东方不败', '雪千寻', '任我行', '令狐冲', '鸠摩智', '独孤求败']
      }
    }
  })
</script>
```

### 2. $attrs组件间通信

试想有A,B,C祖孙3代组件，我们想从A组件传递属性a到C组件，但是如果采用props的方式，就会导致在中间层B组件中定义props用于接受A组件传值a，然后再通过B组件props接受的a，传递到C组件中，但是B组件并没有用a，却还是需要定义props属性接受；如果组件嵌套层数很多的情况，中间组件就会定义大量的props导致浪费。

$attrs营运而生，`$attrs` 可以很方便的做到属性透传，使用起来也比较简单，避免了中间组件多写 `props` 的痛苦

```html
// 示例1：使用props进行组件通信
<div id="app">
  A{{msg}}
  <component-b :msg="msg"></component-b>
</div>
<script>
  let vm = new Vue({
    el: '#app',
    data: {
      msg: '100'
    },
    components: {
      'ComponentB': {
        // B组件必须定义props接受A组件的props，导致浪费
        props: ['msg'],
        template: `<div>B<component-c :msg="msg"></component-c></div>`,
        components: {
          'ComponentC': {
            props: ['msg'],
            template: '<div>C{{msg}}</div>'
          }
        }
      },

    }
  })
</script>

// 示例2：使用$attrs进行组件通信
  <script>
    let vm = new Vue({
      el: '#app',
      data: {
        msg: '100'
      },
      components: {
        'ComponentB': {
         	// this.$arrts接受是父组件传递给子组件的所有属性
          // 直接将 $attrs 传递到C组件，不需要在中间组件B中定义props属性了
          template: `<div>B<component-c v-bind="$attrs"></component-c></div>`,
          components: {
            'ComponentC': {
              props: ['msg'],
              template: '<div>C{{msg}}</div>'
            }
          }
        },
        
      }
    })
  </script>

参考：https://juejin.im/post/6844903784989081607
```







## vm.$listeners





## vm.$isServer



