
var _ = require('underscore');
require('./matchers');

describe("GrowlReporter", function() {

  var injector = require('../lib/reporter').inject,
      growl = null,
      reporter = null;

  var fakeSpecResult = function(passed) {
    return {
      status: passed ? 'passed' : 'failed'
    };
  };

  var pendingSpecResult = function() {
    return {
      status: 'pending'
    };
  };

  var title = 'Jasmine',
      passedRegexp = /^PASSED in [\d\.]+s$/,
      failedRegexp = /^FAILED in [\d\.]+s$/;

  beforeEach(function() {
    growl = jasmine.createSpy();
    reporter = new (injector({ growl: growl }))();
  });

  it("should report 0 results", function() {
    reporter.jasmineStarted();
    reporter.jasmineDone();
    expect(growl).toHaveNotified('0 passed, 0 total', {
      name: title,
      title: passedRegexp
    });
  });

  it("should report 2 successful results", function() {
    reporter.jasmineStarted();
    _.times(2, function() {
      reporter.specStarted();
      reporter.specDone(fakeSpecResult(true));
    });
    reporter.jasmineDone();
    expect(growl).toHaveNotified('2 passed, 2 total', {
      name: title,
      title: passedRegexp
    });
  });

  it("should report 3 failed results", function() {
    reporter.jasmineStarted();
    _.times(3, function() {
      reporter.specStarted();
      reporter.specDone(fakeSpecResult(false));
    });
    reporter.jasmineDone();
    expect(growl).toHaveNotified('0 passed, 3 failed, 3 total', {
      name: title,
      title: failedRegexp
    });
  });

  it("should report 2 passed and 4 failed results", function() {
    reporter.jasmineStarted();
    _.times(2, function() {
      reporter.specStarted();
      reporter.specDone(fakeSpecResult(true));
    });
    _.times(4, function() {
      reporter.specStarted();
      reporter.specDone(fakeSpecResult(false));
    });
    reporter.jasmineDone();
    expect(growl).toHaveNotified('2 passed, 4 failed, 6 total', {
      name: title,
      title: failedRegexp
    });
  });

  it("should report 3 pending results", function() {
    reporter.jasmineStarted();
    _.times(3, function() {
      reporter.specStarted();
      reporter.specDone(pendingSpecResult());
    });
    reporter.jasmineDone();
    expect(growl).toHaveNotified('0 passed, 3 pending, 3 total', {
      name: title,
      title: passedRegexp
    });
  });

  it("should report 1 passed and 2 pending results", function() {
    reporter.jasmineStarted();
    _.times(1, function() {
      reporter.specStarted();
      reporter.specDone(fakeSpecResult(true));
    });
    _.times(2, function() {
      reporter.specStarted();
      reporter.specDone(pendingSpecResult());
    });
    reporter.jasmineDone();
    expect(growl).toHaveNotified('1 passed, 2 pending, 3 total', {
      name: title,
      title: passedRegexp
    });
  });

  it("should report 4 pending and 5 failed results", function() {
    reporter.jasmineStarted();
    _.times(4, function() {
      reporter.specStarted();
      reporter.specDone(pendingSpecResult());
    });
    _.times(5, function() {
      reporter.specStarted();
      reporter.specDone(fakeSpecResult(false));
    });
    reporter.jasmineDone();
    expect(growl).toHaveNotified('0 passed, 4 pending, 5 failed, 9 total', {
      name: title,
      title: failedRegexp
    });
  });

  it("should report 2 passed, 3 pending and 4 failed results", function() {
    reporter.jasmineStarted();
    _.times(2, function() {
      reporter.specStarted();
      reporter.specDone(fakeSpecResult(true));
    });
    _.times(3, function() {
      reporter.specStarted();
      reporter.specDone(pendingSpecResult());
    });
    _.times(4, function() {
      reporter.specStarted();
      reporter.specDone(fakeSpecResult(false));
    });
    reporter.jasmineDone();
    expect(growl).toHaveNotified('2 passed, 3 pending, 4 failed, 9 total', {
      name: title,
      title: failedRegexp
    });
  });
});
