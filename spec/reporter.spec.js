
require('./matchers');

describe("GrowlReporter", function() {

  var growl = jasmine.createSpy(),
      GrowlReporter = require('../lib/reporter').inject({ growl: growl }),
      reporter = null;

  beforeEach(function() {
    reporter = new GrowlReporter();
  });

  it("should report 0 results", function() {
    reporter.reportRunnerStarting();
    reporter.reportRunnerResults();
    expect(growl).toHaveNotified('0 tests passed, 0 total', {
      name: 'Jasmine',
      title: /PASSED in [\d\.]+s/
    });
  });
});
