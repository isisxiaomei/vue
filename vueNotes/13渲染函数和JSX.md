https://juejin.im/post/6844903919764635655

https://juejin.im/post/6844903955948896263#comment



```js
// h就是createElement；h也是一个函数，接受参数：(’元素标签‘，属性，孩子节点)
render(h) {
  return (
    <Child1 level={1}>
    <span>Hello</span> world!
		</Child1>
	)
}

//
data: {
  msg: 'Hello world'
},
render (h) {
  return (
    <div id='my-id'>,
      { this.msg } 
    </div>
  );
}


//
new Vue({
  el: '#app',
  data: {
    msg: 'Click to see the message'
  },
  methods: {
    hello () {
      alert('This is the message')
    }
  },
  render (createElement) {
    return createElement(
      'span',
      {
        class: { 'my-class': true },
        style: { cursor: 'pointer' },
        on: {
          click: this.hello
        }
      },
      [ this.msg ]
    );
  },
});
<div id="app"><!--span will render here--></div>


// 
new Vue({
  el: '#app',
  data: {
    msg: 'Click to see the message.'
  },
  methods: {
    hello () {
      alert('This is the message.')
    }
  },
  render: function render(h) {
    return (
      <span
        class={{ 'my-class': true }}
        style={{ cursor: 'pointer' }}
        on-click={ this.hello }
      >
        { this.msg }
      </span>
    )
  }
});



```

