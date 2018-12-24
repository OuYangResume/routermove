function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

import * as maptalks from 'maptalks';

var realTimeTrance = function () {
    function realTimeTrance(options) {
        _classCallCheck(this, realTimeTrance);

        this._map = options.map;
        this._LinePoints = [];
        this.pointFeature = true;
        this.lineFeature = true;
        this.markerSymbol = {
            'markerType': 'ellipse',
            'markerFill': 'rgb(135,196,240)',
            'markerFillOpacity': 1,
            'markerLineColor': '#34495e',
            'markerLineWidth': 3,
            'markerLineOpacity': 1,
            'markerLineDasharray': [],
            'markerWidth': 20,
            'markerHeight': 20,
            'markerDx': 0,
            'markerDy': 0,
            'markerOpacity': 1
        };
        this.init();
    }

    realTimeTrance.prototype.init = function init() {
        this._createLayer();
    };
    /**
     * 创建_vecLayer图层
     */


    realTimeTrance.prototype._createLayer = function _createLayer() {
        this._vecLayer = new maptalks.VectorLayer("vector");
        if (!this._map) {
            console.log("未定义map容器");
            return;
        }
        this._map.addLayer(this._vecLayer);
    };
    /**
     * 向_vecLayer图层添加geometry
     * @param {*} geometry 
     */


    realTimeTrance.prototype.addGeometry = function addGeometry(geometry) {
        this._vecLayer.addGeometry(geometry);
    };

    realTimeTrance.prototype.addPoint = function addPoint(point) {
        this._LinePoints.push(point);
        if (this._LinePoints.length >= 2) {
            this._createLine(this._LinePoints);
        }
        this._createMarker(point);
    };
    /**
     *  创建动态线
     * @param {*} line 
     */


    realTimeTrance.prototype._createLine = function _createLine(line) {
        if (this.lineFeature) {
            this.geomline = new maptalks.LineString(line, {
                id: "geomline"
            });
            var symbol = {
                lineColor: "rgba(250,0,0,1)",
                lineWidth: 4,
                lineJoin: "round", //miter, round, bevel
                lineCap: "round", //butt, round, square
                lineDasharray: null, //dasharray, e.g. [10, 5, 5]
                "lineOpacity ": 1
            };
            this.geomline.setSymbol(symbol);
            this.addGeometry(this.geomline);
            this.lineFeature = false;
            return;
        } else {
            this.geomline.setCoordinates(line);
        }
    };
    /**
     *  创建动态点
     * @param {Array} point 
     */


    realTimeTrance.prototype._createMarker = function _createMarker(point) {
        if (this.pointFeature) {
            this.geompoint = new maptalks.Marker(point, {
                id: "geompoint"
            });
            this.geompoint.setSymbol(this.markerSymbol);
            this.addGeometry(this.geompoint);
            this.pointFeature = false;
            return;
        } else {
            this.geompoint.setCoordinates(point);
        }
    };
    /**
     *  清除_vecLayer中的geometry和缓存点
     */


    realTimeTrance.prototype.clear = function clear() {
        this._vecLayer.clear();
        this._LinePoints = [];
        this.lineFeature = true;
        this.pointFeature = true;
    };
    /**
     * 设置marker的样式
     * @param {*} style 
     */


    realTimeTrance.prototype.setMarkerStyle = function setMarkerStyle(style) {
        this.markerSymbol = style;
    };

    realTimeTrance.prototype.test = function test() {
        console.log("测试类里面的方法");
        var point = [111.32450763502036, 31.667512417065313];
        this.geompoint = new maptalks.Marker(point, {
            id: "geompoint"
        });
        this._vecLayer.addGeometry(this.geompoint);
    };

    return realTimeTrance;
}();

