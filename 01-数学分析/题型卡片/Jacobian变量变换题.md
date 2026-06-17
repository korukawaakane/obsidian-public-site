# Jacobian变量变换题

## 所属课程

数学分析

## 适用章节

第6章 多元函数微分学

## 题型特征

题目要求计算变量变换的 Jacobian，或在隐函数组、重积分换元中使用偏导行列式。

## 标准解法

1. 明确旧变量和新变量。
2. 写偏导矩阵。
3. 计算行列式。
4. 若用于换元，注意取绝对值和倒数方向。

## 常用公式

$$
\frac{\partial(u,v)}{\partial(x,y)}
=
\begin{vmatrix}
u_x & u_y\\
v_x & v_y
\end{vmatrix}.
$$

局部可逆时：

$$
\frac{\partial(u,v)}{\partial(x,y)}
\frac{\partial(x,y)}{\partial(u,v)}=1.
$$

## 典型例题

极坐标变换 $x=r\cos\theta$，$y=r\sin\theta$ 的 Jacobian 为 $r$，重积分换元时面积元变为 $r\,dr\,d\theta$。

## 易错点

分子分母变量顺序不能写反；换元积分中用的是 Jacobian 的绝对值。

## 关联知识点

[[01-数学分析/曲线积分与曲面积分/Jacobian|Jacobian]]、链式法则、重积分换元

## 可迁移套路

Jacobian 的矩阵视角可迁移到多元复合函数求导和隐函数组求导。
