# happyboot-element

> 基于element-plus开发的admin框架

## 演示地址
> 请勿乱修改数据  
> 默认账号密码：admin/123456   
> [https://element.happykit.org](https://elememt.happykit.org)

## 注意
由于vue官方迟迟不支持`keep-alive`通过组件key来实现缓存的控制，我们的项目又急切需要该能力，因此我们手动维护了一个修改版的`runtime-core`。
主要是强化`keep-alive`组件，该组件`include,exclude`参数支持通过key来控制缓存。

修改版的runtime-core@3.0.5
```
https://github.com/pumelotea/vue-next/releases/download/v3.0.5/runtime-core-3.0.5.tgz#d0543d29b7420fe2669ccaae305a97c78e41d1a6
sha512-1Vi8xd+5CBAKO2flZIQtd2o4vuXVjR9eVtpj2SaX3WVugLLNrugvChJlBgNkVt8mAmxXlD8rHQuI+8EF68h3tA==
```

修改版的vue-runtime-core@3.0.7
```
https://github.com/pumelotea/vue-next/releases/download/v3.0.7/vue-runtime-core-3.0.7.tgz#3c18efa1c42330adb3d7dd9ab858e3854942f121
sha512-QnC6GyEq5X7Z3i2vRE/2PzJV8gk4Zs5TP5PmmOcV38UqwVI07zOKW+IhKjZQ5YqxxsRqu1qDxVxthInSkyoi3w==
```

## 生态
- [happykit](https://happykit.org)
- [happyboot-api](https://happykit.org/happyboot-api/)
