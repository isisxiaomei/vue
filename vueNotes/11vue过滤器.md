# 过滤器

> 主要作用：改变数据输出格式或者内容

Vue中的过滤器不能替代Vue中的`methods`、`computed`或者`watch`，因为过滤器不改变真正的`data`，而只是改变渲染的结果，并返回过滤后的版本

***注意点：过滤器中不能访问vm实例，并且过滤器中的this没有指向vm实例***

过滤器可以用在两个地方：**双花括号插值和 `v-bind` 表达式** (后者从 2.1.0+ 开始支持)

## 1. 基本使用

```html

// 示例1：过滤器用在双花括号中
<div id="app">
  // 这里的message属数据会作为过滤器函数filterFun的第一个参数value传递到过滤器
  {{ message | filterFun }}
</div>

<script>
  var vm = new Vue({
    el: '#app',
    data() {
      return {
        message: "hello"
      }
    },
    // 定义本地过滤器
    filters: {
      filterFun(value) {
        if (!value) return ''
        return value.toUpperCase();
      }
    }

  })
</script>

// 注意点：过滤器只是对数据渲染之前做一些定制化的处理，但并不改变数据本身。比如此时在控制台输出vm.message的结果是hello,并没有没变

```

```html

// 示例2：过滤器用在v-bind中；我们可以通过在p标签上绑定事件进而获取p标签对象然后获取msg的值
<div id="app">
  <p :msg="message | filterFun"></p>
</div>

<script>
  var vm = new Vue({
    el: '#app',
    data() {
      return {
        message: "hello"
      }
    },
    filters: {
      filterFun(value) {
        return value.toUpperCase();
      }
    }

  })
</script>

```

## 2. 过滤器传参

过滤器的第一个参数是接受要过滤的数据源

```html
// 示例1：
<div id="app">
  // 数据源message传递给过滤器的第一个参数value，参数world传递给第二个参数arg1，参数叹号传递给第三个参数arg2
  <p>{{ message | filterFun('world', '!') }}</p>
</div>

<script>
  var vm = new Vue({
    el: '#app',
    data() {
      return {
        message: "hello"
      }
    },
    filters: {
      filterFun(value, arg1, arg2) {
        return value.concat(arg1, arg2);
      }
    }

  })
</script>
```



## 3. 多个过滤器

多个过滤器通过`|`管道符连接

 ```html
// 示例1：
<div id="app">
  // msg作为filterA的数据源，filterA过滤的结果再作为filterB的数据源
  <p>{{ msg | filterA | filterB}}</p>
</div>

<script>
  var vm = new Vue({
    el: '#app',
    data() {
      return {
        msg: "hello"
      }
    },
    filters: {
      filterA(value) {
        return value.toUpperCase();
      },
      filterB(value) {
        return value.concat('world');
      }
    }

  })
</script>
 ```

## 4. 全局过滤器和局部过滤器

### 4.1 全局过滤器

***语法***：`Vue.filter('过滤器名', Function)` 

***注意点***：<span style="color: red">全局过滤器必须定义在vue实例之前，否则无效</span>

```html
// 示例1：
<div id="app">
  <p>{{ msg | filterName }}</p>
</div>

<script>
  // 通过Vue.filter定义全局过滤器
  Vue.filter('filterName', function (value) {
    return value.toUpperCase()
  });
  
  var vm = new Vue({
    el: '#app',
    data() {
      return {
        msg: "hello vue"
      }
    },
  })
</script>
```

### 4.2 局部过滤器

***注意点***：当局部和全局过滤器同名时，优先使用局部过滤器

```html
<div id="app">
  {{ message | filterFun }}
</div>

<script>
  var vm = new Vue({
    el: '#app',
    data() {
      return {
        message: "hello"
      }
    },
    // 在组件选项中定义本地过滤器
    filters: {
      filterFun(value) {
        if (!value) return ''
        return value.toUpperCase();
      }
    }

  })
</script>
```

