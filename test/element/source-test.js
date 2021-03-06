require('./env');

var vows = require('vows'),
    assert = require('assert');

var suite = vows.describe('type');

suite.addBatch({
  'test sources': {
    'Test fileSource': function() {
      var data = [];
      var consumer = {
        producers: function() { return []; },
        consume: function(str) { data.push(str); },
        consumeEOS: function() { check(); }
      };
      var fileSource = new triflow.element.FileSource(
          {
            bufferSize: 4,
            filepath: getExample('digits.txt')
          });

      fileSource.wire([consumer]);
      fileSource.go();
      function check() {
        assert.deepEqual(data, [['0123'], ['4567'], ['89']]);
      }
    },
    'Test stringSource': function() {

      var consumer = defaultConsumer([['abc'], ['def']]);
      var source = new triflow.element.StringSource({
        bufferSize: 3,
        str: 'abcdef'
      });
      source.wire([consumer]);
      source.go();
      assert(consumer.eosHandled());

      consumer = defaultConsumer([['abcd'], ['ef']]);
      source = new triflow.element.StringSource({
        str: 'abcdef',
        bufferSize: 4
      });
      source.wire([consumer]);
      source.go();
      assert(consumer.eosHandled());

      consumer = defaultConsumer([['abcdef']]);
      source = new triflow.element.StringSource({
        str: 'abcdef',
        bufferSize: 6
      });
      source.wire([consumer]);
      source.go();
      assert(consumer.eosHandled());

      consumer = defaultConsumer([['abcdef']]);
      source = new triflow.element.StringSource({
        str: 'abcdef',
        bufferSize: 7
      });
      source.wire([consumer]);
      source.go();
      assert(consumer.eosHandled());
    }
  }
});

suite.export(module);
