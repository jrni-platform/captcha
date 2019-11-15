
import Configurator from 'bookingbug-configurator-js';

const client_key = '<ADD YOUR ONW CLIENT_KEY_HERE>';

/////////////////////////////////////////////
// render the captcha
function renderCaptchaRegion( {
  data,
  bbRegions
} ) {

  // add the script to load the captcha
  const script = document.createElement( 'script' );
  script.type = 'text/javascript';
  script.async = true;
  script.defer = true;
  script.src = "https://www.google.com/recaptcha/api.js"
  document.getElementsByTagName( "head" )[ 0 ].appendChild( script );

  // render the captcha div
  return `<bb-panel><div class="g-recaptcha" data-sitekey="${client_key}"></div></bb-panel>`
}

// add the captcha to the bottom of the clietn details page
Configurator.registerRegion(
  'details-page-form-bottom', [ {
      state: {
        counter: 0
      },
      mappings: ( {
        journey
      } ) => ( {
        company: journey.company,
        timezone: journey.timezone
      } ),
      render: renderCaptchaRegion
    }
] );

/////////////////////////////////////////////////
// validate the client form and ensure that the captcha has been ticked

async function validateClient( values ) {
  const response = grecaptcha.getResponse( );

  if ( response ) {
    values.client.extra_info.captcha = response;
    return Promise.resolve( );
  } else {
    return Promise.reject( );
  }
}

// add in a validator to the next page button of the details page
Configurator.registerValidator( 'Public.Details.NextPage', {
  name: 'validateClient',
  message: 'Please validate the Captcha',
  debounce: 500,
  validation_function: validateClient
} );