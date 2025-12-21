// helplines.js - International Crisis Support Directory
// Last updated: October 2025
// Please verify numbers regularly as they may change

module.exports = {
  // === North America ===
  "US": {
    emergency: "Call 911",
    suicide: "988 (USA Suicide & Crisis Lifeline)",
    text: "Text HOME to 741741 (Crisis Text Line)",
    online: "suicidepreventionlifeline.org",
    additional: "SAMHSA: 1-800-662-4357"
  },
  "CA": {
    emergency: "Call 911",
    suicide: "1-833-456-4566 (Talk Suicide Canada)",
    text: "Text 45645 (Kids Help Phone)",
    online: "talksuicide.ca",
    additional: "Kids Help Phone: 1-800-668-6868"
  },
  "MX": {
    emergency: "Call 911",
    suicide: "800-911-2000 (Línea de la Vida)",
    text: null,
    online: "lineadelavida.org.mx",
    additional: "Cruz Roja: 065"
  },

  // === United Kingdom & Ireland ===
  "UK": {
    emergency: "Call 999 or 112",
    suicide: "116 123 (Samaritans, UK & Ireland)",
    text: "Text SHOUT to 85258",
    online: "samaritans.org",
    additional: "Mind: 0300 123 3393"
  },
  "IE": {
    emergency: "Call 112 or 999",
    suicide: "116 123 (Samaritans Ireland)",
    text: "Text HELLO to 50808",
    online: "samaritans.org",
    additional: "Pieta House: 1800 247 247"
  },

  // === Europe ===
  "DE": {
    emergency: "Call 112",
    suicide: "0800-111-0-111 (Telefonseelsorge)",
    text: null,
    online: "telefonseelsorge.de",
    additional: "Alternative: 0800-111-0-222"
  },
  "FR": {
    emergency: "Call 112 or 15",
    suicide: "3114 (National Crisis Line)",
    text: null,
    online: "3114.fr",
    additional: "SOS Amitié: 09 72 39 40 50"
  },
  "NL": {
    emergency: "Call 112",
    suicide: "0900-0113 (113 Suicide Prevention)",
    text: null,
    online: "113.nl",
    additional: "Korrelatie: 0900-1450"
  },
  "ES": {
    emergency: "Call 112",
    suicide: "024 (Línea de Atención)",
    text: null,
    online: "telefonodelaesperanza.org",
    additional: "Teléfono de la Esperanza: 717 003 717"
  },
  "IT": {
    emergency: "Call 112",
    suicide: "02-2327-2327 (Telefono Amico)",
    text: null,
    online: "telefonoamico.it",
    additional: "Samaritans Onlus: 800 86 00 22"
  },
  "SE": {
    emergency: "Call 112",
    suicide: "020-22 00 60 (Mind Självmordslinjen)",
    text: null,
    online: "mind.se",
    additional: "BRIS: 116 111 (for children)"
  },
  "NO": {
    emergency: "Call 112",
    suicide: "810 20 050 (Mental Helse)",
    text: null,
    online: "mentalhelse.no",
    additional: "Kirkens SOS: 22 40 00 40"
  },
  "CH": {
    emergency: "Call 112",
    suicide: "143 (Die Dargebotene Hand)",
    text: null,
    online: "143.ch",
    additional: "Pro Juventute: 147"
  },
  "AT": {
    emergency: "Call 112",
    suicide: "142 (Telefonseelsorge)",
    text: null,
    online: "telefonseelsorge.at",
    additional: "Rat auf Draht: 147"
  },

  // === Asia-Pacific ===
  "AU": {
    emergency: "Call 000",
    suicide: "13 11 14 (Lifeline Australia)",
    text: "Text 0477 13 11 14",
    online: "lifeline.org.au",
    additional: "Beyond Blue: 1300 22 4636"
  },
  "NZ": {
    emergency: "Call 111",
    suicide: "1737 (Need to Talk?)",
    text: "Text 1737",
    online: "1737.org.nz",
    additional: "Lifeline: 0800 543 354"
  },
  "JP": {
    emergency: "Call 110 or 119",
    suicide: "0120-783-556 (TELL Lifeline)",
    text: null,
    online: "telljp.com",
    additional: "JHELP: 0570-000-911"
  },
  "KR": {
    emergency: "Call 112",
    suicide: "1393 (Korea Suicide Prevention Center)",
    text: null,
    online: "spckorea.or.kr",
    additional: "Seoul Mental Health: 1577-0199"
  },
  "SG": {
    emergency: "Call 999",
    suicide: "1800-221-4444 (Samaritans of Singapore)",
    text: null,
    online: "sos.org.sg",
    additional: "IMH Emergency: 6389 2222"
  },
  "IN": {
    emergency: "Call 112",
    suicide: "1800-599-0019 (KIRAN Mental Health)",
    text: null,
    online: "mentalhealthhelpline.in",
    additional: "Sneha: +91-44-2464-0050"
  },
  "PH": {
    emergency: "Call 911",
    suicide: "(02) 8804-4673 (Natasha Goulbourn Foundation)",
    text: null,
    online: "ngf-mindstrong.org",
    additional: "DOH Crisis Hotline: 1553"
  },

  // === Africa ===
  "ZA": {
    emergency: "Call 10111",
    suicide: "0800-567-567 (Suicide Crisis Line)",
    text: null,
    online: "sadag.org",
    additional: "SADAG: 011 234 4837"
  },

  // === South America ===
  "BR": {
    emergency: "Call 190",
    suicide: "188 (Centro de Valorização da Vida)",
    text: null,
    online: "cvv.org.br",
    additional: "CAPS: 0800-644-0000"
  },
  "AR": {
    emergency: "Call 911",
    suicide: "135 (Centro de Asistencia al Suicida)",
    text: null,
    online: "casbuenosaires.com.ar",
    additional: "Línea 107: 107"
  },

  // === Default/International ===
  "default": {
    emergency: "Call your local emergency number (911, 112, 999, etc.)",
    suicide: "Contact your local crisis helpline or mental health services",
    text: "Look for local text-based crisis support",
    online: "Visit befrienders.org for international resources",
    additional: "International Association for Suicide Prevention: iasp.info"
  }
};

// Helper function to get helpline info with fallback
function getHelplineInfo(countryCode) {
  const code = (countryCode || "").toUpperCase();
  return module.exports[code] || module.exports["default"];
}

// Export the helper function as well
module.exports.getHelplineInfo = getHelplineInfo;