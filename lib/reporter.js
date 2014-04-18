
exports.inject = function(deps) {

  deps = deps || {};
  var growl = deps.growl || require('growl');

  var GrowlReporter = function() {
  };

  GrowlReporter.prototype = {

    reportRunnerStarting: function() {
      this.startedAt = new Date();
      this.passedSpecs = 0;
      this.totalSpecs = 0;
    },

    reportSpecStarting: function() {
      this.totalSpecs++;
    },

    reportSpecResults: function(spec) {
      if (spec.results().passed()) {
        this.passedSpecs++;
      }
    },

    reportRunnerResults: function() {

      growl(growlMessage(this.passedSpecs, this.totalSpecs), {
        name: growlName,
        title: growlTitle(this.passedSpecs, this.totalSpecs, this.startedAt),
        image: growlImage(this.passedSpecs, this.totalSpecs)
      });
    }
  };

  var growlName = 'Jasmine';

  var growlTitle = function(passedSpecs, totalSpecs, startedAt) {
    
    var title = passed(passedSpecs, totalSpecs) ? 'PASSED' : 'FAILED';
    title += ' in ' + ((new Date().getTime() - startedAt.getTime()) / 1000) + 's';

    return title;
  };

  var growlMessage = function(passedSpecs, totalSpecs) {

    var description = passedSpecs + ' tests passed';

    var failedSpecs = totalSpecs - passedSpecs;
    if (failedSpecs) {
      description += ', ' + failedSpecs + ' tests failed';
    }

    description += ', ' + totalSpecs + ' total';

    return description;
  };

  var growlImage = function(passedSpecs, totalSpecs) {
    var resDir = __dirname + '/../res/';
    if (passed(passedSpecs, totalSpecs)) {
      return resDir + 'passed.png';
    } else {
      return resDir + 'failed.png';
    }
  };

  var passed = function(passedSpecs, totalSpecs) {
    return passedSpecs == totalSpecs;
  };

  return GrowlReporter;
};
