## 1. template

- ***用法***：是vue实例的一个内部属性，一个字符串模板，模板将会***替换***挂载的元素。挂载元素的内容都将被忽略，除非***模板的内容有分发插槽***。（主要作用那个当html以template的形式写入js中时，我们可以使用template作模板进行html和js的分离）
- ***备注***：如果 Vue 选项中包含渲染函数，该模板将被忽略。
- ***特点***：
  - 如果vue实例中有template属性，会将该属性值进行编译，将编译后的虚拟dom直接替换掉vue实例绑定的元素（即el绑定的那个元素）
  -  ***template属性中的dom结构只能有一个根元素***，如果有多个根元素需要使用v-if、v-else、v-else-if设置成只显示其中一个根元素
  - 在该属性对应的属性值中可以使用vue实例data、methods中定义的数据
- template定义的模板最终还是调用的`Vue.extend()`来创建构造器对象
  
- ***基本使用***：

```html
<!-- 未使用template属性 -->
<body>
  <div id="app">
    <div>{{message}}</div>
	</div>
  <script>
        var vm = new Vue({
          el: '#app',
          data(){
            return {
              message: 'hello vue'
            }
          },
        })
  </script>
</body>

<!-- 使用template属性，此时span标签替换整个el绑定的id为app的div标签，dom结构中只有一个span -->
<body>
  <div id="app">
    <div>{{message}}</div>
  </div>
  <script>
    var vm = new Vue({
      el: '#app',
      data(){
        return {
          message: 'hello world'
        }
      },
      template: `<span>{{message}}</span>`
    })
  </script>
</body>
```

- ***template的几种方式***：

```html
<!-- 方式1： -->
template: `<span>方式1：{{message}}</span>`

<!-- 方式2： -->
<div id="app">
  <div>{{message}}</div>
</div>
<template id="tem2">
  <h1>方式2：{{message}}</h1>
</template>
<script>
  var vm = new Vue({
    el: '#app',
    data(){
      return {
        message: 'hello world'
      }
    },
    template: "#tem2"
  })
</script>


<!-- 方式3：推荐 因为这种方式可以实现外部引用 -->
<body>
  <div id="app">
    <div>{{message}}</div>
  </div>
  <script type="x-template" id='tem3' src="">
        <h1>方式3：{{message}}</h1>
  </script>
  <script>
    var vm = new Vue({
      el: '#app',
      data(){
        return {
          message: 'hello world'
        }
      },
      template: "#tem3"
    })
  </script>
</body>
```

- ***template的作用***：

```html
<!-- 需求背景: 想要span也一起循环 -->
<div id='app'>
  <div>
    <div v-for="item in items">{{item.text}}</div>
    <span>{{item.text}}</span>
  </div>
</div>

<!-- 方式1实现：直接对span也循环 -->
// 缺点：后期不好维护
<div id='app'>
  <div>
    <div v-for="item in items">{{item.text}}</div>
    <span v-for="item in items">{{item.text}}</span>
  </div>
</div>

<!-- 方式2实现：在外层包裹一层div循环-->
// 缺点：额外增加多余div标签
<div id='app'>
  <div v-for="item in items">
    <div>{{item.text}}</div>
    <span>{{item.text}}</span>
  </div>
</div>

<!-- 方式3实现：在外层包裹一层div循环-->
// 备注：
<template v-for="item in items">
    <div>{{item.text}}</div>
    <span>{{item.text}}</span>
</template>
```

## 2. components属性

- ***作用***：用于定义局部组件；包含 Vue 实例可用组件的哈希表
- ***语法***：

```js
components: {
  '组件名1': 组件1的构造器对象/直接定义选项对象,
  '组件名2': 组件2的构造器对象/直接定义选项对象
}
```

- ***用法***：

```js
var cpnConstructor = Vue.extend({
  template: `<h1>我是cpn2</h1>`
})
var vm = new Vue({
  el: '#app',
  components: {
    // 方式1：组件名：选项对象
    'cpn1': {
      template: `<h1>我是cpn1</h1>`
    },
    // 方式2：组件名：构造器对象
    'cpn2': cpnConstructor
  }
})
```

