## 项目名称
dep-analyze-cli
## 项目说明
> dep-analyze-cli是一个命令行工具，用于分析使用nodejs开发的前后端项目依赖关系。并可以启动一个本地服务器，使用前端渲染库D3可视化展示依赖关系。

## 功能特点
+ 分析并输出当前项目及当前项目下任意依赖包的生产环境依赖关系
+ 前端可视化展示当前项目及当前项目下任意依赖包的生产环境依赖关系、是否存在循环依赖以及是否存在多个相同包名不同版本号的依赖等信息

## 实现难点
1. 众多依赖的版本号是否规范是本项目健壮运行的关键，但由于npm依赖安装方式的多样性和npm包开发者对语义化版本号不彻底遵循，导致**本项目无法解析所有的npm依赖包的版本号格式**，只能通过semver包解析规范的语义化版本号和一些妥协的手段保证项目的运行。
2. 图的深度优先遍历是在已经有图的实例的情况下进行的操作，而在本项目只能通过构建扩展图与深度遍历同时并举的方式进行，这会使得求图的深度和正确构建扩展图的操作更加细粒度。
3. 可以通过设置节点的访问标志解决循环依赖造成的死循环问题，但**难以辨别重复访问一个节点是循环依赖导致的还是多个节点依赖相同节点导致的**，因而如果辨别循环依赖是一个难点，本项目通过一个栈保存每个节点到入口节点的访问路径，如果下一个访问节点在栈中，那就表示是循环依赖导致的重复访问一个节点。

## 技术栈
+ prettier + eslint + lint-staged + husky
+ typescript + express + vue + D3
+ vitest
+ datastructure:graph

## 安装方式
1. 在安装dep-analyze-cli工具之前，必须确保已经安装了[nodejs](https://nodejs.cn/download/)
2. 本项目已经发布到npm上，可以直接使用npm安装。
全局安装：<code>npm install dep-analyze-cli -g</code>
本地安装：<code>npm install dep-analyze-cli</code>
## 使用方式
1. 全局安装方式，在windows下可以直接使用，在linux下必须要找到dep-analyze-cli路径，并将其链接到/usr/bin/下。
2. 本地安装方式，可以在当前项目控制台中输出./node_moduels/.bin/dep-analyze-cli使用该工具，也可以在package.json中构造命令脚本。
3. 使用描述
```
Usage: dep-analyze-cli [arguments] [options] 

Description:
  dep-analyze-cli can display the dependencies of a package and run a server to graphical display

Options:
  -h, --help     Display help information
  -p, --package  Specify a package name and also provide a version number
  -v, --version  Specify a version number and also provide a package name
  -d, --depth    Specify the depth of traversal 
  -j, --json     Specify the saved path of dependency information

Arguments:
  help           Display help information without any options
  analyze        Analyze the dependencies of a package. If no parameters are specified, the current project package will be analyzed by default

Examples:
  dep-analyze-cli help || dep-analyze-cli || dep-analyze-cli analyze -h       Display help information
  dep-analyze-cli runserver                                                   Run a server to graphically display dependency information of the current project package
  dep-analyze-cli analyze                                                     Display dependencies  of the current package and run a server
  dep-analyze-cli analyze -p=test -v=1.0.0                                    Display dependencies  of the package test@1.0.0
  dep-analyze-cli analyze -d=4                                                Display The first four levels dependency information of the current package with a server
  dep-analyze-cli analyze -j=./data/save.json                                 Save dependency information of the current package with a server
```
4. 使用注意事项
> 如果指定包名和版本号，那么必须同时指定且指定的报名和版本号必须正确无误，否则前端页面将会渲染失败。
## 演示
[Ubuntu下演示视频]()
