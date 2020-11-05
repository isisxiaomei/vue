# slot插槽

- ***插槽作用***：为了让组件更加具有扩展性。抽取共性，保留不同为插槽，让其他组件可以传递自己想展示的标签到预留插槽。
- `<slot>` 元素作为组件模板之中的内容分发插槽。`<slot>` 元素自身将被替换

# 插槽的基本使用

## 1. 插槽的基本使用

在组件中预留插槽，可以供外界组件使用本组件时，可以给本组件传递内容到插槽位置进行展示

```html
<body>
    <div id="app">
        <cpn></cpn>
        <cpn>
          	<!-- 其他组件使用cpn组件时可以在这个位置可以给cpn组件的插槽传递自己想展示的内容 -->
            <button>btn</button>
        </cpn>
    </div>

    <template id="cpn">
        <div>
            <p>我是cpn组件</p>
          	<!-- 在cpn组件这里预留了插槽，这样在外部使用cpn组件时可以灵活传递给插槽这里一些其他组件想在cpn组件中展示的内容 -->
            <slot></slot>
        </div>
    </template>

    <script>
        new Vue({
            el: '#app',
            components: {
                cpn: {
                    template: '#cpn'
                }
            }
        })
    </script>
</body>
```



## 2. 插槽的默认值

如果其他组件使用cpn组件时大多都传递的是button元素到cpn组件的插槽处，那么我们可以将button元素作为插槽的默认值；这样就不用每次使用都手动传递button元素了。

***默认值规则：如果有传内容到插槽，则显示用户传递的内容到插槽；没传则使用插槽默认值***

```html
// 示例1：没有默认值时
<div id="app">
  <cpn></cpn>
  <cpn> <button>btn</button> </cpn>
  <cpn> <button>btn</button> </cpn>
  <cpn> <button>btn</button> </cpn>
</div>

<!-- cpn组件 -->
<template id="cpn">
  <div>
    <p>我是cpn组件</p>
    <slot></slot>
  </div>
</template>

// 示例2：抽取为插槽默认值
<div id="app">
  <cpn></cpn>
  <cpn></cpn>
  <cpn></cpn>
  <cpn></cpn>
</div>

<!-- cpn组件 -->
<template id="cpn">
  <div>
    <p>我是cpn组件</p>
    <slot> <button>btn</button> </slot>
  </div>
</template>

```

## 3. 多值替换

如果传递多个元素到插槽，但是只预留一个插槽，此时会将传递的多个元素全部替换到预留插槽

```html
// 示例：
<div id="app">
  <cpn></cpn>
  <!-- 下面这个cpn组件传递的button和input会全部替换到预留插槽位置 -->
	<cpn>
    <button>btn</button>
    <input type="text">
  </cpn>
</div>

<template id="cpn">
  <div>
    <p>我是cpn组件</p>
    <slot></slot>
	</div>
</template>

```

# 具名插槽

```js
1. v-slot: 用于绑定子组件模板中的指定插槽(slot组件的name属性)。这样父组件传递给子组件的标签就会绑定到特定的插槽上展示
2. v-slot只能添加在<template></template>上。
3. v-slot的缩写形式为 `#` ('v-slot:center'  等价于 '#center' )
```

用户传递的标签默认会替换没有名字的插槽

```html
<!-- 示例1：下面这种情况显示传递的button元素会把cpn组件预留的3个插槽替换成3个button；相当于3个插槽都插上了button元素 -->
<div id="app">
  <cpn> <button>btn</button> </cpn>
</div>

<template id="cpn">
  <div>
    <slot> <span>左边</span> </slot>
    <slot> <span>中间</span> </slot>
    <slot> <span>右边</span> </slot>
	</div>
</template>
```

如果我们想替换指定的插槽，可以在父组件中使用`template标签`包裹父组件要传递给子组件的标签，并且在`template`上使用`v-slot`绑定子组件中的`插槽名`也就是`slot标签`的`name`属性。具体见如下代码：

```html
<!-- 示例1： -->
<div id="app">
  <cpn> 
    	// 使用template将要传递给子组件cpn的标签button包裹起来，再使用v-slot绑定子组件cpn中预留的指定插槽(通过v-slot绑定slot标签的name属性); 后面父组件的button就可以渲染到cpn的插槽名为center的插槽上
      <template v-slot:center>
          <button>btn</button>
      </template>
  </cpn>
