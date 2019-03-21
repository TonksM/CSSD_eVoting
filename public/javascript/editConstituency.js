/** @module javascript/editConstituency Schema */

/**
 * Function to add a postcode checkbox to the ui to be assiociated to the constituency
 * @name addPostcode
 * @param {string} The id of the constituency to add the postcode to
 * @callback addPostcode
 */
function addPostcode(id){
	var newPostcodeValue = document.getElementById("postcode"+id).value;
	if(newPostcodeValue == null){
		
	}else{
		var quotedPostcode = '"' + newPostcodeValue + '"';
		document.getElementById("postcode"+id).value = '';
		var newPostcode = "<input value='" + newPostcodeValue +"' onclick='removePostcode("+quotedPostcode+")' type='checkbox' name='postcodes' checked='true'/>";
		var newPostcodeLabel = document.createElement("label");
		newPostcodeLabel.innerText = newPostcodeValue;
		var divContainer = document.createElement("div");
		divContainer.id = newPostcodeValue;
		divContainer.class = "postcodeGroup";
		divContainer.append(newPostcodeLabel);
		divContainer.innerHTML += newPostcode;

		document.getElementById("postcodeGroup"+id).append(divContainer);
	}
}