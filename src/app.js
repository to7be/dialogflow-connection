const util = require('util'),
	express = require('express'),
	app = express(),
	bodyParser = require('body-parser'),
	//jsonParser = bodyParser.json(),
	urlencodedParser = bodyParser.urlencoded({ extended: false }),
	uuidv4 = require('uuid/v4'),
	{ API_AI_KEY_EXPO } = process.env,
	apiai = require('apiai'),
	apiaiInterface = apiai(API_AI_KEY_EXPO),
	FuzzyMatching = require('fuzzy-matching'),
	fuzzydata = require('./utils/database');
/*
    Webhook
*/
app.post('/webhook', urlencodedParser, (req, res) => {
	const userInput = req.body.queryString;
	//console.log(util.inspect(userInput, {showHidden: false, depth: null}));

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
				// directly send DialoFlow's response back+
				let payload = {
					messages: [
						{
							text: response.result.fulfillment.speech
						}
					]
				};

				res.status(200).send(payload);
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
		res.status(500).send('Parameter queryString is missing in request body.');
	}
});

const getResponse = context => {
	let userCompany, answer;

	switch (context.name) {
		/* ##############################
					    D 1
	    ############################## */
		case 'd1':
			userCompany = context.parameters.company;
			answer = fuzzydata.getAnswer(userCompany);

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
							{ text: `Meinten Sie ${answer.value}?` },
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
					messages: [{ text: `Ich habe leider keinen Aussteller mit Namen ${userCompany} gefunden.` }]
				};
			}

		/* ##############################
					    D 2
	    ############################## */
		case 'd2':
			userCompany = context.parameters.company;
			answer = fuzzydata.getAnswer(userCompany);

			if (answer.distance > 0.4) {
				if (answer.value === userCompany) {
					return {
						messages: [
							{
								attachment: {
									payload: {
										template_type: 'button',
										text: `Aussteller ${
											answer.value
										} ist in Halle 3 am Stand D15. Hier können Sie den Aussteller direkt im Hallenplan sehen`,
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
							{ text: `Meinten Sie ${answer.value}?` },
							{
								attachment: {
									payload: {
										template_type: 'button',
										text: `Aussteller ${
											answer.value
										} ist in Halle 3 am Stand D15. Hier können Sie den Aussteller direkt im Hallenplan sehen`,
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
					messages: [{ text: `Ich habe leider keinen Aussteller mit Namen ${userCompany} gefunden.` }]
				};
			}

		/* ##############################
					    D 3
	    ############################## */
		case 'd3':
			userCompany = context.parameters.company;
			answer = fuzzydata.getAnswer(userCompany);

			if (answer.distance > 0.4) {
				if (answer.value === userCompany) {
					return {
						messages: [
							{
								attachment: {
									payload: {
										template_type: 'button',
										text: `Aussteller ${
											answer.value
										} wird auf der Heim+Handwerk durch die folgenden Personen repräsentiert.`,
										buttons: [
											{
												url: `https://www.marktplatz.heim-handwerk.de/de/suche?term=${
													answer.value
												}`,
												type: 'web_url',
												title: 'Ansprechpartner 1'
											},
											{
												url: `https://www.marktplatz.heim-handwerk.de/de/suche?term=${
													answer.value
												}`,
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
							{ text: `Meinten Sie ${answer.value}?` },
							{
								attachment: {
									payload: {
										template_type: 'button',
										text: `Aussteller ${
											answer.value
										} wird auf der Heim+Handwerk durch die folgenden Personen repräsentiert.`,
										buttons: [
											{
												url: `https://www.marktplatz.heim-handwerk.de/de/suche?term=${
													answer.value
												}`,
												type: 'web_url',
												title: 'Ansprechpartner 1'
											},
											{
												url: `https://www.marktplatz.heim-handwerk.de/de/suche?term=${
													answer.value
												}`,
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
					messages: [{ text: `Ich habe leider keinen Aussteller mit Namen ${userCompany} gefunden.` }]
				};
			}

		/* ##############################
					    D 4
	    ############################## */
		case 'd4':
			let userCompany1 = context.parameters.company1,
				userCompany2 = context.parameters.company2,
				answer1 = fuzzydata.getAnswer(userCompany1),
				answer2 = fuzzydata.getAnswer(userCompany2);

			if (answer1.distance > 0.4 && answer2.distance > 0.4) {
				return {
					messages: [
						{
							attachment: {
								payload: {
									template_type: 'button',
									text: `${answer1.value} befindet sich in Halle B, ${
										answer2.value
									} befindet sich in Halle D. Hier können Sie sich genau anschauen, wie Sie da am schnellsten hinkommen.`,
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
					messages: [{ text: `Ich habe leider keinen Aussteller mit Namen ${userCompany1} gefunden.` }]
				};
			} else {
				return {
					messages: [{ text: `Ich habe leider keinen Aussteller mit Namen ${userCompany2} gefunden.` }]
				};
			}

		/* ##############################
					    D 5
	    ############################## */
		case 'd5':
			userCompany = context.parameters.company;
			answer = fuzzydata.getAnswer(userCompany);

			if (answer.distance > 0.4) {
				if (answer.value === userCompany) {
					return {
						messages: [
							{
								attachment: {
									payload: {
										template_type: 'button',
										text: `Der Aussteller ${
											answer.value
										} hat eine Website auf unserem Marktplatz. Möchten Sie die Website jetzt besuchen?`,
										buttons: [
											{
												url: `https://www.marktplatz.heim-handwerk.de/de/suche?term=${
													answer.value
												}`,
												type: 'web_url',
												title: 'Ja'
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
							{ text: `Meinten Sie ${answer.value}?` },
							{
								attachment: {
									payload: {
										template_type: 'button',
										text: `Der Aussteller ${
											answer.value
										} hat eine Website auf unserem Marktplatz. Möchten Sie die Website jetzt besuchen?`,
										buttons: [
											{
												url: `https://www.marktplatz.heim-handwerk.de/de/suche?term=${
													answer.value
												}`,
												type: 'web_url',
												title: 'Ja'
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
					messages: [{ text: `Ich habe leider keinen Aussteller mit Namen ${userCompany} gefunden.` }]
				};
			}

		/* ##############################
					    D 6
	    ############################## */
		case 'd6':
			userCompany = context.parameters.company;
			answer = fuzzydata.getAnswer(userCompany);

			if (answer.distance > 0.4) {
				if (answer.value === userCompany) {
					return {
						messages: [
							{
								attachment: {
									payload: {
										template_type: 'button',
										text: `Die Geschäftsadresse von ${
											answer.value
										} lautet Kurfürstendamm 100, 10179 Berlin. Weitere Informationen finden Sie hier`,
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
							{ text: `Meinten Sie ${answer.value}?` },
							{
								attachment: {
									payload: {
										template_type: 'button',
										text: `Die Geschäftsadresse von ${
											answer.value
										} lautet Kurfürstendamm 100, 10179 Berlin. Weitere Informationen finden Sie hier`,
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
					messages: [{ text: `Ich habe leider keinen Aussteller mit Namen ${userCompany} gefunden.` }]
				};
			}

		/* ##############################
					    D 7
	    ############################## */
		case 'd7':
			userCompany = context.parameters.company;
			answer = fuzzydata.getAnswer(userCompany);

			if (answer.distance > 0.4) {
				if (answer.value === userCompany) {
					return {
						messages: [
							{
								attachment: {
									payload: {
										template_type: 'button',
										text: `Hier ist das Firmenprofil von ${answer.value}`,
										buttons: [
											{
												url: `https://www.marktplatz.heim-handwerk.de/de/suche?term=${
													answer.value
												}`,
												type: 'web_url',
												title: 'Firmenprofil'
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
							{ text: `Meinten Sie ${answer.value}?` },
							{
								attachment: {
									payload: {
										template_type: 'button',
										text: `Hier ist das Firmenprofil von ${answer.value}`,
										buttons: [
											{
												url: `https://www.marktplatz.heim-handwerk.de/de/suche?term=${
													answer.value
												}`,
												type: 'web_url',
												title: 'Firmenprofil'
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
					messages: [{ text: `Ich habe leider keinen Aussteller mit Namen ${userCompany} gefunden.` }]
				};
			}

		/* ##############################
					    D 8
	    ############################## */
		case 'd8':
			userCompany = context.parameters.company;
			answer = fuzzydata.getAnswer(userCompany);

			if (answer.distance > 0.4) {
				if (answer.value === userCompany) {
					return {
						messages: [
							{
								attachment: {
									payload: {
										template_type: 'button',
										text: `Hier sind die Kontaktdaten von ${answer.value}.`,
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
							{ text: `Meinten Sie ${answer.value}?` },
							{
								attachment: {
									payload: {
										template_type: 'button',
										text: `Hier sind die Kontaktdaten von ${answer.value}.`,
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
					messages: [{ text: `Ich habe den Aussteller ${userCompany} leider nicht gefunden.` }]
				};
			}

		/* ##############################
					    D 9
	    ############################## */
		case 'd9':
			userCompany = context.parameters.company;
			answer = fuzzydata.getAnswer(userCompany);

			if (answer.distance > 0.4) {
				if (answer.value === userCompany) {
					return {
						messages: [
							{
								attachment: {
									payload: {
										template_type: 'button',
										text: `Die Telefonnummer von ${
											answer.value
										} lautet 01234 / 56789. Per Klick auf den Button können Sie ihn direkt anrufen.`,
										buttons: [
											{
												type: 'phone_number',
												payload: '+0123456789',
												title: 'Anrufen'
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
										text: `Die Telefonnummer von ${
											answer.value
										} lautet 01234 / 56789. Per Klick auf den Button können Sie ihn direkt anrufen.`,
										buttons: [
											{
												type: 'phone_number',
												payload: '+0123456789',
												title: 'Anrufen'
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
					messages: [{ text: `Ich habe leider keinen Aussteller mit Namen ${userCompany} gefunden.` }]
				};
			}

		/* ##############################
					    D 10
	    ############################## */
		case 'd10':
			userCompany = context.parameters.company;
			answer = fuzzydata.getAnswer(userCompany);

			if (answer.distance > 0.4) {
				if (answer.value === userCompany) {
					return {
						messages: [
							{
								attachment: {
									payload: {
										template_type: 'button',
										text: `Der Aussteller ${
											answer.value
										} bietet vor Allem Badezimmermöbel an. Möchten Sie mehr zu diesem Aussteller erfahren? Alle Informationen finden Sie in seinem Ausstellerprofil`,
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
										text: `Der Aussteller ${
											answer.value
										} bietet vor Allem Badezimmermöbel an. Möchten Sie mehr zu diesem Aussteller erfahren? Alle Informationen finden Sie in seinem Ausstellerprofil`,
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
					messages: [{ text: `Ich habe leider keinen Aussteller mit Namen ${userCompany} gefunden.` }]
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