## 3. computed计算属性

- ***作用***：用于在data数据被渲染前的操作，有利于逻辑代码和模板的分离
- ***使用***：两种方式：1. 可以在计算属性中直接使用`this访问data的数据`；2. 使用回调函数的形式接受一个`vm实例`通过vm实例访问data的属性

```html
<div id="app">
  <!-- 这种比较繁琐 -->
  {{ this.firstName + ' ' + this.lastName }}
  <!-- 计算属性的方式比较简洁 -->
  {{ fullName }}
</div>
<script>
  new Vue({
    el: '#app',
    data: {
      firstName: 'Nice',
      lastName: 'alice'
    },
    computed: {
      fullName: vm => vm.firstName.concat('-').concat(vm.lastName)
    }
  })
</script>
```

- ***注意点***：computed中定义的属性名不能和data中的属性名重名，不然警告已经被定义`The computed property "categories" is already defined in data.`

```html
<!-- 基本使用 -->
<body>
    <!-- 308 --308  -->
    <div id="app">{{ totalPrice }} -- {{totalPriceTwo}}</div>
    <script>
        var vm = new Vue({
            el: "#app",
            data: {
                categories: [
                    { id: 1, name: '计算机网络', price: 100 },
                    { id: 2, name: '操作系统', price: 98 },
                    { id: 3, name: '深入理解计算机系统', price: 110 },
                ]
            },
            computed: {
                totalPrice() {
                    return this.categories.reduce((a, b) => {
                        a.price += b.price
                        return a;
                    }, { price: 0 }).price
                },
                totalPriceTwo() {
                    return this.categories.map(item => item.price).reduce((a, b) => a + b);
                },
            },


        });
    </script>
</body>

```

- ***本质***：
  - 计算属性的本质是包含setter和getter方法的一个属性，所以访问的时候不是函数调用的方式，相当于在data中定义的属性一样，而不是方法。
  - 如果没有自己实现set，那么计算属性默认是只读的，不能更改。

```html
<!-- 本质写法 -->
<div id="app">{{ fullName }}</div>
<script>
  var vm = new Vue({
    el: "#app",
    data: {
      firstName: 'Nice',
      lastName: 'alice'
    },
    computed: {
      // 本质是个包含setter和getter方法的对象; 在访问fullName属性时，会默认调用get函数，并将get函数的返回值作为fullName属性的值
      fullName: {
        set() { },
        get() {
          return this.firstName.concat(' ').concat(this.lastName)
        }
      }
    }
  });
</script>
```

```js
// 简写过度阶段
computed: {
  fullName: {
    get() {
        return this.firstName.concat(' ').concat(this.lastName)
    }
  }
}

// 简写最终版: 因为一般我们不希望别人给我们的计算属性设置值，所以就把set函数删掉了，相当于计算属性是个只读属性；那么计算属性都只有一个get方法，每次都写get方法太麻烦了，所以直接把get省略了
computed: {
  fullName: function{
    return this.firstName.concat(' ').concat(this.lastName)
  }
}
```

```html
<!-- 自己实现set函数
// 可以自己实现set方法，实现了set方法就不是只读属性了;
// 备注：自己实现的set方法，set方法是有一个参数的，fullName被赋值时的值就是set的参数
-->

<div id="app">{{ fullName }}</div>
<script>
  var vm = new Vue({
    el: "#app",
    data: {
      firstName: 'Nice',
      lastName: 'alice',
    },
    computed: {
      fullName: {
        // 当执行 vm.fullName = 'hello bob'时，就会默认调用set函数，newValue就等于'hello bob'
        set(newValue) {
          var names = newValue.split(' ')
          this.firstName = names[0];
          this.lastName = names[1];
        },
        get() {
          return this.firstName.concat(' ').concat(this.lastName)
        }
      }
    }
  });
</script>
```

