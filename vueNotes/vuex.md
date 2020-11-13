计算属性传参

- state：
  1. store中的state跟vue的data数据一样，已经声明的就具有响应式，后加的没有响应式，需要手动set响应式；
  2. 必须是单一状态树
  3. 可以手动直接修改state，但是不推荐，因为没有经过mutation，则看不到devtool中修改state的过程



mutation：必须是同步的，这样devtools可以帮助跟踪每次修改快照，如果是写成异步方法，devtools不知道什么时候完成的，不方便跟踪。mutation推荐写成常量类型，不然容易写错

getters：计算属性传参

actions：异步操作都放在action中，

moudule：





因为异步操作是成功还是失败不可预测，什么时候进行异步操作也不可预测；当异步操作成功或失败时，如果不 commit(mutation) 或者 dispatch(action)，Vuex 和 Redux 就不能捕获到异步的结果从而进行相应的操作



