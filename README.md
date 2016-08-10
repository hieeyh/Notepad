# 一个简单的基于PhoneGap的记事本app

刚学前端不久，想做一个简单的应用，就很自然选择了记事本。

这是一个基于PhoneGap框架的记事本hybrid app，用html,css，javascript（和jquery）语言实现了记事本基本的功能。

**应用的初始界面如下：**

![index](https://github.com/hieeyh/Notepad/blob/master/images/index.png)

首页呈现所有的记事标签的标题和时间，点击新建按钮，进入新建标签页面，点击编辑按钮进入批量删除标签页面，点击标签进入该标签的编辑页面。

在搜索框输入要搜索的内容，点击搜索图标，呈现搜索后的结果（*请忽略最下方的录音按钮，还没实现该功能！*）

**新建标签页面如下：**

![new](https://github.com/hieeyh/Notepad/blob/master/images/new.png)

分别输入标题和内容，两者可以有一个为空不能同时为空。点击完成按钮存储标签。

**标签的编辑页面如下**

![edit](https://github.com/hieeyh/Notepad/blob/master/images/edit.png)

可以对标题和内容进行修改，点击完成按钮，完成对标签的修改。点击右下角新建小图标，进入新建标签页面。若点击左下角删除小图标，则会跳出如下弹框：

![suredelete](https://github.com/hieeyh/Notepad/blob/master/images/suredelete.png)

点击确定，则删除该标签。

**批量删除标签页面如下**

![delete](https://github.com/hieeyh/Notepad/blob/master/images/delete.png)

点击标签，标签处于被选中状态，点删除按钮，跳出弹框，确认是否删除，若确认，则选中的标签被删除。

点击全选按钮， 全部的标签都处于被选中状态，如下图所示：

![allselect](https://github.com/hieeyh/Notepad/blob/master/images/allselect.png)

点击删除按钮，跳出弹框，确认是否删除，若确认，则所有的标签都会被删除。