- ***计算属性缓存***： 
  - 计算属性的值fullName会被缓存，它`只会监听get中使用的data数据项里面的属性`（比如data的flag没有被计算属性使用，所以flag的变化不会导致重新计算），如果有变化，则会重新更新计算属性
  - 由于计算属性的值会被缓存，所以多次访问计算属性值只会调用一次get函数；所以计算属性比methods性能更好一点

```html
<body>
    <div id="app">
        <h1>{{this.firstName + ' ' + this.lastName}}</h1>
        <div>
            methods方法调用次数：3次
            <h1>{{getFullName()}}</h1>
            <h1>{{getFullName()}}</h1>
            <h1>{{getFullName()}}</h1>
        </div>
        <div>
            computed属性调用次数：1次
            <h1>{{fullName}}</h1>
            <h1>{{fullName}}</h1>
            <h1>{{fullName}}</h1>
        </div>

    </div>
    <script>
        var vm = new Vue({
            el: "#app",
            data: {
                firstName: 'Nice',
                lastName: 'alice',
                flag: '111',
            },
            computed: {
                fullName: vm => {
                    console.log('fullName');
                    return vm.firstName.concat(' ').concat(vm.lastName)
                }
            },
            methods: {
                getFullName() {
                    console.log('getFullName');
                    return this.firstName.concat(' ').concat(this.lastName)
                }
            }
        });
    </script>
</body>
```

- ***computed和methods的区别***：
  - computed计算属性值可以缓存，性能更好。（如果方法中有循环，那么使用方法则会每调用一次方法都会进行for循环）
  - computed计算属性本质是一个属性，不是方法；methods定义的时方法
  - computed除了可以使用基本函数的this访问data之外，还提供箭头函数接受参数vm实例的方式访问data数据；methods中的方法不能使用箭头函数的形式
- ***场景选择***：将data的数据做一些变化重新展示的情况建议选择`computed`， 方法和computed都适用的情况下优先选择computed。

## 4. methods

- 使用：methods是一个选项属性对象，提供操作实例数据的方法；方法不能使用箭头函数

```js
<div id="app">
 <h1>{{ getFullName() }}</h1>
<div>
var vm = new Vue({
  el: "#app",
  data: {
    firstName: 'Nice',
    lastName: 'alice',
  },
  methods: {
    getFullName() {
      return this.firstName.concat(' ').concat(this.lastName)
    }
  }
});
```

## 5. filters





## 6. watch

- ***简介***：虽然计算属性在大多数情况下更合适，但有时也需要一个自定义的侦听器。这就是为什么 Vue 通过 `watch` 选项提供了一个更通用的方法，来响应数据的变化。当需要在<span style="color:red">数据变化时执行异步或开销较大的操作时</span>，这个方式是最有用的。
- ***注意点***：<span style="color:red">不应该使用箭头函数来定义 watcher 函数</span>
- ***watch中的几个常见属性***:
  - **handler**： 定义监听到键名发生变化后执行的回调
  - **immediate**：因为默认是监听到数据改变时，才会执行handler回调；如果我们想一开始就让他的变化回调handler执行，就需要使用`immediate: true`
  - **deep**：可以深度监听整个键名内部的所有属性

### 6.1 基本使用

- ***被监听的data中的键名对应键值类型***：`String | Function | Object | Array`

```html
<!-- 基本使用示例1： -->
<body>
    <div id="app">
        <input v-model="count" />
    </div>
    <script>
        new Vue({
            el: '#app',
            data: {
                count: 10,
            },
            watch: {
              	// watch中实时监听的是 data中的 count键名，count键对应的键值是一个回调函数
              	// 回调函数接受两个参数，newVal是count变化后的值，oldValue是count变成newValue的前一个值
                count: function (newVal, oldVal) {
                    console.log(`new: %s, old: %s`, newVal, oldVal);
                }
            }
        })
    </script>
</body>

<!-- 基本使用示例2：监听到变化之后可以操作 -->
<div>
      <p>FullName: {{fullName}}</p>
      <p>FirstName: <input type="text" v-model="firstName"></p>
</div>
<script>
      new Vue({
        el: '#root',
        data: {
          firstName: 'Dawei',
          lastName: 'Lou',
          fullName: ''
        },
        watch: {
          firstName(newName, oldName) {
            // 监听到firstName变化，操作之后赋值给fullName
            this.fullName = newName + ' ' + this.lastName;
          }
        } 
      })
</script>
```

