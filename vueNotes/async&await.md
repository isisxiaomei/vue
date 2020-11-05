# async起什么作用

`async `函数返回的是一个` Promise `对象；如果在函数中 `return` 一个直接量，async 会把这个直接量通过 `Promise.resolve()` 封装成 Promise 对象（备注：`Promise.resolve(x)` 可以看作是 `new Promise(resolve => resolve(x))` 的简写，可以用于快速封装字面量对象或其他对象，将其封装成 Promise 实例）；所以我们可以调用async修饰的函数后，可以使用then进行链式调用

```js
// 示例1：
async function testAsync() {
    return "hello async";
}

const result = testAsync();
console.log(result);				// result是个promise对象 Promise { 'hello async' }


testAsync().then(v => {
    console.log(v);     		// 输出 hello async
});
```

如果 async 函数没有返回值时，很容易想到，它会返回 `Promise.resolve(undefined)`

```js
async function testAsync(){
	return;
}
let res = testAsync();
console.dir(res)						// Promise { undefined }
```

联想一下 Promise 的特点——无等待，所以在没有 `await` 的情况下执行 async 函数，它会立即执行，返回一个 Promise 对象，并且，绝不会阻塞后面的语句。这和普通返回 Promise 对象的函数并无二致；那么下一个关键点就在于` await `关键字了

# await在等待什么

await只能用在async函数内部。

await 表达式会暂停当前`async function` 的执行，等待 Promise 处理完成。若 Promise 正常处理(fulfilled)，其回调的resolve函数参数作为 await 表达式的值，继续执行 `async function` 。

若 Promise 处理异常(rejected)，await 表达式会把 Promise 的异常原因抛出。

```js
1. 如果一个 Promise 被传递给一个 await 操作符，await 将等待 Promise 正常处理完成并返回其处理结果。
2. 如果传递给await的值不是一个 Promise，await 会把该值转换为已正常处理的Promise，然后等待其处理结果。
```

```js
// 示例1：
function resolveAfter2Seconds(x) {
  return new Promise(resolve => {
    setTimeout(() => {
      resolve(x);
    }, 2000);
  });
}

async function f1() {
  var x = await resolveAfter2Seconds(10);
  console.log(x); // 10
}
f1();

// 示例2：
async function f2() {
  var y = await 20;
  console.log(y); // 20
}
f2();
```



# await执行顺序问题

> 总结：执行顺序为：先执行await命令之前的代码，遇到await时停止执行async中await命名后的代码，此时执行async函数外部的代码，执行完毕后再接着执行async函数内部的await命令所在行以及之后的代码



- ***示例1结论***：由于await主要等待的是promise的resolve的值作为await本身的返回值，

```js
// 示例1：
async function getStockPriceByName () {
    console.log("aa")

    const stockPrice = await new Promise((resolved, rejected) => {
        setTimeout(() => {
            console.log("time...")
        }, 5000);
        resolved(111);
    });
    console.log(stockPrice);
    console.log("bb")
    return stockPrice;
}

getStockPriceByName().then(function (result) {
    console.log(result);
});

// 输出：
aa
111
bb
111
// 这里间隔5秒再输出 time...
time...

// 结论：await主要等待的是其后的promise的resolved的返回的值
```

- ***示例2结论***：await等待的主要是resolve的返回参数，所以这里不执行宏任务settimeout，那么resolve没办法返回参数，await也就没办法结束，那么await命令后面的代码也就没办法执行

```js
// 示例2：
async function getStockPriceByName () {
    console.log("aa")

    const stockPrice = await new Promise((resolved, rejected) => {
        setTimeout(() => {
            console.log("time...")
            resolved(111);
        }, 5000);
    });
    console.log(stockPrice);
    console.log("bb")
    return stockPrice;
}

getStockPriceByName().then(function (result) {
    console.log(result);
});


// 输出：
aa
// 先输出了aa，接着在这里间隔5秒后再输出下面的4项
time...
111
bb
111

// 结论：await主要等待的是其后的promise的resolved的返回的值
```

