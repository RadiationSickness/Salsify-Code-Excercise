# Salsify-Code-Excercise

## Development server
Ensure you are using Node `v16.10.0 or greater`
Navigate in to the `/salsify-code-exercise` folder and
Run `npm run start` for a dev server. Navigate to `http://localhost:4200/`. The application will automatically reload if you change any of the source files.

OR

Run `docker-compose up` if you prefer to use docker.

## Work Flow
 - Created Typescript version of the data service provided
 - Created types and enums from data object
 - Created sort Component and integrated the data service into it
 - Built initial UI layout and sort form
 - Mapped data from data service to UI and form elements
 - Added comparison operator logic
 - Manualy tested and fixed minor bugs

## Work to complete if given the time
 - `eslint` and `stylelint` packages to keep code more consistent in form and structure
 - Form directives to help validate the sort form as its filled out
 - CSS polish to make app less boring to look at
 - Replace multi-select with a checkbox list for enumerated values
 - Unit tests
