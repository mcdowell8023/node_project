# 读狼叔 nodejs 学习笔记

## Node.js 理论

- 09 年诞生
- Node.js 采用事件驱动和异步 I/O 的方式，实现了一个单线程、高并发的 JavaScript 运行时环境。
- Node.js 的单线程仅仅是指 JavaScript 运行在单线程中，而并非 Node.js 本身 是单线程。
- Node.js 是基于 chrome V8 引擎构建的，由 事件循环（Event Loop）分发 I/O 任务，最终工作线程（workThread）将任务放到线程池（Thread Pool）中执行，而事件循环只要等待执行结果就可以了。
- chrome V8 引擎，用于解释执行 JavaScript 代码
- 事件循环 和 线程池 都是由 libuv 提供的，负责所有的 I/O 任务的分发与执行。

![nki3jg.png](https://s2.ax1x.com/2019/09/03/nki3jg.png)

### 事件循环 及工作过程

Node.js 在主线程里维护了一个事件队列，当接到请求后，就将该请求作为一个事件放入这个队列中，然后继续接收其他请求。当主线程空闲时(没有请求接入时)，就开始循环事件队列，检查队列中是否有要处理的事件，这时要分两种情况：如果是**非 I/O 任务，就亲自处理，并通过回调函数返回到上层调用**；如果是 **I/O 任务，就从 线程池 中拿出一个线程来处理这个事件，并指定回调函数**，然后继续循环队列中的其他事件。

当线程中的 I/O 任务完成以后，就执行指定的回调函数，并把这个完成的事件放到事件队列的尾部，等待事件循环，当主线程再次循环到该事件时，就直接处理并返回给上层调用。 这个过程就叫 事件循环 (Event Loop)

![nki9tx.png](https://s2.ax1x.com/2019/09/03/nki9tx.png)

### 工作原理

Node.js 实现异步的核心是**事件**，也就是说，它把每一个任务都当成 事件 来处理，然后通过 Event Loop 模拟了异步的效果。它通过 事件驱动模型 实现了高并发 和 异步 I/O。

Node.js 其实就是帮我们构建了类似排队和叫号的机制。在排队的时候，除了等待我们什么都做不了。但如果有叫号机制，我们就可以先取号码，等轮到自己的时候，系统会发出通知，这中间，我们可以做任何想做的事（在线程池中处理异步 I/O）。写代码的过程实际上就是取号的过程，由事件循环来接受处理，而真正执行操作的是具体的线程池中的 I/O 任务。之所以说 Node.js 是单线程的，是因为它在接受任务的时候是单线程的，无须切换进程/线程，非常高效，但它在执行具体任务的时候是多线程的。

> 一个 nodejs 进程只能使用一个 CPU，要想利用多核 CPU，必须启动多个进程。进程之间使用 IPC 进行通信。
> 由于自己实现这套逻辑略麻烦，所以 Nodejs 提供了 cluster 模块简化多核开发。

### CPU 密集型是短板

不是所有的任务都是 I/O 密集型任务，当碰到**CPU 密集型**任务时，即只用 CPU 计算的操作，比如要对数据加解密(node.bcrypt.js)，数据压缩和解压(node-tar)，这时 **Node.js 就会亲自处理，一个一个的计算，前面的任务没有执行完，后面的任务就只能干等着**。

在事件队列中，如果前面的 CPU 计算任务没有完成，后面的任务就会被阻塞，出现响应缓慢的情况，如果操作系统本身就是单核，那也就算了，但现在大部分服务器都是多 CPU 或多核的，而 Node.js 只有一个 EventLoop，也就是只占用一个 CPU 内核，当 Node.js 被 CPU 密集型任务占用，导致其他任务被阻塞时，却还有 CPU 内核处于闲置状态，造成资源浪费。

**因此，Node.js 并不适合 CPU 密集型任务。**

[参考：Node.js 事件循环机制](https://www.cnblogs.com/onepixel/p/7143769.html)

### ChakraCore 和 Chrome V8 引擎

Node.js 同时支持 ChakraCore 和 Chrome V8 这两种 JavaScript 引擎二者在性能和特点上各有千秋 ChakraCore 给人感觉更「潮」一些曾是第一个支持 async 函数的引擎，但目前 Node.js 还是以 Chrome V8 引擎为主。

## 特点

1. 适合构建 web 应用
2. 高性能：执行速度快，天生异步【事件驱动和非阻塞 I/O】，适用于 I/O 密集的网络应用开发。
3. 简单：语法简单，并发简单，部署运维简单，开发简单
4. 可扩展： 可以使用 npm 上的大量模块， 也可以使用 通过 c、c++扩展实现 cpu 密集型任务，也可以搭配 java、Rust 等语言使用。架构互补，不同的功能业务使用适合的语言。

## 起步

### 安装 Node.js

#### Node.js 版本

- LTS （长期支持版本 稳定，适用于生产）
- Current （尝鲜版本）

> Node.js 版本比较多，但是众多版本中，通常奇数版本都是 Current 版本（v.5.x、v.9.x、v.11.x）偶数版本通常是 LTS 版本（v.6.x、v.8.x、v.10.x）

#### 普通安装

- 下载软件安装
- 使用 apt-get[ubuntu]、yum[centOS]、homebrew[macOS]等安装软件

> 这种方式安装，每次更新 Node.js 的版本，都需要从官网下载，并且进行覆盖安装。而且，在系统中只能存在一个版本的 Node.js ，不适合对比学习。

#### 3m 安装

使用 3m 安装的原因：

- Node.js 版本更新过快，版本多，同台机子需要多个版本
- Node.js 内置的 npm 版本有差异
- 国内访问 npmjs.org 镜像的速度慢

##### nvm（node version manager）[版本管理]

用于开发阶段，解决多版本共存、切换、测试等问题的**外部 shell 脚本**。nvm 不支持 windows， window 使用 nvmw。

特点：

- 安装方便
- 可以随意切换需要安装的 Node.js 版本
- 还可以免除安装权限，通过 nvm 命令安装的 Node.js 位于用户目录下，而非系统目录下
- 在 npm 安装全局模块的时候，可以避免除操作系统超级用户授权问题。[常见 linux 系统的权限问题]

###### nvm linux 安装

- 安装下载

```bash
    # 需要git
    # 版本哪里根据实际情况
    $ curl -o- https://raw.githubusercontent.com/creationix/nvm/v0.33.0/install.sh | bash
    # 通过 curl 下载执行 install.sh 脚本
```

运行结果后见到控制台：

```bash
    => Appending nvm source string to /Users/mcdowell/.bash_profile
    => bash_completion source string already in /Users/mcdowell/.bash_profile
    # 执行后 放在 /Users/mcdowell/.bash_profile路径下
```

- 确认信息
  先通过 cat 查看下确认信息，类似示例

```bash
    xport NVM_DIR="/Users/mcdowell/.nvm"
    [ -s "$NVM_DIR/nvm.sh" ] && \. "$NVM_DIR/nvm.sh"  # This loads nvm
```

- 生效环境变量

```bash
    $ source /Users/mcdowell/.bash_profile
```

- 修改下载源
  nvm 默认是从 http://nodejs.org/dist/ 下载的, 国外服务器, 必然很慢,
  好在 nvm 以及支持从镜像服务器下载包, 于是我们可以方便地从七牛的 node dist 镜像下载：

```bash
    $ NVM_NODEJS_ORG_MIRROR=https://npm.taobao.org/mirrors/node nvm install 4
```

如果你不想每次都输入环境变量 NVM_NODEJS_ORG_MIRROR, 建议加入到 .bashrc 文件中:

```bash
    # nvm
    export NVM_NODEJS_ORG_MIRROR=https://npm.taobao.org/mirrors/node
    $ source /Users/mcdowell/.bash_profile
```

###### [windows 安装 nvm](https://blog.csdn.net/jayhkw/article/details/75259267)

###### [nvm 和 nodejs 安装使用](https://www.kancloud.cn/summer/nodejs-install/71975)

###### 使用

常用 nvm 命令

- 安装：nvm install < node 版本号 >
- 设置系统默认的 Node.js 版本：nvm alias default < node 版本号>
- 切换版本：nvm use < node 版本号 >
- 列出当前的本地版本：nvm ls
- 列出远端可安装版本：nvm ls-remote
- 一键安装全局模块：nvm reinstall-packages

[参考：安装详细步骤](http://bubkoo.com/2017/01/08/quick-tip-multiple-versions-node-nvm/)

##### npm（node package manager）[包管理]

解决 Node.js 模块安装问题，其本身也是一个 Node.js 模块，每次安装都会内置某个版本的 npm。

###### 安装 npm

- npm v2：典型的树形依赖，层次深，依赖重叠，安装时间长，但相对更清晰。
- npm v3：扁平化依赖，将依赖移到了顶层，同一模块多版本依赖时需采用 npm v2 模式，由于 Node.js 项目模块依赖非常多，因此在查找依赖时特别麻烦，虽没有 npm v2 用起来体验好，但下载速度确实快了不少。
- npm v5：自动记录依赖树，下载使用强校验，重写缓存系统等功能得到了升级和改造。代表性特征是新增了 package-lock.json 文件，在操作依赖时默认生成，用于记录和锁定依赖树的信息，与 Yarn 类似。

###### 升级 npm

```bash
  # 查看版本
  $ npm -v
  # 升级到对应版本
  $ [sudo] npm install -g npm[@版本号] # sudo 可选

  # eg: 在遇到使用问题的时候，一定要先查看版本，适当升级或降级是十分必要的
  $ [sudo] npm install -g npm[@6.11]
```

###### 使用 npm 安装模块

npm 的包安装是最核心的功能，分为本地安装（local）【没-g】、全局安装（global）【有-g】两种。

- 使用说明

```bash

  # 查看npm install 使用帮助
  $ npm -h install

  # 将模块安装到本地 node_modules目录下，但不保存到 package.json
  $ npm install [ pkg包名[@版本] ] # 包名缺省 自动按照 package.json 进行安装

  $ npm install --save
  $ npm i --save # 缩写

  # 将模块安装到本地 node_modules目录下，但不保存到 package.json 里的 dependencies
  $ npm install --save-prod # 安装依赖 [要在生产环境下使用该依赖]
  $ npm install -P # 简写

  # 将模块安装到本地 node_modules目录下，但不保存到 package.json 里的 devDependencies
  $ npm install --save-dev # 安装 开发依赖 [仅在开发环境使用该依赖]
  $ npm install -D # 简写

  # 安装全局模块 如果是命令行模块，直接连接到环境变量里【如npm、@vue/cli】
  $ npm install --global # 安装 开发依赖 [仅在开发环境使用该依赖]
  $ npm install -g # 简写

```

- 关于本地安装

1. 将安装包放在 node_modules（运行 npm 命令时所在的目录）下，如果没有 node_modules 目录，则会在目录下生成。
2. 通过 require（）来引入本地安装的包，无须指定第三方包路径。

- 关于全局安装

1. 如果不是使用 nvm 安装的，安装包将放在/usr/local 【windows 在 C:\Users\主机名\AppData\Roaming\npm\node_modules】下，安装全局模块需要超级用户授权。
2. 如果是使用 nvm 安装的，则需要将安装包放到用户目录的 nvm 版本对应的 bin 目录 ～/.nvm/versions/node/v6.0.0/bin/下，一般用户对于用户目录下的所有文件拥有完整权限，所以不需要增加 sudo 授权。
3. 不能通过 require（）来引入本地安装的包。

#### nrm（node registry manager）[源管理]

解决 npm 镜像访问慢的问题，提供测速、切换下载源（registry）功能。

##### 安装 nrm

```bash
  # nrm 本身是node.js 模块 也是通过 npm 进行安装的

  $ npm install -g nrm
```

##### nrm 常用命令

```bash
  # 查看 帮助信息
  $ nrm -h

  # 测速 显示个安装源 延迟 推荐 cnpm or taobao
  $ nrm test

  # 查看源 地址 *标识当前源
  $ nrm ls

  # 切换源
  $ nrm use <registry name>
  # eg
  $ nrm use cnpm

  # 增加自定义源源
  $ nrm add yourcompany http://registry.npm.yourcompany.com/
```

#### 从源码 编译

Ubuntu 安装 g++ 依赖

```bash
  $ sudo apt-get install g++ curl libssl-dev apache2-utils git-core build-essential
```

[windows 安装 gcc](https://www.cnblogs.com/raina/p/10656106.html)

下载源码并编译

```bash
  $ git clont https://github.com/nodejs/node.git
  $ cd node
  $ ./configure
  $ make
  $ sudo make install
```

## 开始

### 执行脚本

```bash
  $ node <fileName>
```

### 遵循 CommonJS 规范

创建模块

```js
'use strict'
/* 使用 module.export 定义模块 */
module.exports = function() {
  console.log('Hello CommonJS！: module.exports 定义，require 引入')
}
```

引用模块

```js
'use strict'
/* 使用 require 引用 模块 ，使用 CommonJS规范 */
const hello = require('./1.2.modules')

hello()
```

## 临时工具

```js
function getAllContents(tag = '.content') {
  // 看书工具函数
  let arr = document.querySelectorAll(tag)
  let contents = []
  for (let i = 0; i < arr.length; i++) {
    const item = arr[i]
    contents.push(item.textContent)
  }
  const str = contents.toString()
  // console.log(str,'i')
  console.log(contents.join('\r\n'), '获取全部内容')
}
```
