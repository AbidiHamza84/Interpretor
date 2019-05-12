let express = require('express');
let router = express.Router();
let bodyParser = require("body-parser");

router.use(bodyParser.urlencoded({ extended: true }));
router.use(bodyParser.json({ limit: '10mb' }));

const SECOND = 10;
const SOUND = 1;
const PLAY = "PLAY";
const PAUSE = "PAUSE";
const STOP = "STOP";
const FORWARD = "FORWARD";
const BACKWARD = "BACKWARD";
const RAISE = "RAISE";
const TURN_DOWN = "TURN_DOWN";

const firstFamily = /^(joue|lance)[rz]* (\w+)/;
const secondFamily = /^arrêt($|e|er|ez)($| .*)|^stop(per|pez)*($| .*)|^pause$|^met(s|tre|tez)* en pause($| .*)|^suspend(s|re|ez)*($| .*)|^repren(d|ds|dre|ez)($| .*)/;
const thirdFamily = /^avance[rz]*($| .*)|^recule[rz]*($| .*)|^(augmente[rz]*|leve[rz]*)($| .*)|^(baisse[rz]*|diminue[rz]*)($| .*)/;


router.post('/', function (req, res) {
    let request = req.body.request.toLowerCase();
    console.log(request);
    let action = { fail: false };
    if (firstFamily.test(request)) {
        let musicModel = /la musique|la chanson|l'album/.exec(request);
        if (musicModel) {
            let isSong = (musicModel[0] !== "l'album");
            let titleModel = /^.*(la musique|la chanson|l'album)/;
            let title = request.replace(titleModel, "").trim();
            if (title !== "") {
                action.type = PLAY;
                action.what = {
                    isSong: isSong,
                    title: title
                };
            }
            else {
                action.fail = true;
            }
        }
        else {
            action.fail = true;
        }
    }
    else if (secondFamily.test(request)) {
        if (/^arrêt($|e|er|ez)|^stop(per|pez)*($| .*)/.test(request)) {
            action.type = STOP;
        }
        else if (/^pause$|^met(s|tre|tez)* en pause($| .*)|^suspend(s|re|ez)*($| .*)/.test(request)) {
            action.type = PAUSE;
        }
        else if (/^repren(d|ds|dre|ez)($| .*)/.test(request)) {
            action.type = PLAY;
        }
        else {
            action.fail = true;
        }
    }
    else if (thirdFamily.test(request)) {
        if (/^avance[rz]*($| .*)/.test(request)) {
            action.type = FORWARD;
            if (/^avance[rz]* de [0-9]+.*$/.test(request)) {
                let seconds = request.replace(/^avance[rz]* de /, "").trim();
                let secondsModel = /^[0-9]+/.exec(seconds);
                if (secondsModel) {
                    action.seconds = parseInt(secondsModel[0]);
                }
                else {
                    action.fail = true;
                }
            }
            else if (/^avance[rz]*$/.test(request)) {
                action.seconds = SECOND;
            }
            else {
                action.fail = true;
            }
        }
        else if (/^recule[rz]*($| .*)/.test(request)) {
            action.type = BACKWARD;
            if (/^recule[rz]* de [0-9]+.*$/.test(request)) {
                let seconds = request.replace(/^recule[rz]* de /, "").trim();
                let secondsModel = /^[0-9]+/.exec(seconds);
                if (secondsModel) {
                    action.seconds = parseInt(secondsModel[0]);
                }
                else {
                    action.fail = true;
                }
            }
            else if (/^recule[rz]*$/.test(request)) {
                action.seconds = SECOND;
            }
            else {
                action.fail = true;
            }
        }
        else if (/^(augmente[rz]*|leve[rz]*)($| .*)/.test(request)) {
            action.type = RAISE;

            if (/^(augmente[rz]*|leve[rz]*) le son de [0-9]+ *$/.test(request)) {
                let sound = request.replace(/^(augmente[rz]*|leve[rz]*) le son de /, "").trim();
                let soundModel = /^[0-9]+/.exec(sound);
                console.log(sound);
                if (soundModel) {
                    action.sound = parseInt(soundModel[0]);
                }
                else {
                    action.fail = true;
                }
            }
            else if (/^(augmente[rz]*|leve[rz]*) le son$/.test(request)) {
                action.sound = SOUND;
            }
            else {
                action.fail = true;
            }
        }
        else if (/^(baisse[rz]*|diminue[rz]*)($| .*)/.test(request)) {
            action.type = TURN_DOWN;
            if (/^(baisse[rz]*|diminue[rz]*) le son de [0-9]+ *$/.test(request)) {
                let sound = request.replace(/^(baisse[rz]*|diminue[rz]*) le son de /, "").trim();
                let soundModel = /^[0-9]+/.exec(sound);
                if (soundModel) {
                    action.sound = parseInt(soundModel[0]);
                }
                else {
                    action.fail = true;
                }
            }
            else if (/^(baisse[rz]*|diminue[rz]*) le son$/.test(request)) {
                action.sound = SOUND;
            }
            else {
                action.fail = true;
            }
        }
        else {
            action.fail = true;
        }
    }
    else {
        action.fail = true;
    }
    console.log(action);
    res.json({ action: action });
});

module.exports = router;
