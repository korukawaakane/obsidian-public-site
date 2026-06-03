---
type: knowledge-card
course: 数学分析
chapter: 第8章 无穷级数
tags:
  - 知识点
  - Taylor展开
---

# e^x 展开式

## 展开式

$$
e^x=\sum_{n=0}^{\infty}\frac{x^n}{n!}
=1+x+\frac{x^2}{2!}+\frac{x^3}{3!}+\cdots
$$

对任意实数 $x$ 都收敛。

特别地：

$$
e=\sum_{n=0}^{\infty}\frac{1}{n!}
$$

## 常见变形

因为：

$$
\frac{n}{n!}=\frac{1}{(n-1)!},\quad n\ge 1
$$

所以：

$$
\sum_{n=1}^{\infty}\frac{n}{n!}=e
$$

因此：

$$
\sum_{n=0}^{\infty}\frac{2n+1}{n!}=3e
$$

## 识别信号

看到 $n!$、$\frac{1}{n!}$、$\frac{n}{n!}$、$\frac{2n+1}{n!}$，优先联想到 $e^x$ 展开。

## 易错点

- $0!=1$。
- $\sum_{n=0}^{\infty}\frac{1}{n!}=e$。
- $\sum_{n=1}^{\infty}\frac{1}{n!}=e-1$。
- $\frac{n}{n!}$ 在 $n=0$ 时为 $0$，换指标要从 $n=1$ 开始。

## 相关双链

[[Maclaurin 展开]]
[[Taylor展开]]
[[常数项级数求和]]
[[幂级数]]
[[习题8.3.4常数项级数求和]]

