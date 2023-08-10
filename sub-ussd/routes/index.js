const express = require('express');
const Africastalking = require('africastalking');
const router = express.Router();
const config = require('config');
const saveAsCSV = require('../utils/csv.js');


const AT = Africastalking(config.get('AT')).AIRTIME;
console.log(AT);

const sendAirtime = async (phoneNumber) => {
    const output = await AT.send({
        maxNumRetry: 1,
        recipients: [
            {
                phoneNumber: `${phoneNumber}`,
                amount: 0.5,
                currencyCode: 'KES',
            }
        ],
    });
    console.log('phone number', phoneNumber);
    console.log({ output });
};
// function getLocation() {
//     navigator.geolocation.getCurrentPosition(function(position) {
//       const latitude = position.coords.latitude;
//       const longitude = position.coords.longitude;
//       const location = {
//         latitude: latitude,
//         longitude: longitude
//       };
//       alert("Your current location is: " + location);
//     });
//   }


router.get('/', (req, res) => res.send('Hola!'));

router.post('/', async (req, res) => {
    try {
        const { sessionId, serviceCode, phoneNumber, text } = req.body;

        let response = '';

        if (text == '') {
            response = `CON Welcome to DataVis. We guarantee identity protection. Do you agree to share your Data with us?
            1. Yes
            `;
        } else if (text == '1') {
            response = `CON Where are you located?`;
          
        }
        else if (text.split('*').length == 2) {
            response = `CON What is your sex?`;
           
        } else if (text.split('*').length == 3) {
            response = `CON Do you have any Disability?`;
           
        } else if (text.split('*').length == 4) {
            const location = text.split('*')[1];
                const identity = text.split('*')[2];
                const additionalInfo = text.split('*')[3];

                const inputData = {
                    location,
                    identity,
                    additionalInfo,
                };

                const dataVisData = {
                    ...inputData,
                    phoneNumber,
                    sessionId,
                    date: new Date(),
                };
                sendAirtime(phoneNumber);
                saveAsCSV(dataVisData);
                console.log({ dataVisData });

                response = `END Thank you for joining DataVis. Your Details have been added successfully!`;
        }
        res.set('Content-Type: text/plain');
        res.send(response);
    } catch (error) {
        console.trace(error);
        response = `END There is an error. Try again later.`;
        res.set('Content-Type: text/plain');
        res.send(response);
    }
});

module.exports = router;
