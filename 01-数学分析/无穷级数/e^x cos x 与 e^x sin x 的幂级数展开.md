# e^x cos x 与 e^x sin x 的幂级数展开

## 所属课程
- 数学分析

## 所属章节
- 第8章-无穷级数

## 核心定义
用 [[01-数学分析/无穷级数/Euler 公式|Euler 公式]] 将 $e^x\cos x$ 和 $e^x\sin x$ 合并到 $e^{(1+i)x}$ 中，再展开复指数函数并比较实部、虚部。

## 推导
由：
$$
e^x(\cos x+i\sin x)=e^{(1+i)x}
$$

以及：
$$
e^{(1+i)x}=\sum_{n=0}^{\infty}\frac{(1+i)^n x^n}{n!}
$$

又因为：
$$
1+i=\sqrt2 e^{i\pi/4}
$$

所以：
$$
(1+i)^n=2^{n/2}\left(\cos\frac{n\pi}{4}+i\sin\frac{n\pi}{4}\right)
$$

比较实部和虚部：
$$
e^x\cos x=\sum_{n=0}^{\infty}\frac{2^{n/2}\cos\frac{n\pi}{4}}{n!}x^n
$$

$$
e^x\sin x=\sum_{n=0}^{\infty}\frac{2^{n/2}\sin\frac{n\pi}{4}}{n!}x^n
$$

收敛域均为：
$$
(-\infty,+\infty)
$$

## 易错点
- 比较实部得到 $e^x\cos x$，比较虚部得到 $e^x\sin x$。
- $(1+i)^n$ 要先写成三角形式，不要直接展开到高次。
- 收敛域继承指数函数幂级数，为全体实数。

## 关联题型
- [[01-数学分析/题型卡片/利用Euler公式求e^xcosx与e^xsinx的Maclaurin展开式|利用Euler公式求e^xcosx与e^xsinx的Maclaurin展开式]]

## 关联知识点
- [[01-数学分析/无穷级数/Euler 公式|Euler 公式]]
- [[01-数学分析/无穷级数/利用复指数展开实函数|利用复指数展开实函数]]
- [[01-数学分析/无穷级数/比较实部与虚部法|比较实部与虚部法]]
- [[01-数学分析/无穷级数/e^x 展开式|e^x 展开式]]
