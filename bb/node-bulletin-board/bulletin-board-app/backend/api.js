var events = require('./events.js');
const statusCodes = require('http').STATUS_CODES;
const httpConstants = require('http2').constants;
const AWS = require('aws-sdk');
AWS.config.update({region: 'us-east-1'});
let dynamodb = new AWS.DynamoDB.DocumentClient({apiVersion: '2012-08-10'});
var params = {
  AttributeDefinitions: [
    {
      AttributeName: "id",
      AttributeType: "S",
    },
    {
      AttributeName: "title",
      AttributeType: "S",
    },
    {
      AttributeName: "detail",
      AttributeType: "S",
    },
    {
      AttributeName: "date",
      AttributeType: "S",
    },
  ],
  KeySchema: [
    {
      AttributeName: "id",
      KeyType: "HASH",
    },
  ],
  ProvisionedThroughput: {
    ReadCapacityUnits: 5,
    WriteCapacityUnits: 5,
  },
  TableName: "Events",
  StreamSpecification: {
    StreamEnabled: false,
  },
};

ddb.createTable(params, function (err, data) {
  if (err) {
    console.log("Error", err);
  } else {
    console.log("Table Created", data);
  }
});

exports.events = function (req, res) {
  if (req.method === 'GET') {
    const params = {
      TableName: 'Events'
    };

    dynamodb.scan(params, function (err, data) {
      if (err) {
        console.error("Unable to scan the table. Error JSON:", JSON.stringify(err, null, 2));
        res.status(500).send(err);
      } else {
        res.json(data.Items);
      }
    });
  } 
};

exports.event = function (req, res) {
  const eventId = req.params.eventId;
  const params = {
    TableName: 'Events',
    Key: {
      'id': eventId
    }
  };

  dynamodb.get(params, function (err, data) {
    if (err) {
      console.error("Unable to read item. Error JSON:", JSON.stringify(err, null, 2));
      res.status(500).send(err);
    } else {
      res.json(data.Item);
    }
  });
};