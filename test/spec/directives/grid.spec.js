goog.require('ngeo.GridConfig');
goog.require('ngeo.gridDirective');

describe('ngeo.gridDirective', function() {

  var gridController;
  var $scope;
  var $rootScope;

  beforeEach(inject(function($injector, _$controller_, _$rootScope_) {
    var $controller = _$controller_;
    $rootScope = _$rootScope_;
    $scope = $rootScope.$new();

    var gridConfigData = [
      {
        'name': 'row_1',
        'display_name': 'Row 1',
        'type': 12,
        'timestamp': '2010-11-09T22:56:26Z'
      },
      {
        'name': 'row_2',
        'display_name': 'Row 2',
        'type': 121,
        'timestamp': '2010-11-07T22:56:26Z'
      },
      {
        'name': 'row_3',
        'display_name': 'Row 3',
        'type': 7,
        'timestamp': '2010-11-03T22:56:26Z'
      },
      {
        'name': 'row_4',
        'display_name': 'Row 3',
        'type': 7,
        'timestamp': '2010-11-03T22:56:26Z'
      },
      {
        'name': 'row_4',
        'display_name': 'Row 4',
        'type': 5,
        'timestamp': '2010-11-19T22:56:26Z'
      },
      {
        'name': 'row_5',
        'display_name': 'Row 5',
        'type': 23,
        'timestamp': '2010-11-23T22:56:26Z'
      }
    ];
    var columnDefs = [
        {name: 'name'},
        {name: 'display_name'},
        {name: 'timestamp'},
        {name: 'type'}
    ];

    var data = {
      configuration: new ngeo.GridConfig(gridConfigData, columnDefs)
    };
    gridController = $controller(
        'ngeoGridController', {$scope: $scope}, data);
  }));

  describe('#sort', function() {

    it('sorts a column', function() {
      var data = gridController.configuration.data;

      // sort asc. by 'type'
      gridController.sort('type');
      expect(data[0]['name']).toBe('row_4');

      // sort desc. by 'type'
      gridController.sort('type');
      expect(data[0]['name']).toBe('row_2');
    });

  });

  describe('#selectRow_', function() {

    it('selects a row', function() {
      var data = gridController.configuration.data;

      var firstRow = data[0];
      expect(gridController.configuration.isRowSelected(firstRow)).toBe(false);

      gridController.clickRow_(firstRow, false, false);
      expect(gridController.configuration.isRowSelected(firstRow)).toBe(true);

      gridController.clickRow_(firstRow, false, false);
      expect(gridController.configuration.isRowSelected(firstRow)).toBe(false);
    });

    it('selects a different row', function() {
      var data = gridController.configuration.data;

      var firstRow = data[0];
      var sndRow = data[1];
      expect(gridController.configuration.isRowSelected(firstRow)).toBe(false);
      expect(gridController.configuration.isRowSelected(sndRow)).toBe(false);

      gridController.clickRow_(firstRow, false, false);
      gridController.clickRow_(sndRow, false, false);
      expect(gridController.configuration.isRowSelected(firstRow)).toBe(false);
      expect(gridController.configuration.isRowSelected(sndRow)).toBe(true);
    });

    it('selects multiple rows', function() {
      var data = gridController.configuration.data;

      var firstRow = data[0];
      var sndRow = data[1];
      expect(gridController.configuration.isRowSelected(firstRow)).toBe(false);
      expect(gridController.configuration.isRowSelected(sndRow)).toBe(false);

      // select both rows
      gridController.clickRow_(firstRow, false, true);
      gridController.clickRow_(sndRow, false, true);
      expect(gridController.configuration.isRowSelected(firstRow)).toBe(true);
      expect(gridController.configuration.isRowSelected(sndRow)).toBe(true);

      // unselect the 2nd row
      gridController.clickRow_(sndRow, false, true);
      expect(gridController.configuration.isRowSelected(firstRow)).toBe(true);
      expect(gridController.configuration.isRowSelected(sndRow)).toBe(false);

      // select the 2nd again
      gridController.clickRow_(sndRow, false, true);
      expect(gridController.configuration.isRowSelected(firstRow)).toBe(true);
      expect(gridController.configuration.isRowSelected(sndRow)).toBe(true);

      // a normal click clears both
      gridController.clickRow_(sndRow, false, false);
      expect(gridController.configuration.isRowSelected(firstRow)).toBe(false);
      expect(gridController.configuration.isRowSelected(sndRow)).toBe(false);
    });

    it('selects a range of rows (continuous down)', function() {
      var data = gridController.configuration.data;

      var firstRow = data[0];
      var sndRow = data[1];
      var thirdRow = data[2];

      // select first row
      gridController.clickRow_(firstRow, false, false);

      // then click on the 3rd row with SHIFT pressed
      gridController.clickRow_(thirdRow, true, false);

      expect(gridController.configuration.isRowSelected(firstRow)).toBe(true);
      expect(gridController.configuration.isRowSelected(sndRow)).toBe(true);
      expect(gridController.configuration.isRowSelected(thirdRow)).toBe(true);
    });

    it('selects a range of rows (continuous up)', function() {
      var data = gridController.configuration.data;

      var firstRow = data[0];
      var sndRow = data[1];
      var thirdRow = data[2];

      // select third row
      gridController.clickRow_(thirdRow, false, false);

      // then click on the first row with SHIFT pressed
      gridController.clickRow_(firstRow, true, false);

      expect(gridController.configuration.isRowSelected(firstRow)).toBe(true);
      expect(gridController.configuration.isRowSelected(sndRow)).toBe(true);
      expect(gridController.configuration.isRowSelected(thirdRow)).toBe(true);
    });

    it('selects a range of rows (no previous selection)', function() {
      var data = gridController.configuration.data;

      // SHIFT click on row 1 without previous selection
      gridController.clickRow_(data[0], true, false);

      expect(gridController.configuration.isRowSelected(data[0])).toBe(true);
      expect(gridController.configuration.isRowSelected(data[1])).toBe(false);
      expect(gridController.configuration.isRowSelected(data[2])).toBe(false);
      expect(gridController.configuration.isRowSelected(data[3])).toBe(false);
      expect(gridController.configuration.isRowSelected(data[4])).toBe(false);
    });

    it('selects a range of rows (on already selected row)', function() {
      var data = gridController.configuration.data;

      // select row 1
      gridController.clickRow_(data[0], false, false);

      // SHIFT click again on row 1
      gridController.clickRow_(data[0], true, false);

      expect(gridController.configuration.isRowSelected(data[0])).toBe(true);
      expect(gridController.configuration.isRowSelected(data[1])).toBe(false);
      expect(gridController.configuration.isRowSelected(data[2])).toBe(false);
      expect(gridController.configuration.isRowSelected(data[3])).toBe(false);
      expect(gridController.configuration.isRowSelected(data[4])).toBe(false);
    });

    it('selects a range of rows (already selected rows, up)', function() {
      /**
       * Row 1 and 3 are selected:
       * [x] 1
       * [ ] 2
       * [x] 3
       * [ ] 4
       * [ ] 5
       *
       * A click on row 5 should select row 4 and 5:
       * [x] 1
       * [ ] 2
       * [x] 3
       * [x] 4
       * [x] 5
       */
      var data = gridController.configuration.data;

      var row1 = data[0];
      var row2 = data[1];
      var row3 = data[2];
      var row4 = data[3];
      var row5 = data[4];

      // select row 1 and 3
      gridController.clickRow_(row1, false, false);
      gridController.clickRow_(row3, false, true);

      // then click on row 5 with SHIFT pressed
      gridController.clickRow_(row5, true, false);

      expect(gridController.configuration.isRowSelected(row1)).toBe(true);
      expect(gridController.configuration.isRowSelected(row2)).toBe(false);
      expect(gridController.configuration.isRowSelected(row3)).toBe(true);
      expect(gridController.configuration.isRowSelected(row4)).toBe(true);
      expect(gridController.configuration.isRowSelected(row5)).toBe(true);
    });

    it('selects a range of rows (already selected rows, down)', function() {
      /**
       * Row 3 and 5 are selected:
       * [ ] 1
       * [ ] 2
       * [x] 3
       * [ ] 4
       * [x] 5
       *
       * A click on row 1 should select row 1 and 2:
       * [x] 1
       * [x] 2
       * [x] 3
       * [ ] 4
       * [x] 5
       */
      var data = gridController.configuration.data;

      var row1 = data[0];
      var row2 = data[1];
      var row3 = data[2];
      var row4 = data[3];
      var row5 = data[4];

      // select row 3 and 5
      gridController.clickRow_(row3, false, false);
      gridController.clickRow_(row5, false, true);

      // then click on row 1 with SHIFT pressed
      gridController.clickRow_(row1, true, false);

      expect(gridController.configuration.isRowSelected(row1)).toBe(true);
      expect(gridController.configuration.isRowSelected(row2)).toBe(true);
      expect(gridController.configuration.isRowSelected(row3)).toBe(true);
      expect(gridController.configuration.isRowSelected(row4)).toBe(false);
      expect(gridController.configuration.isRowSelected(row5)).toBe(true);
    });
  });

  describe('#selectAll', function() {

    it('selects and unselects all rows', function() {
      var data = gridController.configuration.data;

      gridController.configuration.selectAll();
      data.forEach(function(row) {
        expect(gridController.configuration.isRowSelected(row)).toBe(true);
      });

      gridController.configuration.unselectAll();
      data.forEach(function(row) {
        expect(gridController.configuration.isRowSelected(row)).toBe(false);
      });
    });

  });

  describe('#invertSelection', function() {

    it('inverts a selection', function() {
      var data = gridController.configuration.data;

      gridController.configuration.selectRow(data[0]);
      gridController.configuration.invertSelection();
      expect(gridController.configuration.isRowSelected(data[0])).toBe(false);
      expect(gridController.configuration.isRowSelected(data[1])).toBe(true);
      expect(gridController.configuration.isRowSelected(data[2])).toBe(true);
    });

  });
});