</div>

<template id="cpn">
  <div>
    <slot name="left"> <span>左边</span> </slot>
    <slot name="center"> <span>中间</span> </slot>
    <slot name="right"> <span>右边</span> </slot>
	</div>
</template>
```

#  编译作用域

- ***总结***：使用变量时不清楚这个变量是哪个组件的，判断方法是在谁的模板中使用，这个变量就是谁的。

```html
// vm实例组件模板；所以下面使用的isShow变量时vm实例的isShow而不是cpn的
<div id="app">
  <cpn v-show="isShow"></cpn>
</div>

// cpn组件模板
<template id="cpn">
  <div>hello</div>
</template>
```

# 作用域插槽

***总结***：父组件定制在子组件插槽上展示的标签，但是标签的数据内容由子组件提供。这就要求子组件把数据内容传递给父组件。

## 1. 作用域插槽之默认插槽

```html
<!-- 示例1： -->
<body>
  	// 父组件模板
    <div id="app">
        <cpn>
          	// 在父组件的模板中通过`v-slot:default="slotProps"`获取到子组件插槽上绑定的数据并存放在slotProps对象上，slotProps可以任意命名
            <template v-slot:default="slotProps">
                <p>{{ slotProps.persons.join('--') }}</p>
            </template>
        </cpn>
    </div>
		
  	// 子组件cpn模板
    <template id="cpn">
        <div>
          	// 将子组件的persons数据绑定到子组件的插槽上，这样父组件就可以通过v-slot获取到子组件插槽上的数据，进而在父组件传递给子组件的标签上就可以使用子组件的数据
            <slot v-bind:persons="persons"></slot>
        </div>
    </template>

    <script>
        new Vue({
            el: '#app',
            components: {
                cpn: {
                    template: '#cpn',
                    data() {
                        return {
                            persons: ['东方不败', '雪千寻', '任我行', '令狐冲', '鸠摩智', '独孤求败']
                        }
                    },
                }
            }
        })
    </script>
</body>
```

## 2. 作用域插槽之多个插槽

只有一个默认插槽时，直接使用`v-slot:default="slotProps"` ，这里slotProps名字任意取；当出现多个插槽时，可以为每个插槽使用name属性命名，接着用`v-slot:person="slotPersonProps"`，这里的person绑定的时子组件中插槽slot标签的name属性

```html
// 示例1：
<body>
    <div id="app">
        <cpn>
            <template v-slot:person="slotPersonProps">
                <p>{{ slotPersonProps.cpnperson  }}</p>
            </template>
            <template v-slot:book="slotBookProps">
                <p v-for="i in slotBookProps.cpnbook">{{ i }}</p>
            </template>
        </cpn>
    </div>

    <template id="cpn">
        <div>
          	// 多个插槽使用name属性，这样父组件中就可以通过`v-slot:name`获取到子组件的绑定在name指定的插槽上子组件数据属性  
            <slot v-bind:cpnperson="persons" name="person"></slot>
            <slot v-bind:cpnbook="books" name="book"></slot>
        </div>
    </template>

    <script>
        new Vue({
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
                }
            }
        })
    </script>
</body>
```



# 解构插槽prop

针对多个插槽的情况，在写法上可以解构插槽prop

```html
// 示例1：
<body>
    <div id="app">
        <cpn>
          	// 这里采用解构的写法，类比之前`v-slot:person="slotPersonProps"` 相当于从slotPersonProps对象中解构出cpnperson属性
            <template v-slot:person="{cpnperson}">
                <p>{{ cpnperson  }}</p>
            </template>
        </cpn>
    </div>

    <template id="cpn">
        <div>
            <slot v-bind:cpnperson="persons" name="person"></slot>
        </div>
    </template>

    <script>
        new Vue({
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
                }
            }
        })
    </script>
</body>

```