```js
// 示例2：监听data中的键名所对应的键值的各种类型
var vm = new Vue({
  data: {
    a: 1,
    b: 2,
    c: {
      	title:'my-blog',
        categories:[]
    },
    d: 4,
    e: {
      f: {
        g: 5
      }
    }
  },
  watch: {
    
    a: function (newVal, oldVal) {
        console.log(`new: %s, old: %s`, newVal, oldVal);
    },
    // 可以是方法名
    b: 'someMethod',
    
    c: function (newVal, oldVal) {
        console.log("如果c对象中的某个属性发生了变化，我们这种直接监听c对象是监听不到变化的，因为c对象的指向并没有发生改变");
    },
    
    // 下面监听方式的缺点是，只要修改c对象中的任何一个属性(无论嵌套多深的属性)，都会执行handler；这样会造成更多的性能开销
    c: {
      handler: function (val, oldVal) { /* ... */ },
      deep: true
    },
    
    // 只监听某个对象的特定属性，'c.title' 字符串写法；这种方式的优点弥补了深度监听整个对象而造成了更多的性能开销
    'c.title': function(newVal, oldVal){
      
    }
    
    // 因为默认是监听到数据改变时，才会执行handler回调；如果想一开始就让他的变化回调handler执行，就需要使用`immediate: true`
    d: {
      handler: 'someMethod',
      immediate: true
    },
    
    // 你可以传入回调数组，当e发生变化时，这一组回调函数它们会被逐一调用；感觉有点像观察者模式
    e: [
      'handle1',
      function handle2 (val, oldVal) { /* ... */ },
      {
        handler: function handle3 (val, oldVal) { /* ... */ },
        /* ... */
      }
    ],
  }
})
vm.a = 2 // => new: 2, old: 1
```

### 6.2 watch中的异步操作

---

// todo有问题，后续更新

---



### 6.3 vm.$watch实例方法

