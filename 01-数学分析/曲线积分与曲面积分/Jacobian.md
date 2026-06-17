# Jacobian

## 所属课程

数学分析

## 所属章节

第6章 多元函数微分学

## 核心定义

Jacobian 是由多个函数对多个变量的偏导数组成的行列式或矩阵，用来描述变量变换的局部伸缩关系。

## 核心公式 / 定理

二维变换 $u=u(x,y)$，$v=v(x,y)$ 的 Jacobian 为

$$
\frac{\partial(u,v)}{\partial(x,y)}
=
\begin{vmatrix}
u_x & u_y\\
v_x & v_y
\end{vmatrix}
=u_xv_y-u_yv_x.
$$

## 适用条件

函数具有相应偏导，变量变换局部可逆时 Jacobian 通常不为 $0$。

## 做题判断方法

1. 明确分子变量组和分母变量组。
2. 按行列排偏导矩阵。
3. 计算行列式。
4. 变量变换中注意绝对值。

## 常见题型

[[01-数学分析/题型卡片/Jacobian变量变换题|Jacobian变量变换题]]

## 易错点

不要把 $\frac{\partial(u,v)}{\partial(x,y)}$ 和 $\frac{\partial(x,y)}{\partial(u,v)}$ 混同；二者互为倒数的前提是局部可逆。

## 关联知识点

链式法则、隐函数求导、重积分换元
