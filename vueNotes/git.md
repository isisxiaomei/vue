# 初始化仓库

```js
// 进入到learngit目录并执行git init将learngit初始化为本地仓库
cd learngit
git init
```

# 远程仓库

## 1. 本地仓库关联远程仓库

如果是从远程仓库clone到本地的仓库，则不需要关联本地仓库和远程仓库

```js
// 在本地仓库learngit目录下，执行git remote add origin git@github.com:isisxiaomei/git.git；表示将远程仓库地址git@github.com:isisxiaomei/git.git，关联到本地仓库。origin是给远程仓库地址取的别名，以后origin就代表远程仓库地址git@github.com:isisxiaomei/git.git

git remote add origin git@github.com:isisxiaomei/git.git

// 在learngit本地仓库中执行git remote -v，查看本地仓库关联的远程仓库
git remote -v
```

## 2. 克隆仓库

```js

// 当你从远程仓库克隆时，实际上Git自动在本地分支和远程分支之间建立一种追踪关系，比如：在git clone的时候，所有本地分支默认与远程主机的同名分支之间建立追踪关系，也就是说，本地的master分支自动"追踪"origin/master分支。并且远程仓库的默认名称是origin
git clone git@github.com:isisxiaomei/git.git
```



# 分支代码推送

>  推送本地分支到远程分支：git push系列



- ***方式1是***：`git push <远程主机名也就是远程仓库地址> <本地分支名>:<远程分支名>`

```js

// 推送本地dev分支到远程的master分支 
git push origin dev:master

// 如果省略远程分支名，则表示将本地分支推送与之存在"追踪关系"的远程分支（通常两者同名），如果该远程分支不存在，则会被新建
// `git push origin master`	省略了远程分支名表示将本地的master分支推送到origin主机的master分支。如果远程master分支不存在，则会被新建
git push origin master


// 如果省略本地分支名，则表示删除指定的远程分支，因为这等同于推送一个空的本地分支到远程分支
// `git push origin :master` 等同于 `git push origin --delete master`
// `git push origin :master` 表示删除远程origin地址下的master分支
git push origin :master


// 如果当前分支与远程分支之间存在追踪关系，则本地分支和远程分支都可以省略
// 将当前分支推送到`origin`指定的远程仓库对应的分支
git push origin

// 如果当前分支只有一个追踪分支，那么主机名都可以省略。也就是当前的本地仓库下的本地分支只关联了一个远程仓库下的一个具有追踪关系的远程分支
git push


// 如果当前分支与多个主机存在追踪关系，则可以使用-u选项指定一个默认主机，这样后面就可以不加任何参数使用git push。
// `git push -u origin master`: 表示将本地的master分支推送到origin主机，同时指定origin为默认主机，后面就可以不加任何参数使用git push了。
git push -u origin master

```

- ***方式2***：`git push --set-upstream  [远程主机名] [远程分支名]` （前提是远程没有本地的分支）

```js
// 新建并切换到本地dev
git checkout -b dev
// 推送dev分支此时出错
git push dev

// 出现错误提示：
fatal: The current branch zheer has no upstream branch.
To push the current branch and set the remote as upstream, use
 	git push --set-upstream zheer zheer

// git push --set-upstream  [远程主机名] [远程分支名]
// 在本地dev分支上执行下面命令表示推送本地dev到远程的dev分支
git push --set-upstream origin dev
```



# 分支代码拉取

> 分支代码拉取使用：git pull 系列



- ***git pull***：取回远程主机某个分支的更新，再与本地的指定分支合并。

```js
git pull
等价于
git fetch && git merge
```

- ***语法***：`git pull <远程主机名> <远程分支名>:<本地分支名>`

```js
// 表示取回`origin`远程地址下的`next`分支，与本地的`master`分支合并
git pull origin next:master

// 如果远程分支是与当前分支合并，则冒号后面的部分可以省略
// `git pull origin next`表示取回`origin/next分支`，再与当前分支合并
// git pull origin next 等价于 git fetch origin && git merge origin/next
git pull origin next


// 手动建立追踪关系
// `git branch --set-upstream master origin/next`表示：指定本地`master`分支追踪`origin/next`分支
git branch --set-upstream master origin/next

// 当前分支与远程分支存在追踪关系，git pull就可以省略远程分支名
// `git pull origin` 表示：本地的当前分支自动与对应的origin主机"追踪分支"（remote-tracking branch）进行合并
git pull origin


// 如果当前分支只有一个追踪分支，连远程主机名都可以省略
// `git pull`: 表示拉取当前分支对应的远程分支，并和当前分支合并
git pull
```





# 分支

## 1. 创建分支

```js
// 新建本地分支dev
git branch dev

// 在本地创建和远程分支对应的分支;本地和远程分支的名称最好一致
git checkout -b branch-name origin/branch-name
```

## 2. 查看分支

```js
// 查看分支
git branch

// 查看本地和远程的所有分支
git branch -a

// 查看远程分支
git branch -r
```



## 3. 切换分支

```js
// 切换到dev分支
git checkout dev
```



## 4. 创建并切换分支

```js
// 创建dev分支并切换到dev分支上
git checkout -b dev
```



## 5. 删除本地分支

- ***备注***：不能在dev分支上执行删除dev分支的命令；只能切换到其他分支上执行删除dev分支的命令

