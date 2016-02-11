


/** @const **/
var app = {};


/** @type {!angular.Module} **/
app.module = angular.module('app', ['gmf']);


/**
 * App-specific directive wrapping the line measure tools. The directive's
 * controller has a property "map" including a reference to the OpenLayers
 * map.
 *
 * @return {angular.Directive} The Directive Definition Object.
 */
app.mobileMeasureLengthDirective = function() {
  return {
    restrict: 'A',
    scope: {
      'map': '=appMobileMeasureLengthMap'
    },
    controller: 'AppMobileMeasureLengthController',
    controllerAs: 'ctrl',
    bindToController: true,
    templateUrl: 'partials/mobilemeasure.html'
  };
};

app.module.directive('appMobileMeasureLength',
                     app.mobileMeasureLengthDirective);



/**
 * @param {ngeo.DecorateInteraction} ngeoDecorateInteraction Decorate
 *     interaction service.
 * @constructor
 * @ngInject
 */
app.MobileMeasureLengthController = function(ngeoDecorateInteraction) {

  /**
   * @type {ol.Map}
   * @export
   */
  this.map;

  /**
   * @type {ngeo.interaction.MeasureLengthMobile}
   * @export
   */
  this.measureLength = new ngeo.interaction.MeasureLengthMobile();

  var measureLength = this.measureLength;
  measureLength.setActive(false);
  ngeoDecorateInteraction(measureLength);
  this.map.addInteraction(measureLength);

  /**
   * @type {ngeo.interaction.MobileDraw}
   * @export
   */
  this.drawInteraction = /** @type {ngeo.interaction.MobileDraw} */ (
      this.measureLength.getDrawInteraction());

};
app.module.controller('AppMobileMeasureLengthController',
                      app.MobileMeasureLengthController);



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
