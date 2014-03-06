
exports.inject = function(deps) {

  deps = deps || {};
  var growl = deps.growl || require('growl');

  var GrowlReporter = function() {
  };

  GrowlReporter.prototype = {

    jasmineStarted: function() {
      this.startedAt = new Date();
      this.counts = {
        passed: 0,
        pending: 0,
        total: 0
      };
    },

    specStarted: function() {
      this.counts.total++;
    },

    specDone: function(spec) {
      switch (spec.status) {
        case 'pending':
          this.counts.pending++;
          break;
        case 'passed':
          this.counts.passed++;
          break;
      }
    },

    jasmineDone: function() {

      growl(growlMessage(this.counts), {
        name: growlName,
        title: growlTitle(this.counts, this.startedAt)
      });
    }
  };

  var growlName = 'Jasmine';

  var growlTitle = function(counts, startedAt) {
    
    var title = counts.passed + counts.pending < counts.total ? 'FAILED' : 'PASSED';
    title += ' in ' + ((new Date().getTime() - startedAt.getTime()) / 1000) + 's';

    return title;
  };

  var growlMessage = function(counts) {

    var description = counts.passed + ' passed';

    if (counts.pending) {
      description += ', ' + counts.pending + ' pending';
    }

    var failed = counts.total - counts.passed - counts.pending;
    if (failed) {
      description += ', ' + failed + ' failed';
    }

    description += ', ' + counts.total + ' total';

    return description;
  };

  return GrowlReporter;
};
