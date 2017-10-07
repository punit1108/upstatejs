var expect = require('chai').expect;
var sinon = require('sinon');
var proxyquire = require('proxyquire');

var requestStub = sinon.stub();
var service = proxyquire('../lib/services/heroku.service', {
    request: requestStub
});

describe('Heroku service', function () {

    var callbackSpy;

    beforeEach(function() {
        callbackSpy = sinon.spy();
    });

    afterEach(function() {
        requestStub.reset();
    });

    it('should do GET http request to https://status.heroku.com/api/v3/current-status', function () {
        service(requestStub);
        expect(requestStub.getCall(0).args[0].url).to.equal('https://status.heroku.com/api/v3/current-status');
        expect(requestStub.getCall(0).args[0].method).to.equal('GET');
        expect(requestStub.getCall(0).args[0].headers['User-Agent']).to.equal('request');
    });

    it('should call provided callback with message "Problem with the connection." in case of error', function(done) {
        var responseBody = 'foo';
        //make fake `request` method call the second argument as a callback with specified arguments
        requestStub.callsArgWithAsync(1, 'error', null, responseBody);
        service(callbackSpy);
        setTimeout(function() {
            expect(callbackSpy.calledOnce).to.equal(true);
            expect(callbackSpy.getCall(0).args[0].message).to.equal('Problem with the connection.');
            done();
        }, 10);
    });

    it('should call provided callback with message "Could not parse the response." if body contains invalid JSON', function(done) {
        var responseBody = 'foo';
        requestStub.callsArgWithAsync(1, null, null, responseBody);
        service(callbackSpy);
        setTimeout(function() {
            expect(callbackSpy.calledOnce).to.equal(true);
            expect(callbackSpy.getCall(0).args[0].message).to.equal('Could not parse the response.');
            done();
        }, 10);
    });

    it('should call provided callback with message "Production and Development unhealthy." if production and development are not green', function(done) {
      var responseBody = {
          status: {
            Production: 'red',
            Development: 'red'
          }
      };
        requestStub.callsArgWithAsync(1, null, null, JSON.stringify(responseBody));
        service(callbackSpy);
        setTimeout(function() {
            expect(callbackSpy.calledOnce).to.equal(true);
            expect(callbackSpy.getCall(0).args[0].message).to.equal('Production and Development unhealthy.');
            done();
        }, 10);
    });

    it('should call provided callback with message "Production unhealthy." if production is not green and development is green', function(done) {
      var responseBody = {
          status: {
            Production: 'red',
            Development: 'green'
          }
      };
        requestStub.callsArgWithAsync(1, null, null, JSON.stringify(responseBody));
        service(callbackSpy);
        setTimeout(function() {
            expect(callbackSpy.calledOnce).to.equal(true);
            expect(callbackSpy.getCall(0).args[0].message).to.equal('Production unhealthy.');
            done();
        }, 10);
    });

    it('should call provided callback with message "Development unhealthy." if development is not green and production is green', function(done) {
      var responseBody = {
          status: {
            Production: 'green',
            Development: 'red'
          }
      };
        requestStub.callsArgWithAsync(1, null, null, JSON.stringify(responseBody));
        service(callbackSpy);
        setTimeout(function() {
            expect(callbackSpy.calledOnce).to.equal(true);
            expect(callbackSpy.getCall(0).args[0].message).to.equal('Development unhealthy.');
            done();
        }, 10);
    });

    it('should call provided callback with message "Service healthy." if development is green and production is green', function(done) {
      var responseBody = {
          status: {
            Production: 'green',
            Development: 'green'
          }
      };
        requestStub.callsArgWithAsync(1, null, null, JSON.stringify(responseBody));
        service(callbackSpy);
        setTimeout(function() {
            expect(callbackSpy.calledOnce).to.equal(true);
            expect(callbackSpy.getCall(0).args[0].message).to.equal('Service healthy.');
            done();
        }, 10);
    });

    it('should call provided callback with message "Empty response. Try Again." if resonse body is empty', function(done) {
        requestStub.callsArgWithAsync(1, null, null, undefined);
        service(callbackSpy);
        setTimeout(function() {
            expect(callbackSpy.calledOnce).to.equal(true);
            expect(callbackSpy.getCall(0).args[0].message).to.equal('Empty response. Try Again.');
            done();
        }, 10);
    });
});