- ***语法***：`vm.$watch( expOrFn, callback, [options] )`
  1. `expOrFn`：{String | Function}，可以是监听的字符串键名，或者监听函数（就像监听一个未被定义的计算属性）
  2. `callback`： {Function | Object} 监听的键名发生变化后的回调
  3. `options`： { handler | immediate | deep）

```js
// 示例1：
// 键路径
vm.$watch('a.b.c', function (newVal, oldVal) {
 // 做点什么
})

// 函数
vm.$watch(
 function () {
   // 表达式 `this.a + this.b` 每次得出一个不同的结果时
   // 处理函数都会被调用。
   // 这就像监听一个未被定义的计算属性
   return this.a + this.b
 },
 function (newVal, oldVal) {
   // 做点什么
 }
)
```

- ***返回值***：`vm.$watch` 返回一个取消观察函数，用来停止触发回调 

- ***注意***：在变更 (不是替换) 对象或数组时，旧值将与新值相同，因为它们的引用指向同一个对象/数组。Vue 不会保留变更之前值的副本

### 6.3 注销watch

- `vm.$watch` 返回一个取消观察函数，用来停止触发回调

```js
var unwatch = vm.$watch('a', callback);
// 停止触发回调
unwatch()
```

- ***注意***：组件选项中的watch中可以随着组件的销毁而销毁，而实例方法的`vm.$watch()`，我们需要手动销毁

---

遗留问题： 为什么销毁watch  内置溢出？

---

### 6.4 watch和computed的比较

---

// todo 关于computed同步，watch异步的问题有待更新

----



## 7. props

### 7.1 基本使用

- ***作用***：props 可以是数组或对象，用于接收来自父组件的数据。props 可以是简单的数组，或者使用对象作为替代，对象允许配置高级选项，如类型检测、自定义验证和设置默认值
- ***注意点***：

```js
1. Prop 是单向绑定的：当父组件的属性变化时，将传导给子组件，但是反过来不会。这是为了防止子组件无意间修改了父组件的状态，因为对于传递的引用类型的值，也就是说prop接受到的是对象或者数组，那么父子组件指向的同一块内存，子组件内部修改会影响父组件。
2. 子组件如果需要修改prop，则可以在子组件内部进行一份prop的拷贝
3. 关于修改父组件传递的props被修改的测试结果：如果传递的时基本类型，那么子组件直接修改不会影响到父组件，但是控制台会包警告，如果传递的引用类型，那么子组件的修改是会影响父组件的，并且控制台不报错也不抱警告
```

```html
<!-- 基本使用 -->
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



### 7.2 prop验证

> 验证配置是基于对象的语法；当 prop 验证失败的时候，(开发环境构建版本的) Vue 将会产生一个控制台的警告。

- ***注意***：注意那些 prop 会在一个组件实例创建**之前**进行验证，所以实例的 property (如 `data`、`computed` 等) 在 `default` 或 `validator` 函数中是不可用的。

- ***配置项如下***：

```js
1. type：检查一个 prop 是否是给定的类型，否则抛出警告；可以是原生构造函数或者自定义构造函数的一种`String、Number、Boolean、Array、Object、Date、Function、Symbol`

2. default：为 prop 指定一个默认值。若 prop 没有被传入，则用默认值。对象或数组的默认值必须从一个工厂函数返回
3. required：定义prop是否必填项；在非生产环境中，如果这个值为 truthy 且该 prop 没有被传入的，则一个控制台警告将会被抛出
4. validator：当校验规则很复杂，默认提供的校验规则无法满足的时候可以使用自定义函数来校验；自定义验证函数接受参数，函数对参数进行一些处理判断等满足条件后再赋值给prop。
```

```js
// 自定义构造函数Person
function Person (firstName, lastName) {
  this.firstName = firstName
  this.lastName = lastName
}

Vue.component('blog-post', {
  props: {
    // 指定prop属性author传入的值必须是Person类型
    author: Person
  }
})
```

```js
// props为对象提供的语法验证
Vue.component('my-component', {
  props: {
    // 基础的类型检查 (`null` 和 `undefined` 会通过任何类型验证)
    propA: Number,
    // 多个可能的类型
    propB: [String, Number],
    // 必填的字符串
    propC: {
      type: String,
      required: true
    },
    // 带有默认值的数字
    propD: {
      type: Number,
      default: 100
    },
    // 带有默认值的对象
    propE: {
      type: Object,
      // 对象或数组默认值必须从一个工厂函数获取
      default: function () {
        return { message: 'hello' }
      }
    },
    
    // 带有默认值的对象
    propH: {
      type: Arrary,
      // 对象或数组默认值必须从一个工厂函数获取
      default: function () {
        return []
      }
    },
    
    propG: {
      type: Object,
  		// 指定propG是个对个Object类型，默认值是工厂函数并且返回一个空对象作为默认值
      default: function () {
        return {}
      }
    },
    // 自定义验证函数：
    propF: {
      validator: function (value) {
        // validator定义的函数接受传递给propF的value值；这个值必须匹配下列字符串中的一个，才能赋值给propF
        return ['success', 'warning', 'danger'].indexOf(value) !== -1
      }
    }
  }
})
```

### 7.3 非prop的Attribute

- ***定义***：所谓非 prop 特性，就是指它可以直接传入组件，而不需要定义相应的 prop。尽管为组件定义明确的 prop 是推荐的传参方式，组件的作者却并不总能预见到组件被使用的场景。所以组件可以接收任意传入的特性，这些特性都会被添加到组件的根元素上

```html
// 非prop属性
<div id="app">
  <cpn class='myCls' data="vue"></cpn>
</div>
<script>
  Vue.component('cpn', {
    template: `<input>我是组件cpn</input>`,
  })

  new Vue({
    el: '#app',
  })
</script>

// 运行结果
<input class='myCls' data="vue">我是组件cpn</input>

```





















