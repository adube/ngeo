


/** @const **/
var app = {};


/** @type {!angular.Module} **/
app.module = angular.module('app', ['gmf']);


/**
 * @constructor
 * @param {!angular.Scope} $scope Angular scope.
 * @param {angular.$timeout} $timeout Angular timeout service.
 */
app.MainController = function($scope, $timeout) {

  /**
   * @type {!angular.Scope}
   * @private
   */
  this.scope_ = $scope;

  var features = new ol.format.GeoJSON().readFeatures({
    'type': 'FeatureCollection',
    'features': [{
      'type': 'Feature',
      'geometry': {
        'type': 'Point',
        'coordinates': [-8458215, 6672646]
      },
      'properties': {
        'color': '#009D57',
        'label': 'Point 1',
        'size': '6'
      }
    }, {
      'type': 'Feature',
      'geometry': {
        'type': 'Point',
        'coordinates': [-8007848, 6209744]
      },
      'properties': {
        'angle': '0',
        'color': '#000000',
        'isText': true,
        'label': 'Text 1',
        'size': '16'
      }
    }, {
      'type': 'Feature',
      'geometry': {
        'type': 'LineString',
        'coordinates': [
          [-8321240, 6523441],
          [-8103547, 6726458],
          [-8091318, 6408480],
          [-7973910, 6631065]
        ]
      },
      'properties': {
        'color': '#0BA9CC',
        'label': 'LineString 1',
        'stroke': '4'
      }
    }, {
      'type': 'Feature',
      'geometry': {
        'type': 'Polygon',
        'coordinates': [
          [
            [-8512027, 6359560],
            [-8531595, 6080718],
            [-8267428, 6031798],
            [-8238077, 6247045],
            [-8512027, 6359560]
          ]
        ]
      },
      'properties': {
        'color': '#4186F0',
        'label': 'Polygon 1',
        'opacity': '0.5',
        'stroke': '1'
      }
    }, {
      'type': 'Feature',
      'geometry': {
        'type': 'Polygon',
        'coordinates': [
          [
            [-7952508, 6096617],
            [-8051570, 5959642],
            [-7848554, 5926621],
            [-7754383, 6025683],
            [-7952508, 6096617]
          ]
        ]
      },
      'properties': {
        'color': '#CCCCCC',
        'label': 'Polygon 2',
        'opacity': '1',
        'stroke': '3'
      }
    }, {
      'type': 'Feature',
      'geometry': {
        'type': 'Polygon',
        'coordinates': [
          [
            [-7874848, 6496535],
            [-7874848, 6384020],
            [-7730535, 6384020],
            [-7730535, 6496535],
            [-7874848, 6496535]
          ]
        ]
      },
      'properties': {
        'color': '#000000',
        'isRectangle': true,
        'label': 'Rectangle 1',
        'opacity': '0.5',
        'stroke': '2'
      }
    }]
  });

  features.push(new ol.Feature({
    geometry: new ol.geom.Circle([-7691093, 6166327], 35000),
    color: '#000000',
    label: 'Circle 1',
    opacity: '0.5',
    stroke: '2'
  }));

  var source = new ol.source.Vector({
    wrapX: false,
    features: features
  });

  var vector = new ol.layer.Vector({
    source: source
  });

  /**
   * @type {ol.View}
   * @export
   */
  this.view = new ol.View({
    center: [-8174482, 6288627],
    zoom: 6
  });

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
    view: this.view
  });

  /**
   * @type {ol.Feature}
   * @export
   */
  this.selectedFeature = null;

  this.map.on('singleclick', this.handleMapSingleClick_, this);

  // force selection for each feature to apply the style upon initialization
  // (for the purpose of having a more appealing example)
  $('gmf-featurestyle').hide();
  features.forEach(function(feature) {
    $timeout(function() {
      this.selectedFeature = feature;
    }.bind(this));
  }, this);
  $timeout(function() {
    this.selectedFeature = null;
    $('gmf-featurestyle').show();
    this.map.addLayer(vector);
  }.bind(this));
};


/**
 * @param {ol.MapBrowserEvent} evt MapBrowser event
 * @private
 */
app.MainController.prototype.handleMapSingleClick_ = function(evt) {
  var pixel = evt.pixel;

  var feature = this.map.forEachFeatureAtPixel(pixel, function(feature) {
    return feature;
  });

  if (feature) {
    if (this.selectedFeature !== feature) {
      this.selectedFeature = feature;
    }
  } else {
    this.selectedFeature = null;
  }

  this.scope_.$apply();

};


app.module.controller('MainController', app.MainController);
