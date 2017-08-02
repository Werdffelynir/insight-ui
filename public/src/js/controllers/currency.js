'use strict';

angular.module('insight.currency').controller('CurrencyController',
  function($scope, $rootScope, Currency) {
    $rootScope.currency.symbol = defaultCurrency;

    var _roundFloat = function(x, n) {
      if(!parseInt(n, 10) || !parseFloat(x)) n = 0;

      return Math.round(x * Math.pow(10, n)) / Math.pow(10, n);
    };

    $rootScope.currency.getConvertion = function(value) {
      value = value * 1; // Convert to number

      if (!isNaN(value) && typeof value !== 'undefined' && value !== null) {
        if (value === 0.00000000) return '0 ' + this.symbol; // fix value to show

        var response;

        if (this.symbol === 'USD') {
          response = _roundFloat((value * this.usd), 2);
        } else if (this.symbol === 'RUB') {
          response = _roundFloat((value * this.factor), 2);
        } else if (this.symbol === 'mSIB') {
          this.factor = 1000;
          response = _roundFloat((value * this.factor), 5);
        } else if (this.symbol === 'bits') {
          this.factor = 1000000;
          response = _roundFloat((value * this.factor), 2);
        } else {
          this.factor = 1;
          response = value;
        }
        // prevent sci notation
        if (response < 1e-7) response = response.toFixed(8);

        return response + ' ' + this.symbol;
      }

      return 'value error';
    };

    $scope.setCurrency = function(currency) {
      $rootScope.currency.symbol = currency;
      localStorage.setItem('insight-currency', currency);

      if (currency === 'RUB' || currency === 'USD') {
        Currency.get({}, function(res) {
          // res.data.bitstamp consist fields 'usd' and 'rur', 'rur' qu 'bitstamp'
          $rootScope.currency.factor = $rootScope.currency.bitstamp = res.data.bitstamp;
          $rootScope.currency.usd = res.data.usd;
        });
      } else if (currency === 'mSIB') {
        $rootScope.currency.factor = 1000;
      } else if (currency === 'bits') {
        $rootScope.currency.factor = 1000000;
      } else {
        $rootScope.currency.factor = 1;
      }
    };

    // Get initial value
    Currency.get({}, function(res) {
      // res.data.bitstamp consist fields 'usd' and 'rur', 'rur' qu 'bitstamp'
      $rootScope.currency.factor = $rootScope.currency.bitstamp = res.data.bitstamp;
      $rootScope.currency.usd = res.data.usd;
    });

  });
