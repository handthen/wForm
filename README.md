## wForm  vue 表单组件

**引用**
```js
// 全局注册
import wFormHand from "wformhand";
Vue.use(wFormHand)

// 局部注册
import {wFormHand} from "wformhand";


<w-form-hand :formData.sync="form" :columnList="columnList"  :formConfig="formConfig">
</w-form-hand>

```
**表单配置**
```js
 formConfig: {
        labelWidth: "100px",
        gutter: "20px", // 列间隙
        showMessage:false,
      },
 columnList: [
        {
          label: "姓名",
          key: "name",
          name: "input",
          columnSpan: 6, // 列宽
          placeholder: "请输入内容",
          showMessage:false,
        },
        {
          label: "电话",
          key: "phone", //对应 form  key
          name: "el-select", // 渲染的表单组件
          optionName: "el-option",//渲染 el-select,el-checkbox-grounp 等需要此
          required: true,
          options: [
            {
              value: 1,
              label: "小米",
            },
            {
              value: 2,
              label: "小明",
            },
          ],
          columnSpan: 6,
          placeholder: "请选择",
          clearable: true,
        },
        {
          label: "年龄",
          key: "age",
          name: "el-input",
          columnSpan: 6,
          placeholder: "请输入内容",
          clearable: true, // 组件或标签上的属性，事件可直接声明使用，例如placeholder,clearable,style,class等等
          rules: [
            {
              trigger: ['blur', 'input'], // blur/change/input
              message: '------',
              validator: (_, v) => {
                console.log(v)
                return v > 0
              }
            }
          ],
          change(e){
            console.log(e)
          }
        },
      ],
      form: {
        phone: "",
        age: 12,
        name: "",
       },

```
插槽名对应form的key,此时若columnList里name设置rules校验,这里的input同样会校验

```js
<w-form-hand ref='wForm' :formData.sync="form" :columnList="columnList"  :formConfig="formConfig">
  <template v-slot:name="column">
        <input v-mode="form[column.key]" />
  </template>
</w-form-hand>
```

```js
// 表单校验
<w-form-hand ref='wForm' :formData.sync="form" :columnList="columnList"  :formConfig="formConfig">
</w-form-hand>

// 回调
async submit(){
 const valid = awiat this.$refs['wForm'].validate(function(valid) {
   if(valid){
      console.log("验证成功")
   }
 })
}
// promise
submit(){
   this.$refs['wForm'].validate()
   .then((valid)=>{
        console.log("验证成功")
   })
   .catch(()=>{
        console.log("验证失败")
   })
 
}
```