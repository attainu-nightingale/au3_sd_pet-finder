var placeSearch, autocomplete;

function initAutocomplete() {

    //creation of auto complete object,restricting the search location type to geographical code
    //geographical location types
    console.log("selector ",document.querySelector("#location"))
    autocomplete = new google.maps.places.Autocomplete(document.querySelector("#location"), { types: ["geocode"] });

    // Avoid paying for data that you don't need by restricting the set of
    // place fields that are returned to just the address components.
    autocomplete.setFields(['address_component']);


     // When the user selects an address from the drop-down, populate the
     // address fields in the form.
     autocomplete.addListener('place_changed',fillinAddress);


     function fillinAddress(){

        //getting place details from autocompleteobject
        var place=autocomplete.getPlace();
     }

}


// Bias the autocomplete object to the user's geographical location,
// as supplied by the browser's 'navigator.geolocation' object.

function geolocate(){

    if(navigator.geolocation){
        navigator.geolocation.getCurrentPosition(function(position){
            var geolocation={
                lat:position.coords.latitude,
                lng:position.coords.longitude
            };

            var circle=new google.maps.Circle({
                center:geolocation,radius:position.coords.accuracy });

             autocomplete.setBounds(circle.getBounds());   
        });
    }

}