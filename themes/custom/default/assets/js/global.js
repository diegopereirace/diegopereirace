/**
 * @file
 * Global utilities.
 *
 */
(function (Drupal) {

  'use strict';

  Drupal.behaviors.default = {
    attach: function (context, settings) {
      new Scene({
        ".square": i => ({
          opacity: [0, 1],
          options: {
            duration: 1,
            delay: (i % 7) * 0.1 + Math.floor(i / 7) * 0.2,
          }
        }),
      }, {
        selector: true,
        direction: "alternate",
        iterationCount: "infinite",
      }).play();      
    }
  };

})(Drupal);
