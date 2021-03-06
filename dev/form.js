/* jshint esversion: 6 */
let form = document.querySelector('.form');
let text = document.querySelector('#textname');
let pass = document.querySelector('#textpass');
let pass1 = document.querySelector('#textpass1');
let textarea = document.querySelector('#comment-area');
let submit = document.querySelector('.button-s');
let sq1 = document.querySelector('select.sq1');
let sq2 = document.querySelector('select.sq2');
let button = document.querySelector('.button-s');

//Constructor

UnitEvent = {
  addHandler: (element, type, fn) => {
    element.addEventListener(type, fn, false);
  },
  removerHandler: (element, type, fn) => {
    element.removerListener(type, fn, false);
  }
};

//Event focusin and focusout

let getFocus = (event) => {
  if (!event.target.style.backgroundColor) {
    event.target.style.backgroundColor = '#f3f3f3';
  } else if (!!event.target.style.backgroundColor) {
    event.target.style.backgroundColor = '';
  }
};

let testPass = (event) => {
  // 验证密码是否为空，是否一致
  if (!!pass.value) {
    document.querySelector('span.warnpass').innerText = '';
  }
  if (pass.value != pass1.value) {
    // 最后submit事件验证不通过则阻止提交
    event.preventDefault();
    // innerText由浅入深的顺序包含操作元素的所有文本内容
    // 此处亦可使用innerHTML属性
    document.querySelector('span.warndiff').innerText = '两次密码输入不一致';
  } else {
    document.querySelector('span.warndiff').innerText = '';
  }
  // 当性别栏为默认选项时，弹出提示，选择非默认项且失焦后，提示消失
  if (!form.elements['gender'].options[0].selected) {
    document.querySelector('span.warngender').innerText = '';
  }
};
UnitEvent.addHandler(form, 'focusin', getFocus);
UnitEvent.addHandler(form, 'focusout', getFocus);
UnitEvent.addHandler(form, 'focusout', testPass);

//Event keypress or keydown in text

let inputNum = (event) => {
  if (event.target.value.length == event.target.maxLength) {
    //达到相应字符数自动转移焦点
    for (let i = 0; len = form.elements.length, i < len; i++) {
      if (form.elements[i] == event.target && form.elements[i + 1]) {
        form.elements[i + 1].focus();
      }
    }
  }
  if (!/\d/.test(event.key) && event.key != 'Enter' && event.key != 'Backspace') {
    event.preventDefault();
    alert('Only support number');
  }
  // or
  // let code = event.keyCode || event.chartCode;
  // if (!/\d/.test(String.fromCharCode(event.code)) && event.code != 13)
};
//在firefox中keypress事件任意数字和字母的keyCode始终为0!!此时，只有charCode
// 设置监听keyup事件时无法阻止错误的输出，只能设置keypress或者keydown
// chrome和IE11在keypress事件中会忽略退格键；keypress的小键盘和字母区数字码一样，keydown和keyup他们的则不同
UnitEvent.addHandler(document.querySelector('.your-card'), 'keypress', inputNum);

// Event select

let Selected = (event) => {
  event.target.setSelectionRange(0, textarea.value.length);
  // or
  // evnet.target.selectionStart = 0;
  // event.target.selectionEnd = textarea.value.length;
  // or
  // event.target.select();
};
UnitEvent.addHandler(textarea, 'focusin', Selected);

// Event change
// 并不阻挡用户输入过多密码，等到失去焦点时提醒用户字符数超过限定值
let change = (event) => {
  if (pass.value.length > 6) {
    alert('Only support 6 digit number');
  }
};
UnitEvent.addHandler(pass, 'change', change);

//Event submit
// 验证密码在event focusout验证
let testForm = (event) => {
  if (form.elements['gender'].options[0].selected) {
    event.preventDefault();   //阻止的是提交表单行为，而不是阻止冒泡，阻止冒泡用event.stopPropagation()
    document.querySelector('.warngender').innerText = 'Please select your gender';
  }
  if (!form.elements['textpass'].value) {
    event.preventDefault();
    document.querySelector('.warnpass').innerText = 'Please input your password';
  }
};
UnitEvent.addHandler(form, 'submit', testPass);
UnitEvent.addHandler(form, 'submit', testForm);

// Event click

// 表单序列化
let getAll = (form) => {
  let output = [];
  for (let i = 0; len = form.elements.length, i < len; i++) {
    let field = form.elements[i];
    switch (field.type) {
      case 'select-one':
      case 'select-multiple':
        if (field.name.length) {
          for (let j = 0; optLen = field.options.length, j < optLen; j++) {
            if (field.options[j].selected) {
              output.push(field.name + ':' + field.options[j].value);
            }
          }
        }
        break;
      case 'submit':    // 跳过submit按钮的value值
        break;
      default:    // 所有没有出现在case的表单控件，执行default
        if (field.name.length) {
          output.push(field.name + ":" + field.value);
        }
    }
  }
  return output.join('\n');
};

let getAllValue = (event) => {
  alert(getAll(form));
};
// 检测能否取值，click事件先于submit事件。此时无法提交，若提交form则删除此监听器
// UnitEvent.addHandler(button, 'click', getAllValue);


// 总结：
// 已经实现的效果有：
// 1.在选项表单控件中模拟placeholder效果
// 2.检验密码是否一致
// 3.达到最大字符数自动转移焦点
// 4.过滤输入文本，如有则弹窗提醒
// 5.输入过多字符时，只在失去焦点时提醒(event change)
// 6.遍历多项选择表单控件，得到多项选择
// 7.聚焦选择文本
// 8.其他H5效果，必填，日期，数字等
