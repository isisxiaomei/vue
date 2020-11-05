# computed计算属性

- ***作用***：用于在`data`数据被渲染前的操作，有利于逻辑代码和模板的分离。这里指明是data中的数据，因为data中的数据是响应式的。
- ***两种使用方式***：：
  - 可以在计算属性中直接使用`this访问data的数据`；
  - 使用回调函数的形式接受一个`vm实例`通过vm实例访问data的属性
- ***注意点***：computed中定义的属性名不能和data中的属性名重名，不然警告已经被定义`The computed property "categories" is already defined in data.`

## 1. 基本使用

```html
<!-- 示例1：-->
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
      // 通过箭头函数接受vm实例的方式
      fullName: vm => vm.firstName.concat('-').concat(vm.lastName)
    }
  })
</script>
```



```html
<!-- 示例2： -->
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
          	// 通过this的方式
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

## 2. 计算属性本质

- 计算属性的本质是包含`setter`和`getter方法`的一个`属性`，所以在模板中访问的时候不是函数调用的方式，而是像访问data中的属性一样访问计算属性；***说白了计算属性跟data中的数据属性一样是属性而不是方法***。
- 如果没有自己实现set，那么计算属性默认是只读的，不能更改。

```html
<!-- 示例1：本质写法 -->
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
// 示例2：简写过度阶段
computed: {
  fullName: {
    get() {
        return this.firstName.concat(' ').concat(this.lastName)
    }
  }
}

// 示例3： 简写最终版————因为一般我们不希望别人给我们的计算属性设置值，所以就把set函数删掉了，相当于计算属性是个只读属性；那么计算属性都只有一个get方法，每次都写get方法太麻烦了，所以直接把get省略了
computed: {
  fullName: function{
    return this.firstName.concat(' ').concat(this.lastName)
  }
}
```

```html
<!-- 示例4：自己实现set函数
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

## 3. 计算属性缓存问题

- 计算属性的值`fullName`会被缓存，它`只会监听get中使用的data数据项里面的属性`（比如data的flag没有被计算属性使用，所以flag的变化不会导致重新计算），如果有变化，则会重新更新计算属性
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
- ***场景选择***：将data的数据做一些变化重新展示的情况建议选择`computed`， 方法和computed都适用的情况下优先选择com

## 4. 场景

***场景1***：计算属性没有监听data中的数据，而是直接返回了123，这种情况不会报错，但是当我们在控制台修改vm.lastName值时，也就是改变dta中的值，计算属性fullname也感知不到，所以这种写法没有任何意义。

```html
// 场景1：
<div id="app">
  {{ fullName }}
</div>
<script>
  var vm = new Vue({
    el: '#app',
    data: {
      firstName: 'Nice',
      lastName: 'alice'
    },
    computed: {
      fullName() {
        return 123
      }
    }
  })
</script>
```

***场景2***：在控制台修改temp变量的值为'hello'，此时页面渲染fullName的值不会变化，还是初始的'xxx'；但如果fullName中监听的是data中的属性值，那么在控制台中通过vm修改data中的值，此时页面会重新渲染fullName，因为data中的值是响应式的。

```html
// 场景2：
<div id="app">
  <!-- 在控制台修改temp的值，不会触发这里的重新渲染；这里一直保持temp的初始值xxx；因为temp不是响应式属性 -->
  {{ fullName }}
</div>
<script>
  var temp = 'xxx'
  var vm = new Vue({
    el: '#app',
    data: {
      firstName: 'Nice',
      lastName: 'alice'
    },
    computed: {
      fullName() {
        return temp;
      }
    }
  })
</script>
```

# watch

***简介***：虽然计算属性在大多数情况下更合适，但有时也需要一个自定义的侦听器。这就是为什么 Vue 通过 `watch` 选项提供了一个更通用的方法，来响应数据的变化。当需要在<span style="color:red">数据变化时执行异步或开销较大的操作时</span>，这个方式是最有用的。

***注意点***：<span style="color:red">不应该使用箭头函数来定义 watcher 函数</span>

***watch中的几个常见属性***:

```js
1. handler： 定义监听到键名发生变化后执行的回调

2. immediate：因为默认是监听到数据改变时，才会执行handler回调；如果我们想一开始就让他的变化回调handler执行，就需要使用`immediate: true`

3. deep：可以深度监听整个键名内部的所有属性
```

## 1. 基本使用

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

## 2. watch属性使用

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

## 3. watch中的异步操作

可以在watch中执行复杂的异步操作等；这些是computed不能胜任的。具体可以参考官网的案例

## 4. vm.$watch实例方法

***注意***：在变更 (不是替换) 对象或数组时，旧值将与新值相同，因为它们的引用指向同一个对象/数组。Vue 不会保留变更之前值的副本

***语法***：`vm.$watch( expOrFn, callback, [options] )`

- `expOrFn`：{String | Function}，可以是监听的字符串键名，或者监听函数（就像监听一个未被定义的计算属性）

- `callback`： {Function | Object} 监听的键名发生变化后的回调

- `options`： { handler | immediate | deep）

```js
// 示例1：
// 键路径
vm.$watch('a.b.c', function (newVal, oldVal) {
 // 做点什么
})


// 示例2：
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

## 5. watch注销

***vm.$watch***： 返回一个取消观察函数，用来停止触发回调

***注意***：组件选项中的watch中可以随着组件的销毁而销毁，而实例方法的`vm.$watch()`，我们需要手动销毁

```js
var unwatch = vm.$watch('a', callback);
// 停止触发回调
unwatch()
```

