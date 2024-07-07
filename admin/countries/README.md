## Some useful scripts for adding raw json countries

### Compile individual country documents into one list

`jq -s '.' *.json > countries_upload.json`

### Save list of countries to an env var

`export COUNTRY_NAMES=$(jq -r '.[] | "\"\(.country_name)\"" ' < countries_upload.json | paste -s -d "," -)`

`echo $COUNTRY_NAMES | pbcopy`

### Find those countries in database then delete in Compass

`{"country_name": {"$in": [ < $country_names >  ]}}`