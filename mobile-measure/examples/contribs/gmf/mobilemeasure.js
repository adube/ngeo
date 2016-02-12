


/** @const **/
var app = {};


/** @type {!angular.Module} **/
app.module = angular.module('app', ['gmf']);


app.module.constant(
    'gmfAltitudeUrl',
    'altitude.json');


/**
 * App-specific directive wrapping the line measure tools. The directive's
 * controller has a property "map" including a reference to the OpenLayers
 * map.
 *
 * @return {angular.Directive} The Directive Definition Object.
 */
app.mobileMeasureDirective = function() {
  return {
    restrict: 'A',
    scope: {
      'map': '=appMobileMeasureMap'
    },
    controller: 'AppMobileMeasureController',
    controllerAs: 'ctrl',
    bindToController: true,
    templateUrl: 'partials/mobilemeasure.html'
  };
};

app.module.directive('appMobileMeasure',
                     app.mobileMeasureDirective);



/**
 * @param {ngeo.DecorateInteraction} ngeoDecorateInteraction Decorate
 *     interaction service.
 * @constructor
 * @ngInject
 */
app.MobileMeasureController = function(ngeoDecorateInteraction) {

  /**
   * @type {ol.Map}
   * @export
   */
  this.map;

  var style = new ol.style.Style({
    fill: new ol.style.Fill({
      color: 'rgba(255, 255, 255, 0.2)'
    }),
    stroke: new ol.style.Stroke({
      color: 'rgba(0, 0, 0, 0.5)',
      lineDash: [10, 10],
      width: 2
    }),
    image: new ol.style.RegularShape({
      stroke: new ol.style.Stroke({
        color: 'rgba(0, 0, 0, 0.7)',
        width: 2
      }),
      points: 4,
      radius: 8,
      radius2: 0,
      angle: 0
    })
  });

  /**
   * @type {ngeo.interaction.MeasureLengthMobile}
   * @export
   */
  this.measureLength = new ngeo.interaction.MeasureLengthMobile({
    decimals: 2,
    sketchStyle: style
  });

  var measureLength = this.measureLength;
  measureLength.setActive(false);
  ngeoDecorateInteraction(measureLength);
  this.map.addInteraction(measureLength);

  /**
   * @type {ngeo.interaction.MobileDraw}
   * @export
   */
  this.drawLine = /** @type {ngeo.interaction.MobileDraw} */ (
      this.measureLength.getDrawInteraction());

  /**
   * @type {ngeo.interaction.MeasurePointMobile}
   * @export
   */
  this.measurePoint = new ngeo.interaction.MeasurePointMobile({
    decimals: 2,
    sketchStyle: style
  });

  var measurePoint = this.measurePoint;
  measurePoint.setActive(false);
  ngeoDecorateInteraction(measurePoint);
  this.map.addInteraction(measurePoint);

  /**
   * @type {ngeo.interaction.MobileDraw}
   * @export
   */
  this.drawPoint = /** @type {ngeo.interaction.MobileDraw} */ (
      this.measurePoint.getDrawInteraction());

};
app.module.controller('AppMobileMeasureController',
                      app.MobileMeasureController);



/**
 * @constructor
 */
app.MainController = function() {

  /**
   * @type {ol.Map}
   * @export
   */
  this.map = new ol.Map({
    layers: [
      new ol.layer.Tile({
        source: new ol.source.OSM()
      })
    ],
    view: new ol.View({
      center: [692114.718759744, 5743119.914347709],
      zoom: 15
    })
  });

  this.map.addControl(new ol.control.ScaleLine());
};


app.module.controller('MainController', app.MainController);
