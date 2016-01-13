


/** @const **/
var app = {};


/** @type {!angular.Module} **/
app.module = angular.module('app', ['ngeo']);


/**
 * App-specific directive wrapping the measure tools. The directive's
 * controller has a property "map" including a reference to the OpenLayers
 * map.
 *
 * @return {angular.Directive} The directive specs.
 */
app.measuretoolsDirective = function() {
  return {
    restrict: 'A',
    scope: {
      'map': '=appMeasuretoolsMap'
    },
    controller: 'AppMeasuretoolsController',
    controllerAs: 'ctrl',
    bindToController: true,
    templateUrl: 'partials/mobilemeasuretools.html'
  };
};

app.module.directive('appMeasuretools', app.measuretoolsDirective);



/**
 * @param {!angular.Scope} $scope Angular scope.
 * @param {angular.$compile} $compile Angular compile service.
 * @param {angular.$sce} $sce Angular sce service.
 * @param {ngeo.DecorateInteraction} ngeoDecorateInteraction Decorate
 *     interaction service.
 * @constructor
 * @ngInject
 */
app.MeasuretoolsController = function($scope, $compile, $sce,
    ngeoDecorateInteraction) {

  /**
   * @type {ol.Map}
   * @export
   */
  this.map;

  var map = this.map;

  /**
   * @type {ngeo.interaction.MobileDraw}
   * @export
   */
  this.mobileDrawLine = new ngeo.interaction.MobileDraw({
    'type': /** @type {ol.geom.GeometryType<string>} */ ('LineString')
  });

  var mobileDrawLine = this.mobileDrawLine;
  mobileDrawLine.setActive(false);
  ngeoDecorateInteraction(mobileDrawLine);
  map.addInteraction(mobileDrawLine);

};


/**
 * Add current sketch point
 * @export
 */
app.MeasuretoolsController.prototype.addPointToLine = function() {
  this.mobileDrawLine.addToDrawing();
};

app.module.controller('AppMeasuretoolsController', app.MeasuretoolsController);



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
