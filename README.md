
## 效果

* [Examples](http://39.108.100.163:8081/#/map/maptalks/move).

## 安装
  
* Install with npm: ```npm install routermove```. 

## 使用

```html
<script>
import RouterMove from 'routermove'
let option = {
        map: vm.map,
        lineData: [
          [111.32450763502036, 31.667512417065313],
          [113.32450763502036, 33.667512417065313],
          [114.32450763502036, 31.667512417065313],
          [114.32450763502036, 36.667512417065313],
          [116.32450763502036, 35.667512417065313]
        ]
      };
var path = new RouterMove(option);
path.open();
</script>
```

## API Reference

### `Constructor`

```javascript
new RouterMove(options);
```

* lineData **Object[]** 轨迹数据的数组。
* map **Map** maptalks 创建的map容器。
* options **Object** 其他属性
    * speed **Number** 轨迹的移动速度，默认为2。
    * isOpen **Boolean** 是否开启轨迹动画，默认为true。

### `open()`
开始回放

### `suspended()`
暂停

### `continued()`
继续

### `close()`
清除轨迹

### `setData(lineData)`
设置轨迹的数据

### `setSpeed(number)`
设置轨迹移动速度

