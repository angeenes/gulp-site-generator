"use strict";

// IFFE + Constructor design pattern
((window, document, undefined) => {
  const Page = function (version, api) {
    this.version = '0.0.0 - Init version';
    // this.api = 'http://api.domainname.com/'
    this.windowWidth = screen.width
    this.screens = {
        xs : 480,
        sm : 768,
        md : 992,
        lg : 1200
    };
        this.init()
  }

  Page.prototype = {
    init: function () {
      console.log('version', this.version)
      this.testES6()
      // App initialization
      // this.funtionExample(this.windowWidth);
      // this.funtionExample1();
      // this.funtionExample2();
      // this.funtionExample3();
    },
    methodName: function () {
      // your code here
    },
    testES6: function () {
      // var odds = evens.map(v => v + 1);
      console.log("es6 Babel");
    }
  }

  let page = new Page() // can be a private variable as well "var ..."

})(window, document,undefined)
