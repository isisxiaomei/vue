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

























