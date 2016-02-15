


/** @const **/
var app = {};


/** @type {!angular.Module} **/
app.module = angular.module('app', ['gmf']);


app.module.constant(
    'gmfAltitudeUrl',
    'https://geomapfish-demo.camptocamp.net/2.0/wsgi/raster');



/**
 * @param {ngeo.DecorateInteraction} ngeoDecorateInteraction Decorate
 *     interaction service.
 * @constructor
 */
app.MainController = function(ngeoDecorateInteraction) {

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

  /**
   * @type {boolean}
   * @export
   */
  this.measureLengthActive = false;

  /**
   * @type {boolean}
   * @export
   */
  this.measurePointActive = false;

};


app.module.controller('MainController', app.MainController);