- ***示例3结论***：

```js
// 示例3：
async function getStockPriceByName () {
    console.log("aa")

    const stockPrice = await new Promise((resolved, rejected) => {
        setTimeout(() => {
            console.log("time...")
            resolved(111);
        }, 5000);
    });
    console.log(stockPrice);
    console.log("bb")
    return stockPrice;
}

getStockPriceByName().then(function (result) {
    console.log(result);
});
console.log('cc');

// 输出：
aa
cc
// 这里间隔5秒
time...
111
bb
111

// 结论：await只会阻塞async函数内部await之后的代码；async函数外部的代码正常执行。
```

https://juejin.im/post/6844903613530144781

- ***示例4结论***：记住await后面跟的是异步操作，就算是之前promise的同步代码；这里还是默认是异步操作都不执行。

```js
// 示例4：
async function getStockPriceByName () {
    console.log("aa")

    const stockPrice = await new Promise((resolved, rejected) => {
        setTimeout(() => {
            console.log("time...")
        }, 5000);
        resolved(111);
    });
    console.log(stockPrice);
    console.log("bb")
    return stockPrice;
}

getStockPriceByName().then(function (result) {
    console.log(result);
});
console.log('cc');

// 输出：
aa
cc
111
bb
111
// 这里间隔5秒
time...
```

- ***示例5结论***：在async函数内部遇到await命令后停止async函数的执行，相当于遇到的异步操作，这时先去执行async函数外部的同步代码，执行结束后再回到await处继续执行async函数内await命令后的代码

```js
// 示例5：
async function getStockPriceByName () {
    console.log("aa")

    const stockPrice = await 222
    console.log(stockPrice);
    console.log("bb")
    return stockPrice;
}

getStockPriceByName().then(function (result) {
    console.log(result);
});
console.log('cc');

// 输出：
aa
cc
222
bb
222
```

- ***示例6结论***：由于await其实是promise的异步处理，所以会在宏任务之前执行

```js
// 示例6：
async function getStockPriceByName () {
    console.log("aa")

    const stockPrice = await 222
    console.log(stockPrice);
    console.log("bb")
    return stockPrice;
}

getStockPriceByName().then(function (result) {
    console.log(result);
});

setTimeout(() => {
    console.log("ff");
}, 5000)
console.log('cc');

// 输出：
aa
cc
222
bb
222
// 这里间隔5秒
ff
```

# 错误处理

`await`命令后面的 Promise 对象如果变为`reject`状态，则`reject`的参数会被`catch`方法的回调函数接收到。

```js
// 示例1：下方代码reject抛出，await前的return加不加效果是一样的
async function f() {
  await Promise.reject('出错了');
}

f()
.then(v => console.log(v))
.catch(e => console.log(e))

// 输出：
出错了
```

任何一个`await`语句后面的 Promise 对象变为`reject`状态，那么整个`async`函数都会中断执行

```js
// 示例2：
async function f() {
  await Promise.reject('出错了');
  await Promise.resolve('hello world'); 		// 不会执行；因为第一个await语句状态变成了reject
}
```

防止出错的方法，也是将其放在`try...catch`代码块之中

```js
// 示例3：
async function main() {
  try {
    const val1 = await firstStep();
    const val2 = await secondStep(val1);
    const val3 = await thirdStep(val1, val2);

    console.log('Final: ', val3);
  }
  catch (err) {
    console.error(err);
  }
}
```

# 批量并发执行

多个`await`命令后面的异步操作，如果不存在继发关系，最好让它们同时触发。多个请求并发执行，可以使用`Promise.all`方法

```js
// 示例：

let foo = await getFoo();
let bar = await getBar();
// 并发写法：
let [foo, bar] = await Promise.all([getFoo(), getBar()]);
```

