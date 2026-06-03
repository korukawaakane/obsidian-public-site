---
type: problem-card
course: 数学分析
chapter: 第8章 无穷级数
tags:
  - 题型
  - Taylor展开
---

# arctan复合函数Maclaurin展开

## 题目

$$
f(x)=\arctan\frac{4+x^2}{4-x^2}
$$

## 标准思路

不要直接硬套 $\arctan x$ 的复杂复合展开。

令：

$$
z=\frac{4+x^2}{4-x^2}
$$

利用反正切加法公式：

$$
\arctan z
=
\frac{\pi}{4}
+
\arctan\frac{z-1}{z+1}
$$

该变形在 $x=0$ 附近成立。

计算：

$$
\frac{z-1}{z+1}
=
\frac{x^2}{4}
$$

所以：

$$
f(x)=\frac{\pi}{4}+\arctan\frac{x^2}{4}
$$

再用 [[arctan x 展开式]]：

$$
f(x)
=
\frac{\pi}{4}
+
\sum_{n=0}^{\infty}
(-1)^n
\frac{x^{4n+2}}{(2n+1)4^{2n+1}}
$$

收敛范围：

$$
|x|<2
$$

## 易错点

- 不能把 $\arctan\frac{4+x^2}{4-x^2}$ 直接拆开。
- 关键是用反正切加法公式，把复杂分式化成 $\arctan\frac{x^2}{4}$。
- 原函数在 $x=\pm2$ 处分母为 $0$，所以展开半径为 $2$。

## 相关双链

[[arctan x 展开式]]
[[Maclaurin 展开]]
[[Taylor展开]]
[[习题8.3.6-Maclaurin展开]]

