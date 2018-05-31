const
    util = require('util'),
	express = require('express'),
	app = express(),
	bodyParser = require('body-parser'),
	jsonParser = bodyParser.json(),
    uuidv4 = require('uuid/v4'),
    { API_AI_KEY_EXPO } = process.env,
    apiai = require('apiai'),
    apiaiInterface = apiai(API_AI_KEY_EXPO),
    FuzzyMatching = require('fuzzy-matching'),
    fuzzydata = require('./utils/database');
;

/*
    Webhhook

    Input: {
        text: ""
    }
*/
app.post('/webhook', jsonParser, (req, res) => {
    
    const userInput = req.body.text;

    if (typeof userInput !== 'undefined') {

        // API AI Options
        let randomToken = uuidv4();
        let options = {
            sessionId: randomToken,
        }
        
        // Request API AI
        let apiaiRequest = apiaiInterface.textRequest(userInput, options);
        
        apiaiRequest.on('response', (response) => {
            let context = response.result.contexts[0];
            let answer = getResponse(context);
            res.send(answer);
        });
        
        apiaiRequest.on('error', (error) => {
            res.send(error);
        });
        
        apiaiRequest.end();

    }
    else {
        res.status(500).send('Parameter text is missing in request body.');
    }
    
});

const getResponse = context => {
	
    switch (context.name) {
        case 'd1':
            let userCompany = context.parameters.company;
            var answer = fuzzydata.getAnswer(userCompany);
            
            if (answer.distance > 0.4) {
					if (answer.value === userCompany) {
                        return {
                            "messages": [
                                {"text": `Aussteller ${answer.value} ist in Halle Y am Stand Z. Hier können Sie den Aussteller direkt im Hallenplan sehen`}
                            ]
                        }
					} else {
						return {
                            "messages": [
                                {"text": `Do you mean ${answer.value}?`},
                                {"text": `Aussteller ${answer.value} ist in Halle Y am Stand Z. Hier können Sie den Aussteller direkt im Hallenplan sehen`}
                            ]
                        };
					}
				} 
            else {
                return {
                    "messages": [
                        {"text": `Nein, Ich habe den Aussteller ${userCompany} nicht gefunden.`}
                    ]
                };
            }
            
        default:
            return context;
    }
	return answer;
};


// Initiating the enpoint
let port = process.env.PORT || 5000;
app.listen(port, () => console.log(`Webhook is listening on port ${port}`));