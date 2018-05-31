const util = require('util'),
	express = require('express'),
	app = express(),
	bodyParser = require('body-parser'),
	jsonParser = bodyParser.json(),
	uuidv4 = require('uuid/v4'),
	{ API_AI_KEY_EXPO } = process.env,
	apiai = require('apiai'),
	apiaiInterface = apiai(API_AI_KEY_EXPO),
	FuzzyMatching = require('fuzzy-matching'),
	fuzzydata = require('./utils/database');
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
			sessionId: randomToken
		};

		// Request API AI
		let apiaiRequest = apiaiInterface.textRequest(userInput, options);

		apiaiRequest.on('response', response => {

            // catch missing context
			if (response.result.contexts.length == 0) {
                // directly send DialoFlow's response back
				res.status(200).send(response.result.fulfillment.speech);
			} else {
				let context = response.result.contexts[0];
				let answer = getResponse(context);
				res.status(200).send(answer);
			}
		});

		apiaiRequest.on('error', error => {
			res.send(error);
		});

		apiaiRequest.end();
	} else {
		res.status(500).send('Parameter text is missing in request body.');
	}
});

const getResponse = context => {
	switch (context.name) {
		/* ##############################
					    D 1
	    ############################## */
		case 'd1':
			let userCompany = context.parameters.company;
			var answer = fuzzydata.getAnswer(userCompany);

			if (answer.distance > 0.4) {
				if (answer.value === userCompany) {
					return {
						messages: [
							{
								attachment: {
									payload: {
										template_type: 'button',
										text: `Alle Informationen zum Aussteller ${answer.value} finden Sie hier ⬇️`,
										buttons: [
											{
												url: `https://www.marktplatz.heim-handwerk.de/de/suche?term=${
													answer.value
												}`,
												type: 'web_url',
												title: 'Ausstellerprofil'
											}
										]
									},
									type: 'template'
								}
							}
						]
					};
				} else {
					return {
						messages: [
							{ text: `Do you mean ${answer.value}?` },
							{
								attachment: {
									payload: {
										template_type: 'button',
										text: `Alle Informationen zum Aussteller ${answer.value} finden Sie hier ⬇️`,
										buttons: [
											{
												url: `https://www.marktplatz.heim-handwerk.de/de/suche?term=${
													answer.value
												}`,
												type: 'web_url',
												title: 'Ausstellerprofil'
											}
										]
									},
									type: 'template'
								}
							}
						]
					};
				}
			} else {
				return {
					messages: [{ text: `Nein, Ich habe den Aussteller ${userCompany} nicht gefunden.` }]
				};
            }

		/* ##############################
					    D 2
	    ############################## */
		case 'd2':
			let userCompany = context.parameters.company;
			var answer = fuzzydata.getAnswer(userCompany);

			if (answer.distance > 0.4) {
				if (answer.value === userCompany) {
					return {
						messages: [
							{
								attachment: {
									payload: {
										template_type: 'button',
										text: `Aussteller ${answer.value} ist in Halle Y am Stand Z. Hier können Sie den Aussteller direkt im Hallenplan sehen`,
										buttons: [
											{
												url: `https://www.marktplatz.heim-handwerk.de/de/hallenplan`,
												type: 'web_url',
												title: 'Hallenplan'
											}
										]
									},
									type: 'template'
								}
							}
						]
					};
				} else {
					return {
						messages: [
							{ text: `Do you mean ${answer.value}?` },
							{
								attachment: {
									payload: {
										template_type: 'button',
										text: `Aussteller ${answer.value} ist in Halle Y am Stand Z. Hier können Sie den Aussteller direkt im Hallenplan sehen`,
										buttons: [
											{
												url: `https://www.marktplatz.heim-handwerk.de/de/hallenplan`,
												type: 'web_url',
												title: 'Hallenplan'
											}
										]
									},
									type: 'template'
								}
							}
						]
					};
				}
			} else {
				return {
					messages: [{ text: `Nein, Ich habe den Aussteller ${userCompany} nicht gefunden.` }]
				};
            }

		/* ##############################
					    D 3
	    ############################## */
		case 'd3':
			let userCompany = context.parameters.company;
			var answer = fuzzydata.getAnswer(userCompany);

			if (answer.distance > 0.4) {
				if (answer.value === userCompany) {
					return {
						messages: [
							{
								attachment: {
									payload: {
										template_type: 'button',
										text: `Aussteller ${answer.value} wird auf der Heim+Handwerk durch die folgenden Personen repräsentiert.`,
										buttons: [
											{
												url: `https://www.marktplatz.heim-handwerk.de/de/suche?term=${answer.value}`,
												type: 'web_url',
												title: 'Ansprechpartner 1'
											},
											{
												url: `https://www.marktplatz.heim-handwerk.de/de/suche?term=${answer.value}`,
												type: 'web_url',
												title: 'Ansprechpartner 2'
											}
										]
									},
									type: 'template'
								}
							}
						]
					};
				} else {
					return {
						messages: [
							{ text: `Do you mean ${answer.value}?` },
							{
								attachment: {
									payload: {
										template_type: 'button',
										text: `Aussteller ${answer.value} wird auf der Heim+Handwerk durch die folgenden Personen repräsentiert.`,
										buttons: [
											{
												url: `https://www.marktplatz.heim-handwerk.de/de/suche?term=${answer.value}`,
												type: 'web_url',
												title: 'Ansprechpartner 1'
                                            },
                                            {
												url: `https://www.marktplatz.heim-handwerk.de/de/suche?term=${answer.value}`,
												type: 'web_url',
												title: 'Ansprechpartner 2'
											}
										]
									},
									type: 'template'
								}
							}
						]
					};
				}
			} else {
				return {
					messages: [{ text: `Nein, Ich habe den Aussteller ${userCompany} nicht gefunden.` }]
				};
            }

		/* ##############################
					    D 4
	    ############################## */
		case 'd4':
			let userCompany1 = context.parameters.company1,
			    userCompany2 = context.parameters.company2,
                answer1 = fuzzydata.getAnswer(userCompany1),
                answer2 = fuzzydata.getAnswer(userCompany2)
            ;

			if ((answer1.distance > 0.4) && (answer2.distance > 0.4)) {
                return {
                    messages: [
                        {
                            attachment: {
                                payload: {
                                    template_type: 'button',
                                    text: `${answer1.value} befindet sich in Halle B, ${answer2.value} befindet sich in Halle D. Hier können Sie sich genau anschauen, wie Sie da am schnellsten hinkommen.`,
                                    buttons: [
                                        {
                                            url: `https://www.marktplatz.heim-handwerk.de/de/hallenplan`,
                                            type: 'web_url',
                                            title: 'Hallenplan'
                                        }
                                    ]
                                },
                                type: 'template'
                            }
                        }
                    ]
                };
            } 
            if (answer1.distance <= 0.4) {
                return {
					messages: [{ text: `Nein, Ich habe den Aussteller ${userCompany1} nicht gefunden.` }]
				};
            }
            else {
				return {
					messages: [{ text: `Nein, Ich habe den Aussteller ${userCompany2} nicht gefunden.` }]
				};
            }
            

		/* ##############################
					NO CONTEXT
	    ############################## */
		default:
			return context;
	}
	return answer;
};

// Initiating the enpoint
let port = process.env.PORT || 5000;
app.listen(port, () => console.log(`Webhook is listening on port ${port}`));