```js
// 删除本地dev分支
git branch -d dev

// 如果dev分支还没有被合并，直接`git branch -d dev`删除分支，则会销毁失败。如果要强行删除，需要使用大写的-D参数
git branch -d dev

// 采用 -D 强行删除
git branch -D dev
```

# 分支合并

```js
// 比如当前在master分支；将dev分支合并到当前master分支
git branch			// 输出当前分支是master分支
git merge dev		// 在当前的master分支上，执行git merge dev；表示将dev分支合并到当前的master分支
```

## 1. 合并方式1之快速合并（Fast-forward）

> 快速合并的前提条件是：比如两个分支中的其中一个分支master没有动，另一分支dev有新的提交，此时是快速合并，只需要将master分支的指针移动到dev分支指针指的节点上就可以。此时并没有产生新的提交点。只是移动master分支的指针







## 2. 合并方式2之三方合并（recursive strategy）

> 三方合并前提条件是：两个分支都有提交记录，此时不能通过移动指针来完成合并。需要通过两个分支各自的最新提交记录和公共的第一个祖先提交记录共同决定出一个新的提交节点



```js

```



# 分支合并冲突

> 两个分支对同一个文件的同一行都进行了修改(主要是删除)，并且都commit提交了；然后执行git merge合并这两个分支时，此时会引发冲突，人为修复冲突决定最终提交内容



```

```



# 状态查询





# diff查看





# 日志

```js
1. git log： 显示从最近到最远的提交日志记录历史

2. git log --pretty=oneline : 
		- 显示从最近到最远的提交日志记录历史，只显示commit信息不显示其他，比较简洁
		- 也可以直接使用 `git log --oneline`
		- `git log --oneline --graph`: 可以帮我们展示出简略的提交记录图形化
3. git reflog： 是记录每一次命令，查看命令历史
```



# 撤销操作

## 1. 撤销工作区的修改

```js
// 撤销工作区中当前目录中的所有更改
git checkout .

// 撤销工作区中指定文件的修改
git checkout -- filename
```



## 2. 版本回退

- ***版本回退***：是指将版本库从当前版本回退到其他的版本
- ***语法***：`git reset --hard 版本号`
  - `HEAD`：指向当前分支记录的最新版本节点
  - `HEAD^`：表示当前分支记录的上一个版本节点
  - `HEAD~50`：表示当前分支记录的上50个版本节点



```js
// 将当前分支的版本回退到上一个commit版本节点
git reset --hard HEAD^

// 回退到指定版本
git reset --hard 4b2a0c8
```

- ***帮助***：`git reset -h` 帮助查看选项

```js
1. --mixed： 
	- 为默认参数，表示不删除工作空间的改动代码，撤销commit，并且撤销git add操作；
  - git reset --mixed HEAD^ 和 git reset HEAD^ 效果是一样的。

2. --soft： 
	- 表示仅仅重置 HEAD 指针，即只改变 HEAD 的指向
  - 不删除工作空间改动代码，也保留暂存区。撤销commit，不撤销add操作

3. --hard： 
	- 删除工作空间改动代码，撤销commit，撤销git add 
  - 注意完成这个操作后，就恢复到了上一次的commit状态
```

- ***具体操作***：见场景分析



# 场景分析

## 1. 场景1

- 假如你只是修改了工作区，还没有 git add 到暂存区。可以使用下面的命令撤销工作区中的修改

```js
// 还没有git add之前，撤销工作区所有更改
git checkout .

// 撤销工作区中指定文件的修改
git checkout -- filename
```

## 2. 场景2

- 假如你修改了工作区，并把工作区中的修改 git add 到了暂存区。如果你想撤销git add操作并且不保留工作区的代码改动。

```js
git reset --hard head
```

## 3. 场景3

- 假如你修改了工作区，并把工作区中的修改 git add 到了暂存区。如果你只想撤销git add操作并且保留工作区的代码改动。

```js
git reset --mixed
// 或者简写
git reset
```

## 4. 场景4

- 假如修改了工作区，并且已经git add到暂存区，也已经git commit到版本库，此时只想撤销commit操作，不撤销git add操作，保留暂存区代码，也保留工作区代码

```js
git reset --soft HEAD^
```



## 5. 场景5

- 假如修改了工作区，并且已经git add到暂存区，也已经git commit到版本库，此时只想撤销commit操作，撤销git add操作，保留工作区代码

```js
// 撤销commit和add，保留工作区改动的代码
git reset --mixed HEAD^
```

## 6. 场景6

- 假如修改了工作区，并且已经git add到暂存区，也已经git commit到版本库，此时只想撤销commit操作，撤销git add操作，不保留工作区代码

```js
// 相当于回到了上一个版本，也就是上一个commit之后
git reset --hard head^
```



# 回滚操作











# git的config配置

```js
// 在当前的本地仓库内配置局部git用户名信息
git config user.name isisxiaomei

// 在当前的本地仓库内配置局部git用户邮件信息
git config user.email xumeihong@2008.sina.com

// 列出当前仓库的git配置信息
git config --list

// 也可以通过git配置文件查看本地仓库的git配置信息 
cd learngit
cat .git/config
```



# 踩坑

## 踩坑1

如果不是通过clone得到的本地仓库，而是通过在本地git init初始化仓库，并且使用git remote的方式关联远程仓库，那么这种情况下本地是没有master分支的，必须进行一次commit之后才会自动生成本地的master分支