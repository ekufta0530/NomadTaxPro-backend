import json

country_data = """
Estonia, EUR, Tallinn, Northern Europe, EE
Croatia, EUR, Zagreb, Southern Europe, HR
Germany, EUR, Berlin, Western Europe, DE
Portugal, EUR, Lisbon, Southern Europe, PT
Spain, EUR, Madrid, Southern Europe, ES
Italy, EUR, Rome, Southern Europe, IT
Latvia, EUR, Riga, Northern Europe, LV
Hungary, HUF, Budapest, Central Europe, HU
Greece, EUR, Athens, Southern Europe, GR
Iceland, ISK, Reykjavik, Northern Europe, IS
Malta, EUR, Valletta, Southern Europe, MT
Romania, RON, Bucharest, Eastern Europe, RO
Czech Republic, CZK, Prague, Central Europe, CZ
Norway, NOK, Oslo, Northern Europe, NO
Cyprus, EUR, Nicosia, Southern Europe, CY
Montenegro, EUR, Podgorica, Southern Europe, ME
Georgia, GEL, Tbilisi, Western Asia, GE
Bulgaria, BGN, Sofia, Eastern Europe, BG
Serbia, RSD, Belgrade, Southern Europe, RS
Poland, PLN, Warsaw, Central Europe, PL
Slovenia, EUR, Ljubljana, Southern Europe, SI
Turkey, TRY, Ankara, Western Asia, TR
United Kingdom, GBP, London, Northern Europe, GB
France, EUR, Paris, Western Europe, FR
Netherlands, EUR, Amsterdam, Western Europe, NL
Belgium, EUR, Brussels, Western Europe, BE
Switzerland, CHF, Bern, Western Europe, CH
Ireland, EUR, Dublin, Northern Europe, IE
Austria, EUR, Vienna, Central Europe, AT
Sweden, SEK, Stockholm, Northern Europe, SE
Finland, EUR, Helsinki, Northern Europe, FI
Denmark, DKK, Copenhagen, Northern Europe, DK
Mexico, MXN, Mexico City, North America, MX
Costa Rica, CRC, San José, Central America, CR
Panama, PAB, Panama City, Central America, PA
El Salvador, USD, San Salvador, Central America, SV
Barbados, BBD, Bridgetown, Caribbean, BB
Bahamas, BSD, Nassau, Caribbean, BS
Bermuda, BMD, Hamilton, Caribbean, BM
Dominica, XCD, Roseau, Caribbean, DM
Antigua and Barbuda, XCD, St. John's, Caribbean, AG
United States, USD, Washington D.C., North America, US
Puerto Rico, USD, San Juan, Caribbean, PR
Canada, CAD, Ottawa, North America, CA
Belize, BZD, Belmopan, Central America, BZ
Guatemala, GTQ, Guatemala City, Central America, GT
Nicaragua, NIO, Managua, Central America, NI
Honduras, HNL, Tegucigalpa, Central America, HN
Jamaica, JMD, Kingston, Caribbean, JM
Guadeloupe, EUR, Basse-Terre, Caribbean, GP
Dominican Republic, DOP, Santo Domingo, Caribbean, DO
Curaçao, ANG, Willemstad, Caribbean, CW
Colombia, COP, Bogotá, South America, CO
Ecuador, USD, Quito, South America, EC
Brazil, BRL, Brasília, South America, BR
Argentina, ARS, Buenos Aires, South America, AR
Bolivia, BOB, Sucre, South America, BO
Chile, CLP, Santiago, South America, CL
Peru, PEN, Lima, South America, PE
Uruguay, UYU, Montevideo, South America, UY
Paraguay, PYG, Asunción, South America, PY
Thailand, THB, Bangkok, Southeast Asia, TH
Malaysia, MYR, Kuala Lumpur, Southeast Asia, MY
Japan, JPY, Tokyo, East Asia, JP
UAE, AED, Abu Dhabi, Western Asia, AE
India, INR, New Delhi, South Asia, IN
Vietnam, VND, Hanoi, Southeast Asia, VN
Indonesia, IDR, Jakarta, Southeast Asia, ID
Cambodia, KHR, Phnom Penh, Southeast Asia, KH
Philippines, PHP, Manila, Southeast Asia, PH
South Korea, KRW, Seoul, East Asia, KR
Singapore, SGD, Singapore, Southeast Asia, SG
Taiwan, TWD, Taipei, East Asia, TW
Sri Lanka, LKR, Colombo, South Asia, LK
Maldives, MVR, Malé, South Asia, MV
Australia, AUD, Canberra, Oceania, AU
New Zealand, NZD, Wellington, Oceania, NZ
Fiji, FJD, Suva, Oceania, FJ
Vanuatu, VUV, Port Vila, Oceania, VU
Tonga, TOP, Nukuʻalofa, Oceania, TO
Cayman Islands, KYD, George Town, Caribbean, KY
Cape Verde, CVE, Praia, West Africa, CV
Namibia, NAD, Windhoek, Southern Africa, NA
Mauritius, MUR, Port Louis, East Africa, MU
Egypt, EGP, Cairo, North Africa, EG
Madagascar, MGA, Antananarivo, East Africa, MG
South Africa, ZAR, Pretoria, Southern Africa, ZA
Kenya, KES, Nairobi, East Africa, KE
Morocco, MAD, Rabat, North Africa, MA
Senegal, XOF, Dakar, West Africa, SN
Seychelles, SCR, Victoria, East Africa, SC
"""

template = {
    "country_name": "",
    "country_code": "",
    "capital": "",
    "region": "",
    "display": False,
    "currency": "",
    "anchor_country": False,
    "has_nomad_visa": False,
    "schengen_zone": False,
    "in_european_union": False,
    "cost_of_living_index": 0,
    "cost_of_living_lvl": "",
    "practical_tips": {
        "financial_benefits": [],
        "lifestyle_benefits": [],
        "additional_benefits": []
    },
    "key_consideration": "",
    "best_for": [],
    "action_comment": "",
    "tagline": "",
    "image": "",
    "tax_residency_trigger": 0,
    "tax_residency_trigger_details": "",
    "country_standard_taxes": {
        "tax_currency": "",
        "employees": {
            "income_tax": [],
            "social_security": []
        },
        "contractors": {
            "income_tax": [],
            "social_security": []
        },
        "retirees": {
            "income_tax": [],
            "social_security": []
        }
    },
    "visas": []
}

def create_country_json(name, currency, capital, region, code):
    country = template.copy()
    country["country_name"] = name
    country["country_code"] = code
    country["capital"] = capital
    country["currency"] = currency
    country["region"] = region
    country["image"] = f"{name.lower().replace(' ', '_')}.jpg"
    return country

country_list = country_data.strip().split("\n")
country_jsons = []

for line in country_list:
    parts = line.split(", ")
    name, currency, capital, region, code = parts
    country_json = create_country_json(name, currency, capital, region, code)
    country_jsons.append(country_json)

# Save to a single file
with open("countries_upload.json", 'w') as file:
    json.dump(country_jsons, file, indent=2)

print("countries_upload.json generated.")