var RouterMove = function () {
    /**
     * Path_Animation的构造函数
     * @param {*} options 
     */
    function RouterMove(options) {
        _classCallCheck(this, RouterMove);

        this._map = options.map;
        this.time = 100 || options.time;
        this.lineData = null || options.lineData; //传入的轨迹数据
        this.linePoints = null; //生成的新point
        this.setInterval = null;
        this.isOpen = true;
        this.speed = 2 || options.speed;
        this.init();
    }

    RouterMove.prototype.setOptions = function setOptions(obj, options) {
        for (var i in options) {
            obj.options[i] = options[i];
        }
        return obj.options;
    };

    RouterMove.prototype.init = function init() {
        var option = {
            map: this._map
        };
        this.real = new realTimeTrance(option);
    };

    RouterMove.prototype.close = function close() {
        this.isOpen = false;
        if (this.setInterval) {
            window.clearInterval(this.setInterval);
        }
        this.real.clear();
        this.index = 0;
        this.linePoints = [];
    };
    /**
     * 开启回放
     */


    RouterMove.prototype.open = function open() {
        this.close();
        this.isOpen = true;
        this.addLine(this.lineData);
        this.linePoints = this.getNewData(this.lineData);
        this.createInterval();
    };
    /**
     * 暂停
     */


    RouterMove.prototype.suspended = function suspended() {
        this.isOpen = false;
    };
    /**
     * 继续
     */


    RouterMove.prototype.continued = function continued() {
        this.isOpen = true;
    };
    /**
     * 设置轨迹数据
     * @param {*} lineData 
     */


    RouterMove.prototype.setData = function setData(lineData) {
        this.lineData = lineData;
        this.linePoints = this.getNewData(lineData);
    };
    /**
     * 设置轨迹播放速度
     * @param {number} speed 
     */


    RouterMove.prototype.setSpeed = function setSpeed(speed) {
        this.speed = speed;
    };
    /**
     * 设置动态点的样式
     * @param {*} style 
     */


    RouterMove.prototype.setMarkerStyle = function setMarkerStyle(style) {
        this.real.setMarkerStyle(style);
    };
    /**
     * 创建定时器
     */


    RouterMove.prototype.createInterval = function createInterval() {
        var self = this;
        if (self.linePoints == undefined) {
            console.log("新生成的数据有误");
            return;
        }
        self.setInterval = setInterval(function () {
            if (self.isOpen) {
                setTimeout(function () {
                    if (self.index < self.linePoints.length) {
                        self.real.addPoint(self.linePoints[self.index]);
                        // if(self.index>1){
                        //     var Angle=self.getAngle(self.linePoints[self.index-1],self.linePoints[self.index]);
                        //     self.IconRotation(Angle);
                        // }
                        self.index++;
                    } else {
                        self.close();
                    }
                }, parseInt(self.time / self.speed));
            }
        }, parseInt(self.time / self.speed));
    };

    RouterMove.prototype.addLine = function addLine(lineData) {
        var lineSymbol = {
            lineColor: "#1bbc9b",
            lineWidth: 6,
            lineJoin: "round", //miter, round, bevel
            lineCap: "round", //butt, round, square
            lineDasharray: null, //dasharray, e.g. [10, 5, 5]
            "lineOpacity ": 1
        };
        var line = new maptalks.LineString(lineData);
        line.setSymbol(lineSymbol);
        this.real.addGeometry(line);
    };

    RouterMove.prototype.getNewData = function getNewData(linePoints) {
        if (linePoints === null || linePoints.length < 2) {
            console.log("传入的数据格式不符！");
            return;
        } else {
            var points = [];
            var line = linePoints;
            //修改为for  of
            for (var i = 0; i < line.length; i++) {
                if (i + 1 < line.length) {
                    var lonlats = this.insertPoint(line[i], line[i + 1], this.time);
                    points = points.concat(lonlats);
                }
            }
            return points;
        }
    };

    RouterMove.prototype.insertPoint = function insertPoint(startPoint, endPoint, speed) {
        // var distance = this.getDistance(startPoint, endPoint, true);
        //var insertPointLength = Math.ceil(distance / (speed));
        var insertPointLength = speed;
        //计算每一段的长度。
        var Dx = (endPoint[0] - startPoint[0]) / insertPointLength;
        var Dy = (endPoint[1] - startPoint[1]) / insertPointLength;
        var points = [startPoint];
        for (var i = 0; i < insertPointLength; i++) {
            if (i != insertPointLength - 1) {
                var this_point = points[points.length - 1];
                points[points.length] = [this_point[0] + Dx, this_point[1] + Dy];
            }
        }
        return points;
    };

    return RouterMove;
}();

;

export default RouterMove;