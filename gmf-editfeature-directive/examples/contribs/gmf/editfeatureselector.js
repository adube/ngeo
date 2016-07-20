


/** @const **/
var app = {};


/** @type {!angular.Module} **/
app.module = angular.module('app', ['gmf']);


app.module.constant(
    'authenticationBaseUrl',
    'https://geomapfish-demo.camptocamp.net/2.1/wsgi');


app.module.constant('gmfTreeUrl',
    'https://geomapfish-demo.camptocamp.net/2.1/wsgi/themes?version=2&background=background');


app.module.constant('gmfLayersUrl',
    'https://geomapfish-demo.camptocamp.net/2.1/wsgi/layers/');


/**
 * @param {!angular.Scope} $scope Angular scope.
 * @param {gmf.Themes} gmfThemes The gmf themes service.
 * @param {gmfx.User} gmfUser User.
 * @param {ngeo.ToolActivateMgr} ngeoToolActivateMgr Ngeo ToolActivate manager
 *     service.
 * @constructor
 */
app.MainController = function($scope, gmfThemes, gmfUser, ngeoToolActivateMgr) {

  /**
   * @type {!angular.Scope}
   * @private
   */
  this.scope_ = $scope;

  /**
   * @type {gmfx.User}
   * @export
   */
  this.gmfUser = gmfUser;

  gmfThemes.loadThemes();

  var projection = ol.proj.get('EPSG:21781');
  projection.setExtent([485869.5728, 76443.1884, 837076.5648, 299941.7864]);

  var proxyUrl =
      'https://geomapfish-demo.camptocamp.net/2.1/wsgi/mapserv_proxy';

  /**
   * @type {ol.source.ImageWMS}
   * @private
   */
  this.pointWMSSource_ = new ol.source.ImageWMS({
    url: proxyUrl,
    params: {'LAYERS': 'point'}
  });

  /**
   * @type {ol.layer.Image}
   * @private
   */
  this.pointWMSLayer_ = new ol.layer.Image({
    source: this.pointWMSSource_
  });

  /**
   * @type {ol.layer.Vector}
   * @export
   */
  this.vectorLayer = new ol.layer.Vector({
    source: new ol.source.Vector({
      wrapX: false,
      features: new ol.Collection()
    })
  });

  /**
   * @type {ol.Map}
   * @export
   */
  this.map = new ol.Map({
    layers: [
      new ol.layer.Tile({
        source: new ol.source.OSM()
      }),
      this.pointWMSLayer_,
      this.vectorLayer
    ],
    view: new ol.View({
      projection: projection,
      resolutions: [200, 100, 50, 20, 10, 5, 2.5, 2, 1, 0.5],
      center: [537635, 152640],
      zoom: 2
    })
  });

 /**
   * @type {boolean}
   * @export
   */
  this.editFeatureSelectorActive = true;

  var editFeatureSelectorToolActivate = new ngeo.ToolActivate(
      this, 'editFeatureSelectorActive');
  ngeoToolActivateMgr.registerTool(
      'mapTools', editFeatureSelectorToolActivate, true);

 /**
   * @type {boolean}
   * @export
   */
  this.dummyActive = false;

  var dummyToolActivate = new ngeo.ToolActivate(
      this, 'dummyActive');
  ngeoToolActivateMgr.registerTool(
      'mapTools', dummyToolActivate, false);

  // initialize tooltips
  $('[data-toggle="tooltip"]').tooltip({
    container: 'body',
    trigger: 'hover'
  });

};


app.module.controller('MainController', app.MainController);
