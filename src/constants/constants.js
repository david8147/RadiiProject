import {Platform} from "react-native";

export const DEFAULT_LATITUDE = 37.422;
export const DEFAULT_LONGITUDE = -122.084;

export const MAX_RADIUS_METERS = 32186.9;
export const MIN_RADIUS_METERS = 10;

export const CHARACTER_LIMIT = 200;

export const NUM_PULSES_TO_GRAB = 5;

export const MAX_CATEGORIES = 4;

export const SEND_PULSE_ADDRESS = 'http://192.168.0.17:8000/SendPulse';

export const SEARCH_FOR_NEARBY_USERS_TIMEOUT = 5000;
export const SEARCH_FOR_PULSES_TIMEOUT = 10000;

export const MAX_REPORTS_UNTIL_BAN = 10;

export const METERS_TRAVELED_TO_UPDATE_LOCATION = 10;

// Cool and Fresh
export const color1 = "#05386B";
export const color2 = "#379683";
export const color3 = "#5CDB95";
export const color4 = "#8EE4AF";
export const color5 = "#EDF5E1";


// Striking and Simple
// export const color1 = "#0B0C10";
// export const color2 = "#1F2833";
// export const color3 = "#C5C67C";
// export const color4 = "#66FCF1";
// export const color5 = "#45A29E";

export const HEADER_HEIGHT = Platform.select({
    ios: 60,
    android: 50
});


export const iconImages = {
    fire: require('../assets/images/fire.png'),
    smileyface: require('../assets/images/smileyface.png'),
    frownyface: require('../assets/images/frownyface.png'),
    star: require('../assets/images/star.png'),
    emergency: require('../assets/images/emergency.png'),
    report: require('../assets/images/report.png'),
    message: require('../assets/images/message.png'),
    pin: require('../assets/images/pin.png'),
    send: require('../assets/images/send.png'),
    heart: require('../assets/images/heart.png'),
    info: require('../assets/images/info.png'),
    exciting: require('../assets/images/exciting.png'),
    question: require('../assets/images/question.png'),
    calendar: require('../assets/images/calendar.png'),
    community: require('../assets/images/community.png'),
    music: require('../assets/images/music.png'),
    paw: require('../assets/images/paw.png'),
    sports: require('../assets/images/sports.png'),
    signal: require('../assets/images/signal.png'),
    people: require('../assets/images/people.png'),
    up_arrow: require('../assets/images/up_arrow.png'),
    down_arrow: require('../assets/images/down_arrow.png'),
    checked: require('../assets/images/checked.png'),
    unchecked: require('../assets/images/unchecked.png'),
    food: require('../assets/images/food.png'),
    tools: require('../assets/images/tools.png'),
    money: require('../assets/images/money.png'),
    camera: require('../assets/images/camera.png'),
    backButton: require('../assets/images/back_button.png'),
};


export const allCategories = [
    {
        'image': 'emergency',
    },
    {
        'image': 'fire',
    },

    {
        'image': 'calendar',
    },
    {
        'image': 'community',
    },

    {
        'image': 'question',
    },

    {
        'image': 'info',
    },

    {
        'image': 'music',
    },

    {
        'image': 'paw',
    },
    {
        'image': 'sports',
    },

    {
        'image': 'tools',
    },
    {
        'image': 'star',
    },
    {
        'image': 'food',
    },
    {
        'image': 'smileyface',
    },

    {
        'image': 'money',
    },

    {
        'image': 'heart',
    },

];

export const mapStyle = [
    {
        "featureType": "all",
        "elementType": "labels.text.fill",
        "stylers": [
            {
                "saturation": 36
            },
            {
                "color": "#000000"
            },
            {
                "lightness": 40
            }
        ]
    },
    {
        "featureType": "all",
        "elementType": "labels.text.stroke",
        "stylers": [
            {
                "visibility": "on"
            },
            {
                "color": "#000000"
            },
            {
                "lightness": 16
            }
        ]
    },
    {
        "featureType": "all",
        "elementType": "labels.icon",
        "stylers": [
            {
                "visibility": "off"
            }
        ]
    },
    {
        "featureType": "administrative",
        "elementType": "geometry.fill",
        "stylers": [
            {
                "color": "#000000"
            },
            {
                "lightness": 20
            }
        ]
    },
    {
        "featureType": "administrative",
        "elementType": "geometry.stroke",
        "stylers": [
            {
                "color": "#000000"
            },
            {
                "lightness": 17
            },
            {
                "weight": 1.2
            }
        ]
    },
    {
        "featureType": "landscape",
        "elementType": "geometry",
        "stylers": [
            {
                "color": "#000000"
            },
            {
                "lightness": 20
            }
        ]
    },
    {
        "featureType": "poi",
        "elementType": "geometry",
        "stylers": [
            {
                "color": "#000000"
            },
            {
                "lightness": 21
            }
        ]
    },
    {
        "featureType": "road.highway",
        "elementType": "geometry.fill",
        "stylers": [
            {
                "color": "#000000"
            },
            {
                "lightness": 17
            }
        ]
    },
    {
        "featureType": "road.highway",
        "elementType": "geometry.stroke",
        "stylers": [
            {
                "color": "#000000"
            },
            {
                "lightness": 29
            },
            {
                "weight": 0.2
            }
        ]
    },
    {
        "featureType": "road.arterial",
        "elementType": "geometry",
        "stylers": [
            {
                "color": "#000000"
            },
            {
                "lightness": 18
            }
        ]
    },
    {
        "featureType": "road.local",
        "elementType": "geometry",
        "stylers": [
            {
                "color": "#000000"
            },
            {
                "lightness": 16
            }
        ]
    },
    {
        "featureType": "transit",
        "elementType": "geometry",
        "stylers": [
            {
                "color": "#000000"
            },
            {
                "lightness": 19
            }
        ]
    },
    {
        "featureType": "water",
        "elementType": "geometry",
        "stylers": [
            {
                "color": "#000000"
            },
            {
                "lightness": 17
            }
        ]
    }
]
