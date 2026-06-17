# 利用 Euler 公式求 $e^x\cos x$ 与 $e^x\sin x$ 的 Maclaurin 展开式

## 所属课程
- 数学分析

## 适用章节
- 第8章-无穷级数

## 题型特征
题目要求求 $e^x\cos x$、$e^x\sin x$ 或 $e^{ax}\cos bx$、$e^{ax}\sin bx$ 的 Maclaurin 展开式。

## 标准解法
1. 先把 $\cos x$ 与 $\sin x$ 合成复指数：
   $$
   \cos x+i\sin x=e^{ix}
   $$
2. 两边乘 $e^x$：
   $$
   e^x(\cos x+i\sin x)=e^{(1+i)x}
   $$
3. 对 $e^{(1+i)x}$ 作幂级数展开：
   $$
   e^{(1+i)x}=\sum_{n=0}^{\infty}\frac{(1+i)^n x^n}{n!}
   $$
4. 把 $(1+i)^n$ 写成三角形式：
   $$
   (1+i)^n=2^{n/2}\left(\cos\frac{n\pi}{4}+i\sin\frac{n\pi}{4}\right)
   $$
5. 比较实部与虚部。

## 常用公式
$$
e^x\cos x=\sum_{n=0}^{\infty}\frac{2^{n/2}\cos\frac{n\pi}{4}}{n!}x^n
$$

$$
e^x\sin x=\sum_{n=0}^{\infty}\frac{2^{n/2}\sin\frac{n\pi}{4}}{n!}x^n
$$

收敛域：
$$
(-\infty,+\infty)
$$

## 典型例题或简例
求 $e^x\cos x$ 的 Maclaurin 展开式时，不直接做级数乘法，而是由 $e^{(1+i)x}$ 的实部得到：
$$
e^x\cos x=\sum_{n=0}^{\infty}\frac{2^{n/2}\cos\frac{n\pi}{4}}{n!}x^n
$$

## 易错点
- 不要分别硬展开 $e^x$、$\cos x$、$\sin x$ 后再相乘。
- 关键是把两个函数合成一个复指数。
- 比较实部得到 $e^x\cos x$，比较虚部得到 $e^x\sin x$。
- 指数函数幂级数处处收敛，所以两个展开式的收敛域都是全体实数。

## 关联知识点
- [[01-数学分析/无穷级数/Euler 公式|Euler 公式]]
- [[01-数学分析/无穷级数/利用复指数展开实函数|利用复指数展开实函数]]
- [[01-数学分析/无穷级数/比较实部与虚部法|比较实部与虚部法]]
- [[01-数学分析/无穷级数/e^x cos x 与 e^x sin x 的幂级数展开|e^x cos x 与 e^x sin x 的幂级数展开]]
- [[01-数学分析/无穷级数/Maclaurin 展开|Maclaurin 展开]]

## 可迁移套路
遇到 $e^{ax}\cos bx$、$e^{ax}\sin bx$，优先合成 $e^{(a+ib)x}$，展开后比较实部和虚部。
