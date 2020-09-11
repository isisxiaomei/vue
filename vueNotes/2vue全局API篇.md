## 1. Vue.extend(options)

- ***参数***：options是个object
- ***作用***：使用基础 Vue 构造器，创建一个“子类”。参数是一个包含组件选项的对象；**`data` 选项在 `Vue.extend()` 中必须是函数**。

```html
<script src="https:cdn.jsdelivr.net/npm/vue"></script>
<div id="mount-point"></div>
<script>
  // 创建构造器
  var VmSon = Vue.extend({
    template: '<p>{{firstName}}--{{lastName}}</p>',
    // 备注： 在Vue.extend中data必须是函数
    data: function(){
      return {
        firstName: 'xu',
        lastName: 'xiaomei',
      }
    }
  })
  
  // 将创建的新vue实例挂载到元素上
  new VmSon().$mount('#mount-point')  // 备注：发现Id为mount-point的div ,是直接被template的p元素替代了，dom中没有Id为mount-point的div
</script>

// 结果展示如下
<p>xu--xiaomei</p>
```

