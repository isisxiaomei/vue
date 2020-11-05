# vue快速上手helloworld

## 0. 初始化

```js
1. 安装node和npm `brew install node && brew install npm`
2. 使用npm安装live-server	`npm install -g live-server` （后续可以使用`live-server`命令在本地起服务器;并且可是实现实时刷新浏览器）
3. 使用npm初始化项目	`npm init` (此时会暴露出package.json)
```

## 1. helloworld

```html
<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <title>vue是mvvm的代表框架，通过简单的程序理解下mvvm</title>
		// 需要引入 vue的包
    <script src="https://cdn.jsdelivr.net/npm/vue@2.5.16/dist/vue.js"></script>
  </head>
  <body>
    <!-- View层 -->
    <div id="app">hello {{ message }} </div>	 // 通过差值表达式的方式将数据渲染到页面
    <script>
        // vm实例就相当于VM层 数据监听双向绑定
      var vm = new Vue({
        el: "#app",
        // 这里的data就是Mode层数据可以从后端获取也可以自定义
        data: {
          message: "Vue",		//备注 message参数是名是随便起的
        },
      });
    </script>
  </body>
</html>
```



## 2. MVVM模式

- ***思想***：mvvvm模式是数据双向绑定的，即数据发生变化时，视图也就跟着发生变化，当视图发生变化的时候，数据也跟着同步变化，这就是mvvm数据双向绑定模式，也是vue的精髓。