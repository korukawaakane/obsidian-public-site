# Green公式法向导数形式

## 知识点说明

[[01-数学分析/曲线积分与曲面积分/Green公式法向导数形式|Green公式法向导数形式]]把边界上的外法向导数积分转化为区域内部的 Laplace 算子积分。

它可以看成 Green 公式在梯度场上的一个常用结果，但不要和 Green 第二恒等式混淆。

## 核心公式

设 $D$ 是平面有界区域，边界 $\partial D$ 取正向，$\frac{\partial f}{\partial n}$ 表示沿外法线方向的方向导数，则：

$$
\oint_{\partial D}\frac{\partial f}{\partial n}\,ds
=\iint_D(f_{xx}+f_{yy})\,dx\,dy
=\iint_D\Delta f\,dA
$$

其中：

$$
\Delta f=f_{xx}+f_{yy}
$$

## 使用条件

- $f$ 在区域内有足够连续的二阶偏导数。
- $\partial D$ 是分段光滑闭曲线。
- 法向导数取外法线方向。

## 解题套路

1. 看到 $\oint_{\partial D}\frac{\partial f}{\partial n}\,ds$，先想到区域积分。
2. 计算 $\Delta f=f_{xx}+f_{yy}$。
3. 把边界积分转成 $\iint_D\Delta f\,dA$。
4. 再根据区域形状选择直角坐标、极坐标或对称性。
5. 检查外法线方向是否与公式约定一致。

## 易错点

- 不要把它和 Green 第二恒等式混用。
- 法向导数是沿外法线方向，不是沿切线方向。
- $\Delta f$ 是 $f_{xx}+f_{yy}$，不是一阶导数之和。

## Green 第二恒等式对比

Green 第二恒等式是：

$$
\iint_D(u\Delta v-v\Delta u)\,dA
=\oint_{\partial D}
\left(
u\frac{\partial v}{\partial n}
-v\frac{\partial u}{\partial n}
\right)\,ds
$$

它含有两个函数 $u,v$，结构和法向导数形式不同。

## 关联题目

- [[01-数学分析/题型卡片/Green公式法向导数积分题|Green公式法向导数积分题]]
- [[01-数学分析/题型卡片/Green公式计算曲线积分题|Green公式计算曲线积分题]]

## 关联链接

- [[01-数学分析/曲线积分与曲面积分/Green公式|Green公式]]
- [[01-数学分析/曲线积分与曲面积分/外法线|外法线]]
- 方向导数
- [[01-数学分析/曲线积分与曲面积分/散度|散度]]
