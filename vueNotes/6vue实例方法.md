## 1. vm.$watch()



## 2. vm.$set()

背景：因为某些属性不是响应式的，所以需要vue提供这种方式实现赋值并保证是响应式的。

```js
// 给对象的指定属性给值，并确保这个属性是响应式的
vm.$set(Obejct, '属性名', value)

// 给数组的某个下标上给值，并确保这个属性是响应式的
vm.$set(Array, index, value)
```

## 3. vm.$delete()

背景： 因为我们直接`delete obj.xx`这种删除方式不触发响应式，所以vue提供触发响应式的删除

```
vm.$delete(arr, index)
vm.$delete(obj, '属性名')
```

